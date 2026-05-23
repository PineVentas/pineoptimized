"""Pine Opti iteration 3 — 4 games + scan/browser + services + security-status + auto-mode + fallback categories."""
import os
import uuid
import pytest
import requests

BASE_URL = os.environ["REACT_APP_BACKEND_URL"].rstrip("/")
API = f"{BASE_URL}/api"


@pytest.fixture(scope="module")
def session():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


@pytest.fixture(scope="module")
def fresh_user(session):
    uname = f"TEST_{uuid.uuid4().hex[:10]}"
    r = session.post(f"{API}/auth/register", json={"username": uname, "password": "abc12345"}, timeout=30)
    assert r.status_code == 200
    d = r.json()
    return {"username": uname, "token": d["token"], "user": d["user"]}


@pytest.fixture(scope="module")
def auth(fresh_user):
    return {"Authorization": f"Bearer {fresh_user['token']}", "Content-Type": "application/json"}


# ---------- Stats users from 0 ----------
class TestStats:
    def test_stats_users_is_count(self, session):
        r = session.get(f"{API}/stats", timeout=15)
        assert r.status_code == 200
        d = r.json()
        assert "users" in d
        # Should be a count, not 7733293+. Reasonable upper bound for fresh DB during testing
        assert isinstance(d["users"], int)
        assert 0 <= d["users"] < 100000, f"Expected fresh counter, got {d['users']}"
        assert d["version"] == "1.0"


# ---------- 4 Games only ----------
class TestGames4:
    def test_exactly_4_games(self, session):
        r = session.get(f"{API}/games", timeout=15)
        assert r.status_code == 200
        games = r.json()["games"]
        assert len(games) == 4, f"Expected 4 games, got {len(games)}"
        ids = {g["id"] for g in games}
        assert ids == {"free-fire", "cs2", "valorant", "fortnite"}

    def test_no_removed_games(self, session):
        ids = {g["id"] for g in session.get(f"{API}/games").json()["games"]}
        removed = {"apex", "pubg", "lol", "dota2", "genshin"}
        assert ids.isdisjoint(removed)

    def test_each_game_has_image(self, session):
        games = session.get(f"{API}/games").json()["games"]
        for g in games:
            assert "image" in g and g["image"].startswith("http"), f"{g['id']} missing image"
            # CS2 via steam, others via IGDB
            if g["id"] == "cs2":
                assert "steamstatic" in g["image"] or "steam" in g["image"].lower()
            else:
                assert "igdb" in g["image"].lower()

    def test_apply_all_4_games(self, session, auth):
        for gid, expected_ac in [
            ("free-fire", "BlackBox"),
            ("cs2", "VAC"),
            ("valorant", "Riot Vanguard"),
            ("fortnite", "Easy Anti-Cheat"),
        ]:
            r = session.post(f"{API}/games/{gid}/apply", headers=auth, timeout=20)
            assert r.status_code == 200, f"{gid} apply failed"
            d = r.json()
            assert d["ok"] is True
            assert expected_ac in d["anticheat_protected"], f"{gid}: missing {expected_ac}"


# ---------- /api/scan/browser ----------
class TestScanBrowser:
    def test_requires_auth(self, session):
        r = session.post(f"{API}/scan/browser", json={}, timeout=15)
        assert r.status_code == 401

    def test_parses_nvidia_rtx_3060(self, session, auth):
        payload = {
            "gpu_renderer": "ANGLE (NVIDIA, NVIDIA GeForce RTX 3060 Ti Direct3D11)",
            "gpu_vendor": "Google Inc. (NVIDIA)",
            "cpu_threads": 12,
            "ram_gb": 16,
            "platform": "Win32",
            "user_agent": "Mozilla/5.0 Win64 x64",
            "storage_quota_mb": 500000,
            "storage_usage_mb": 200000,
            "connection": {"downlink": 50, "rtt": 20},
        }
        r = session.post(f"{API}/scan/browser", headers=auth, json=payload, timeout=20)
        assert r.status_code == 200, r.text
        d = r.json()
        assert "RTX 3060" in d["gpu"]["model"], f"GPU parse failed: {d['gpu']}"
        assert d["gpu"]["arch"] == "Ampere"
        assert d["cpu"]["threads"] == 12
        assert d["cpu"]["cores"] == 6
        assert d["ram"]["total_gb"] == 16
        assert d["disk"]["type"] == "SSD"
        assert d["tier"] in {"low", "mid", "high"}
        assert 0 < d["score"] <= 130

    def test_parses_amd_radeon(self, session, auth):
        payload = {
            "gpu_renderer": "ANGLE (AMD, AMD Radeon RX 6700 XT Direct3D11)",
            "cpu_threads": 16, "ram_gb": 32,
            "user_agent": "Mozilla Win64 x64", "storage_quota_mb": 0,
        }
        r = session.post(f"{API}/scan/browser", headers=auth, json=payload, timeout=15)
        assert r.status_code == 200
        d = r.json()
        assert "RX 6700" in d["gpu"]["model"] or "Radeon" in d["gpu"]["model"]
        assert d["gpu"]["arch"] == "RDNA2"

    def test_unknown_gpu_fallback(self, session, auth):
        r = session.post(f"{API}/scan/browser", headers=auth, json={"gpu_renderer": "", "cpu_threads": 4, "ram_gb": 8}, timeout=15)
        assert r.status_code == 200
        d = r.json()
        assert "model" in d["gpu"]


# ---------- /api/services ----------
class TestServices:
    def test_12_protected_services(self, session):
        r = session.get(f"{API}/services", timeout=15)
        assert r.status_code == 200
        d = r.json()
        services = d["services"]
        assert len(services) == 12
        names = {s["name"] for s in services}
        expected = {"PcaSvc", "PlugPlay", "DPS", "DiagTrack", "SysMain", "Sysmon",
                    "EventLog", "WSearch", "Wuauserv", "BFE", "MpsSvc", "WinDefend"}
        assert expected == names
        for s in services:
            assert s["policy"] == "protected"
        assert "NUNCA" in d["policy"]


# ---------- /api/security-status ----------
class TestSecurityStatus:
    def test_requires_auth(self, session):
        r = session.get(f"{API}/security-status", timeout=15)
        assert r.status_code == 401

    def test_security_status_payload(self, session, auth):
        r = session.get(f"{API}/security-status", headers=auth, timeout=15)
        assert r.status_code == 200
        d = r.json()
        for k in ["secure_boot", "tpm_2", "services_protected", "anti_cheats_protected", "policy", "promise"]:
            assert k in d, f"missing key {k}"
        assert d["services_protected"] == 12
        assert d["anti_cheats_protected"] == 8
        assert d["policy"] == "permanente"


# ---------- /api/auto-mode ----------
class TestAutoMode:
    def test_requires_auth_get(self, session):
        assert session.get(f"{API}/auto-mode", timeout=15).status_code == 401

    def test_requires_auth_post(self, session):
        assert session.post(f"{API}/auto-mode", json={"enabled": True}, timeout=15).status_code == 401

    def test_set_and_get(self, session, auth):
        # default false
        r0 = session.get(f"{API}/auto-mode", headers=auth, timeout=15)
        assert r0.status_code == 200
        # enable
        r1 = session.post(f"{API}/auto-mode", headers=auth, json={"enabled": True}, timeout=15)
        assert r1.status_code == 200
        assert r1.json()["enabled"] is True
        # verify persisted
        r2 = session.get(f"{API}/auto-mode", headers=auth, timeout=15)
        assert r2.status_code == 200
        assert r2.json()["enabled"] is True
        # disable
        r3 = session.post(f"{API}/auto-mode", headers=auth, json={"enabled": False}, timeout=15)
        assert r3.status_code == 200
        assert r3.json()["enabled"] is False
        r4 = session.get(f"{API}/auto-mode", headers=auth, timeout=15)
        assert r4.json()["enabled"] is False


# ---------- /api/optimizations/default spans 16 categories ----------
class TestOptimizationsDefault:
    EXPECTED_CATEGORIES = {
        "mis-ajustes", "basico", "seguridad", "personalizacion", "panel-nvidia",
        "administracion-energia", "eliminacion", "limpieza", "privacidad",
        "ajustes", "inicio-automatico", "dispositivos", "adaptadores-red",
        "tareas", "componentes", "obsoleto"
    }

    def test_default_items_cover_all_categories(self, session):
        r = session.get(f"{API}/optimizations/default", timeout=15)
        assert r.status_code == 200
        items = r.json()["items"]
        assert len(items) >= 50, f"Expected 50+ items, got {len(items)}"
        cats = {it["category"] for it in items}
        missing = self.EXPECTED_CATEGORIES - cats
        assert not missing, f"Missing categories: {missing}"

    def test_each_item_shape(self, session):
        items = session.get(f"{API}/optimizations/default").json()["items"]
        for it in items[:10]:
            assert {"id", "label", "description", "safe", "recommended_value", "reasoning", "category"}.issubset(it.keys())


# ---------- /api/optimize/analyze still works (AI or fallback) ----------
class TestAnalyze:
    def test_analyze_after_browser_scan(self, session, auth):
        # First do browser scan to produce a result we can pass in
        scan_resp = session.post(f"{API}/scan/browser", headers=auth, json={
            "gpu_renderer": "ANGLE (NVIDIA, NVIDIA GeForce RTX 4060 Direct3D11)",
            "cpu_threads": 12, "ram_gb": 16, "user_agent": "Win64 x64",
            "storage_quota_mb": 500000, "storage_usage_mb": 100000,
        }, timeout=20)
        assert scan_resp.status_code == 200
        scan_data = scan_resp.json()

        r = session.post(f"{API}/optimize/analyze", headers=auth, json={"scan": scan_data}, timeout=120)
        assert r.status_code == 200, r.text
        d = r.json()
        assert "summary" in d
        assert "optimizations" in d and len(d["optimizations"]) >= 5
        assert isinstance(d["boost_percent"], int)

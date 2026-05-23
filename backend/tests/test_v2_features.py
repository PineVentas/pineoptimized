"""Pine Opti v1.0 new features: games, DNS, processes, achievements, boost-history, theme."""
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
    """Fresh user — used to validate achievement auto-unlock from clean state."""
    uname = f"TEST_{uuid.uuid4().hex[:10]}"
    r = session.post(f"{API}/auth/register", json={"username": uname, "password": "abc12345"}, timeout=30)
    assert r.status_code == 200
    data = r.json()
    return {"username": uname, "token": data["token"], "user": data["user"]}


@pytest.fixture(scope="module")
def auth(fresh_user):
    return {"Authorization": f"Bearer {fresh_user['token']}", "Content-Type": "application/json"}


# -------- Version --------
class TestVersion:
    def test_root_version_is_1_0(self, session):
        r = session.get(f"{API}/", timeout=15)
        assert r.status_code == 200
        assert r.json()["version"] == "1.0"

    def test_stats_version_is_1_0(self, session):
        r = session.get(f"{API}/stats", timeout=15)
        assert r.status_code == 200
        assert r.json()["version"] == "1.0"


# -------- Games --------
class TestGames:
    def test_list_games(self, session):
        r = session.get(f"{API}/games", timeout=15)
        assert r.status_code == 200
        games = r.json()["games"]
        assert len(games) == 4
        ids = {g["id"] for g in games}
        assert ids == {"free-fire", "valorant", "cs2", "fortnite"}
        for g in games:
            assert {"id", "name", "publisher", "anticheat", "tweaks", "color", "image"}.issubset(g.keys())

    def test_apply_free_fire_requires_auth(self, session):
        r = session.post(f"{API}/games/free-fire/apply", timeout=15)
        assert r.status_code == 401

    def test_apply_free_fire(self, session, auth):
        r = session.post(f"{API}/games/free-fire/apply", headers=auth, timeout=20)
        assert r.status_code == 200
        d = r.json()
        assert d["ok"] is True
        assert d["applied"]["id"] == "free-fire"
        protected = d["anticheat_protected"]
        for ac in ["BlackBox", "Keller SS", "Garena Shell"]:
            assert ac in protected

    def test_apply_unknown_game_404(self, session, auth):
        r = session.post(f"{API}/games/foo-bar/apply", headers=auth, timeout=15)
        assert r.status_code == 404


# -------- DNS --------
class TestDNS:
    def test_list_dns(self, session):
        r = session.get(f"{API}/dns", timeout=15)
        assert r.status_code == 200
        dns = r.json()["dns"]
        assert len(dns) == 6
        ids = {d["id"] for d in dns}
        assert {"cloudflare", "google", "quad9", "adguard", "opendns", "isp"}.issubset(ids)

    def test_apply_dns_requires_auth(self, session):
        r = session.post(f"{API}/dns/cloudflare/apply", timeout=15)
        assert r.status_code == 401

    def test_apply_cloudflare(self, session, auth):
        r = session.post(f"{API}/dns/cloudflare/apply", headers=auth, timeout=20)
        assert r.status_code == 200
        d = r.json()
        assert d["ok"] is True
        assert d["applied"]["id"] == "cloudflare"
        assert d["applied"]["primary"] == "1.1.1.1"

    def test_apply_unknown_dns_404(self, session, auth):
        r = session.post(f"{API}/dns/foo/apply", headers=auth, timeout=15)
        assert r.status_code == 404


# -------- Processes --------
class TestProcesses:
    def test_list_processes(self, session):
        r = session.get(f"{API}/processes", timeout=15)
        assert r.status_code == 200
        procs = r.json()["processes"]
        assert len(procs) == 12
        for p in procs:
            assert {"name", "cpu_pct", "ram_mb", "safe_to_kill", "reason"}.issubset(p.keys())
        names = {p["name"] for p in procs}
        # criticals present and locked
        critical = {"explorer.exe", "Discord.exe", "NVIDIA Container", "SearchHost.exe"}
        assert critical.issubset(names)
        for p in procs:
            if p["name"] in critical:
                assert p["safe_to_kill"] is False

    def test_kill_processes_separates_safe_vs_critical(self, session, auth):
        payload = {"names": ["OneDrive.exe", "Spotify.exe", "explorer.exe", "Discord.exe", "RuntimeBroker.exe"]}
        r = session.post(f"{API}/processes/kill", headers=auth, json=payload, timeout=20)
        assert r.status_code == 200
        d = r.json()
        assert set(d["killed"]) == {"OneDrive.exe", "Spotify.exe", "RuntimeBroker.exe"}
        assert set(d["skipped_critical"]) == {"explorer.exe", "Discord.exe"}
        assert d["ram_freed_mb"] > 0


# -------- Achievements --------
class TestAchievements:
    def test_achievements_requires_auth(self, session):
        r = session.get(f"{API}/achievements", timeout=15)
        assert r.status_code == 401

    def test_fresh_user_unlocks_protector_and_game_profile(self, session, fresh_user):
        """fresh_user already applied free-fire above → game-profile, dns-tune, protector unlocked."""
        h = {"Authorization": f"Bearer {fresh_user['token']}"}
        r = session.get(f"{API}/achievements", headers=h, timeout=15)
        assert r.status_code == 200
        d = r.json()
        assert d["total"] == 8
        assert len(d["achievements"]) == 8
        unlocked = {a["id"] for a in d["achievements"] if a["unlocked"]}
        assert "protector" in unlocked  # always unlocked
        assert "game-profile" in unlocked  # applied free-fire
        assert "dns-tune" in unlocked  # applied cloudflare

    def test_brand_new_user_protector_only(self, session):
        """Verify a truly brand new user gets only 'protector' (=1)."""
        uname = f"TEST_{uuid.uuid4().hex[:10]}"
        r = session.post(f"{API}/auth/register", json={"username": uname, "password": "abc12345"}, timeout=30)
        assert r.status_code == 200
        tok = r.json()["token"]
        h = {"Authorization": f"Bearer {tok}"}
        r2 = session.get(f"{API}/achievements", headers=h, timeout=15)
        assert r2.status_code == 200
        d = r2.json()
        unlocked = {a["id"] for a in d["achievements"] if a["unlocked"]}
        assert unlocked == {"protector"}, f"Expected only protector, got {unlocked}"
        assert d["unlocked_count"] == 1

    def test_ai_chat_unlocks_after_chat(self, session, auth):
        """After a chat with TweaX, ai-chat should appear."""
        sid = f"sess-{uuid.uuid4().hex[:8]}"
        rc = session.post(f"{API}/chat", headers=auth, json={"session_id": sid, "message": "hola"}, timeout=90)
        assert rc.status_code == 200
        r = session.get(f"{API}/achievements", headers=auth, timeout=15)
        assert r.status_code == 200
        unlocked = {a["id"] for a in r.json()["achievements"] if a["unlocked"]}
        assert "ai-chat" in unlocked


# -------- Boost History --------
class TestBoostHistory:
    def test_requires_auth(self, session):
        r = session.get(f"{API}/boost-history", timeout=15)
        assert r.status_code == 401

    def test_returns_7_days(self, session, auth):
        r = session.get(f"{API}/boost-history", headers=auth, timeout=15)
        assert r.status_code == 200
        h = r.json()["history"]
        assert len(h) == 7
        days = [d["day"] for d in h]
        assert days == ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"]
        for d in h:
            assert isinstance(d["value"], int)
            assert 5 <= d["value"] <= 95


# -------- Theme --------
class TestTheme:
    def test_set_valid_themes(self, session, auth):
        for t in ["green", "cyan", "magenta", "amber"]:
            r = session.post(f"{API}/theme", headers=auth, json={"theme": t}, timeout=15)
            assert r.status_code == 200, f"theme {t} failed: {r.text}"
            assert r.json()["theme"] == t

    def test_set_invalid_theme_400(self, session, auth):
        r = session.post(f"{API}/theme", headers=auth, json={"theme": "rainbow"}, timeout=15)
        assert r.status_code == 400

    def test_theme_requires_auth(self, session):
        r = session.post(f"{API}/theme", json={"theme": "green"}, timeout=15)
        assert r.status_code == 401

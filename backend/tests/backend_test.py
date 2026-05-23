"""Pine Opti backend API tests."""
import os
import uuid
import time
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://firewall-pro-2.preview.emergentagent.com").rstrip("/")
API = f"{BASE_URL}/api"


# ---------- Fixtures ----------
@pytest.fixture(scope="session")
def session():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


@pytest.fixture(scope="session")
def test_user(session):
    """Create a fresh test user for the full run."""
    username = f"TEST_{uuid.uuid4().hex[:10]}"
    password = "abc12345"
    r = session.post(f"{API}/auth/register", json={"username": username, "password": password}, timeout=30)
    assert r.status_code == 200, f"register failed: {r.status_code} {r.text}"
    data = r.json()
    return {"username": username, "password": password, "token": data["token"], "user": data["user"]}


@pytest.fixture(scope="session")
def auth_headers(test_user):
    return {"Authorization": f"Bearer {test_user['token']}", "Content-Type": "application/json"}


# ---------- Public ----------
class TestPublic:
    def test_root(self, session):
        r = session.get(f"{API}/", timeout=15)
        assert r.status_code == 200
        data = r.json()
        assert "Pine Opti" in data["message"]
        assert "version" in data

    def test_stats(self, session):
        r = session.get(f"{API}/stats", timeout=15)
        assert r.status_code == 200
        d = r.json()
        assert "users" in d and isinstance(d["users"], int)
        assert "version" in d

    def test_news(self, session):
        r = session.get(f"{API}/news", timeout=15)
        assert r.status_code == 200
        d = r.json()
        assert "news" in d
        assert len(d["news"]) == 3
        for item in d["news"]:
            assert "id" in item and "body" in item and "tag" in item

    def test_tools(self, session):
        r = session.get(f"{API}/tools", timeout=15)
        assert r.status_code == 200
        d = r.json()
        assert len(d["tools"]) == 9
        ids = {t["id"] for t in d["tools"]}
        assert {"storex", "gamemodex", "processx", "godmode"}.issubset(ids)

    def test_protected_services(self, session):
        r = session.get(f"{API}/protected-services", timeout=15)
        assert r.status_code == 200
        d = r.json()
        names = [s["name"] for s in d["services"]]
        assert len(names) == 8
        assert "BlackBox" in names
        assert "Keller SS" in names
        assert any("BattlEye" in n for n in names)


# ---------- Auth ----------
class TestAuth:
    def test_register_and_login(self, session):
        uname = f"TEST_{uuid.uuid4().hex[:8]}"
        pwd = "pass1234"
        r = session.post(f"{API}/auth/register", json={"username": uname, "password": pwd}, timeout=20)
        assert r.status_code == 200
        d = r.json()
        assert "token" in d and "user" in d
        assert d["user"]["is_pro"] is True

        # duplicate registration should fail
        r2 = session.post(f"{API}/auth/register", json={"username": uname, "password": pwd}, timeout=20)
        assert r2.status_code == 400

        # login
        r3 = session.post(f"{API}/auth/login", json={"username": uname, "password": pwd}, timeout=20)
        assert r3.status_code == 200
        assert "token" in r3.json()

        # bad login
        r4 = session.post(f"{API}/auth/login", json={"username": uname, "password": "wrong"}, timeout=20)
        assert r4.status_code == 401

    def test_me(self, session, auth_headers, test_user):
        r = session.get(f"{API}/user/me", headers=auth_headers, timeout=20)
        assert r.status_code == 200
        d = r.json()
        assert d["username"] == test_user["username"]
        assert "optimization_pct" in d

    def test_me_no_token(self, session):
        r = session.get(f"{API}/user/me", timeout=15)
        assert r.status_code == 401


# ---------- Scan + AI Analyze ----------
class TestScanAndAnalyze:
    def test_scan_requires_auth(self, session):
        r = session.post(f"{API}/scan", timeout=15)
        assert r.status_code == 401

    def test_scan_ok(self, session, auth_headers):
        r = session.post(f"{API}/scan", headers=auth_headers, timeout=30)
        assert r.status_code == 200
        d = r.json()
        for k in ["cpu", "gpu", "ram", "disk", "network", "score", "tier"]:
            assert k in d
        assert d["tier"] in ("low", "mid", "high")
        assert "model" in d["cpu"]

    def test_analyze_returns_optimizations(self, session, auth_headers):
        scan_r = session.post(f"{API}/scan", headers=auth_headers, timeout=30)
        assert scan_r.status_code == 200
        scan = scan_r.json()

        r = session.post(f"{API}/optimize/analyze", headers=auth_headers, json={"scan": scan}, timeout=90)
        assert r.status_code == 200, f"analyze failed: {r.text[:300]}"
        d = r.json()
        assert "summary" in d
        assert isinstance(d["boost_percent"], int)
        assert len(d["optimizations"]) >= 10
        # No anti-cheat in optimizations
        joined = " ".join((o.get("label", "") + " " + o.get("description", "") + " " + o.get("id", "")).lower()
                          for o in d["optimizations"])
        for bad in ["blackbox", "keller", "battleye", "vanguard", "faceit", "easy anti-cheat", "eac"]:
            assert bad not in joined, f"Anti-cheat service '{bad}' appears in optimizations!"

    def test_default_optimizations(self, session):
        r = session.get(f"{API}/optimizations/default", timeout=15)
        assert r.status_code == 200
        items = r.json()["items"]
        assert len(items) >= 10


# ---------- Chat ----------
class TestChat:
    def test_chat_flow_and_history(self, session, auth_headers):
        sid = f"sess-{uuid.uuid4().hex[:8]}"
        r = session.post(f"{API}/chat", headers=auth_headers,
                         json={"session_id": sid, "message": "¿Cuál es la mejor optimización para Free Fire?"},
                         timeout=90)
        assert r.status_code == 200, f"chat failed: {r.text[:300]}"
        d = r.json()
        assert d["session_id"] == sid
        assert len(d["reply"]) > 5

        time.sleep(0.5)
        h = session.get(f"{API}/chat/history/{sid}", headers=auth_headers, timeout=20)
        assert h.status_code == 200
        msgs = h.json()["messages"]
        assert len(msgs) >= 1
        assert msgs[0]["user_message"].startswith("¿Cuál")

    def test_chat_requires_auth(self, session):
        r = session.post(f"{API}/chat", json={"session_id": "x", "message": "hi"}, timeout=15)
        assert r.status_code == 401


# ---------- Settings ----------
class TestSettings:
    def test_settings_persist(self, session, auth_headers):
        payload = {"settings": {"darkMode": True, "lang": "es", "notify": False}}
        r = session.post(f"{API}/settings", headers=auth_headers, json=payload, timeout=20)
        assert r.status_code == 200
        assert r.json()["ok"] is True

        g = session.get(f"{API}/settings", headers=auth_headers, timeout=20)
        assert g.status_code == 200
        assert g.json()["settings"]["darkMode"] is True
        assert g.json()["settings"]["lang"] == "es"


# ---------- Apply ----------
class TestApply:
    def test_apply_bumps_pct(self, session, auth_headers):
        items = [{"id": f"opt-{i}", "label": f"Opt {i}"} for i in range(5)]
        r = session.post(f"{API}/apply", headers=auth_headers, json={"applied": items}, timeout=20)
        assert r.status_code == 200
        d = r.json()
        assert d["ok"] is True
        assert d["applied_count"] == 5
        assert d["new_pct"] >= 25

        # verify reflected on /user/me
        me = session.get(f"{API}/user/me", headers=auth_headers, timeout=20)
        assert me.status_code == 200
        assert me.json()["optimization_pct"] == d["new_pct"]

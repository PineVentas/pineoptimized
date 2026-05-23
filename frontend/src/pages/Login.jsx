import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";

const LOGO = "https://customer-assets.emergentagent.com/job_firewall-pro-2/artifacts/yp9jj9mp_logo.ico";

export default function Login() {
  const { login, register } = useAuth();
  const nav = useNavigate();
  const [mode, setMode] = useState("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!username || !password) return toast.error("Completa los campos");
    setLoading(true);
    try {
      if (mode === "login") await login(username, password);
      else await register(username, password);
      toast.success(`Bienvenido, ${username}`);
      nav("/");
    } catch (err) {
      toast.error(err?.response?.data?.detail || "Error");
    } finally { setLoading(false); }
  };

  return (
    <div className="bg-app bg-grain h-screen w-screen flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-20 -left-20 w-[400px] h-[400px] rounded-full bg-[#14ff72]/10 blur-3xl"/>
        <div className="absolute -bottom-20 -right-20 w-[420px] h-[420px] rounded-full bg-[#d926ff]/10 blur-3xl"/>
      </div>

      <div className="glass p-8 w-full max-w-md relative z-10">
        <div className="flex flex-col items-center mb-6">
          <img src={LOGO} alt="" className="w-14 h-14 mb-3 neon-glow rounded-full"/>
          <h1 className="font-display text-3xl uppercase tracking-[0.2em] neon-text">Pine Opti</h1>
          <p className="text-[11px] uppercase tracking-widest text-white/40 mt-1">Neon Edition · v1.0</p>
        </div>

        <div className="flex border border-white/10 rounded overflow-hidden mb-5 text-xs font-display uppercase tracking-widest">
          <button onClick={() => setMode("login")} className={`flex-1 py-2 ${mode === "login" ? "bg-[#14ff72] text-black" : "text-white/60"}`} data-testid="tab-login">Entrar</button>
          <button onClick={() => setMode("register")} className={`flex-1 py-2 ${mode === "register" ? "bg-[#14ff72] text-black" : "text-white/60"}`} data-testid="tab-register">Crear</button>
        </div>

        <form onSubmit={submit} className="space-y-3">
          <div>
            <label className="text-[10px] uppercase tracking-widest text-white/40">Usuario</label>
            <input data-testid="username-input" value={username} onChange={e => setUsername(e.target.value)} className="w-full mt-1 bg-[#05070A] border border-white/10 rounded px-3 py-2.5 text-sm focus:border-[#14ff72] focus:outline-none" autoComplete="username"/>
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-widest text-white/40">Contraseña</label>
            <input data-testid="password-input" type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full mt-1 bg-[#05070A] border border-white/10 rounded px-3 py-2.5 text-sm focus:border-[#14ff72] focus:outline-none" autoComplete="current-password"/>
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full" data-testid="submit-auth-btn">
            {loading ? "…" : mode === "login" ? "Iniciar sesión" : "Crear cuenta"}
          </button>
        </form>
        <p className="text-[11px] text-white/40 text-center mt-5">Tu cuenta es 100% individual · Tu nombre, tus ajustes, tu boost.</p>
      </div>
    </div>
  );
}

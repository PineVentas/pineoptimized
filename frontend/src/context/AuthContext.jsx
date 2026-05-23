import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

// Pine Opti corre sin cuentas — sesión local permanente
const getLocalUser = () => {
  return {
    id: "pine-local-user",
    username: "PINE LIMPIO",
    is_pro: true,
    optimization_pct: 10,
    created_at: new Date().toISOString(),
  };
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getLocalUser());
  const loading = false;

  // Forzar que el usuario siempre sea el nombre real del PC
  useEffect(() => {
    const updateName = async () => {
      if (window.electronAPI && window.electronAPI.getRealUserName) {
        try {
          const name = await window.electronAPI.getRealUserName();
          if (name) {
            setUser(prev => ({ ...prev, username: name.toUpperCase() }));
          }
        } catch (e) {
          console.error("Error detectando nombre:", e);
        }
      }
    };
    
    updateName();
  }, []);

  // No-ops — no hay sistema de cuentas, no se puede cerrar sesión ni crear usuarios
  const login = () => Promise.resolve(getLocalUser());
  const register = () => Promise.resolve(getLocalUser());
  const logout = () => {
    console.log("Sesión local — No es necesario cerrar sesión");
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

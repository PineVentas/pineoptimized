# Pine Opti — Guía para crear el .exe portable

Todo el código ya está listo. Solo necesitas **Node.js instalado en Windows** y 3 comandos.

---

## ✅ Requisitos

| Herramienta | Versión mínima | Descarga |
|---|---|---|
| Node.js | 20 LTS | https://nodejs.org/ |
| Git | cualquiera | https://git-scm.com/ |
| Windows | 10 / 11 | — |

---

## 🚀 Pasos (copia y pega)

### 1 — Descarga el proyecto

```bash
git clone https://github.com/TU_USUARIO/pine-opti.git
cd pine-opti
```

> Si no tienes Git, descarga el ZIP desde Replit → tres puntos → Download as ZIP.
> Descomprime y abre esa carpeta en la terminal.

---

### 2 — Instala dependencias de Electron

Desde la **raíz** del proyecto:

```bash
npm install
```

---

### 3 — Compila el frontend (React → archivos estáticos)

```bash
cd frontend
npm install --legacy-peer-deps
npm run build
cd ..
```

Esto genera la carpeta `frontend/build/` con toda la UI compilada.

---

### 4 — Genera el .exe

```bash
npm run build:exe
```

Espera 2-5 minutos. Se generan **dos archivos** en `dist-electron/`:

| Archivo | Tipo | Uso |
|---|---|---|
| `PineOpti-v1.2-Portable.exe` | **Portátil** ← este | Un solo .exe, sin instalar. Pásalo a tus amigos |
| `Pine Opti Setup 1.2.0.exe` | Instalador | Instala con accesos directos en escritorio |

---

## 📁 Estructura resultante

```
dist-electron/
├── PineOpti-v1.2-Portable.exe     ← 1 archivo, ~85MB, listo para usar
└── Pine Opti Setup 1.2.0.exe      ← instalador con acceso directo
```

---

## 🔑 El exe requiere permisos de Administrador

El `package.json` ya tiene configurado `"requestedExecutionLevel": "requireAdministrator"`.
Windows pedirá "¿Permitir que esta app haga cambios?" — hay que decir **Sí** para que los tweaks se apliquen al registro.

---

## 📤 Cómo pasar el exe a tus amigos

1. Sube `PineOpti-v1.2-Portable.exe` a Google Drive / Mega / WeTransfer
2. Tus amigos lo descargan y lo ejecutan directamente
3. Windows Defender puede mostrar "SmartScreen" la primera vez → click en **"Más información" → "Ejecutar de todas formas"**

> Esto pasa porque el exe no tiene firma de código (cuesta ~$200/año). Es completamente normal para apps indie.

---

## ⚠️ Windows Defender / Antivirus

Si el antivirus borra el exe:
- Agrega la carpeta donde lo guardaste a las **exclusiones de Windows Defender**
- O usa el instalador NSIS que tiene firma en el certificado del builder

---

## 🔧 Backend (opcional)

La versión web usa el backend de Replit automáticamente (`/api`).
En el exe, todas las funciones que usan datos reales (Process Killer, Hardware info, DNS) van directo a PowerShell/WMI — **sin necesitar internet ni backend**.

Si quieres incluir el backend Python localmente:
```js
// electron/main.js — ya incluido comentado al final del archivo
const { spawn } = require('child_process');
const backend = spawn('backend\\server.exe', [], { windowsHide: true });
```
Usa PyInstaller para generar `backend/server.exe` primero.

---

## 🔄 Actualizar versión

Cuando hagas cambios al código, solo corre de nuevo:
```bash
cd frontend && npm run build && cd ..
npm run build:exe
```

---

## 🛠️ Problemas comunes

| Problema | Solución |
|---|---|
| `electron-builder` no encontrado | Corre `npm install` en la raíz |
| `frontend/build` no existe | Corre el paso 3 (cd frontend && npm run build) |
| Error NSIS / falta icono | Verifica que `assets/icon.ico` existe (ya está incluido) |
| Antivirus elimina el exe | Agregar exclusión o usar instalador NSIS |
| "No puedo ejecutar scripts" en PowerShell | Corre: `Set-ExecutionPolicy RemoteSigned -Scope CurrentUser` |

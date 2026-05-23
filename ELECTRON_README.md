# 🔥 Pine Opti — Convertir a `.exe` (Electron)

Esta carpeta contiene la **web app completa**. Para generar el `.exe` real para Windows, sigue estos pasos en tu PC con Windows.

## 1. Requisitos en tu PC
- Windows 10/11
- [Node.js 20+](https://nodejs.org/)
- Git

## 2. Clonar y preparar
```bash
git clone <tu-repo> pine-opti
cd pine-opti/frontend
yarn install
yarn build         # genera /build con la app estática
```

## 3. Añadir Electron
```bash
cd ..   # raíz del proyecto
yarn add -D electron electron-builder concurrently
```

Crea `electron/main.js`:
```js
const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1280, height: 820, minWidth: 1100, minHeight: 720,
    frame: false, transparent: false, backgroundColor: '#07090E',
    icon: path.join(__dirname, '../assets/icon.ico'),
    webPreferences: { contextIsolation: true, nodeIntegration: false }
  });
  Menu.setApplicationMenu(null);
  win.loadFile(path.join(__dirname, '../frontend/build/index.html'));
}
app.whenReady().then(createWindow);
app.on('window-all-closed', () => app.quit());
```

Añade a tu `package.json` raíz:
```json
{
  "main": "electron/main.js",
  "build": {
    "appId": "com.pineopti.app",
    "productName": "Pine Opti",
    "directories": { "output": "dist-electron" },
    "files": ["electron/**/*", "frontend/build/**/*", "assets/**/*"],
    "win": {
      "target": "nsis",
      "icon": "assets/icon.ico"
    }
  },
  "scripts": {
    "electron:dev": "electron .",
    "electron:build": "electron-builder --win"
  }
}
```

Coloca el logo `.ico` en `assets/icon.ico`.

## 4. Compilar
```bash
yarn electron:build
```

Se genera `dist-electron/Pine Opti Setup x.x.x.exe`. ¡Listo!

## 5. Backend
El backend (FastAPI) puede:
- **Opción A**: quedarse en la nube (esta URL) — tu .exe simplemente lo llama
- **Opción B**: empaquetarse local con [PyInstaller](https://pyinstaller.org/) y lanzarse desde `main.js` (`child_process.spawn`)

## 6. Tweaks reales (Windows)
Para que el .exe ejecute cambios reales de Windows, agrega en `electron/main.js`:
```js
const { exec } = require('child_process');
exec('powershell -Command "Set-Service -Name SysMain -StartupType Disabled"', { shell: true });
```
**SIEMPRE** filtra contra la lista de servicios protegidos del backend (`/api/protected-services`) antes de ejecutar.

## ⚠️ Firma de código
Windows marcará el .exe como "no verificado" sin firma. Para evitarlo, compra un certificado de firma (~$200/año en SSL.com, DigiCert, etc.).

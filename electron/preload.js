const { contextBridge, ipcRenderer } = require('electron');
const os = require('os');

contextBridge.exposeInMainWorld('electronAPI', {
  getComputerName: () => os.hostname(),
  getUserName: () => { try { return os.userInfo().username || "Usuario"; } catch { return "Usuario"; } },
  getRealUserName: () => ipcRenderer.invoke('get-real-username'),
  minimize: () => ipcRenderer.send('window-minimize'),
  maximize: () => ipcRenderer.send('window-maximize'),
  close: () => ipcRenderer.send('window-close'),
  getHardwareInfo: () => ipcRenderer.invoke('get-hardware-info'),
  getLiveStats: () => ipcRenderer.invoke('get-live-stats'),
  installStoreApp: (appId, appName) => ipcRenderer.invoke('install-store-app', appId, appName),
  runFix: (fixType) => ipcRenderer.invoke('run-fix', fixType),
  createRestorePoint: () => ipcRenderer.invoke('create-restore-point'),
  getRestorePoints: () => ipcRenderer.invoke('get-restore-points'),
  restoreSystem: (seq) => ipcRenderer.invoke('restore-system', seq),
  applyDns: (primary, secondary) => ipcRenderer.invoke('apply-dns', primary, secondary),
  getProcesses: () => ipcRenderer.invoke('get-processes'),
  killProcesses: (names) => ipcRenderer.invoke('kill-processes', names),
  applyGameProfile: (gameId) => ipcRenderer.invoke('apply-game-profile', gameId),
  applyOptimization: (id, enabled) => ipcRenderer.invoke('apply-optimization', id, enabled),
  toggleGameMode: (enable) => ipcRenderer.invoke('toggle-game-mode', enable),
  createGodMode: () => ipcRenderer.invoke('create-god-mode'),
  steamBoost: () => ipcRenderer.invoke('steam-boost'),
  runLatencyTest: () => ipcRenderer.invoke('run-latency-test'),
});

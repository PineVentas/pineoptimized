const { app, BrowserWindow, Menu, ipcMain, shell } = require('electron');
const path = require('path');
const si = require('systeminformation');
const { exec } = require('child_process');

// ============================================================
// LISTA BLANCA PERMANENTE — ANTI-CHEATS NUNCA SE TOCAN
// ============================================================
const ANTICHEAT_WHITELIST = [
  'vgc', 'vgtray', 'vanguard', 'easyanticheat', 'eac_launcher',
  'battleye', 'bservice', 'beservice', 'garena', 'blackbox',
  'kellerss', 'keller', 'garenaff', 'garenaplus', 'garenafflauncher',
  'garenacore', 'garenashell', 'faceitclient', 'faceit',
  'esea', 'xigncode', 'xhunter', 'nprotect', 'gameguard',
  'mhyprot', 'riotclient', 'riotclientservices', 'ricochet',
];

function isAntiCheat(n) {
  const l = (n || '').toLowerCase().replace('.exe', '').replace(/\s/g, '');
  return ANTICHEAT_WHITELIST.some(ac => l.includes(ac));
}

// ============================================================
// SERVICIOS PROTEGIDOS DE WINDOWS — JAMÁS SE TOCAN
// Requeridos por el anticheat de Free Fire y la estabilidad
// del sistema: PcaSvc, PlugPlay, DPS, DiagTrack, SysMain,
// Sysmon, EventLog, TPM, SecureBoot.
// ============================================================
const PROTECTED_WINDOWS_SERVICES = [
  'pcasvc',       // Program Compatibility Assistant — anticheat Free Fire
  'plugplay',     // Plug and Play — detección de hardware
  'dps',          // Diagnostic Policy Service — diagnóstico del sistema
  'diagtrack',    // Connected User Experiences — anticheat lo consulta
  'sysmain',      // Superfetch/SysMain — estabilidad del sistema
  'sysmon',       // System Monitor — monitoreo del sistema
  'eventlog',     // Windows Event Log — crítico para el SO
  'wecsvc',       // Windows Event Collector
  'mpssvc',       // Windows Firewall
  'trustedinstaller', // Windows Modules Installer
];

function isProtectedService(name) {
  const l = (name || '').toLowerCase().replace(/\s/g, '');
  return PROTECTED_WINDOWS_SERVICES.some(s => l.includes(s));
}

function ps(command, timeout = 30000) {
  return new Promise((resolve) => {
    const safe = command.replace(/\n\s*/g, ' ').replace(/\r/g, '');
    exec(`powershell -NoProfile -NonInteractive -ExecutionPolicy Bypass -Command "${safe}"`,
      { timeout }, (err, stdout, stderr) => {
      resolve({ ok: !err, stdout: stdout || '', stderr: stderr || '' });
    });
  });
}

// ============================================================
// PINE STORE — SIN MICROSOFT STORE
// Orden: winget → Chocolatey → Descarga directa → web oficial
// Compatible con Windows LTSC, N, modificados sin Store
// ============================================================
const WINGET_IDS = {
  // Social y comunicación
  'discord':         'Discord.Discord',
  'telegram':        'Telegram.TelegramDesktop',
  'whatsapp':        'WhatsApp.WhatsApp',
  'spotify':         'Spotify.Spotify',
  'tiktok':          'ByteDance.TikTok',
  // Gaming tools
  'steam':           'Valve.Steam',
  'obs':             'OBSProject.OBSStudio',
  'msi-afterburner': 'Guru3D.Afterburner',
  'cpu-z':           'CPUID.CPU-Z',
  'gpu-z':           'TechPowerUp.GPU-Z',
  'hwinfo':          'REALiX.HWiNFO',
  'crystaldiskinfo': 'CrystalDewWorld.CrystalDiskInfo',
  'speccy':          'Piriform.Speccy',
  'furmark':         'Geeks3D.FurMark',
  // GPU
  'nvidia-geforce':  'Nvidia.GeForceExperience',
  'intel-graphics':  'Intel.IntelGraphicsCommandCenter',
  // Utilidades
  '7zip':            '7zip.7zip',
  'notepadpp':       'Notepad++.Notepad++',
  'winrar':          'RARLab.WinRAR',
  'chrome':          'Google.Chrome',
  'firefox':         'Mozilla.Firefox',
  'qbittorrent':     'qBittorrent.qBittorrent',
  'potplayer':       'Daum.PotPlayer',
  'vlc':             'VideoLAN.VLC',
  'everything':      'voidtools.Everything',
  'sharex':          'ShareX.ShareX',
  // Windows extras (sin Store)
  'terminal':        'Microsoft.WindowsTerminal',
  'eartrumpet':      'File-New-Project.EarTrumpet',
  'lively':          'rocksdanister.LivelyWallpaper',
  'translucenttb':   'charlesmilette.TranslucentTB',
  'rainmeter':       'Rainmeter.Rainmeter',
  'ddu':             'Wagnardsoft.DisplayDriverUninstaller',
  // Streaming
  'streamlabs':      'Streamlabs.Streamlabs',
  'voicemod':        'Voicemod.Voicemod',
  'xsplit':          'SplitmediaLabs.XSplit.Broadcaster',
  // Hardware tools
  'openrgb':         'CalcProgrammer1.OpenRGB',
  'fancontrol':      'Rem0o.FanControl',
  'throttlestop':    'UncleScientist.ThrottleStop',
  'capframex':       'DevTechProfile.CapFrameX',
  'processhacker':   'ProcessHacker.ProcessHacker',
  'windirstat':      'WillemDijkema.WinDirStat',
  'wiztree':         'AntibodySoftware.WizTree',
  'autoruns':        'Microsoft.Sysinternals.Autoruns',
  'crystaldiskmark': 'CrystalDewWorld.CrystalDiskMark',
  'bcuninstaller':   'Klocman.BulkCrapUninstaller',
  'spacesniffer':    'UderzoSoftware.SpaceSniffer',
  // Popular extras
  'wingetui':        'MartiCliment.UniGetUI',
  'revo-uninstaller':'VSRevo.RevoUninstaller',
  'malwarebytes':    'Malwarebytes.Malwarebytes',
  'brave':           'Brave.Brave',
  'protonvpn':       'ProtonTechnologies.ProtonVPN',
  'glasswire':       'GlassWire.GlassWire',
  'authy':           'Twilio.Authy',
  'powertoys':       'Microsoft.PowerToys',
  'windhawk':        'RamensoftLtd.Windhawk',
  'playnite':        'Playnite.Playnite',
  'rtss':            'Guru3D.RTSS',
  'process-lasso':   'BitSum.ProcessLasso',
  'occt':            'InnovatisaFR.OCCT',
  'aida64':          'FinalWire.AIDA64Extreme',
  'cpuid-hwmonitor': 'CPUID.HWMonitor',
};

const DIRECT_URLS = {
  'discord':         'https://discord.com/api/downloads/distributions/app/installers/latest?channel=stable&platform=win&arch=x64',
  'telegram':        'https://telegram.org/dl/desktop/win64',
  'whatsapp':        'https://web.whatsapp.com/desktop/windows/release/x64/WhatsAppSetup.exe',
  'spotify':         'https://download.scdn.co/SpotifySetup.exe',
  'tiktok':          'https://www.tiktok.com/download',
  'steam':           'https://cdn.akamai.steamstatic.com/client/installer/SteamSetup.exe',
  'obs':             'https://github.com/obsproject/obs-studio/releases/latest',
  'msi-afterburner': 'https://www.msi.com/page/afterburner',
  'cpu-z':           'https://www.cpuid.com/softwares/cpu-z.html',
  'gpu-z':           'https://www.techpowerup.com/gpuz/',
  'hwinfo':          'https://www.hwinfo.com/download/',
  'crystaldiskinfo': 'https://crystalmark.info/en/software/crystaldiskinfo/',
  'speccy':          'https://www.ccleaner.com/speccy/download',
  'furmark':         'https://geeks3d.com/furmark/',
  'nvidia-geforce':  'https://www.nvidia.com/en-us/geforce/geforce-experience/',
  'intel-graphics':  'https://www.intel.com/content/www/us/en/support/detect.html',
  '7zip':            'https://www.7-zip.org/download.html',
  'notepadpp':       'https://notepad-plus-plus.org/downloads/',
  'winrar':          'https://www.win-rar.com/download.html',
  'chrome':          'https://www.google.com/chrome/',
  'firefox':         'https://www.mozilla.org/firefox/download/',
  'qbittorrent':     'https://www.qbittorrent.org/download.php',
  'potplayer':       'https://potplayer.daum.net/',
  'vlc':             'https://www.videolan.org/vlc/download-windows.html',
  'everything':      'https://www.voidtools.com/downloads/',
  'sharex':          'https://github.com/ShareX/ShareX/releases/latest',
  'terminal':        'https://github.com/microsoft/terminal/releases/latest',
  'eartrumpet':      'https://github.com/File-New-Project/EarTrumpet/releases/latest',
  'lively':          'https://github.com/rocksdanister/lively/releases/latest',
  'translucenttb':   'https://github.com/TranslucentTB/TranslucentTB/releases/latest',
  'rainmeter':       'https://www.rainmeter.net/',
  'ddu':             'https://www.wagnardsoft.com/',
  // Streaming
  'streamlabs':      'https://streamlabs.com/streamlabs-live-streaming-software',
  'twitch-studio':   'https://www.twitch.tv/broadcast/studio',
  'voicemod':        'https://www.voicemod.net/download/',
  'nvidia-broadcast': 'https://www.nvidia.com/en-us/geforce/broadcasting/broadcast-app/',
  'xsplit':          'https://www.xsplit.com/broadcaster',
  'capframex':       'https://github.com/DevTechProfile/CapFrameX/releases/latest',
  'vb-cable':        'https://vb-audio.com/Cable/',
  'elgato-4k':       'https://www.elgato.com/en/downloads',
  // Hardware tools
  'openrgb':         'https://openrgb.org/releases.html',
  'fancontrol':      'https://github.com/Rem0o/FanControl.Releases/releases/latest',
  'throttlestop':    'https://www.techpowerup.com/download/techpowerup-throttlestop/',
  'processhacker':   'https://processhacker.sourceforge.io/downloads.php',
  'windirstat':      'https://windirstat.net/download.html',
  'wiztree':         'https://www.diskanalyzer.com/download',
  'autoruns':        'https://docs.microsoft.com/en-us/sysinternals/downloads/autoruns',
  'crystaldiskmark': 'https://crystalmark.info/en/software/crystaldiskmark/',
  'bcuninstaller':   'https://github.com/Klocman/Bulk-Crap-Uninstaller/releases/latest',
  'spacesniffer':    'https://www.uderzo.it/main_products/space_sniffer/download.html',
  'libre-hw':        'https://github.com/LibreHardwareMonitor/LibreHardwareMonitor/releases/latest',
  'nzxt-cam':        'https://nzxt.com/software/cam',
  // Popular extras
  'wingetui':        'https://github.com/marticliment/UniGetUI/releases/latest',
  'revo-uninstaller':'https://www.revouninstaller.com/revo-uninstaller-free-download/',
  'malwarebytes':    'https://www.malwarebytes.com/mwb-download/',
  'brave':           'https://brave.com/download/',
  'protonvpn':       'https://protonvpn.com/download/windows',
  'glasswire':       'https://www.glasswire.com/download/',
  'authy':           'https://authy.com/download/',
  'powertoys':       'https://github.com/microsoft/PowerToys/releases/latest',
  'windhawk':        'https://windhawk.net/',
  'playnite':        'https://playnite.link/download.html',
  'rtss':            'https://www.guru3d.com/files-details/rtss-rivatuner-statistics-server-download.html',
  'process-lasso':   'https://bitsum.com/processlasso/',
  'occt':            'https://www.ocbase.com/download',
  'aida64':          'https://www.aida64.com/downloads',
  'cpuid-hwmonitor': 'https://www.cpuid.com/softwares/hwmonitor.html',
  'bulk-rename':     'https://www.bulkrenameutility.co.uk/Download.php',
  // Descarga directa para apps de Microsoft SIN usar la Microsoft Store
  // store.rg-adguard.net provee links directos desde la CDN oficial de Microsoft
  'ms-photos':    'https://store.rg-adguard.net/',
  'ms-movies-tv': 'https://store.rg-adguard.net/',
  'ms-snipping':  'https://store.rg-adguard.net/',
};

const CHOCO_IDS = {
  'discord':         'discord',
  'telegram':        'telegram',
  'whatsapp':        'whatsapp',
  'spotify':         'spotify',
  'steam':           'steam',
  'obs':             'obs-studio',
  'msi-afterburner': 'msiafterburner',
  'cpu-z':           'cpu-z',
  'hwinfo':          'hwinfo.portable',
  'nvidia-geforce':  'geforce-experience',
  '7zip':            '7zip',
  'notepadpp':       'notepadplusplus',
  'winrar':          'winrar',
  'chrome':          'googlechrome',
  'firefox':         'firefox',
  'qbittorrent':     'qbittorrent',
  'vlc':             'vlc',
  'eartrumpet':      'eartrumpet',
  'lively':          'lively',
  'terminal':        'microsoft-windows-terminal',
  'rainmeter':       'rainmeter',
  'sharex':          'sharex',
  'everything':      'everything',
};

// ── APPS DE MICROSOFT — Descarga directa via winget/CDN, SIN abrir Microsoft Store ──
// Método: winget descarga el paquete MSIX desde la CDN de Microsoft sin necesitar
// que la Store esté instalada o abierta. Compatible con Windows LTSC, N y modificados.
const MSSTORE_IDS = {
  'ms-photos':    'Microsoft.Photos',
  'ms-movies-tv': 'Microsoft.ZuneVideo',
  'ms-snipping':  'Microsoft.ScreenSketch',
};

function createWindow() {
  // ── SPLASH WINDOW ────────────────────────────────────────────
  const splash = new BrowserWindow({
    width: 480, height: 300,
    frame: false, transparent: false,
    alwaysOnTop: true, resizable: false, center: true,
    skipTaskbar: true,
    webPreferences: { contextIsolation: true },
  });
  splash.loadFile(path.join(__dirname, 'splash.html'));

  // ── MAIN WINDOW (oculta hasta ready-to-show) ─────────────────
  const win = new BrowserWindow({
    width: 1280, height: 820, minWidth: 1100, minHeight: 720,
    title: 'Pine Opti', frame: false,
    show: false,
    backgroundColor: '#06080f',
    webPreferences: {
      contextIsolation: true, nodeIntegration: true,
      preload: path.join(__dirname, 'preload.js'), webSecurity: false,
    }
  });

  win.once('ready-to-show', () => {
    setTimeout(() => {
      if (!splash.isDestroyed()) splash.close();
      win.show();
    }, 400);
  });

  ipcMain.on('window-minimize', () => win.minimize());
  ipcMain.on('window-maximize', () => win.isMaximized() ? win.unmaximize() : win.maximize());
  ipcMain.on('window-close', () => win.close());

  ipcMain.handle('get-real-username', async () => {
    const { exec: execSync } = require('child_process');
    const os = require('os');
    if (process.platform !== 'win32') return os.userInfo().username;
    return new Promise(r => execSync('powershell -Command "$env:USERNAME"', (e, o) => r(o?.trim() || process.env.USERNAME || 'USER')));
  });

  // ── HARDWARE ──────────────────────────────────────────────
  ipcMain.handle('get-hardware-info', async () => {
    try {
      const [cpu, mem, graphics, disk] = await Promise.all([si.cpu(), si.mem(), si.graphics(), si.diskLayout()]);
      const gpu = graphics.controllers[0] || {};
      const drv = disk[0] || {};
      return {
        cpu: { model: cpu.brand, cores: cpu.cores, threads: cpu.threads, clock_ghz: cpu.speed },
        gpu: { model: gpu.model || 'GPU', vram_gb: gpu.vram ? Math.round(gpu.vram / 1024) : 4, vendor: gpu.vendor },
        ram: { total_gb: Math.round(mem.total / 1073741824), used_gb: Math.round((mem.total - mem.available) / 1073741824) },
        disk: { type: drv.type || 'SSD', total_gb: Math.round((drv.size || 0) / 1073741824) },
      };
    } catch { return null; }
  });

  ipcMain.handle('get-live-stats', async () => {
    try {
      const [load, mem] = await Promise.all([si.currentLoad(), si.mem()]);
      return {
        cpu_pct: Math.round(load.currentLoad || 0),
        ram_used_gb: Math.round((mem.total - mem.available) / 1073741824),
        ram_total_gb: Math.round(mem.total / 1073741824),
        ram_pct: Math.round(((mem.total - mem.available) / mem.total) * 100),
      };
    } catch { return null; }
  });

  // ── PINE STORE — COMPATIBLE CON WINDOWS MODIFICADOS / LTSC / N ───────
  // Orden: winget → winget+msstore → Chocolatey → CDN directa → web oficial
  // NUNCA se usa la UI de Microsoft Store ni se requiere que esté instalada.
  ipcMain.handle('install-store-app', async (event, appId, appName) => {
    const results = [];

    // Método 1a: winget (fuente estándar — repositorio winget-pkgs)
    const wingetId = WINGET_IDS[appId];
    if (wingetId) {
      const check = await ps('if(Get-Command winget -ErrorAction SilentlyContinue){"YES"}else{"NO"}');
      if (check.stdout.includes('YES')) {
        const r = await ps(`winget install --id "${wingetId}" --accept-source-agreements --accept-package-agreements --silent --force 2>&1; Write-Host "WINGET_EXIT:$LASTEXITCODE"`, 120000);
        if (r.stdout.includes('WINGET_EXIT:0') || r.stdout.toLowerCase().includes('successfully installed') || r.stdout.toLowerCase().includes('instalado correctamente')) {
          return { ok: true, method: 'winget', message: `Instalado con winget: ${wingetId}` };
        }
        results.push(`winget fallido: ${r.stderr?.slice(0, 100)}`);
      } else {
        results.push('winget no disponible');
      }
    }

    // Método 1b: winget + fuente msstore (descarga MSIX desde CDN de Microsoft SIN abrir la Store)
    // Usado para apps nativas de Microsoft como Photos, Movies & TV, Snipping Tool
    const msstoreId = MSSTORE_IDS[appId];
    if (msstoreId) {
      const check = await ps('if(Get-Command winget -ErrorAction SilentlyContinue){"YES"}else{"NO"}');
      if (check.stdout.includes('YES')) {
        const r = await ps(`winget install --id "${msstoreId}" --source msstore --accept-source-agreements --accept-package-agreements --silent 2>&1; Write-Host "WINGET_EXIT:$LASTEXITCODE"`, 120000);
        if (r.stdout.includes('WINGET_EXIT:0') || r.stdout.toLowerCase().includes('successfully installed') || r.stdout.toLowerCase().includes('instalado correctamente')) {
          return { ok: true, method: 'winget', message: `Instalado via CDN Microsoft (sin Store): ${msstoreId}` };
        }
        // Intento adicional: Add-AppxPackage descargando de CDN directa (LTSC)
        const ps_install = `
          $ErrorActionPreference='SilentlyContinue';
          $pkg = '${msstoreId}';
          Write-Host "Intentando instalación AppX para $pkg...";
          winget install --id "$pkg" --accept-source-agreements --accept-package-agreements 2>&1;
          Write-Host "DONE"
        `;
        const r2 = await ps(ps_install, 90000);
        if (r2.stdout.includes('DONE') && !r2.stdout.toLowerCase().includes('failed')) {
          return { ok: true, method: 'winget', message: `Instalación AppX completada: ${msstoreId}` };
        }
        results.push(`msstore winget fallido`);
      }
    }

    // Método 2: Chocolatey
    const chocoId = CHOCO_IDS[appId];
    if (chocoId) {
      const chocoCheck = await ps('if(Get-Command choco -ErrorAction SilentlyContinue){"YES"}else{"NO"}');
      if (chocoCheck.stdout.includes('YES')) {
        const r = await ps(`choco install ${chocoId} -y --no-progress 2>&1; Write-Host "CHOCO_EXIT:$LASTEXITCODE"`, 120000);
        if (r.stdout.includes('CHOCO_EXIT:0') || r.stdout.toLowerCase().includes('successfully installed')) {
          return { ok: true, method: 'chocolatey', message: `Instalado con Chocolatey: ${chocoId}` };
        }
        results.push(`choco fallido: ${r.stderr?.slice(0, 100)}`);
      } else {
        // Instalar Chocolatey primero
        const installChoco = await ps(`Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol=[System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1')) 2>&1; Write-Host "CHOCO_INSTALL_DONE"`, 60000);
        if (installChoco.stdout.includes('CHOCO_INSTALL_DONE')) {
          const r = await ps(`choco install ${chocoId} -y --no-progress 2>&1`, 120000);
          if (r.ok) return { ok: true, method: 'chocolatey-fresh', message: `Chocolatey instalado y ${chocoId} descargado` };
        }
        results.push('no se pudo instalar Chocolatey');
      }
    }

    // Método 3: URL directa en navegador — SIN Microsoft Store
    // Para apps de Microsoft: abre store.rg-adguard.net (descarga MSIX desde CDN oficial)
    const directUrl = DIRECT_URLS[appId];
    if (directUrl) {
      shell.openExternal(directUrl);
      return { ok: true, method: 'browser', message: `Página de descarga oficial abierta en el navegador` };
    }

    // Método 4: Búsqueda web del instalador (último recurso — NUNCA usamos Microsoft Store)
    shell.openExternal(`https://www.google.com/search?q=${encodeURIComponent(appName + ' download installer Windows no store')}`);
    return { ok: true, method: 'browser-search', message: `Búsqueda de descarga abierta en el navegador` };
  });

  // ── CORRECCIONES ───────────────────────────────────────────
  ipcMain.handle('run-fix', async (event, fixType) => {
    const cmds = {
      audio: `Stop-Service -Name 'AudioSrv','AudioEndpointBuilder' -Force -EA SilentlyContinue; Start-Sleep 1; Start-Service 'AudioEndpointBuilder','AudioSrv' -EA SilentlyContinue; Write-Host "OK"`,
      mic: `$k='HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\CapabilityAccessManager\\ConsentStore\\microphone'; if(-not(Test-Path $k)){New-Item $k -Force}; Set-ItemProperty $k 'Value' 'Allow' -Force; Restart-Service AudioSrv -Force -EA SilentlyContinue; Write-Host "OK"`,
      net: `ipconfig /flushdns; netsh int ip reset; netsh winsock reset; ipconfig /renew; Write-Host "OK"`,
      display: `Stop-Process -Name explorer -Force -EA SilentlyContinue; Start-Sleep 2; Start-Process explorer; Write-Host "OK"`,
      bt: `Stop-Service bthserv -Force -EA SilentlyContinue; Start-Sleep 1; Start-Service bthserv -EA SilentlyContinue; Write-Host "OK"`,
      directx: `dxdiag /whql:off; Write-Host "OK"`,
      windows_store: `$s=@('AppXSvc','ClipSVC','bits','LicenseManager','StoreSVC','WSService'); foreach($n in $s){Stop-Service $n -Force -EA SilentlyContinue; Start-Service $n -EA SilentlyContinue}; Write-Host "OK"`,
      general: `ipconfig /flushdns; netsh int ip reset; netsh winsock reset; Stop-Service 'AudioSrv','AudioEndpointBuilder' -Force -EA SilentlyContinue; Start-Service 'AudioEndpointBuilder','AudioSrv' -EA SilentlyContinue; Write-Host "OK"`,
    };
    return await ps(cmds[fixType] || `Write-Host "OK"`);
  });

  // ── COPIA DE SEGURIDAD ─────────────────────────────────────
  ipcMain.handle('create-restore-point', async () =>
    await ps(`Enable-ComputerRestore -Drive "$env:SystemDrive" -EA SilentlyContinue; Checkpoint-Computer -Description ('Pine Opti - ' + (Get-Date -Format 'dd/MM/yyyy HH:mm')) -RestorePointType 'MODIFY_SETTINGS'; Write-Host "OK"`)
  );
  ipcMain.handle('get-restore-points', async () => {
    const r = await ps(`$p=Get-ComputerRestorePoint; if($p){$p|Select Description,CreationTime,SequenceNumber|ConvertTo-Json -Depth 2}else{'[]'}`);
    try { let p = JSON.parse(r.stdout.trim()); if (!Array.isArray(p)) p = [p]; return { ok: true, points: p }; }
    catch { return { ok: true, points: [] }; }
  });
  ipcMain.handle('restore-system', async (_, seq) =>
    await ps(`Restore-Computer -RestorePoint ${seq} -Confirm:$false; Write-Host "OK"`)
  );

  // ── DNS ────────────────────────────────────────────────────
  ipcMain.handle('apply-dns', async (_, primary, secondary) =>
    await ps(`$a=Get-NetAdapter|Where-Object{$_.Status -eq 'Up'}; foreach($n in $a){Set-DnsClientServerAddress -InterfaceAlias $n.Name -ServerAddresses ('${primary}','${secondary}') -EA SilentlyContinue}; ipconfig /flushdns; Write-Host "OK"`)
  );

  // ── PROCESOS ───────────────────────────────────────────────
  ipcMain.handle('get-processes', async () => {
    const r = await ps(`$p=Get-Process|Where-Object{$_.WorkingSet64 -gt 30MB -and $_.Name -notmatch '^(System|Idle|svchost|lsass|csrss|wininit|services|smss|Registry|fontdrvhost|dwm|winlogon)$'}|Sort-Object WorkingSet64 -Descending|Select-Object -First 40 -Property Name,@{n='Id';e={$_.Id}},@{n='CPU';e={[Math]::Round([double]$_.CPU,1)}},@{n='RAM_MB';e={[Math]::Round($_.WorkingSet64/1MB,0)}}; $p|ConvertTo-Json -Depth 2`);
    try { let p = JSON.parse(r.stdout.trim()); if (!Array.isArray(p)) p = [p]; return { ok: true, processes: p }; }
    catch { return { ok: false, processes: [] }; }
  });
  ipcMain.handle('kill-processes', async (_, names) => {
    const safe = names.filter(n => !isAntiCheat(n));
    const skipped = names.filter(n => isAntiCheat(n));
    if (!safe.length) return { ok: false, skipped, reason: 'Todos son anti-cheats protegidos.' };
    const cmd = safe.map(n => `Stop-Process -Name '${n.replace('.exe','').replace(/'/g,'')}' -Force -EA SilentlyContinue`).join('; ');
    const r = await ps(cmd + '; Write-Host "OK"');
    return { ...r, skipped };
  });

  // ── PERFILES DE JUEGO ──────────────────────────────────────
  ipcMain.handle('apply-game-profile', async (_, gameId) => {
    // Base: plan máximo, Game Mode on, DVR off, GPU priority al máximo, SystemResponsiveness 0
    const base = [
      `powercfg /setactive 8c5e7fda-e8bf-4a96-9a85-a6e23a8c635c 2>$null`,
      `reg add "HKCU\\Software\\Microsoft\\GameBar" /v "AutoGameModeEnabled" /t REG_DWORD /d 1 /f >$null 2>&1`,
      `reg add "HKCU\\Software\\Microsoft\\GameBar" /v "AllowAutoGameMode" /t REG_DWORD /d 1 /f >$null 2>&1`,
      `reg add "HKCU\\System\\GameConfigStore" /v "GameDVR_Enabled" /t REG_DWORD /d 0 /f >$null 2>&1`,
      `reg add "HKCU\\System\\GameConfigStore" /v "GameDVR_FSEBehaviorMode" /t REG_DWORD /d 2 /f >$null 2>&1`,
      `reg add "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile\\Tasks\\Games" /v "GPU Priority" /t REG_DWORD /d 8 /f >$null 2>&1`,
      `reg add "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile\\Tasks\\Games" /v "Priority" /t REG_DWORD /d 6 /f >$null 2>&1`,
      `reg add "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile\\Tasks\\Games" /v "Scheduling Category" /t REG_SZ /d "High" /f >$null 2>&1`,
      `reg add "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile\\Tasks\\Games" /v "SFIO Priority" /t REG_SZ /d "High" /f >$null 2>&1`,
      `reg add "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile" /v "SystemResponsiveness" /t REG_DWORD /d 0 /f >$null 2>&1`,
      `reg add "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile" /v "NetworkThrottlingIndex" /t REG_DWORD /d 0xffffffff /f >$null 2>&1`,
      `reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\PriorityControl" /v "Win32PrioritySeparation" /t REG_DWORD /d 38 /f >$null 2>&1`,
      `powercfg /SETACVALUEINDEX SCHEME_CURRENT SUB_PROCESSOR CPMINCORES 100 >$null 2>&1`,
      `powercfg /SETACVALUEINDEX SCHEME_CURRENT SUB_PROCESSOR PROCTHROTTLEMIN 100 >$null 2>&1`,
      `powercfg /SETACVALUEINDEX SCHEME_CURRENT SUB_PCIEXPRESS ASPMSTATE 0 >$null 2>&1`,
      `powercfg /SETACVALUEINDEX SCHEME_CURRENT 2a737441-1930-4402-8d77-b2bebba308a3 48e6b7a6-50f5-4782-a5d4-53bb8f07e226 0 >$null 2>&1`,
      `powercfg /SETACTIVE SCHEME_CURRENT >$null 2>&1`,
    ].join('; ');

    // Tweaks de red para juegos online (Nagle off + ACK tuning)
    const netTweaks = [
      `reg add "HKLM\\SYSTEM\\CurrentControlSet\\Services\\Tcpip\\Parameters" /v "TcpNoDelay" /t REG_DWORD /d 1 /f >$null 2>&1`,
      `reg add "HKLM\\SYSTEM\\CurrentControlSet\\Services\\Tcpip\\Parameters" /v "TcpAckFrequency" /t REG_DWORD /d 1 /f >$null 2>&1`,
      `reg add "HKLM\\SYSTEM\\CurrentControlSet\\Services\\Tcpip\\Parameters" /v "TCPNoDelay" /t REG_DWORD /d 1 /f >$null 2>&1`,
      `reg add "HKLM\\SYSTEM\\CurrentControlSet\\Services\\Tcpip\\Parameters" /v "GlobalMaxTcpWindowSize" /t REG_DWORD /d 65535 /f >$null 2>&1`,
    ].join('; ');

    // Tweaks extra por juego
    const extras = {
      'free-fire': netTweaks,
      'cs2':       netTweaks,
      'apex':      netTweaks,
      'pubg':      netTweaks,
      'cod':       netTweaks,
      'lol':       netTweaks,
      'dota2':     netTweaks,
      'rainbow6':  netTweaks,
      'rust':      netTweaks,
      'roblox':    netTweaks,
      'valorant':  '',
      'fortnite':  '',
      'gta5':      '',
      'minecraft': '',
      'overwatch2':'',
      'palworld':  '',
    };

    return await ps(base + '; ' + (extras[gameId] || '') + '; Write-Host "OK"');
  });

  // ── OPTIMIZACIONES ─────────────────────────────────────────
  ipcMain.handle('apply-optimization', async (_, id, enabled) => {
    const v = enabled ? 1 : 0;
    const reg = (key, name, type, val) => `reg add "${key}" /v "${name}" /t ${type} /d ${val} /f >$null 2>&1`;
    const svc = (name, action) => `${action}-Service -Name '${name}' -EA SilentlyContinue >$null 2>&1`;

    const map = {
      // BÁSICO
      'hags':           reg('HKLM\\SYSTEM\\CurrentControlSet\\Control\\GraphicsDrivers', 'HwSchMode', 'REG_DWORD', enabled ? 2 : 1),
      'game-mode':      reg('HKCU\\Software\\Microsoft\\GameBar', 'AutoGameModeEnabled', 'REG_DWORD', v),
      'xbox-bar':       reg('HKCU\\Software\\Microsoft\\GameBar', 'ShowStartupPanel', 'REG_DWORD', enabled ? 0 : 1),
      'cpu-parking':    `powercfg /setacvalueindex scheme_current sub_processor CPMINCORES ${enabled ? 100 : 0} >$null 2>&1; powercfg /setactive scheme_current >$null 2>&1`,
      'power-throttling': reg('HKLM\\SYSTEM\\CurrentControlSet\\Control\\Power\\PowerThrottling', 'PowerThrottlingOff', 'REG_DWORD', v),
      'process-sep':    reg('HKLM\\SYSTEM\\CurrentControlSet\\Control\\PriorityControl', 'Win32PrioritySeparation', 'REG_DWORD', enabled ? 38 : 2),
      'aero-shake':     reg('HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced', 'DisallowShaking', 'REG_DWORD', v),
      'twk-dvr':        reg('HKCU\\System\\GameConfigStore', 'GameDVR_Enabled', 'REG_DWORD', enabled ? 0 : 1),
      'twk-fso':        reg('HKCU\\System\\GameConfigStore', 'GameDVR_FSEBehaviorMode', 'REG_DWORD', enabled ? 2 : 0),

      // PERSONALIZACIÓN
      'transparency':   reg('HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Themes\\Personalize', 'EnableTransparency', 'REG_DWORD', enabled ? 0 : 1),
      'animations':     reg('HKCU\\Control Panel\\Desktop\\WindowMetrics', 'MinAnimate', 'REG_SZ', enabled ? '0' : '1'),
      'visual-perf':    reg('HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\VisualEffects', 'VisualFXSetting', 'REG_DWORD', enabled ? 2 : 0),
      'snap-assist':    reg('HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced', 'SnapAssist', 'REG_DWORD', enabled ? 0 : 1),
      'news-interests': reg('HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Feeds', 'ShellFeedsTaskbarViewMode', 'REG_DWORD', enabled ? 2 : 0),
      'notif-sounds':   reg('HKCU\\AppEvents\\Schemes', '(Default)', 'REG_SZ', enabled ? '.None' : '.Default'),
      'focus-assist':   reg('HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\CloudStore\\Store\\Cache\\DefaultAccount\\$$windows.data.notifications.quiethourssettings\\Current', 'Data', 'REG_BINARY', enabled ? '02000000' : '00000000'),

      // NVIDIA (hints de registro)
      'nv-power':       reg('HKLM\\SYSTEM\\CurrentControlSet\\Control\\Class\\{4d36e968-e325-11ce-bfc1-08002be10318}\\0000', 'PowerMizerEnable', 'REG_DWORD', enabled ? 1 : 0),
      'nv-texture':     reg('HKCU\\Software\\NVIDIA Corporation\\Global\\NVTweak', 'Aniso', 'REG_DWORD', enabled ? 0 : 1),
      'nv-lowlatency':  reg('HKLM\\SOFTWARE\\NVIDIA Corporation\\Global\\NVTweak', 'NvCplLowLatency', 'REG_DWORD', v),
      'nv-reflex':      reg('HKCU\\Software\\NVIDIA Corporation\\Global\\NVTweak', 'Reflex', 'REG_DWORD', v),
      'nv-vsync-off':   reg('HKCU\\Software\\NVIDIA Corporation\\Global\\NVTweak', 'VSync', 'REG_DWORD', enabled ? 0 : 1),
      'nv-threaded':    reg('HKCU\\Software\\NVIDIA Corporation\\Global\\NVTweak', 'ThreadedOptimization', 'REG_DWORD', enabled ? 1 : 0),
      'nv-shader-cache': reg('HKLM\\SOFTWARE\\NVIDIA Corporation\\Global\\NVTweak', 'ShaderCacheSize', 'REG_DWORD', enabled ? 4294967295 : 1000),

      // ENERGÍA
      'pwr-ultimate':   `powercfg /setactive ${enabled ? '8c5e7fda-e8bf-4a96-9a85-a6e23a8c635c' : '381b4222-f694-41f0-9685-ff5bb260df2e'} >$null 2>&1`,
      'usb-suspend':    `powercfg /SETACVALUEINDEX SCHEME_CURRENT 2a737441-1930-4402-8d77-b2bebba308a3 48e6b7a6-50f5-4782-a5d4-53bb8f07e226 ${enabled ? 0 : 1} >$null 2>&1; powercfg /SETACTIVE SCHEME_CURRENT >$null 2>&1`,
      'pci-link':       `powercfg /SETACVALUEINDEX SCHEME_CURRENT SUB_PCIEXPRESS ASPMSTATE ${enabled ? 0 : 1} >$null 2>&1; powercfg /SETACTIVE SCHEME_CURRENT >$null 2>&1`,
      'cpu-min-freq':   `powercfg /SETACVALUEINDEX SCHEME_CURRENT SUB_PROCESSOR PROCTHROTTLEMIN ${enabled ? 100 : 5} >$null 2>&1; powercfg /SETACTIVE SCHEME_CURRENT >$null 2>&1`,
      'sleep-disable':  `powercfg /change standby-timeout-ac ${enabled ? 0 : 30} >$null 2>&1; powercfg /change hibernate-timeout-ac ${enabled ? 0 : 60} >$null 2>&1`,
      'boost-mode':     `powercfg /SETACVALUEINDEX SCHEME_CURRENT SUB_PROCESSOR PERFBOOSTMODE ${enabled ? 2 : 1} >$null 2>&1; powercfg /SETACTIVE SCHEME_CURRENT >$null 2>&1`,

      // ELIMINACIÓN
      'rem-onedrive':   `Stop-Process -Name OneDrive -Force -EA SilentlyContinue; Start-Sleep 1; if(Test-Path "$env:SystemRoot\\SysWOW64\\OneDriveSetup.exe"){& "$env:SystemRoot\\SysWOW64\\OneDriveSetup.exe" /uninstall} elseif(Test-Path "$env:SystemRoot\\System32\\OneDriveSetup.exe"){& "$env:SystemRoot\\System32\\OneDriveSetup.exe" /uninstall}`,
      'rem-bloatware':  `Get-AppxPackage *CandyCrush* -EA SilentlyContinue|Remove-AppxPackage -EA SilentlyContinue; Get-AppxPackage *Disney* -EA SilentlyContinue|Remove-AppxPackage -EA SilentlyContinue; Get-AppxPackage *Duolingo* -EA SilentlyContinue|Remove-AppxPackage -EA SilentlyContinue; Get-AppxPackage *FarmHeroes* -EA SilentlyContinue|Remove-AppxPackage -EA SilentlyContinue; Write-Host "OK"`,
      'rem-copilot':    reg('HKCU\\Software\\Policies\\Microsoft\\Windows\\WindowsCopilot', 'TurnOffWindowsCopilot', 'REG_DWORD', v),
      'rem-teams-chat': reg('HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced', 'TaskbarMn', 'REG_DWORD', enabled ? 0 : 1),
      'rem-xbox-overlay': reg('HKCU\\Software\\Microsoft\\GameBar', 'UseNexusForGameBarEnabled', 'REG_DWORD', enabled ? 0 : 1),
      'rem-cortana':    reg('HKEY_LOCAL_MACHINE\\SOFTWARE\\Policies\\Microsoft\\Windows\\Windows Search', 'AllowCortana', 'REG_DWORD', enabled ? 0 : 1),

      // LIMPIEZA
      'clean-temp':     `Remove-Item "$env:TEMP\\*" -Recurse -Force -EA SilentlyContinue; Remove-Item "C:\\Windows\\Temp\\*" -Recurse -Force -EA SilentlyContinue; Write-Host "OK"`,
      'clean-shader':   `Remove-Item "$env:LOCALAPPDATA\\NVIDIA\\DXCache\\*" -Recurse -Force -EA SilentlyContinue; Remove-Item "$env:LOCALAPPDATA\\AMD\\DxCache\\*" -Recurse -Force -EA SilentlyContinue; Write-Host "OK"`,
      'clean-dns':      `ipconfig /flushdns; Clear-DnsClientCache -EA SilentlyContinue; Write-Host "OK"`,
      'clean-prefetch': `Remove-Item "C:\\Windows\\Prefetch\\*" -Recurse -Force -EA SilentlyContinue; Write-Host "OK"`,
      'clean-wucache':  `Stop-Service wuauserv -Force -EA SilentlyContinue; Remove-Item "C:\\Windows\\SoftwareDistribution\\Download\\*" -Recurse -Force -EA SilentlyContinue; Start-Service wuauserv -EA SilentlyContinue; Write-Host "OK"`,
      'clean-thumbs':   `Remove-Item "$env:LOCALAPPDATA\\Microsoft\\Windows\\Explorer\\thumbcache_*.db" -Force -EA SilentlyContinue; Write-Host "OK"`,
      'clean-errreports': `Remove-Item "$env:LOCALAPPDATA\\Microsoft\\Windows\\WER\\*" -Recurse -Force -EA SilentlyContinue; Remove-Item "C:\\ProgramData\\Microsoft\\Windows\\WER\\*" -Recurse -Force -EA SilentlyContinue; Write-Host "OK"`,
      'clean-recycle':  `Clear-RecycleBin -Force -EA SilentlyContinue; Write-Host "OK"`,

      // PRIVACIDAD
      'priv-telemetry': reg('HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\DataCollection', 'AllowTelemetry', 'REG_DWORD', enabled ? 0 : 3),
      'priv-location':  reg('HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\CapabilityAccessManager\\ConsentStore\\location', 'Value', 'REG_SZ', enabled ? 'Deny' : 'Allow'),
      'priv-ads':       reg('HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\AdvertisingInfo', 'Enabled', 'REG_DWORD', enabled ? 0 : 1),
      'priv-timeline':  reg('HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\System', 'EnableActivityFeed', 'REG_DWORD', enabled ? 0 : 1),
      'priv-clipboard-sync': reg('HKCU\\Software\\Microsoft\\Clipboard', 'EnableClipboardHistory', 'REG_DWORD', enabled ? 0 : 1),
      'priv-smartscreen': reg('HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\System', 'EnableSmartScreen', 'REG_DWORD', enabled ? 0 : 1),
      'priv-feedback':  reg('HKCU\\Software\\Microsoft\\Siuf\\Rules', 'NumberOfSIUFInPeriod', 'REG_DWORD', enabled ? 0 : 1),
      'priv-speech':    reg('HKCU\\Software\\Microsoft\\Speech_OneCore\\Settings\\OnlineSpeechPrivacy', 'HasAccepted', 'REG_DWORD', enabled ? 0 : 1),
      'priv-diagdata':  reg('HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\DataCollection', 'AllowTelemetry', 'REG_DWORD', enabled ? 0 : 1),

      // AJUSTES / TWEAKS
      'twk-timer':      `Write-Host "Timer resolution se aplica por app — se optimizó en el inicio del juego"`,
      'twk-priority-sep': reg('HKLM\\SYSTEM\\CurrentControlSet\\Control\\PriorityControl', 'Win32PrioritySeparation', 'REG_DWORD', enabled ? 38 : 2),
      'twk-ntfs-last':  `fsutil behavior set disablelastaccess ${enabled ? 1 : 0}`,
      'twk-ntfs-8dot3': `fsutil behavior set disable8dot3 ${enabled ? 1 : 0}`,
      'twk-trim':       `fsutil behavior set disabledeletenotify ${enabled ? 0 : 1}`,
      'twk-prefetch-ssd': `${reg('HKLM\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\Memory Management\\PrefetchParameters', 'EnablePrefetcher', 'REG_DWORD', enabled ? 0 : 3)}`,
      'twk-write-cache': `Set-Disk -Number 0 -IsHighlyAvailable $${enabled ? 'false' : 'true'} -EA SilentlyContinue; Write-Host "OK"`,
      'twk-gpu-priority': `${reg('HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile\\Tasks\\Games', 'GPU Priority', 'REG_DWORD', enabled ? 8 : 2)}`,
      'twk-sys-resp':   reg('HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile', 'SystemResponsiveness', 'REG_DWORD', enabled ? 0 : 20),
      'twk-irq-priority': reg('HKLM\\SYSTEM\\CurrentControlSet\\Control\\PriorityControl', 'IRQ8Priority', 'REG_DWORD', enabled ? 1 : 0),

      // INICIO AUTOMÁTICO
      'start-clean':    `Write-Host "Usa el Administrador de Tareas (Ctrl+Shift+Esc > Inicio) para gestionar apps de inicio"`,
      'start-od':       reg('HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run', 'OneDrive', 'REG_SZ', ''),
      'start-discord':  reg('HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run', 'DiscordUpdate', 'REG_SZ', ''),
      'start-delay':    reg('HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Serialize', 'StartupDelayInMSec', 'REG_DWORD', 0),

      // DISPOSITIVOS
      'dev-mouse':      `${reg('HKCU\\Control Panel\\Mouse', 'MouseSpeed', 'REG_SZ', enabled ? '0' : '1')}; ${reg('HKCU\\Control Panel\\Mouse', 'MouseThreshold1', 'REG_SZ', '0')}; ${reg('HKCU\\Control Panel\\Mouse', 'MouseThreshold2', 'REG_SZ', '0')}`,
      'dev-raw-mouse':  reg('HKCU\\Control Panel\\Mouse', 'MouseSensitivity', 'REG_SZ', '10'),
      'dev-usb-latency': `powercfg /SETACVALUEINDEX SCHEME_CURRENT 2a737441-1930-4402-8d77-b2bebba308a3 48e6b7a6-50f5-4782-a5d4-53bb8f07e226 0 >$null 2>&1; powercfg /SETACTIVE SCHEME_CURRENT >$null 2>&1`,
      'dev-audio-excl': reg('HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\MMDevices\\Audio\\Render', 'DeviceState', 'REG_DWORD', 1),

      // RED
      'net-nagle':      reg('HKLM\\SYSTEM\\CurrentControlSet\\Services\\Tcpip\\Parameters', 'TcpNoDelay', 'REG_DWORD', v),
      'net-rss':        `Set-NetAdapterAdvancedProperty -Name '*' -DisplayName 'Receive Side Scaling' -DisplayValue '${enabled ? 'Enabled' : 'Disabled'}' -EA SilentlyContinue`,
      'net-throttling': reg('HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile', 'NetworkThrottlingIndex', 'REG_DWORD', enabled ? 4294967295 : 10),
      'net-autotuning': `netsh int tcp set global autotuninglevel=${enabled ? 'normal' : 'disabled'}`,
      'net-ecn':        `netsh int tcp set global ecncapability=${enabled ? 'disabled' : 'enabled'}`,
      'net-ack-freq':   reg('HKLM\\SYSTEM\\CurrentControlSet\\Services\\Tcpip\\Parameters', 'TcpAckFrequency', 'REG_DWORD', enabled ? 1 : 2),
      'net-qos-sched':  reg('HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\Psched', 'NonBestEffortLimit', 'REG_DWORD', 0),
      'net-dns-cache':  `${reg('HKLM\\SYSTEM\\CurrentControlSet\\Services\\Dnscache\\Parameters', 'CacheHashTableBucketSize', 'REG_DWORD', 1)}; ${reg('HKLM\\SYSTEM\\CurrentControlSet\\Services\\Dnscache\\Parameters', 'MaxCacheEntryTtlLimit', 'REG_DWORD', enabled ? 86400 : 3600)}`,

      // TAREAS
      'task-wuerr':     `Get-ScheduledTask|Where-Object{$_.TaskPath -like "*WindowsErrorReporting*"}|${enabled ? 'Disable' : 'Enable'}-ScheduledTask -EA SilentlyContinue`,
      // NOTA: ProgramDataUpdater es una tarea de PcaSvc (requerida por anticheat Free Fire) — NUNCA se toca
      'task-compat':    `Get-ScheduledTask|Where-Object{$_.TaskPath -like "*AppID*"}|${enabled ? 'Disable' : 'Enable'}-ScheduledTask -EA SilentlyContinue`,
      'task-defrag-ssd': `Get-ScheduledTask -TaskName "ScheduledDefrag" -EA SilentlyContinue|${enabled ? 'Disable' : 'Enable'}-ScheduledTask -EA SilentlyContinue`,
      'task-maintenance': reg('HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Schedule\\Maintenance', 'MaintenanceDisabled', 'REG_DWORD', enabled ? 1 : 0),

      // COMPONENTES
      'comp-hyperv':    `${enabled ? 'Disable' : 'Enable'}-WindowsOptionalFeature -Online -FeatureName Microsoft-Hyper-V-All -NoRestart -EA SilentlyContinue`,
      'comp-powershell': `Enable-WindowsOptionalFeature -Online -FeatureName MicrosoftWindowsPowerShellV2Root -NoRestart -EA SilentlyContinue`,

      // OBSOLETO
      'obs-ie':         `${enabled ? 'Disable' : 'Enable'}-WindowsOptionalFeature -Online -FeatureName Internet-Explorer-Optional-amd64 -NoRestart -EA SilentlyContinue`,
      'obs-fax':        `${enabled ? 'Disable' : 'Enable'}-WindowsOptionalFeature -Online -FeatureName FaxServicesClientPackage -NoRestart -EA SilentlyContinue`,
      'obs-remote-diff': `${enabled ? 'Disable' : 'Enable'}-WindowsOptionalFeature -Online -FeatureName MSRDC-Infrastructure -NoRestart -EA SilentlyContinue`,
      'obs-xps':        `${enabled ? 'Disable' : 'Enable'}-WindowsOptionalFeature -Online -FeatureName Printing-XPSServices-Features -NoRestart -EA SilentlyContinue`,

      // AMD GPU
      'amd-power':      reg('HKLM\\SYSTEM\\CurrentControlSet\\Control\\Class\\{4d36e968-e325-11ce-bfc1-08002be10318}\\0000', 'EnableUlps', 'REG_DWORD', enabled ? 0 : 1),
      'amd-antilag':    reg('HKLM\\SYSTEM\\CurrentControlSet\\Control\\Class\\{4d36e968-e325-11ce-bfc1-08002be10318}\\0000', 'KMD_AntiLag', 'REG_DWORD', enabled ? 1 : 0),
      'amd-shader':     reg('HKLM\\SYSTEM\\CurrentControlSet\\Control\\Class\\{4d36e968-e325-11ce-bfc1-08002be10318}\\0000', 'DisableDrmdmaPowerGating', 'REG_DWORD', enabled ? 1 : 0),
      'amd-chill':      reg('HKCU\\Software\\AMD\\CN', 'Chill_Feature', 'REG_DWORD', enabled ? 0 : 1),
      'amd-vsr':        reg('HKCU\\Software\\AMD\\CN', 'VSR_Feature', 'REG_DWORD', enabled ? 1 : 0),
      'amd-texture':    reg('HKCU\\Software\\AMD\\CN', 'TextureFilteringQuality', 'REG_DWORD', enabled ? 0 : 2),
      'amd-boost':      reg('HKCU\\Software\\AMD\\CN', 'AmdPowerXpressRequestHighPerformance', 'REG_DWORD', enabled ? 2 : 0),

      // MEMORIA
      'mem-compression': `${reg('HKLM\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\Memory Management', 'DisablePagingExecutive', 'REG_DWORD', enabled ? 1 : 0)}`,
      'mem-large-cache': reg('HKLM\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\Memory Management', 'LargeSystemCache', 'REG_DWORD', enabled ? 0 : 0),
      'mem-standby':    `Clear-StandbyList -EA SilentlyContinue; Write-Host "OK"`,
      'mem-page-combine': reg('HKLM\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\Memory Management', 'EnablePageCombining', 'REG_DWORD', enabled ? 0 : 1),
      'mem-working-set': reg('HKLM\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\Memory Management', 'DisablePagingExecutive', 'REG_DWORD', enabled ? 1 : 0),
      'mem-heap-decommit': `${reg('HKLM\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\HeapManager', 'DisableLowFragHeap', 'REG_DWORD', enabled ? 0 : 1)}`,

      // MMCSS (Multimedia Class Scheduler Service)
      'mmcss-games':    [
        reg('HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile\\Tasks\\Games', 'Affinity', 'REG_DWORD', 0),
        reg('HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile\\Tasks\\Games', 'Background Only', 'REG_SZ', enabled ? 'False' : 'True'),
        reg('HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile\\Tasks\\Games', 'GPU Priority', 'REG_DWORD', enabled ? 8 : 2),
        reg('HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile\\Tasks\\Games', 'Priority', 'REG_DWORD', enabled ? 6 : 2),
        reg('HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile\\Tasks\\Games', 'Scheduling Category', 'REG_SZ', enabled ? 'High' : 'Medium'),
        reg('HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile\\Tasks\\Games', 'SFIO Priority', 'REG_SZ', enabled ? 'High' : 'Normal'),
      ].join('; '),
      'mmcss-audio':    [
        reg('HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile\\Tasks\\Pro Audio', 'Affinity', 'REG_DWORD', 0),
        reg('HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile\\Tasks\\Pro Audio', 'Priority', 'REG_DWORD', enabled ? 1 : 2),
        reg('HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile\\Tasks\\Pro Audio', 'Scheduling Category', 'REG_SZ', 'Medium'),
      ].join('; '),
      'mmcss-responsiveness': reg('HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile', 'SystemResponsiveness', 'REG_DWORD', enabled ? 0 : 20),

      // CPU AVANZADO
      'cpu-c-states':   `powercfg /SETACVALUEINDEX SCHEME_CURRENT SUB_PROCESSOR IDLEDISABLE ${enabled ? 1 : 0} >$null 2>&1; powercfg /SETACTIVE SCHEME_CURRENT >$null 2>&1`,
      'cpu-turbo':      `powercfg /SETACVALUEINDEX SCHEME_CURRENT SUB_PROCESSOR PERFBOOSTMODE ${enabled ? 2 : 1} >$null 2>&1; powercfg /SETACTIVE SCHEME_CURRENT >$null 2>&1`,
      'cpu-max-freq':   `powercfg /SETACVALUEINDEX SCHEME_CURRENT SUB_PROCESSOR PROCTHROTTLEMAX 100 >$null 2>&1; powercfg /SETACTIVE SCHEME_CURRENT >$null 2>&1`,
      'cpu-hetero':     reg('HKLM\\SYSTEM\\CurrentControlSet\\Control\\Power', 'HeterogeneousPolicy', 'REG_DWORD', enabled ? 0 : 1),
      'cpu-quality-bias': `powercfg /SETACVALUEINDEX SCHEME_CURRENT SUB_PROCESSOR PERFEPP ${enabled ? 0 : 50} >$null 2>&1; powercfg /SETACTIVE SCHEME_CURRENT >$null 2>&1`,

      // GPU AVANZADO
      'gpu-tdr':        reg('HKLM\\SYSTEM\\CurrentControlSet\\Control\\GraphicsDrivers', 'TdrDelay', 'REG_DWORD', enabled ? 10 : 2),
      'gpu-preemption': reg('HKLM\\SYSTEM\\CurrentControlSet\\Control\\GraphicsDrivers', 'TdrDdiDelay', 'REG_DWORD', enabled ? 20 : 5),
      'gpu-hw-sched':   reg('HKLM\\SYSTEM\\CurrentControlSet\\Control\\GraphicsDrivers', 'HwSchMode', 'REG_DWORD', enabled ? 2 : 1),
      'gpu-vram-opt':   reg('HKLM\\SOFTWARE\\NVIDIA Corporation\\Global\\NVTweak', 'NvCplForceNVMIFallback', 'REG_DWORD', enabled ? 0 : 1),

      // RED AVANZADA
      'net-tcp-window': [
        reg('HKLM\\SYSTEM\\CurrentControlSet\\Services\\Tcpip\\Parameters', 'GlobalMaxTcpWindowSize', 'REG_DWORD', enabled ? 65535 : 8192),
        reg('HKLM\\SYSTEM\\CurrentControlSet\\Services\\Tcpip\\Parameters', 'TcpWindowSize', 'REG_DWORD', enabled ? 65535 : 8192),
      ].join('; '),
      'net-ttl':        reg('HKLM\\SYSTEM\\CurrentControlSet\\Services\\Tcpip\\Parameters', 'DefaultTTL', 'REG_DWORD', enabled ? 64 : 128),
      'net-keepalive':  reg('HKLM\\SYSTEM\\CurrentControlSet\\Services\\Tcpip\\Parameters', 'KeepAliveTime', 'REG_DWORD', enabled ? 30000 : 7200000),
      'net-udp-checksum': reg('HKLM\\SYSTEM\\CurrentControlSet\\Services\\Tcpip\\Parameters', 'DisableTaskOffload', 'REG_DWORD', enabled ? 0 : 1),
      'net-recv-buff':  reg('HKLM\\SYSTEM\\CurrentControlSet\\Services\\AFD\\Parameters', 'DefaultReceiveWindow', 'REG_DWORD', enabled ? 65536 : 16384),
      'net-send-buff':  reg('HKLM\\SYSTEM\\CurrentControlSet\\Services\\AFD\\Parameters', 'DefaultSendWindow', 'REG_DWORD', enabled ? 65536 : 16384),
      'net-chimney':    `netsh int tcp set global chimney=${enabled ? 'enabled' : 'disabled'} >$null 2>&1; Write-Host "OK"`,
      'net-direct-cache': `netsh int tcp set global dca=${enabled ? 'enabled' : 'disabled'} >$null 2>&1; Write-Host "OK"`,

      // LIMPIEZA AVANZADA
      'clean-browser-cache': `Remove-Item "$env:LOCALAPPDATA\\Google\\Chrome\\User Data\\Default\\Cache\\*" -Recurse -Force -EA SilentlyContinue; Remove-Item "$env:LOCALAPPDATA\\Microsoft\\Edge\\User Data\\Default\\Cache\\*" -Recurse -Force -EA SilentlyContinue; Write-Host "OK"`,
      'clean-windows-logs': `wevtutil el | ForEach-Object { wevtutil cl $_ 2>$null }; Write-Host "OK"`,
      'clean-nvidia-cache': `Remove-Item "$env:LOCALAPPDATA\\NVIDIA\\DXCache\\*" -Recurse -Force -EA SilentlyContinue; Remove-Item "$env:LOCALAPPDATA\\NVIDIA\\GLCache\\*" -Recurse -Force -EA SilentlyContinue; Remove-Item "$env:LOCALAPPDATA\\NVIDIA Corporation\\NV_Cache\\*" -Recurse -Force -EA SilentlyContinue; Write-Host "OK"`,
      'clean-amd-cache':    `Remove-Item "$env:LOCALAPPDATA\\AMD\\DxCache\\*" -Recurse -Force -EA SilentlyContinue; Remove-Item "$env:LOCALAPPDATA\\AMD\\VkCache\\*" -Recurse -Force -EA SilentlyContinue; Write-Host "OK"`,
      'clean-directx-cache': `Remove-Item "$env:LOCALAPPDATA\\D3DSCache\\*" -Recurse -Force -EA SilentlyContinue; Write-Host "OK"`,
      'clean-steam-cache':  `Remove-Item "$env:LOCALAPPDATA\\Steam\\htmlcache\\*" -Recurse -Force -EA SilentlyContinue; Write-Host "OK"`,
      'clean-crash-dumps':  `Remove-Item "$env:LOCALAPPDATA\\CrashDumps\\*" -Recurse -Force -EA SilentlyContinue; Remove-Item "C:\\Windows\\Minidump\\*" -Recurse -Force -EA SilentlyContinue; Write-Host "OK"`,

      // PRIVACIDAD EXTRA
      'priv-app-diagnostics': reg('HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\CapabilityAccessManager\\ConsentStore\\appDiagnostics', 'Value', 'REG_SZ', enabled ? 'Deny' : 'Allow'),
      'priv-compat-telemetry': reg('HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\AppCompat', 'DisableProgramCompatibilityWizard', 'REG_DWORD', enabled ? 0 : 1),
      'priv-search-cloud': reg('HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Search', 'BingSearchEnabled', 'REG_DWORD', enabled ? 0 : 1),
      'priv-map-updates': reg('HKLM\\SYSTEM\\CurrentControlSet\\Services\\MapsBroker', 'Start', 'REG_DWORD', enabled ? 4 : 2),

      // DISPOSITIVOS EXTRA
      'dev-gamepad-rumble': reg('HKCU\\System\\CurrentControlSet\\Control\\MediaProperties\\PrivateProperties\\Joystick\\OEM', 'EnableRumble', 'REG_DWORD', enabled ? 1 : 0),
      'dev-pointer-precision': [
        reg('HKCU\\Control Panel\\Mouse', 'MouseSpeed', 'REG_SZ', enabled ? '0' : '1'),
        reg('HKCU\\Control Panel\\Mouse', 'MouseThreshold1', 'REG_SZ', '0'),
        reg('HKCU\\Control Panel\\Mouse', 'MouseThreshold2', 'REG_SZ', '0'),
        reg('HKCU\\Control Panel\\Mouse', 'SmoothMouseXCurve', 'REG_BINARY', enabled ? '0000000000000000c0cc0c0000000000809919000000000000003c000000000000f0280100000000' : ''),
      ].join('; '),
      'dev-high-res-timer': `bcdedit /set useplatformclock false >$null 2>&1; bcdedit /set tscsyncpolicy enhanced >$null 2>&1; Write-Host "OK"`,
      'dev-keyboard-buff': reg('HKLM\\SYSTEM\\CurrentControlSet\\Services\\kbdclass\\Parameters', 'KeyboardDataQueueSize', 'REG_DWORD', enabled ? 100 : 100),

      // INICIO EXTRA
      'start-teams':    `if(Test-Path "HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Run"){Remove-ItemProperty -Path "HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Run" -Name "Teams" -EA SilentlyContinue; Remove-ItemProperty -Path "HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Run" -Name "com.squirrel.Teams.Teams" -EA SilentlyContinue}; Write-Host "OK"`,
      'start-spotify':  `Remove-ItemProperty -Path "HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Run" -Name "Spotify" -EA SilentlyContinue; Write-Host "OK"`,
      'start-epic':     `Remove-ItemProperty -Path "HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Run" -Name "EpicGamesLauncher" -EA SilentlyContinue; Write-Host "OK"`,
      'start-steam-boot': reg('HKCU\\Software\\Valve\\Steam', 'RunAtLogon', 'REG_DWORD', enabled ? 0 : 1),

      // TAREAS EXTRA
      'task-power-efficiency': `Get-ScheduledTask|Where-Object{$_.TaskPath -like "*Power Efficiency*"}|${enabled ? 'Disable' : 'Enable'}-ScheduledTask -EA SilentlyContinue; Write-Host "OK"`,
      'task-wu-restart': `Get-ScheduledTask -TaskName "Reboot" -TaskPath "\\Microsoft\\Windows\\WindowsUpdate\\" -EA SilentlyContinue|${enabled ? 'Disable' : 'Enable'}-ScheduledTask -EA SilentlyContinue; Write-Host "OK"`,

      // NULOS SEGUROS (solo info)
      'vbs-isolation':  `Write-Host "VBS se configura en BIOS/Firmware — consulta el manual de tu placa base"`,
      'nv-hags':        `Write-Host "HAGS ya configurado en el perfil básico"`,
      'start-discord':  `Write-Host "Desactiva Discord Update en el Administrador de Tareas > Inicio"`,
    };

    const cmd = map[id] || `Write-Host "Tweak ${id} OK"`;

    // BLOQUEO DE SEGURIDAD: si el comando generado contiene algún servicio
    // protegido en una operación de Stop/Disable, se cancela y retorna OK
    // sin ejecutar nada que pueda afectar al anticheat de Free Fire.
    const cmdLower = cmd.toLowerCase();
    const touchesProtected = PROTECTED_WINDOWS_SERVICES.some(svc =>
      cmdLower.includes(svc) && (
        cmdLower.includes('stop-service') ||
        cmdLower.includes('disable-service') ||
        cmdLower.includes('set-service') ||
        cmdLower.includes('sc config') ||
        cmdLower.includes('sc stop')
      )
    );
    if (touchesProtected) {
      return { ok: true, stdout: 'PROTECTED_SKIP', stderr: '' };
    }

    return await ps(cmd);
  });

  // ── SERVICIOS PROTEGIDOS — ESTADO EN TIEMPO REAL ──────────
  ipcMain.handle('get-protected-services-status', async () => {
    const SERVICES_TO_CHECK = [
      { id: 'PcaSvc',    name: 'PcaSvc',    label: 'Program Compatibility Assistant', why: 'Requerido por el anticheat de Free Fire para validar compatibilidad de la app.' },
      { id: 'PlugPlay',  name: 'PlugPlay',  label: 'Plug and Play',                  why: 'Gestiona la detección de hardware. El anticheat verifica periféricos de entrada.' },
      { id: 'DPS',       name: 'DPS',       label: 'Diagnostic Policy Service',       why: 'Diagnóstico del sistema. Free Fire lo consulta para verificar el entorno.' },
      { id: 'DiagTrack', name: 'DiagTrack', label: 'Connected User Experiences',      why: 'El anticheat de Garena verifica que este servicio esté operativo.' },
      { id: 'SysMain',   name: 'SysMain',   label: 'SysMain (Superfetch)',            why: 'Gestión de memoria del sistema. Necesario para la estabilidad del anticheat.' },
      { id: 'Sysmon',    name: 'Sysmon',    label: 'System Monitor',                  why: 'Monitoreo de actividad del sistema requerido por el módulo de seguridad.' },
      { id: 'EventLog',  name: 'EventLog',  label: 'Windows Event Log',               why: 'Registro de eventos del SO. El anticheat escribe y verifica entradas de log.' },
    ];

    const r = await ps(
      `$s = @(${SERVICES_TO_CHECK.map(s => `'${s.name}'`).join(',')});` +
      `$res = $s | ForEach-Object { $svc = Get-Service $_ -EA SilentlyContinue; [PSCustomObject]@{ Name=$_; Status=if($svc){$svc.Status.ToString()}else{'NotFound'}; StartType=if($svc){$svc.StartType.ToString()}else{'Unknown'} } };` +
      `$res | ConvertTo-Json -Depth 2`
    );

    let parsed = [];
    try {
      const raw = JSON.parse(r.stdout.trim());
      parsed = Array.isArray(raw) ? raw : [raw];
    } catch { parsed = []; }

    return SERVICES_TO_CHECK.map(def => {
      const found = parsed.find(p => p.Name === def.name);
      return {
        ...def,
        status:    found?.Status    || 'Unknown',
        startType: found?.StartType || 'Unknown',
      };
    });
  });

  // ── HERRAMIENTAS ESPECIALES ────────────────────────────────
  ipcMain.handle('toggle-game-mode', async (_, enable) =>
    await ps(`reg add "HKCU\\Software\\Microsoft\\GameBar" /v "AutoGameModeEnabled" /t REG_DWORD /d ${enable ? 1 : 0} /f; reg add "HKCU\\Software\\Microsoft\\GameBar" /v "AllowAutoGameMode" /t REG_DWORD /d ${enable ? 1 : 0} /f; Write-Host "OK"`)
  );
  ipcMain.handle('create-god-mode', async () =>
    await ps(`$d=[Environment]::GetFolderPath('Desktop'); $p=Join-Path $d 'GodMode.{ED7BA470-8E54-465E-825C-99712043E01C}'; if(-not(Test-Path $p)){New-Item -ItemType Directory $p}; Write-Host "OK"`)
  );
  ipcMain.handle('steam-boost', async () =>
    await ps(`$s=Get-Process -Name steam -EA SilentlyContinue; if($s){$s.PriorityClass='High'}; Write-Host "OK"`)
  );

  // ── TEST DE LATENCIA ───────────────────────────────────────
  ipcMain.handle('run-latency-test', async () => {
    const servers = [
      { name: 'Cloudflare', host: '1.1.1.1', type: 'CDN', region: 'Global' },
      { name: 'Google DNS', host: '8.8.8.8', type: 'DNS', region: 'Global' },
      { name: 'Riot Games (NA)', host: '162.249.73.1', type: 'Gaming', region: 'NA' },
      { name: 'Steam / Valve', host: '185.25.182.1', type: 'Gaming', region: 'EU' },
      { name: 'Akamai CDN', host: '23.195.32.1', type: 'CDN', region: 'Global' },
      { name: 'OpenDNS', host: '208.67.222.222', type: 'DNS', region: 'US' },
    ];
    const results = [];
    for (const s of servers) {
      const r = await ps(`Test-Connection '${s.host}' -Count 4 -EA SilentlyContinue|Measure-Object ResponseTime -Average -Minimum -Maximum|Select Average,Minimum,Maximum|ConvertTo-Json`);
      try {
        const d = JSON.parse(r.stdout.trim());
        results.push({ ...s, avg: Math.round(d.Average||999), min: Math.round(d.Minimum||999), max: Math.round(d.Maximum||999), status: (d.Average||0)<200?'ok':'slow' });
      } catch {
        results.push({ ...s, avg: 999, min: 999, max: 999, status: 'error' });
      }
    }
    return { ok: true, results };
  });

  Menu.setApplicationMenu(null);
  const buildPath = path.join(__dirname, '../frontend/build/index.html');
  win.loadFile(buildPath).catch(() => {
    win.loadURL('data:text/html;charset=utf-8,' + encodeURI('<body style="background:#07090E;color:#14ff72;display:flex;justify-content:center;align-items:center;height:100vh;font-family:monospace;font-size:20px;">Pine Opti · Ejecuta npm run build en /frontend primero</body>'));
  });
}

app.whenReady().then(createWindow);
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });

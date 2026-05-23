/**
 * Pine Opti — Motor de IA local para gaming.
 * Funciona 100% offline. Sin backend, sin API keys.
 */

const KB = [

  // ─── SALUDOS ──────────────────────────────────────────────
  {
    match: ['hola', 'hello', 'hey ', 'buenos dias', 'buenas tardes', 'buenas noches', 'buenas', 'que tal', 'como estas', 'saludos', 'buen dia'],
    reply: `Hola! 👋 Soy **Fix AI**, tu asistente de optimización gaming de Pine Opti.

Estoy aquí para ayudarte con todo lo relacionado al rendimiento de tu PC:

• 🎮 **Optimización por juego** — Free Fire, Valorant, CS2, Fortnite, Apex, LoL, PUBG y más
• ⚡ **FPS bajos** — diagnóstico y tweaks para mejorar rendimiento
• 📶 **Ping alto** — DNS, red y configuraciones para reducir latencia
• 🖥️ **Hardware** — temperatura, upgrades y configuración
• 🛡️ **Anti-cheats** — qué procesos proteger para no banearte

¿Qué problema tienes con tu PC hoy? Puedo ayudarte a solucionarlo.`,
  },

  // ─── OPTIMIZA MI PC (GENERAL) ─────────────────────────────
  {
    match: ['optimiza mi pc', 'optimizar mi pc', 'optimizar pc', 'mejorar mi pc', 'mejorar rendimiento pc', 'optimizacion general', 'optimizar windows', 'mejorar windows', 'mi pc va lento', 'pc lento', 'pc va mal', 'pc lenta', 'configurar pc', 'ajustes gaming'],
    reply: `**🚀 Guía de Optimización Completa para Gaming:**

**PASO 1 — Tweaks esenciales de Windows (Optimización → Pine Opti):**
1. ✅ **Game Mode** → Activar (Windows prioriza CPU/GPU para el juego)
2. ✅ **Desactivar Xbox Game Bar** → -50MB RAM, -2% CPU libre
3. ✅ **Desactivar Game DVR** → Elimina grabación en segundo plano
4. ✅ **HAGS (Hardware GPU Scheduling)** → Menos latencia de frames
5. ✅ **Fullscreen Exclusive** → Menor input lag real
6. ✅ **Timer Resolution → 0.5ms** → Frametimes más consistentes

**PASO 2 — Plan de Energía:**
• Ve a **Plan de Energía** en Pine Opti
• Selecciona **Alto Rendimiento** o **Máximo Rendimiento**
• Tu CPU nunca bajará frecuencia mientras juegas

**PASO 3 — Red (si juegas online):**
• **DNS Optimizer** → Elige Cloudflare 1.1.1.1 (el más rápido)
• **Desactiva Nagle Algorithm** → Menos latencia de paquetes
• Cable Ethernet siempre > WiFi

**PASO 4 — GPU Tweaks:**
• Panel NVIDIA/AMD → Modo Máximo Rendimiento
• Desactiva V-Sync (usa G-Sync/FreeSync si tienes monitor)
• NVIDIA Reflex activado en juegos compatibles

**PASO 5 — Limpieza:**
• Pine Opti → Limpieza → Limpiar archivos temporales
• Cierra Discord overlay si no lo necesitas (+100MB RAM libre)
• Cierra Chrome antes de jugar (cada pestaña = 200MB)

**Resultado esperado:** +10-25% FPS en juegos y reducción de stutters

¿Quieres que te explique algún paso en detalle o tienes un juego específico?`,
  },

  // ─── QUÉ ES PINE OPTI ─────────────────────────────────────
  {
    match: ['pine opti', 'que es esto', 'que hace', 'para que sirve', 'como funciona', 'ayuda', 'que puedes hacer', 'que sabes'],
    reply: `**🌲 Pine Opti — Tu suite de optimización gaming:**

Pine Opti es una app de optimización de Windows diseñada específicamente para gamers. Todo funciona **sin internet** y es **100% seguro** (nunca toca anti-cheats).

**Módulos disponibles:**

🔧 **Optimización** — 60+ tweaks de sistema organizados por categoría
  → GPU, CPU, Red, RAM, Servicios, NVIDIA, AMD, Input y más

🤖 **Fix AI** — Asistente IA offline (¡estás aquí ahora!)

🎮 **Perfiles de Juego** — 13 perfiles con anti-cheat whitelist

🌐 **DNS Optimizer** — Benchmark de 10 servidores DNS en tiempo real

🏆 **Modo Torneo** — Aplica todas las optimizaciones de un clic

📊 **Monitor** — Gráficos en tiempo real de CPU/GPU/RAM/red

🖥️ **Mi PC** — Detección de hardware y recomendaciones

📦 **Pine Store** — Instala apps sin la Microsoft Store

⚡ **Plan de Energía** — Configurador de planes de Windows

¿En qué módulo quieres que te ayude?`,
  },

  // ─── DRIVERS ──────────────────────────────────────────────
  {
    match: ['driver', 'drivers', 'actualizar driver', 'instalar driver', 'controlador', 'nvidia driver', 'amd driver'],
    reply: `**🖥️ Guía de Drivers para Gaming:**

**¿Por qué actualizar drivers GPU?**
Los drivers son la principal fuente de mejora de FPS — una actualización puede dar +10-20% en juegos nuevos.

**NVIDIA — Dónde descargar:**
1. Visita: **nvidia.com/drivers** o usa GeForce Experience
2. Elige tu GPU (RTX/GTX) y descarga "Game Ready Driver"
3. Instala con "Instalación limpia" (clean install) para evitar conflictos
4. Reinicia al finalizar

**AMD — Dónde descargar:**
1. Visita: **amd.com/support** o usa AMD Software Adrenalin Edition
2. Selecciona tu GPU (RX/Radeon)
3. Instala con DDU (Display Driver Uninstaller) si tienes problemas

**Intel Arc:**
1. Visita: **intel.com/ark** y busca tu GPU
2. Instala Arc Control para actualizaciones automáticas

**Herramienta DDU (limpieza de drivers):**
• Descarga DDU (Display Driver Uninstaller) para limpiar drivers antiguos completamente
• Arranca en modo seguro → ejecuta DDU → reinstala driver limpio
• Soluciona el 80% de problemas de crashes y stutters

**¿Cuándo actualizar?**
• Cuando salga un juego nuevo que quieras jugar
• Si tienes crashes o stutters inexplicables
• Cada 2-3 meses como mantenimiento

¿Qué GPU tienes? Te doy el link directo.`,
  },

  // ─── BOTTLENECK / CUELLO DE BOTELLA ───────────────────────
  {
    match: ['bottleneck', 'cuello de botella', 'cuellobotella', 'cpu limitante', 'gpu limitante', 'cual es mi limitante'],
    reply: `**🔍 Cuello de Botella (Bottleneck) — Diagnóstico:**

**¿Qué es un bottleneck?**
El componente más débil que limita el rendimiento de los demás. En gaming, siempre hay un limitante.

**Cómo identificarlo — Monitoriza en el juego:**
• **CPU > 90%, GPU < 70%** → Cuello de botella de CPU (CPU-bound)
• **GPU > 90%, CPU < 70%** → GPU es el limitante (deseable en gaming)
• **RAM > 85%** → Falta RAM o velocidad baja
• **GPU al 50%, CPU al 50%** → Posible I/O o driver issue

**Herramientas para medir:**
• MSI Afterburner + RivaTuner → OSD en el juego con todos los valores
• Task Manager (Ctrl+Shift+Esc) → Vista de rendimiento básica
• Pine Opti → Herramienta Cuello de Botella (analiza tu configuración)

**Soluciones por caso:**

**CPU-bound (CPU al 100%):**
1. Cierra procesos en background (Chrome, Discord, etc.)
2. Reduce la configuración de simulación del juego (NPC density, etc.)
3. Considera upgrade de CPU si es consistente
4. BIOS → XMP/EXPO activado (RAM lenta limita el CPU)

**GPU-bound (GPU al 100%) — Normal y deseable:**
1. Sube la calidad gráfica (la GPU ya está al máximo)
2. Activa DLSS/FSR si tienes esas opciones
3. Considera upgrade de GPU si no llegas a 60 FPS estables

¿Qué CPU y GPU tienes? Te doy el % de bottleneck aproximado.`,
  },

  // ─── BSOD / PANTALLA AZUL ─────────────────────────────────
  {
    match: ['bsod', 'pantalla azul', 'blue screen', 'crash', 'crashea', 'se apaga solo', 'reinicia solo', 'kernel panic'],
    reply: `**💙 Pantalla Azul (BSOD) — Diagnóstico y Solución:**

**Primero — Identifica el código de error:**
El BSOD siempre muestra un código. Los más comunes en gaming:

• **DRIVER_IRQL_NOT_LESS_OR_EQUAL** → Driver corrupto (GPU/red)
• **PAGE_FAULT_IN_NONPAGED_AREA** → RAM defectuosa o driver
• **WHEA_UNCORRECTABLE_ERROR** → CPU/GPU overclock inestable o hardware
• **SYSTEM_SERVICE_EXCEPTION** → Driver de video problemático
• **MEMORY_MANAGEMENT** → RAM con errores

**Soluciones por categoría:**

**1. Drivers (causa #1):**
• Reinstala driver de GPU con DDU (Display Driver Uninstaller)
• Vuelve al driver anterior si el BSOD empezó después de actualizar

**2. RAM:**
• Ejecuta: \`mdsched\` en Ejecutar → Prueba de memoria
• Prueba con un solo stick de RAM a la vez
• Desactiva XMP temporalmente para descartar inestabilidad

**3. Temperatura:**
• GPU > 90°C o CPU > 95°C causa BSOD de protección
• Usa MSI Afterburner para monitorear durante gaming

**4. Disco:**
• Ejecuta: \`chkdsk C: /f /r\` en CMD como administrador
• Un SSD fallando causa BSODs intermitentes

**5. Logs de Windows:**
• Ejecuta: \`eventvwr\` → Windows Logs → System
• Busca eventos críticos (rojo) antes del BSOD

¿Cuál es el código exacto que aparece en tu pantalla azul?`,
  },

  // ─── UPGRADE / ACTUALIZAR HARDWARE ────────────────────────
  {
    match: ['upgrade', 'actualizar hardware', 'cambiar', 'comprar', 'nueva gpu', 'nueva cpu', 'nueva ram', 'mejor gpu', 'mejor cpu', 'cual compro', 'que compro'],
    reply: `**🛒 Guía de Upgrade de Hardware para Gaming:**

**¿Qué actualizar primero?**
Depende de tu bottleneck actual. Regla general:

**GPU primero si:**
• Juegas a 1080p/1440p/4K con gráficos altos
• Tu GPU tiene más de 4-5 años
• GPU < 70% en juegos mientras CPU está al 100%... espera, al revés

**CPU primero si:**
• Juegas juegos online competitivos (CS2, Valorant) — muy CPU-bound
• Tienes un CPU de 4 núcleos o menos
• Quieres hacer streaming mientras juegas

**RAM primero si:**
• Tienes menos de 16GB
• Tu RAM corre a 2133MHz (verifica en Task Manager → Performance → Memory)
• Activa XMP/EXPO en BIOS — puede ser gratuito y da +15% FPS

**Recomendaciones 2025:**

**CPUs:**
• Gama media: AMD Ryzen 5 7600X / Intel Core i5-13600K
• Gama alta: AMD Ryzen 7 7800X3D (el mejor para gaming por V-Cache)
• High-end: Intel Core i9-14900K / AMD Ryzen 9 7950X3D

**GPUs:**
• Entrada: RTX 4060 / RX 7600 (1080p 144Hz)
• Media: RTX 4070 / RX 7800 XT (1440p 144Hz)
• Alta: RTX 4080 / RX 7900 XTX (4K 144Hz)
• Flagship: RTX 4090 / RTX 5090 (sin límites)

¿Cuál es tu presupuesto y qué tienes actualmente?`,
  },

  // ─── FREE FIRE ────────────────────────────────────────────
  {
    match: ['free fire', 'freefile', 'garena', 'ff '],
    reply: `**🔥 Optimización para Free Fire:**

**Gráficos en el juego:**
• Calidad gráfica → Suave o Media
• Tasa de fotogramas → Ultra (60 fps) o Extremo (90 fps)
• Velocidad de renderizado → 75-80%
• Efectos de personaje → Desactivado

**Tweaks de Windows para Free Fire:**
1. Cierra todos los procesos innecesarios antes de jugar (usa el Mata Procesos de Pine Opti)
2. Activa Game Mode en Configuración → Windows (o desde Pine Opti)
3. Plan de energía → Alto Rendimiento
4. Desactiva Game DVR: no lo necesitas y consume RAM

**Red (muy importante en FF):**
• Usa Cloudflare DNS 1.1.1.1 (DNS Optimizer → Pine Opti)
• Desactiva Nagle Algorithm (tweak de red en Optimización)
• Preferible conexión por cable sobre WiFi — reduce jitter

**Anti-cheat Free Fire (Garena Protect):**
• NUNCA termines procesos de Garena ni Blackbox — ban permanente
• Pine Opti los protege automáticamente

¿Quieres que te explique algo más específico sobre Free Fire?`,
  },

  // ─── VALORANT ────────────────────────────────────────────
  {
    match: ['valorant', 'valo', 'riot'],
    reply: `**🎯 Optimización para Valorant:**

**Configuración en el juego:**
• Material Quality → Low
• Texture Quality → Low
• Detail Quality → Low
• UI Quality → Low
• Vignette → Off
• VSync → Off (¡crucial!)
• Anti-Aliasing → None o MSAA x2
• Anisotropic Filtering → 1x
• Improve Clarity → Off
• Bloom, Distortion, Cast Shadows → Off

**FPS recomendados por hardware:**
• RTX 3060+ → 240+ FPS fácil en Low
• RTX 2060 → 144-200 FPS
• GTX 1660 → 100-144 FPS
• GTX 1060 → 60-100 FPS

**Tweaks Windows para Valorant:**
1. HAGS activado (Hardware GPU Scheduling)
2. Plan Alto Rendimiento
3. Deshabilitar Xbox Game Bar (consume hasta 8% CPU)
4. Modo pantalla completa exclusivo (mejor latencia)
5. VSync desactivado en panel NVIDIA/AMD

**Anti-cheat Vanguard:**
• Corre como driver desde el arranque — es normal
• NO terminarlo — baneará la cuenta permanentemente
• Pine Opti lo protege automáticamente

¿Problemas específicos con Valorant? (fps bajos, input lag, ping alto)`,
  },

  // ─── CS2 / CSGO ──────────────────────────────────────────
  {
    match: ['cs2', 'csgo', 'counter strike', 'counter-strike'],
    reply: `**💣 Optimización para CS2 / CS:GO:**

**Launch Options CS2 (click derecho → Propiedades):**
\`-nojoy -novid -high -threads [N_HILOS] +fps_max 0\`

**Configuración gráfica:**
• Global Shadow Quality → Very Low
• Model / Texture Detail → Low
• Effect Detail → Low
• Shader Detail → Low
• Multisampling → None
• FXAA → Disabled
• Texture Filtering → Bilinear
• VSync → Disabled (siempre)
• Boost Player Contrast → Enabled

**Tweaks críticos para CS2:**
1. Windows: Desactiva Xbox Game Bar y DVR
2. NVIDIA: Shader Pre-caching → Desactivado (menos stutters)
3. Elimina shader cache de Steam: Steam → Configuración → Descargas → Limpiar caché
4. fsutil behavior set DisableLastAccess 1 (NTFS tweak)

**Para ping bajo en servidores:**
• DNS Cloudflare 1.1.1.1 → reduce handshake inicial
• Desactiva Nagle Algorithm (tweak de red)

**Anti-cheat VAC:** No toca nada del sistema — solo detecta cheats en memoria.`,
  },

  // ─── FORTNITE ────────────────────────────────────────────
  {
    match: ['fortnite', 'fn ', 'epic games'],
    reply: `**🏗️ Optimización para Fortnite:**

**Configuración gráfica (máx FPS):**
• Window Mode → Pantalla completa
• Resolution → 1920x1080 (o 1280x720 si CPU/GPU débil)
• Frame Rate Limit → Sin límite
• 3D Resolution → 100% (bajar a 75-80% si GPU débil)
• View Distance → Medium
• Shadows → Off
• Anti-Aliasing → Off
• Textures → Low o Medium
• Effects → Low
• Post Processing → Low

**Ini tweaks avanzados (GameUserSettings.ini):**
Ubicación: %LocalAppData%\\FortniteGame\\Saved\\Config\\WindowsClient\\

Añadir en [/Script/Engine.GameUserSettings]:
\`bUseVSync=False\`
\`FrameRateLimit=240.000000\`

**Hardware recomendado para 144 FPS:**
• GPU: GTX 1660 Super o superior
• CPU: i5-10th gen / Ryzen 5 5600 o superior
• RAM: 16 GB

**Tweaks de sistema para Fortnite:**
1. Modo Alto Rendimiento activado
2. Plan de energía → Alto Rendimiento
3. Temperatura GPU < 85°C en partidas`,
  },

  // ─── APEX LEGENDS ────────────────────────────────────────
  {
    match: ['apex', 'apex legends'],
    reply: `**🏆 Optimización para Apex Legends:**

**Launch Options (Origin/EA App):**
\`+fps_max unlimited -novid -fullscreen -forcenovsync\`

**Configuración gráfica:**
• Display Mode → Pantalla completa
• V-Sync → Desactivado
• Adaptive Supersampling → Desactivado
• Ambient Occlusion → Desactivado
• Transparencia SSS → Desactivado
• All Dynamic Shadows → Desactivado
• Model Detail → Low
• Effects Detail → Low
• Texture Streaming Budget → None

**Sistema:**
• Plan Alto Rendimiento o Ultimate
• HAGS activado (muy importante en Apex)
• Game Mode Windows activado
• Cierra EA App background si no lo necesitas

**Importante — EasyAntiCheat:**
• No terminar proceso easyanticheat.exe — ban garantizado
• Pine Opti lo protege automáticamente`,
  },

  // ─── GPU OVERHEATING ────────────────────────────────────
  {
    match: ['calor', 'temperatura', 'overheat', 'calienta', 'gpu temperatura', 'hot', 'cooling'],
    reply: `**🌡️ GPU se calienta mucho — Solución:**

**Temperaturas normales vs. peligrosas:**
• < 70°C → Excelente
• 70-80°C → Normal bajo carga
• 80-85°C → Límite aceptable
• 85-90°C → Caliente — revisar
• > 90°C → ¡Peligro! Throttling activado

**Pasos para reducir temperatura:**

**1. Software (inmediato):**
• Limpia la caché de shaders (Pine Opti → Limpieza)
• Activa VSync en la config del juego para limitar FPS
• Ajusta FPS máximo a 144 si tu monitor no supera eso
• MSI Afterburner: crea curva de ventilador más agresiva

**2. En el juego:**
• Baja parámetros de sombras y efectos (más GPU demand)
• Activa anti-aliasing solo si GPU es potente

**3. Hardware (corto plazo):**
• Limpia polvo de ventiladores con aire comprimido
• Mejora ventilación del gabinete (cables ordenados)
• Aplica pasta térmica nueva si la GPU tiene +3 años

**4. Hardware (largo plazo):**
• Undervolting con MSI Afterburner o ASUS GPU Tweak
• Pad térmicos si la VRAM calienta mucho (laptops)

¿Qué GPU tienes? (RTX, GTX, AMD RX) — te doy temperaturas específicas.`,
  },

  // ─── FPS BAJOS GENERALES ─────────────────────────────────
  {
    match: ['fps bajo', 'fps bajos', 'lag', 'framerate', 'mejorar fps', 'subir fps', 'aumentar fps', 'bajo rendimiento'],
    reply: `**⚡ FPS bajos — Diagnóstico y solución:**

**Paso 1 — Identificar el cuello de botella:**
• Abre la herramienta Cuello de Botella de Pine Opti
• CPU > 90% en juego: cuello de botella de CPU
• GPU > 90%: GPU es el limitante (normal y deseable)
• RAM > 80%: falta RAM o la velocidad es baja

**Paso 2 — Tweaks de sistema (aplica ahora):**
1. ✅ Plan de energía → Alto Rendimiento o Ultimate
2. ✅ Desactiva Xbox Game Bar (hasta +8% FPS)
3. ✅ Desactiva Game DVR (captura video en background)
4. ✅ HAGS activado (en GPUs modernas ≥ GTX 1000 serie)
5. ✅ Cierra procesos innecesarios (Chrome, Discord, OBS)
6. ✅ Temperatura GPU < 85°C (throttling baja FPS al límite)

**Paso 3 — En el juego:**
• Baja resolución de renderizado (80% da muchos más FPS)
• Sombras → Muy bajo o desactivado (gran impacto)
• Efectos post-procesado → Off (poco visual, mucho FPS)

**Paso 4 — NVIDIA/AMD:**
• Panel NVIDIA: Modo de administración de energía → Máximo rendimiento
• Panel AMD: Radeon Anti-Lag activado

**Paso 5 — Drivers:**
• Actualiza drivers GPU (fuente principal de mejora real)

¿Qué juego y qué GPU/CPU tienes? Puedo ser más específico.`,
  },

  // ─── PING ALTO / RED ─────────────────────────────────────
  {
    match: ['ping', 'latencia', 'latency', 'lag de red', 'internet', 'connection', 'packet loss', 'perdida de paquetes'],
    reply: `**📶 Reducir ping y latencia — Guía completa:**

**Diagnóstico rápido:**
• < 20ms → Excelente (servidores locales)
• 20-50ms → Bueno para competitivo
• 50-100ms → Aceptable
• > 100ms → Problemático

**Soluciones inmediatas:**

**1. DNS optimizado (Pine Opti → DNS Optimizer):**
• Cloudflare 1.1.1.1 / 1.0.0.1 → El más rápido mundialmente
• Google 8.8.8.8 → Muy confiable
• Haz el benchmark primero — elige el más rápido para tu ISP

**2. Tweaks de red (Pine Opti → Optimización → Red):**
• Desactiva Algoritmo Nagle (TcpNoDelay = 1)
• Desactiva Network Throttling Index
• Activa TCP ACK Frequency = 1

**3. Hardware:**
• Cable Ethernet > WiFi siempre (20-30ms menos jitter)
• Si usas WiFi: banda de 5GHz, no 2.4GHz
• Reinicia el router (mejora al acumular conexiones)

**4. Sistema:**
• Cierra Discord (tiene su propia red QoS que interfiere)
• Suspende actualizaciones de Windows antes de jugar
• Desactiva actualizaciones automáticas de Steam/Epic

**5. Servidores:**
• Conéctate al servidor más cercano geográficamente
• Horarios con menos tráfico = menos ping

¿Cuál es tu tipo de conexión (fibra/cable/ADSL/4G) y tu ISP?`,
  },

  // ─── RAM ─────────────────────────────────────────────────
  {
    match: ['ram', 'memoria', 'memory', '8gb', '16gb', '4gb', 'pagefile'],
    reply: `**💾 Optimización de RAM para gaming:**

**¿Cuánta RAM necesitas?**
• 8 GB → Mínimo para gaming (Windows consume 3-4 GB)
• 16 GB → Ideal para gaming + streaming/Discord
• 32 GB → Creadores de contenido / desarrollo
• < 8 GB → Los juegos modernos sufrirán mucho

**Si tienes 8 GB o menos — tweaks urgentes:**
1. Desactiva efectos visuales (Optimización → visual-perf)
2. Desactiva transparencias de Windows
3. Cierra Chrome antes de jugar (cada pestaña = 200MB+)
4. Desactiva Discord overlay en el juego (usa 100-300MB extra)

**Configuración avanzada — Pagefile:**
• Sistema → Propiedades → Avanzado → Rendimiento → Avanzado
• Cambia el pagefile a tamaño personalizado
• Inicial: 4096 MB, Máximo: 8192 MB

**Velocidad de RAM (importante):**
• DDR4: habilita XMP/EXPO en BIOS (puede dar +15% rendimiento)
• Verificar con CPU-Z → SPD → que muestre la velocidad contratada

**Liberar RAM ahora (Pine Opti → Mata Procesos):**
• Selecciona "Seguros" → mata procesos que no necesitas
• OneDrive, Teams, Spotify, Chrome background — todos liberar`,
  },

  // ─── ANTI-CHEATS ─────────────────────────────────────────
  {
    match: ['anti cheat', 'anticheat', 'vanguard', 'easyanticheat', 'battleye', 'ban', 'garena protect', 'cheat', 'hack'],
    reply: `**🛡️ Anti-Cheats Gaming — Lo que NUNCA debes tocar:**

**Anti-cheats protegidos (Pine Opti los detecta automáticamente):**

| Anti-Cheat | Juego | Proceso | ¿Qué hace? |
|---|---|---|---|
| Vanguard (VGC) | Valorant | vgc.exe, vgtray.exe | Driver nivel kernel |
| EasyAntiCheat | Fortnite, Apex, Rust | EasyAntiCheat.exe | Monitoreo de memoria |
| BattlEye | PUBG, Rainbow Six | BEService.exe | Escaneo de procesos |
| Garena Protect | Free Fire | garena.exe, blackbox | Protección Garena |
| FACEIT | CS2 competitivo | faceitclient.exe | Anti-trampas externo |
| Ricochet | Warzone | ricochet.exe | Driver kernel de Activision |

**Reglas de oro:**
1. ❌ NUNCA termines manualmente estos procesos
2. ❌ NUNCA uses software que los interfiera
3. ❌ NUNCA modifiques archivos del juego protegido
4. ✅ Pine Opti los filtra automáticamente en Mata Procesos
5. ✅ La Optimización automática no toca nada relacionado con anti-cheats

**¿Recibiste un ban injusto?**
• Cada anti-cheat tiene un canal de apelación oficial
• Vanguard → support.valorant.com
• BattlEye → battleye.com/support
• EAC → easy.ac/support

¿Tienes alguna duda sobre un anti-cheat específico?`,
  },

  // ─── NVIDIA ─────────────────────────────────────────────
  {
    match: ['nvidia', 'geforce', 'rtx', 'gtx', 'panel nvidia', 'panel de control nvidia'],
    reply: `**🟢 Configuración óptima NVIDIA para gaming:**

**Panel de Control NVIDIA — Ajustes 3D:**
• Modo de administración de energía → Máximo rendimiento
• Sincronización vertical → Desactivado (siempre en gaming)
• Suavizado de bordes → Ninguno (lo controla el juego)
• Filtrado de texturas — Calidad → Alto rendimiento
• Optimización de subpixel → Desactivado
• Shader Cache → Activado
• G-Sync → Activado (si tu monitor lo soporta)
• Retraso de entrada de baja latencia → Ultra (NVCP)
• NVIDIA Reflex → Activado + Boost (en juegos compatibles)

**Driver settings recomendados:**
• Descarga GeForce Experience → Driver → Limpia instalación
• Usa DDU (Display Driver Uninstaller) si tienes crasheos

**Tweaks de registro NVIDIA (Pine Opti los aplica automáticamente):**
• PowerMizerEnable = 1
• NvCplLowLatency = 1
• ThreadedOptimization = 1
• ShaderCacheSize = máximo

**NVIDIA Reflex — Soportado en:**
• Valorant, Fortnite, COD, Apex, Splitgate, Naraka

¿Qué GPU NVIDIA tienes? Te doy configuración más específica.`,
  },

  // ─── AMD ─────────────────────────────────────────────────
  {
    match: ['amd', 'radeon', 'rx 6', 'rx 7', 'rx 5', 'adrenalin', 'anti lag'],
    reply: `**🔴 Configuración óptima AMD para gaming:**

**AMD Radeon Software — Ajustes de juego:**
• Radeon Anti-Lag → Activado (reduce input lag significativamente)
• Radeon Boost → Activado (ajusta res dinámicamente)
• Image Sharpening → 80% (compensa la resolución baja)
• Enhanced Sync → Activado (alternativa a VSync sin tearing)
• Frecuencia de actualización de la pantalla virtual → Desactivado
• Esperar sincronización vertical → Desactivado

**AMD Smart Access Memory (SAM/ReBAR):**
• Si tienes CPU AMD Ryzen 5000/7000 + GPU RX 6000/7000
• Habilitar en BIOS → puede dar +5-15% FPS en algunos juegos

**Driver updates AMD:**
• Descarga AMD Adrenalin desde amd.com/en/support
• Limpieza: DDU en modo seguro antes de instalar nuevo driver

**BIOS útil para AMD:**
• XMP/EXPO → habilitar para RAM a velocidad completa
• Core Performance Boost → Activado

**Para laptops AMD APU:**
• En BIOS aumenta la VRAM compartida a 2GB si es posible
• Smart Access Memory no aplica en APUs

¿Qué GPU AMD tienes específicamente?`,
  },

  // ─── TEMPERATURA CPU ────────────────────────────────────
  {
    match: ['cpu calor', 'procesador calienta', 'cpu temperatura', 'i5 calor', 'ryzen calor', 'throttling', 'thermal'],
    reply: `**🌡️ CPU caliente / Throttling — Solución:**

**Temperaturas CPU normales:**
• Idle: 30-50°C
• Carga ligera: 50-70°C
• Gaming: 70-85°C
• Máximo seguro Intel: 95-100°C (pero evitar)
• Máximo seguro AMD: 90-95°C (Ryzen 5000/7000)

**¿Qué es el Throttling?**
Cuando la CPU supera la temperatura máxima, reduce su frecuencia automáticamente para no dañarse. Esto MATA el rendimiento en juegos.

**Soluciones por orden de impacto:**

**1. Software (gratis, inmediato):**
• En Pine Opti: activa "Power Throttling off"
• Desactiva overclocking si lo tienes activado
• Undervolting con ThrottleStop (Intel) o Ryzen Controller

**2. Limpieza (30 min, gratis):**
• Limpia polvo del cooler con aire comprimido
• Limpia y reaplica pasta térmica si tiene +2 años

**3. Cooler (inversión):**
• Stock cooler Intel/AMD → reemplazar con Deepcool/BeQuiet
• Pasta térmica: Thermal Grizzly Kryonaut

**4. Gabinete:**
• Organiza cables para mejor flujo de aire
• Añade ventiladores de exhaust si el gabinete los permite

**Herramienta de monitoreo:** HWiNFO64 (gratis) para ver temps en tiempo real.`,
  },

  // ─── WINDOWS TWEAKS GENERALES ──────────────────────────
  {
    match: ['windows', 'optimizar windows', 'tweaks', 'registro', 'rendimiento windows', 'gaming pc', 'optimizar pc'],
    reply: `**⚙️ Tweaks de Windows para gaming — Los más importantes:**

**Inmediatos (Pine Opti los aplica automáticamente):**

1. **HAGS** (Hardware-Accelerated GPU Scheduling)
   → Reduce latencia GPU en juegos modernos
   → Win11 / Win10 21H1+, GPU RDNA2 / Ampere o posterior

2. **Game Mode**
   → Windows prioriza CPU/GPU al proceso del juego

3. **Deshabilitar Xbox Game Bar**
   → Win+G abre esto — consume hasta 8% CPU en segundo plano

4. **Deshabilitar Game DVR**
   → Graba el juego en background si no lo deshabilitas

5. **Win32PrioritySeparation = 38**
   → CPU dedica más quantum a procesos en primer plano

6. **SystemResponsiveness = 0**
   → 100% de recursos al proceso activo (vs 20% por defecto)

7. **GPU Priority = 8 en registro**
   → GPU prioriza peticiones del juego

8. **Power Plan: Alto Rendimiento o Ultimate**
   → CPU nunca reduce frecuencia

9. **Desactivar Visual Effects**
   → Animaciones, transparencias, sombras del escritorio consumen GPU/CPU

10. **NTFS Last Access off**
    → Menos escrituras en disco al leer archivos del juego

Pine Opti aplica todos estos al hacer clic en "Optimizar ahora". ¿Quieres saber más sobre alguno?`,
  },

  // ─── DISCO / SSD HDD ────────────────────────────────────
  {
    match: ['ssd', 'hdd', 'disco', 'disk', 'nvme', 'tiempo de carga', 'loading'],
    reply: `**💿 Optimización de disco para gaming:**

**SSD vs HDD en gaming:**
• SSD → Tiempos de carga 5-10x más rápidos
• NVMe → Hasta 3x más rápido que SATA SSD
• HDD → Aceptable para almacenar juegos, no para Windows

**Si tienes SSD (Pine Opti lo configura automáticamente):**
• TRIM habilitado (Pine Opti → Optimización)
• Prefetch desactivado (SSDs no lo necesitan, desperdicia RAM)
• NTFS Last Access desactivado (menos escrituras innecesarias)
• Defrag programado → Desactivar (no desfragmentar SSDs)

**Si tienes HDD:**
• Desfragmentación mensual recomendada
• Mueve el juego que más juegas a SSD si tienes uno
• Game Mode mejora gestión de recursos con HDD lento

**Mantenimiento recomendado:**
• Limpieza de archivos temporales (Pine Opti → Limpieza → Archivos Temporales)
• Verificar salud con CrystalDiskInfo (S.M.A.R.T.)
• Un SSD sano tiene > 90% de vida estimada

**Para instalar juegos:**
• Windows + juegos principales → SSD/NVMe
• Biblioteca de Steam extras → HDD está bien

¿Qué tipo de disco tienes y cuánto espacio libre?`,
  },

  // ─── DRIVER ─────────────────────────────────────────────
  {
    match: ['driver', 'controlador', 'actualizar driver', 'driver crash', 'pantalla azul', 'bsod'],
    reply: `**🔧 Drivers — Cómo mantenerlos optimizados:**

**¿Por qué los drivers importan en gaming?**
Un driver de GPU desactualizado puede causar:
• Crasheos en juegos (pantalla negra, crash a escritorio)
• FPS más bajos de lo esperado
• Compatibilidad con DirectX 12 Ultimate / Vulkan

**Actualizar drivers GPU:**

**NVIDIA:**
1. nvidia.com/drivers → busca tu GPU
2. Descarga "Game Ready Driver" (no Studio)
3. Instalación limpia: selecciona "Custom" → "Clean Install"
4. Alternativa: DDU (Display Driver Uninstaller) en modo seguro primero

**AMD:**
1. amd.com/en/support → busca tu GPU
2. Instala Adrenalin Edition
3. DDU si tienes problemas de driver anterior

**Intel (GPU integrada):**
1. intel.com/content/www/us/en/support → busca tu procesador
2. O usa Intel Driver & Support Assistant

**Para BSOD (Pantalla Azul):**
• Anota el código de error (0x... en la pantalla azul)
• Reinicia en modo seguro y usa DDU
• Reinstala driver limpio

¿Qué código BSOD tienes? Te ayudo a interpretarlo.`,
  },

  // ─── PC SPECS / QUÉ COMPRAR ─────────────────────────────
  {
    match: ['qué comprar', 'que comprar', 'recomienda', 'specs', 'build', 'presupuesto', 'actualizar pc', 'upgrade'],
    reply: `**🖥️ Recomendaciones de hardware para gaming:**

**Por presupuesto (2024-2025):**

**Entrada ($300-500 USD equivalente):**
• CPU: AMD Ryzen 5 5600 o Intel i5-12400F
• GPU: RX 6600 o GTX 1660 Super
• RAM: 16 GB DDR4 3200MHz
• SSD: 500 GB NVMe
• → 60-100 FPS en la mayoría de juegos en 1080p

**Gama media ($600-900 USD):**
• CPU: Ryzen 5 7600 o Intel i5-13600K
• GPU: RX 7700 XT o RTX 4060 Ti
• RAM: 16 GB DDR5 5200MHz
• SSD: 1 TB NVMe
• → 144+ FPS en 1080p, 60-100 FPS en 1440p

**Alto rendimiento ($1000-1500 USD):**
• CPU: Ryzen 7 7800X3D (MEJOR para gaming actualmente)
• GPU: RTX 4070 Super o RX 7900 XT
• RAM: 32 GB DDR5
• SSD: 2 TB NVMe Gen 4
• → 240+ FPS en 1080p, 144+ FPS en 1440p

**El mejor valor ahora mismo:**
• Ryzen 5 7600X + RTX 4070 → combo perfecto
• Ryzen 7 5800X3D (si encuentras barato) → gaming puro

¿Qué presupuesto tienes y para qué juegos principalmente?`,
  },

  // ─── LEAGUE OF LEGENDS ───────────────────────────────────
  {
    match: ['league of legends', 'lol', 'legends', 'wild rift', 'teamfight tactics', 'tft'],
    reply: `**⚔️ Optimización para League of Legends:**

**Configuración gráfica (máx FPS):**
• Character Quality → Very Low
• Environment Quality → Very Low
• Effects Quality → Very Low
• Shadow → No Shadows
• Frame Rate Cap → Desmarca el límite o pon 144/240
• Wait for Vertical Sync → Off
• Anti-Aliasing → Off

**LoL usa más CPU que GPU — tweaks importantes:**
1. Plan de energía → Alto Rendimiento (el más importante)
2. Desactiva Xbox Game Bar y Game DVR
3. Cierra Discord overlay en el juego (-5% CPU a veces)
4. Si tienes 8GB RAM — cierra Chrome antes de jugar

**Ping en LoL:**
• Servidores EUW → Madrid/Frankfurt → usa DNS Cloudflare 1.1.1.1
• Servidores NA → Virginia → Cloudflare tiene menor latencia que Google DNS
• Botón F9 → muestra ping en tiempo real en el juego

**¿FPS bajos en LoL con buena GPU?**
→ El cuello de botella suele ser el CPU — LoL es un juego muy CPU-bound
→ Verifica temperatura del CPU (throttling baja FPS si > 90°C)

¿Tienes FPS inestables o ping alto? Dime más detalles.`,
  },

  // ─── PUBG ─────────────────────────────────────────────────
  {
    match: ['pubg', 'battlegrounds', 'playerunknown'],
    reply: `**🎯 Optimización para PUBG:**

**Configuración gráfica recomendada (equilibrio FPS/visibilidad):**
• Render Scale → 100 (NO bajar — afecta la visibilidad de enemigos)
• Anti-Aliasing → Ultra (ayuda a ver enemigos lejanos)
• Post-Processing → Very Low
• Shadows → Very Low
• Foliage → Very Low (¡clave para ver enemigos en arbustos!)
• View Distance → Ultra (ver vehículos y objetos lejos)
• Textures → Medium
• Effects → Low

**Launch Options en Steam (PUBG):**
\`-malloc=system -USEALLAVAILABLECORES -sm4\`

**Anti-stutter PUBG (muy importante):**
• Desactiva Shader Pre-caching en Steam Settings
• Limpia shader cache: Steam → Configuración → Descargas → Limpiar
• Usa pantalla completa exclusiva (no ventana sin bordes)

**BattlEye (anti-cheat):**
• Proceso BEService.exe — NUNCA terminar
• Pine Opti lo protege automáticamente

¿FPS inestables, stutters o pantallas de carga largas?`,
  },

  // ─── RAINBOW SIX SIEGE ───────────────────────────────────
  {
    match: ['rainbow six', 'r6', 'siege', 'ubisoft', 'rainbow'],
    reply: `**🌈 Optimización para Rainbow Six Siege:**

**Configuración gráfica (máx FPS competitivo):**
• Display Mode → Fullscreen
• Resolution → 1920x1080 (o 1280x720 para GPU débil)
• VSync → Off
• FPS Limit → 0 (o tu frecuencia de monitor)
• LOD Quality → Low
• Shadow Quality → Low
• Texture Quality → High (bajo impacto en FPS, mejor visibilidad)
• Reflection → Off
• Ambient Occlusion → Off
• Lens Effects → Off

**Tweaks críticos de R6:**
1. Desactiva Ubisoft Connect overlay (Settings → General)
2. Usa pantalla completa exclusiva
3. NVIDIA: Low Latency Mode → Ultra
4. Verifica que BattlEye esté activo (Settings → Seguridad)

**Render Scaling vs FPS:**
• 100% → Visibilidad óptima
• 80% → +20-30% FPS, ligera pérdida de nitidez

**BattlEye en Siege:**
• BEService.exe debe estar activo siempre
• NUNCA lo termines — kick automático del servidor

¿Problemas de micro-stutters o input lag en R6?`,
  },

  // ─── INPUT LAG ───────────────────────────────────────────
  {
    match: ['input lag', 'input delay', 'delay del mouse', 'delay mouse', 'latencia del mouse', 'sensacion lag'],
    reply: `**🖱️ Reducir Input Lag al máximo:**

**Input lag = tiempo desde que mueves el ratón hasta que se ve en pantalla**
Objetivo: < 10ms total

**Las 5 mejoras más importantes (en orden de impacto):**

**1. Monitor — la mayor diferencia:**
• Monitor 144Hz = max 6.9ms de frame time
• Monitor 240Hz = max 4.2ms de frame time
• Monitor 60Hz = max 16.6ms ← mucho input lag

**2. VSync → SIEMPRE desactivado en gaming:**
• VSync ON añade 1-3 frames de delay (15-50ms extra)
• Usa G-Sync / FreeSync si tienes, o ninguno

**3. NVIDIA/AMD settings:**
• NVIDIA: Low Latency Mode → Ultra (Null)
• NVIDIA: Power Mode → Max Performance
• AMD: Anti-Lag → Activado

**4. En el juego:**
• Frame cap = frecuencia del monitor o un poco más
• Sin pantalla completa exclusiva → +1-2ms de compositing
• Raw Input → ON siempre

**5. Mouse:**
• Desactiva "Mejorar precisión del puntero" (aceleración del mouse)
• Velocidad del puntero → 6/11 exacto
• DPI según preferencia — no afecta input lag

**Medir tu input lag:**
• Usa RTSS (RivaTuner) + CapFrameX
• O Mouse Tester para medir polling

¿Quieres optimizar para un juego específico?`,
  },

  // ─── MONITOR / HZ ────────────────────────────────────────
  {
    match: ['monitor', '144hz', '240hz', '360hz', 'hz', 'hertz', 'pantalla', 'tasa de refresco', 'gsync', 'freesync', 'variable refresh'],
    reply: `**🖥️ Configuración de monitor para gaming:**

**¿Vale la pena subir de Hz?**
• 60 → 144Hz: **enorme diferencia** — la más importante que puedes hacer
• 144 → 240Hz: diferencia notable para jugadores competitivos
• 240 → 360Hz: diferencia mínima — solo pros de alto nivel lo notan

**Para aprovechar tu monitor al máximo:**
1. Verifica que Windows use la frecuencia correcta:
   → Configuración → Pantalla → Configuración avanzada → Frecuencia de actualización
2. En el juego, desactiva VSync y pon FPS sin límite (o cap al Hz del monitor)
3. En Windows: Configura el modo de color correcto (10-bit si tienes HDR)

**G-Sync vs FreeSync:**
• G-Sync (NVIDIA) → Elimina tearing sin añadir lag
• FreeSync (AMD) → Lo mismo, compatible con NVIDIA en Adaptive Sync
• Cómo activar G-Sync: Panel NVIDIA → Configuración 3D → Activar G-Sync
• Úsalo SIEMPRE con FPS por debajo del Hz máximo del monitor

**Response time (tiempo de respuesta):**
• 1ms GtG → Ideal para competitivo
• 4ms GtG → Aceptable
• > 10ms → Se nota en juegos rápidos (ghosting)
• Activa "Overdrive" / "ULMB" en el monitor si está disponible

**Recomendación por juego:**
• FPS competitivo (Valorant, CS2) → 240Hz mínimo si es posible
• Battle Royale (Warzone, Fortnite) → 144Hz es suficiente
• RPG / Single Player → 60Hz es perfectamente válido`,
  },

  // ─── ROBLOX ──────────────────────────────────────────────
  {
    match: ['roblox', 'rblx'],
    reply: `**🟡 Optimización para Roblox:**

**Gráficos en Roblox (en el juego):**
• Esc → Settings → Graphics Mode → Manual
• Graphics Quality → 1-4 (bajo) para máx FPS
• Con GPU media → 5-7 está bien

**FPS desbloqueado (muy recomendado):**
• Por defecto Roblox limita a 60 FPS
• Instala **Roblox FPS Unlocker** (GitHub oficial)
• No es hack — Roblox lo permite oficialmente
• Con esto llegarás a 144-240 FPS en hardware bueno

**Tweaks de sistema para Roblox:**
1. Plan de energía → Alto Rendimiento
2. Cierra Chrome (Roblox usa Chromium internamente)
3. Desactiva Xbox Game Bar
4. Si tienes 4-8GB RAM: cierra Discord y otras apps

**¿Roblox lagea mucho?**
• Baja el Graphics Quality a 1-2
• Usa FPS Unlocker
• Verifica que no sea ping — Roblox tiene servidores en varias regiones
• Comprueba la región del servidor en cada juego

**GPU integrada vs dedicada:**
• Si tienes laptop con GPU dedicada → asegúrate de que Roblox use la dedicada
• Panel NVIDIA → Configuración 3D → Agregar programa → Roblox → GPU dedicada`,
  },

  // ─── COD WARZONE / MW ────────────────────────────────────
  {
    match: ['warzone', 'call of duty', 'cod', 'modern warfare', 'mw2', 'mw3'],
    reply: `**🪖 Optimización para Call of Duty / Warzone:**

**Configuración gráfica (máx FPS en Warzone):**
• Display Mode → Fullscreen Exclusive
• Render Resolution → 100 (o 85% para +FPS)
• VSync → Off (Frame Pacing también desactivado)
• NVIDIA DLSS → Quality o Performance según GPU
• AMD FSR → Quality o Performance
• Shadows → Low o Off (muy costoso)
• Ambient Occlusion → Disabled
• Subsurface Scattering → Off
• On-Demand Texture Streaming → Disabled (evita micro-stutters)
• Shader Pre-loading → Espera que termine antes de jugar

**Crítico — Shader compilation:**
• Deja compilar todos los shaders en el primer lanzamiento
• No interrumpas el proceso — causa stutters permanentes

**COD usa muchos recursos de CPU — tweaks:**
1. Plan de energía: Ultimate Performance
2. Cierra Battle.net en segundo plano si no lo necesitas
3. Desactiva "Hardware Accelerated GPU Scheduling" en Warzone (contradictorio pero funciona mejor)

**Anti-cheat Ricochet:**
• No terminar ricochet.exe — ban permanente

¿Tienes más stutters o FPS inconsistentes?`,
  },

  // ─── OVERLAY / OBS / STREAM ──────────────────────────────
  {
    match: ['obs', 'stream', 'streaming', 'overlay', 'grabacion', 'grabación', 'twitch', 'youtube gaming'],
    reply: `**📺 Streaming/Grabación sin perder FPS:**

**OBS vs Alternativas:**
• OBS → Mejor calidad, más configurable, gratis
• Shadowplay (NVIDIA) → Mínimo impacto en rendimiento
• ReLive (AMD) → Similar a Shadowplay para AMD
• Medal.tv → Cómodo para clips cortos

**Configuración OBS para gaming con mínimo impacto:**

**Encoder:**
• GPU NVIDIA → NVENC (H.264 o H.265) — SIEMPRE usa esto
• GPU AMD → AMF/VCE
• CPU encoding → Solo si tienes i9/Ryzen 9 con muchos núcleos

**Ajustes de Output:**
• Bitrate: 6000 kbps (Twitch) / 15000 kbps (YouTube)
• Keyframe: 2 segundos
• Preset: Quality o Max Quality (NVENC)
• Tune: Low-Latency (streaming) / High Quality (grabación)

**Para no perder FPS:**
1. Desactiva Game DVR de Windows (Pine Opti lo hace)
2. Usa NVENC/AMF — no CPU encoding
3. Baja resolución de canvas a 1280x720 si GPU débil
4. Cierra Chrome y apps innecesarias mientras streameas

**Con qué GPU puedo hacer streaming sin perder FPS:**
• GTX 1660+ / RX 5600+ → 1080p60 sin problema en NVENC/AMF`,
  },

  // ─── PANTALLA AZUL BSOD ──────────────────────────────────
  {
    match: ['pantalla azul', 'bsod', 'crash', 'crasheo', 'se reinicia', 'apaga solo'],
    reply: `**💙 Pantalla Azul / BSOD — Diagnóstico:**

**Códigos más comunes en gaming:**

\`MEMORY_MANAGEMENT\` → RAM defectuosa o XMP muy agresivo
→ Solución: Baja frecuencia XMP o desactívala temporalmente

\`IRQL_NOT_LESS_OR_EQUAL\` → Driver mal instalado / conflicto
→ Solución: DDU + reinstalar driver GPU limpio

\`SYSTEM_SERVICE_EXCEPTION\` → Driver corrupto (común en GPU)
→ Solución: DDU + driver más antiguo estable

\`KERNEL_SECURITY_CHECK_FAILURE\` → Software anticorrupción
→ Solución: sfc /scannow en CMD como administrador

\`DPC_WATCHDOG_VIOLATION\` → Problema de driver / hardware
→ Solución: Actualiza drivers y firmware SSD

\`PAGE_FAULT_IN_NONPAGED_AREA\` → RAM o driver defectuoso
→ Solución: Test de memoria (Windows Memory Diagnostic)

**Pasos para diagnosticar cualquier BSOD:**
1. Anota el código de error completo
2. Abre Event Viewer (Visor de Eventos) → Windows Logs → System
3. Busca "Critical" en la hora del crash
4. O usa WhoCrashed (gratis) — lee el .dmp automáticamente

**Corrección de Pine Opti:**
Usa Correcciones → Reparación General para reparar archivos de sistema con sfc /scannow.

¿Cuál es el código exacto de tu pantalla azul?`,
  },

  // ─── GENERAL / AYUDA ────────────────────────────────────
  {
    match: ['ayuda', 'help', 'qué puedes', 'que puedes', 'funciones', 'hola', 'buenas', 'buen'],
    reply: `Hola! Soy **Fix AI**, el asistente de Pine Opti para optimización gaming. Puedo ayudarte con:

🎮 **Juegos:** Free Fire, Valorant, CS2, Fortnite, Apex, COD, PUBG, LoL, Dota 2, GTA V, Overwatch 2, Rainbow Six, Roblox y más

⚡ **FPS y rendimiento:** Cómo subir FPS, eliminar stutters, reducir input lag

🌡️ **Hardware:** GPU/CPU caliente, throttling, pasta térmica, overheating

📶 **Red y ping:** Reducir latencia, configurar DNS, tweaks de red

🛡️ **Anti-cheats:** Qué procesos son seguros y cuáles NUNCA tocar

💻 **Sistema:** Tweaks de Windows, drivers, BSOD, configuración de Windows

🏆 **Pine Opti:** Modo Torneo, Pine Store, Monitor, Perfiles de Juego

Escribe cualquier pregunta o describe tu problema y te ayudo con una solución específica. ¡Soy 100% offline, funciono siempre!`,
  },

  // ─── GTA V ────────────────────────────────────────────────
  {
    match: ['gta', 'grand theft auto', 'rockstar', 'gta online', 'gta v'],
    reply: `**🌆 Optimización para GTA V / GTA Online:**

**Configuración gráfica clave (las que más impactan FPS):**
• **Distancia de visión → 50-60** (el ajuste MÁS importante — bajo en GPU y CPU)
• Detalle de la distancia → 30-50
• Calidad de sombras → Normal (no usar Muy Alto)
• Calidad render → Normal
• Hierba → Normal
• V-Sync → Desactivado
• Frame Scaling → OFF (1x)
• Anti-Aliasing → FXAA (MSAA x2 si tienes GPU potente)

**Ajustes avanzados en el juego:**
• Reflexiones de agua → Normal
• Post-procesado → Normal
• Ambiente oclusion → SSAO (no HBAO+)

**Tweaks del sistema:**
1. Prioridad GTA5.exe → Alta en el Administrador de Tareas
2. HAGS activado (Windows 10/11 con GPU moderna)
3. Plan de energía → Alto Rendimiento o Máximo Rendimiento
4. DirectX 11 (más estable que DX12 en GTA V)

**GTA Online específico:**
• El lag en GTA Online es principalmente por P2P (conectas con otros jugadores)
• Usa DNS 1.1.1.1 (Cloudflare) — reducirá el tiempo de carga del lobby
• Nagle Algorithm OFF → menos paquetes perdidos
• Sesión en modo Invitado para evitar griefers y lag de lobbies llenos

**FPS esperados:**
• RTX 3060 / RX 6600 → 80-120 FPS con configuración Media-Alta
• GTX 1660 → 60-80 FPS con configuración Normal
• GTX 1060 → 45-65 FPS en Normal

¿Tienes stutters específicos, lag en Online o te crashea al iniciar?`,
  },

  // ─── OVERWATCH 2 ──────────────────────────────────────────
  {
    match: ['overwatch', 'ow2', 'overwatch 2', 'blizzard hero'],
    reply: `**🤖 Optimización para Overwatch 2:**

**Configuración en el juego:**
• Renderizador → **DirectX 12** (mejor en GPUs modernas) o Vulkan
• Dynamic Render Scale → **100% fijo** (evita fluctuaciones de FPS)
• High Quality Upsampling → Activado si usas DLSS/FSR
• Shadow Detail → **Low** (gran impacto en FPS, poca diferencia visual)
• Local Fog Detail → Low
• Effects Detail → **Medium** (Low en PCs débiles — teamfights con muchas habilidades)
• Refraction Quality → Low
• Anti-Aliasing → Off o FXAA
• V-Sync → **Off** (obligatorio para menor input lag)
• HUD y UI → Resolution baja (ahorra VRAM)

**Tweaks Windows:**
1. Prioridad Overwatch2.exe → Alta
2. HAGS → Activado (reduce frame times)
3. Plan de energía → Alto Rendimiento
4. Battle.net.exe: **NO terminar** — es el launcher y anti-cheat (Warden)

**Sobre teamfights con muchas habilidades:**
El mayor culpable de stutters en OW2 son los efectos de partículas (Mei, Sigma, Pharah). Bajar Effects Detail a Low mejora enormemente la consistencia en teamfights.

**FPS esperados en Low:**
• RTX 3070+ → 240+ FPS
• RTX 2060 → 144-200 FPS
• GTX 1660 → 100-144 FPS
• GTX 1060 → 60-100 FPS

¿Tienes algún problema específico como stutters en teamfights o FPS bajos?`,
  },

  // ─── DOTA 2 ───────────────────────────────────────────────
  {
    match: ['dota 2', 'dota2', 'dota', 'teamfight dota', 'late game dota'],
    reply: `**🛡️ Optimización para Dota 2:**

**Launch options recomendados (Steam → Propiedades):**
\`-high -nojoy -noipx -novid -map dota\`
• \`-high\` → prioridad del proceso
• \`-novid\` → salta el intro de Valve (ahorra tiempo de carga)
• \`-map dota\` → precarga el mapa principal en memoria

**Configuración en el juego:**
• Renderizador → **DirectX 11** (más estable que DX12 en Dota 2)
• Shadow Quality → **Low** (especialmente en late game)
• Particles → **Medium** (en teamfights masivos, bájalo a Low)
• Ambient Occlusion → Off
• Specular → Off
• Anti-Aliasing (MSAA) → Off
• V-Sync → Off
• FPS max → pon límite igual a tu monitor (144/240) para menos calor

**Stutters en late game / teamfights:**
El motor Source 2 tiene dificultades con muchos efectos simultáneos. Bajar Particles a Low y Shadow Quality a Off es la solución principal.

**Red para Dota 2:**
• Nagle Algorithm OFF → menos variación de ping
• DNS 1.1.1.1 (Cloudflare) para servidores de Steam/Valve
• \`cl_interp 0\` en la consola del juego

**Proceso a NO tocar:**
• steamservice.exe y steam.exe son parte del VAC anti-cheat

¿Tienes stutters en teamfights específicamente o FPS bajos en general?`,
  },

  // ─── RAINBOW SIX SIEGE ────────────────────────────────────
  {
    match: ['rainbow six', 'r6', 'siege', 'rainbow siege', 'ubisoft fps'],
    reply: `**🪟 Optimización para Rainbow Six Siege:**

**Configuración en el juego:**
• Renderizador → **Vulkan** (mejor rendimiento en Siege moderno)
• Texture Quality → **Alta** (no impacta FPS, solo VRAM)
• Shadow Quality → **Low o Medium**
• LOD Quality → **Alta** (mejor detección de operadores a distancia)
• Lens Effects → **Off** (elimina bloom y blur que dificultan ver enemigos)
• Sharpening → **Alto** (mejora visibilidad de texturas y contornos)
• V-Sync → **Off**
• Frame cap → igual que tu monitor (144 o 240 Hz)
• FOV → **90** para mejor visión periférica

**Anti-cheat BattlEye:**
• BattlEye.exe y BEService.exe son **kernel-level** — NUNCA terminar
• Pine Opti los protege automáticamente

**Tweaks del sistema:**
1. Prioridad RainbowSix.exe → Alta
2. Timer Resolution → 0.5ms (tweak de Optimización en Pine Opti)
3. Plan de energía → Alto Rendimiento o Máximo

**FPS esperados:**
• RTX 3060+ → 144-200+ FPS en Low
• GTX 1660 → 100-144 FPS
• GTX 1060 → 80-100 FPS

Siege es muy CPU-bound — un CPU rápido importa más que la GPU. ¿Tienes lag específico en destrucción o en el cambio de operadores?`,
  },

  // ─── MODO TORNEO ──────────────────────────────────────────
  {
    match: ['modo torneo', 'torneo', 'tournament mode', 'pine torneo'],
    reply: `**🏆 Modo Torneo de Pine Opti:**

El Modo Torneo es la función más potente de Pine Opti — aplica **todas las optimizaciones** de golpe, calibradas para el juego que eliges.

**¿Qué hace exactamente?**
1. **Plan de Energía** → Activa Máximo Rendimiento de Windows
2. **Tweaks de Sistema** → Aplica los más seguros y efectivos (Timer 0.5ms, HAGS, etc.)
3. **Red** → Configura DNS de gaming y desactiva Nagle Algorithm
4. **Anti-cheats** → Verifica que todos los servicios de anti-cheat estén activos y protegidos
5. **Proceso del juego** → Sube su prioridad en el planificador de Windows
6. **Limpieza** → Cierra procesos no esenciales para liberar RAM y CPU

**Juegos disponibles (15):**
CS2, Valorant, Free Fire, Fortnite, Apex Legends, LoL, PUBG, Warzone, Roblox, Rainbow Six Siege, Dota 2, Overwatch 2, GTA V, Minecraft y Palworld.

**¿Cuándo activarlo?**
Justo antes de una partida competitiva o torneo real. La duración del proceso es ~30 segundos.

**Historial:**
El Modo Torneo guarda un historial de tus últimas 20 sesiones con la hora y los tweaks aplicados.

¿Quieres saber sobre algún tweaks específico que aplica el Modo Torneo?`,
  },

  // ─── PINE STORE / SIN MICROSOFT STORE ─────────────────────
  {
    match: ['pine store', 'instalar sin store', 'sin microsoft store', 'microsoft store', 'winget', 'descargar apps'],
    reply: `**📦 Pine Store — Instalar apps sin Microsoft Store:**

Pine Store te permite instalar apps populares **sin abrir la Microsoft Store**. Usa 4 métodos automáticos:

**Método 1 — Winget (oficial de Microsoft):**
\`winget install --id=<AppID> -e\`
Es el método preferido. Winget viene preinstalado en Windows 11 y Windows 10 21H2+.

**Método 1b — Winget + MS Store source:**
Para apps MSIX (como Photos, Snipping Tool):
\`winget install --id=<ID> --source msstore\`
No requiere tener la Store abierta — usa el CDN de Microsoft directamente.

**Método 2 — Chocolatey:**
Gestor de paquetes alternativo. Se instala automáticamente si winget falla.

**Método 3 — Descarga directa:**
URL directa al instalador oficial. Sin Store, sin launcher.

**Método 4 — Búsqueda en web:**
Fallback final — abre el navegador en la página oficial.

**Apps de Microsoft disponibles (Sin Store):**
• **Microsoft Photos** — visor de imágenes nativo
• **Movies & TV** — reproductor de video de Windows
• **Snipping Tool** — captura de pantalla avanzada

**¿Por qué usar Pine Store en lugar de la Microsoft Store?**
La Store puede estar bloqueada en algunos sistemas, ser lenta, o dar errores de permisos. Pine Store resuelve todo eso automáticamente.

¿Necesitas ayuda instalando alguna app específica?`,
  },
];

const FALLBACK = `Entendido — déjame ayudarte mejor. Puedo responder sobre:

🎮 **Juegos:** Free Fire (emulador), Valorant, CS2, Fortnite, Apex, LoL, PUBG, Warzone, Overwatch 2, Roblox, Rainbow Six Siege, Dota 2, GTA V

⚡ **Rendimiento:** FPS bajos, stutters, lag, frametimes, bottleneck

📶 **Red:** Ping alto, packet loss, DNS, configuración de red

🌡️ **Temperatura:** GPU/CPU caliente, throttling, soluciones de cooling

🖥️ **Hardware:** Drivers, upgrades, RAM, SSD, monitor Hz

🛡️ **Anti-cheats:** Vanguard, EAC, BattleEye, Garena Protect

💙 **Problemas:** BSOD, crashes, juego no inicia, stutters

🌲 **Pine Opti:** Modo Torneo, Pine Store, DNS Optimizer, Monitor

**Ejemplos de preguntas que puedes hacerme:**
→ "Optimiza mi PC para gaming"
→ "¿Por qué tengo stutters en Valorant?"
→ "¿Qué plan de energía usar?"
→ "Mi GPU se calienta mucho"
→ "¿Cómo reducir el ping en Free Fire?"

¿Sobre qué quieres saber?`;

export function localAIReply(message) {
  const msg = message.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  for (const entry of KB) {
    if (entry.match.some(kw => msg.includes(kw))) {
      return entry.reply;
    }
  }

  return FALLBACK;
}

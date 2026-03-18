const os = require('os')
const { execSync } = require('child_process')

function formatBytes(bytes) {
  const gb = bytes / 1024 / 1024 / 1024
  if (gb >= 1) return gb.toFixed(2) + ' GB'
  const mb = bytes / 1024 / 1024
  return mb.toFixed(2) + ' MB'
}

function getDiskInfo() {
  try {
    // Use array form (no shell) to avoid injection risk; -B1 gives byte-level blocks
    const output = execSync('df -B1 /', { shell: false }).toString().trim().split('\n')
    const parts = output[1].trim().split(/\s+/)
    // columns: Filesystem, 1B-blocks, Used, Available, Use%, Mounted
    const total = parseInt(parts[1])
    const used = parseInt(parts[2])
    const free = parseInt(parts[3])
    return { total, used, free }
  } catch {
    return null
  }
}

function getNetworkIPs() {
  const interfaces = os.networkInterfaces()
  const ips = []
  for (const [name, addrs] of Object.entries(interfaces)) {
    for (const addr of addrs) {
      if (!addr.internal) {
        ips.push(`${name}: ${addr.address} (${addr.family})`)
      }
    }
  }
  return ips
}

function getCpuModel() {
  const cpus = os.cpus()
  return cpus.length > 0 ? cpus[0].model.trim() : 'Unknown'
}

module.exports = {
  command: ['vps', 'spek', 'specs'],
  description: 'Lihat spesifikasi VPS/server',
  category: 'tools',
  ownerOnly: true,

  handler: async (sock, msg, { from }) => {
    const cpuModel = getCpuModel()
    const cpuCores = os.cpus().length
    const platform = os.platform()
    const arch = os.arch()
    const release = os.release()
    const hostname = os.hostname()

    const totalMem = os.totalmem()
    const freeMem = os.freemem()
    const usedMem = totalMem - freeMem

    const uptime = os.uptime()
    const days = Math.floor(uptime / 86400)
    const hours = Math.floor((uptime % 86400) / 3600)
    const minutes = Math.floor((uptime % 3600) / 60)
    const seconds = Math.floor(uptime % 60)

    const loadAvg = os.loadavg().map(v => v.toFixed(2)).join(', ')

    const disk = getDiskInfo()
    const diskText = disk
      ? `${formatBytes(disk.used)} / ${formatBytes(disk.total)} (Free: ${formatBytes(disk.free)})`
      : 'N/A'

    const ips = getNetworkIPs()
    const ipText = ips.length > 0 ? ips.join('\n│ ') : 'N/A'

    const memPercent = ((usedMem / totalMem) * 100).toFixed(1)
    const diskPercent = disk ? ((disk.used / disk.total) * 100).toFixed(1) : 'N/A'

    await sock.sendMessage(from, {
      text: `╭━━━━━━━━━━━━━━━━━━━╮
│   🖥️ *VPS Specifications*
╰━━━━━━━━━━━━━━━━━━━╯

┌─── 💻 *System*
│ 🏷️ *Hostname:* ${hostname}
│ 🖥️ *OS:* ${platform} ${release}
│ 🏗️ *Arch:* ${arch}
└───────────────────

┌─── ⚙️ *CPU*
│ 🔧 *Model:* ${cpuModel}
│ 🧵 *Cores:* ${cpuCores}
│ 📊 *Load Avg:* ${loadAvg}
└───────────────────

┌─── 💾 *RAM*
│ 📈 *Used:* ${formatBytes(usedMem)} / ${formatBytes(totalMem)}
│ 📉 *Free:* ${formatBytes(freeMem)}
│ 📊 *Usage:* ${memPercent}%
└───────────────────

┌─── 💿 *Disk (/)* 
│ ${diskText}
│ 📊 *Usage:* ${diskPercent}%
└───────────────────

┌─── 🌐 *Network IPs*
│ ${ipText}
└───────────────────

┌─── ⏱️ *Uptime*
│ ${days}d ${hours}h ${minutes}m ${seconds}s
└───────────────────`,
    }, { quoted: msg })
  },
}

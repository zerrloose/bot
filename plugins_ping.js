module.exports = {
  command: ['ping', 'speed'],
  description: 'Cek kecepatan respon bot',
  category: 'tools',
  ownerOnly: false,

  handler: async (sock, msg, { from }) => {
    const start = Date.now()
    const sentMsg = await sock.sendMessage(from, { text: '🏓 Mengukur...' }, { quoted: msg })
    const end = Date.now()

    const speed = end - start
    const uptime = process.uptime()
    const hours = Math.floor(uptime / 3600)
    const minutes = Math.floor((uptime % 3600) / 60)
    const seconds = Math.floor(uptime % 60)

    const memUsed = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)

    await sock.sendMessage(from, {
      text: `🏓 *Pong!*

⚡ *Speed:* ${speed}ms
⏱️ *Uptime:* ${hours}h ${minutes}m ${seconds}s
💾 *RAM Usage:* ${memUsed} MB`,
      edit: sentMsg.key,
    })
  },
}
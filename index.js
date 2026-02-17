const settings = require('./settings')
const startConnection = require('./lib/connection')

// ═══════════════════════════════════
//   CLEAR TERMINAL + ASCII ART
// ═══════════════════════════════════
console.clear()
console.log(settings.asciiArt)
console.log('\x1b[32m[SAWIT BOT]\x1b[0m Memulai koneksi...\n')

// Start bot
startConnection()
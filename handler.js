const fs = require('fs')
const path = require('path')
const settings = require('./settings')

// ═══════════════════════════════════
//   LOAD SEMUA PLUGINS (Case x Plugin)
// ═══════════════════════════════════
const plugins = {}
const pluginDir = path.join(__dirname, 'plugins')

function loadPlugins() {
  const files = fs.readdirSync(pluginDir).filter(f => f.endsWith('.js'))
  for (const file of files) {
    try {
      delete require.cache[require.resolve(`./plugins/${file}`)]
      const plugin = require(`./plugins/${file}`)
      if (plugin.command) {
        // Support array atau string command
        const cmds = Array.isArray(plugin.command) ? plugin.command : [plugin.command]
        for (const cmd of cmds) {
          plugins[cmd] = plugin
        }
      }
      console.log(`\x1b[32m[PLUGIN]\x1b[0m Loaded: ${file}`)
    } catch (err) {
      console.log(`\x1b[31m[PLUGIN ERROR]\x1b[0m ${file}: ${err.message}`)
    }
  }
}

loadPlugins()

// ═══════════════════════════════════
//   GET QUOTE OF THE DAY
// ═══════════════════════════════════
function getQuoteOfTheDay() {
  const today = new Date()
  const dayOfYear = Math.floor(
    (today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24)
  )
  const index = dayOfYear % settings.quotes.length
  return settings.quotes[index]
}

// ═══════════════════════════════════
//   GET GREETING
// ═══════════════════════════════════
function getGreeting() {
  const hour = new Date().getHours()
  if (hour >= 4 && hour < 10) return '🌅 Selamat Pagi'
  if (hour >= 10 && hour < 15) return '☀️ Selamat Siang'
  if (hour >= 15 && hour < 18) return '🌇 Selamat Sore'
  return '🌙 Selamat Malam'
}

// ═══════════════════════════════════
//   GENERATE MENU SECTIONS (Button List)
// ═══════════════════════════════════
function getMenuSections() {
  return [
    {
      title: '🛠️ Tools & Utilities',
      rows: [
        {
          title: `${settings.prefix}sticker`,
          description: 'Convert gambar/video jadi sticker',
        },
        {
          title: `${settings.prefix}toimg`,
          description: 'Convert sticker jadi gambar',
        },
        {
          title: `${settings.prefix}ping`,
          description: 'Cek kecepatan respon bot',
        },
        {
          title: `${settings.prefix}vps`,
          description: 'Lihat spesifikasi VPS/server (owner only)',
        },
      ],
    },
  ]
}

// ═══════════════════════════════════
//   MAIN HANDLER
// ═══════════════════════════════════
async function handler(sock, msg) {
  try {
    const from = msg.key.remoteJid
    const isGroup = from.endsWith('@g.us')

    // Extract message body
    const body =
      msg.message?.conversation ||
      msg.message?.extendedTextMessage?.text ||
      msg.message?.imageMessage?.caption ||
      msg.message?.videoMessage?.caption ||
      msg.message?.listResponseMessage?.singleSelectReply?.selectedRowId ||
      msg.message?.buttonsResponseMessage?.selectedButtonId ||
      msg.message?.interactiveResponseMessage?.nativeFlowResponseMessage?.paramsJson &&
        JSON.parse(msg.message.interactiveResponseMessage.nativeFlowResponseMessage.paramsJson)?.id ||
      ''

    if (!body) return

    const isCmd = body.startsWith(settings.prefix)
    const command = isCmd ? body.slice(settings.prefix.length).trim().split(' ')[0].toLowerCase() : ''
    const args = body.trim().split(' ').slice(1)
    const text = args.join(' ')

    // Push name
    const pushName = msg.pushName || 'User'

    // ═══════════════════════════════════
    //   MENU COMMAND (Full Button + Image)
    // ═══════════════════════════════════
    if (command === 'menu') {
      const now = new Date()
      const uptime = process.uptime()
      const hours = Math.floor(uptime / 3600)
      const minutes = Math.floor((uptime % 3600) / 60)
      const seconds = Math.floor(uptime % 60)

      const quoteToday = getQuoteOfTheDay()
      const greeting = getGreeting()

      const menuText = `${greeting}, ${pushName}! 👋

╭━━━━━━━━━━━━━━━━━━━╮
│     🌴 *${settings.botName}* 🌴
╰━━━━━━━━━━━━━━━━━━━╯

┌─── 📊 *Bot Info*
│ 🤖 *Bot:* ${settings.botName}
│ 👤 *Owner:* ${settings.ownerName}
│ 📡 *Status:* Online
│ ⏱️ *Uptime:* ${hours}h ${minutes}m ${seconds}s
│ 📅 *Date:* ${now.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
│ 🕐 *Time:* ${now.toLocaleTimeString('id-ID')}
│ 🔧 *Prefix:* [ ${settings.prefix} ]
│ 📦 *Plugins:* ${Object.keys(plugins).length} loaded
└───────────────────

┌─── 💬 *Quote of the Day*
│
│ _${quoteToday}_
│
└───────────────────

> Klik tombol *Menu* di bawah untuk lihat fitur! 👇`

      // ═══════════════════════════════════
      //   KIRIM DENGAN BUTTON (Interactive)
      // ═══════════════════════════════════
      const sections = getMenuSections()

      const listMessage = {
        image: { url: settings.menuImageUrl },
        caption: menuText,
        footer: `© ${now.getFullYear()} ${settings.botName} | Powered by Baileys`,
        buttons: [
          {
            buttonId: `${settings.prefix}listmenu`,
            buttonText: { displayText: '📋 Menu' },
            type: 1,
          },
        ],
        headerType: 4, // IMAGE header
        viewOnce: true,
      }

      await sock.sendMessage(from, listMessage, { quoted: msg })
      return
    }

    // ═══════════════════════════════════
    //   LIST MENU (dipanggil dari button)
    // ═══════════════════════════════════
    if (command === 'listmenu' || body === `${settings.prefix}listmenu`) {
      const sections = getMenuSections()

      const listMsg = {
        text: `📋 *Daftar Fitur ${settings.botName}*\n\nPilih fitur yang mau dipakai:`,
        footer: `© ${new Date().getFullYear()} ${settings.botName}`,
        title: `🌴 ${settings.botName} Menu`,
        buttonText: '📋 Lihat Fitur',
        sections,
      }

      await sock.sendMessage(from, listMsg, { quoted: msg })
      return
    }

    // ═══════════════════════════════════
    //   CASE x PLUGIN SYSTEM
    // ═══════════════════════════════════
    if (isCmd && plugins[command]) {
      const plugin = plugins[command]

      // Check permissions
      const senderNumber = msg.key.participant || msg.key.remoteJid
      const isOwner = senderNumber.includes(settings.ownerNumber)

      if (plugin.ownerOnly && !isOwner) {
        return sock.sendMessage(from, { text: '❌ Fitur ini hanya untuk owner!' }, { quoted: msg })
      }

      // Execute plugin
      await plugin.handler(sock, msg, {
        from,
        args,
        text,
        command,
        isGroup,
        isOwner,
        pushName,
        settings,
        plugins,
      })
      return
    }

    // Auto read
    if (settings.autoRead) {
      await sock.readMessages([msg.key])
    }
  } catch (err) {
    console.log('\x1b[31m[HANDLER ERROR]\x1b[0m', err.message)
  }
}

module.exports = handler
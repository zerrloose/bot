const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  makeCacheableSignalKeyStore,
  fetchLatestBaileysVersion,
} = require('@whiskeysockets/baileys')
const pino = require('pino')
const readline = require('readline')
const qrcode = require('qrcode-terminal')
const fs = require('fs')
const settings = require('../settings')
const handler = require('../handler')

async function startConnection() {
  const { state, saveCreds } = await useMultiFileAuthState(`./${settings.sessionName}`)
  const { version } = await fetchLatestBaileysVersion()

  const sock = makeWASocket({
    version,
    logger: pino({ level: 'silent' }),
    printQRInTerminal: !settings.usePairingCode,
    auth: {
      creds: state.creds,
      keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'silent' })),
    },
    browser: [settings.botName, 'Chrome', '120.0.0'],
    generateHighQualityLinkPreview: true,
  })

  // ═══════════════════════════════════
  //     PAIRING CODE (AUTO VERIF)
  // ═══════════════════════════════════
  if (settings.usePairingCode && !sock.authState.creds.registered) {
    // Bersihkan nomor dari + atau spasi
    let phoneNumber = settings.botNumber.replace(/[^0-9]/g, '')
    
    console.log('\x1b[33m[PAIRING]\x1b[0m Meminta pairing code untuk nomor:', phoneNumber)
    
    // Delay sedikit biar socket ready
    await new Promise(resolve => setTimeout(resolve, 3000))

    try {
      let code = await sock.requestPairingCode(phoneNumber)
      code = code?.match(/.{1,4}/g)?.join('-') || code
      console.log('\x1b[36m╔════════════════════════════════════╗')
      console.log('║                                    ║')
      console.log(`║   🔑 PAIRING CODE: \x1b[33m${code}\x1b[36m       ║`)
      console.log('║                                    ║')
      console.log('║   Masukkan code ini di WhatsApp:   ║')
      console.log('║   Settings > Linked Devices > Link ║')
      console.log('║                                    ║')
      console.log('╚════════════════════════════════════╝\x1b[0m')
    } catch (err) {
      console.log('\x1b[31m[ERROR]\x1b[0m Gagal mendapatkan pairing code:', err.message)
    }
  }

  // ═══════════════════════════════════
  //     QR CODE (if usePairingCode = false)
  // ═══════════════════════════════════
  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect, qr } = update

    if (qr && !settings.usePairingCode) {
      console.log('\x1b[36m[QR CODE]\x1b[0m Scan QR Code di bawah ini:\n')
      qrcode.generate(qr, { small: true })
    }

    if (connection === 'close') {
      const reason = lastDisconnect?.error?.output?.statusCode
      console.log('\x1b[31m[DISCONNECTED]\x1b[0m Reason:', reason)

      if (reason !== DisconnectReason.loggedOut) {
        console.log('\x1b[33m[RECONNECTING]\x1b[0m Mencoba reconnect...')
        startConnection()
      } else {
        console.log('\x1b[31m[LOGGED OUT]\x1b[0m Session dihapus, silakan login ulang.')
        fs.rmSync(`./${settings.sessionName}`, { recursive: true, force: true })
        startConnection()
      }
    }

    if (connection === 'open') {
      console.log('\x1b[32m╔════════════════════════════════════╗')
      console.log('║                                    ║')
      console.log('║   ✅ SAWIT BOT CONNECTED!          ║')
      console.log('║   Bot siap digunakan~              ║')
      console.log('║                                    ║')
      console.log('╚════════════════════════════════════╝\x1b[0m')
    }
  })

  // Save credentials
  sock.ev.on('creds.update', saveCreds)

  // Handle messages
  sock.ev.on('messages.upsert', async ({ messages, type }) => {
    if (type !== 'notify') return
    for (const msg of messages) {
      if (msg.key.fromMe && !settings.selfBot) continue
      await handler(sock, msg, settings)
    }
  })

  return sock
}

module.exports = startConnection
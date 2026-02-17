const sharp = require('sharp')
const { downloadMediaMessage } = require('@whiskeysockets/baileys')

module.exports = {
  command: ['toimg', 'toimage'],
  description: 'Convert sticker jadi gambar',
  category: 'tools',
  ownerOnly: false,

  handler: async (sock, msg, { from }) => {
    try {
      const quotedMsg = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage
      const isSticker = msg.message?.stickerMessage || quotedMsg?.stickerMessage

      if (!isSticker) {
        return sock.sendMessage(from, {
          text: '❌ Reply sticker dengan caption *.toimg*',
        }, { quoted: msg })
      }

      await sock.sendMessage(from, { react: { text: '⏳', key: msg.key } })

      const downloadMsg = quotedMsg ? { ...msg, message: quotedMsg } : msg
      const buffer = await downloadMediaMessage(downloadMsg, 'buffer', {})

      const pngBuffer = await sharp(buffer).png().toBuffer()

      await sock.sendMessage(from, {
        image: pngBuffer,
        caption: '✅ Sticker berhasil diconvert jadi gambar!',
      }, { quoted: msg })

      await sock.sendMessage(from, { react: { text: '✅', key: msg.key } })
    } catch (err) {
      console.log('[TOIMG ERROR]', err.message)
      await sock.sendMessage(from, { text: '❌ Gagal convert sticker!' }, { quoted: msg })
    }
  },
}

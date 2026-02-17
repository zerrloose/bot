const sharp = require('sharp')
const { downloadMediaMessage } = require('@whiskeysockets/baileys')
const fs = require('fs')
const path = require('path')
const ffmpeg = require('fluent-ffmpeg')
const ffmpegStatic = require('ffmpeg-static')

ffmpeg.setFfmpegPath(ffmpegStatic)

module.exports = {
  command: ['sticker', 's', 'stiker'],
  description: 'Convert gambar/video jadi sticker',
  category: 'tools',
  ownerOnly: false,

  handler: async (sock, msg, { from, settings }) => {
    try {
      const quotedMsg = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage
      const isImage = msg.message?.imageMessage || quotedMsg?.imageMessage
      const isVideo = msg.message?.videoMessage || quotedMsg?.videoMessage

      if (!isImage && !isVideo) {
        return sock.sendMessage(from, {
          text: '❌ Kirim/reply gambar atau video pendek dengan caption *.sticker*',
        }, { quoted: msg })
      }

      await sock.sendMessage(from, { react: { text: '⏳', key: msg.key } })

      // Download media
      const downloadMsg = quotedMsg ? { ...msg, message: quotedMsg } : msg
      const buffer = await downloadMediaMessage(downloadMsg, 'buffer', {})

      if (isImage) {
        // Convert image to webp sticker
        const webpBuffer = await sharp(buffer)
          .resize(512, 512, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
          .webp({ quality: 80 })
          .toBuffer()

        await sock.sendMessage(from, {
          sticker: webpBuffer,
          packname: settings.stickerPackName,
          author: settings.stickerAuthor,
        }, { quoted: msg })
      } else if (isVideo) {
        // Convert video to webp sticker using ffmpeg
        const tmpInput = path.join(__dirname, '..', `tmp_${Date.now()}.mp4`)
        const tmpOutput = path.join(__dirname, '..', `tmp_${Date.now()}.webp`)

        fs.writeFileSync(tmpInput, buffer)

        await new Promise((resolve, reject) => {
          ffmpeg(tmpInput)
            .addOutputOptions([
              '-vcodec', 'libwebp',
              '-vf', 'scale=512:512:force_original_aspect_ratio=decrease,fps=15,pad=512:512:-1:-1:color=white@0.0,split[a][b];[a]palettegen=reserve_transparent=on:transparency_color=ffffff[p];[b][p]paletteuse',
              '-loop', '0',
              '-ss', '00:00:00',
              '-t', '00:00:06',
              '-preset', 'default',
              '-an',
              '-vsync', '0',
            ])
            .toFormat('webp')
            .save(tmpOutput)
            .on('end', resolve)
            .on('error', reject)
        })

        const stickerBuffer = fs.readFileSync(tmpOutput)
        await sock.sendMessage(from, {
          sticker: stickerBuffer,
          packname: settings.stickerPackName,
          author: settings.stickerAuthor,
        }, { quoted: msg })

        // Cleanup
        fs.unlinkSync(tmpInput)
        fs.unlinkSync(tmpOutput)
      }

      await sock.sendMessage(from, { react: { text: '✅', key: msg.key } })
    } catch (err) {
      console.log('[STICKER ERROR]', err.message)
      await sock.sendMessage(from, { text: '❌ Gagal membuat sticker!' }, { quoted: msg })
    }
  },
}

module.exports = {
  // ═══════════════════════════════════
  //        OWNER SETTINGS
  // ═══════════════════════════════════
  ownerName: 'Zerrloose',
  ownerNumber: '6281234567890', // Ganti dengan nomor owner (format: 628xxx)
  
  // ═══════════════════════════════════
  //        BOT SETTINGS
  // ═══════════════════════════════════
  botName: 'Sawit Bot',
  botNumber: '6289876543210', // Nomor bot untuk auto verifikasi (format: 628xxx)
  prefix: '.', // Prefix command
  
  // ═══════════════════════════════════
  //     PAIRING / QR SETTINGS
  // ═══════════════════════════════════
  usePairingCode: true, // true = pakai pairing code, false = pakai QR
  // Kalo usePairingCode = true, nomor di botNumber akan otomatis dipakai
  // Jadi gausah ketik di terminal lagi, auto verif!
  
  // ═══════════════════════════════════
  //        SESSION SETTINGS
  // ═══════════════════════════════════
  sessionName: 'sawit-session',
  
  // ═══════════════════════════════════
  //        MESSAGE SETTINGS
  // ═══════════════════════════════════
  autoRead: true, // Auto read pesan
  selfBot: false, // true = cuma owner yg bisa pake
  publicMode: true, // true = semua orang bisa pake
  
  // ═══════════════════════════════════
  //        STICKER SETTINGS
  // ═══════════════════════════════════
  stickerPackName: 'Sawit Bot',
  stickerAuthor: 'Zerrloose',
  
  // ═══════════════════════════════════
  //        MENU IMAGE (URL)
  // ═══════════════════════════════════
  // Pake URL biar gak makan penyimpanan
  menuImageUrl: 'https://files.catbox.moe/xxxxxx.jpg', // Ganti dengan URL gambar menu lu
  
  // ═══════════════════════════════════
  //        QUOTES FOR TODAY
  // ═══════════════════════════════════
  // Quote ganti otomatis tiap hari berdasarkan tanggal
  quotes: [
    '"The only way to do great work is to love what you do." — Steve Jobs',
    '"Innovation distinguishes between a leader and a follower." — Steve Jobs',
    '"Life is what happens when you\'re busy making other plans." — John Lennon',
    '"The future belongs to those who believe in the beauty of their dreams." — Eleanor Roosevelt',
    '"It does not matter how slowly you go as long as you do not stop." — Confucius',
    '"Success is not final, failure is not fatal: it is the courage to continue that counts." — Winston Churchill',
    '"Believe you can and you\'re halfway there." — Theodore Roosevelt',
    '"The best time to plant a tree was 20 years ago. The second best time is now." — Chinese Proverb',
    '"Your time is limited, don\'t waste it living someone else\'s life." — Steve Jobs',
    '"Strive not to be a success, but rather to be of value." — Albert Einstein',
    '"In the middle of every difficulty lies opportunity." — Albert Einstein',
    '"What you get by achieving your goals is not as important as what you become." — Zig Ziglar',
    '"Everything you\'ve ever wanted is on the other side of fear." — George Addair',
    '"Don\'t watch the clock; do what it does. Keep going." — Sam Levenson',
    '"Act as if what you do makes a difference. It does." — William James',
    '"The secret of getting ahead is getting started." — Mark Twain',
    '"You miss 100% of the shots you don\'t take." — Wayne Gretzky',
    '"Opportunities don\'t happen. You create them." — Chris Grosser',
    '"I have not failed. I\'ve just found 10,000 ways that won\'t work." — Thomas Edison',
    '"A person who never made a mistake never tried anything new." — Albert Einstein',
    '"The only limit to our realization of tomorrow is our doubts of today." — Franklin D. Roosevelt',
    '"Do what you can, with what you have, where you are." — Theodore Roosevelt',
    '"Hard work beats talent when talent doesn\'t work hard." — Tim Notke',
    '"Dream big and dare to fail." — Norman Vaughan',
    '"It always seems impossible until it\'s done." — Nelson Mandela',
    '"Quality is not an act, it is a habit." — Aristotle',
    '"The mind is everything. What you think you become." — Buddha',
    '"An unexamined life is not worth living." — Socrates',
    '"Happiness is not something readymade. It comes from your own actions." — Dalai Lama',
    '"Turn your wounds into wisdom." — Oprah Winfrey',
    '"The only impossible journey is the one you never begin." — Tony Robbins',
  ],

  // ═══════════════════════════════════
  //        ASCII ART
  // ═══════════════════════════════════
  asciiArt: `
\x1b[36m
   ███████╗ █████╗ ██╗    ██╗██╗████████╗
   ██╔════╝██╔══██╗██║    ██║██║╚══██╔══╝
   ███████╗███████║██║ █╗ ██║██║   ██║   
   ╚════██║██╔══██║██║███╗██║██║   ██║   
   ███████║██║  ██║╚███╔███╔╝██║   ██║   
   ╚══════╝╚═╝  ╚═╝ ╚══╝╚══╝ ╚═╝   ╚═╝   
\x1b[33m        ⚡ SAWIT BOT ⚡
\x1b[37m   Powered by Baileys v6
\x1b[0m`,
}
const mongoose = require('mongoose');

const kullaniciSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  kullaniciAdi: { type: String, required: true },
  sifre: { type: String, required: true },
  ilkGiris: { type: Boolean, default: true },
  rol: { type: String, enum: ['admin', 'kullanici'], default: 'kullanici' } // 🆕 eklendi
});


module.exports = mongoose.model('Kullanici', kullaniciSchema);

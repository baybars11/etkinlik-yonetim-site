const mongoose = require('mongoose');

const etkinlikSchema = new mongoose.Schema({
  baslik: String,
  aciklama: String,
  tarih: Date,
  kategori: String,
  fiyat: Number,      
  resimYolu: String
});

module.exports = mongoose.model('Etkinlik', etkinlikSchema);

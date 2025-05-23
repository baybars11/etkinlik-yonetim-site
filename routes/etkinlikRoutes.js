const express = require('express');
const router = express.Router();
const Etkinlik = require('../models/Etkinlik');
const multer = require('multer');
const path = require('path');

// === RESİM YÜKLEME (multer) ===
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads'); // 📁 mutlaka bu klasörü oluştur
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });


// === ETKİNLİK EKLEME ===
router.post('/etkinlik-ekle', upload.single('resim'), async (req, res) => {
  const { baslik, aciklama, tarih, kategori, fiyat } = req.body;
  const resimYolu = req.file ? '/uploads/' + req.file.filename : null;

  try {
    await Etkinlik.create({
      baslik,
      aciklama,
      tarih,
      kategori,
      fiyat,
      resimYolu
    });

    res.redirect('/admin-panel.html');
  } catch (err) {
    console.error("Etkinlik eklenemedi:", err);
    res.status(500).send('Etkinlik eklenemedi');
  }
});



// === ETKİNLİKLERİ GETİR ===
router.get('/etkinlikler', async (req, res) => {
  try {
    const etkinlikler = await Etkinlik.find().sort({ tarih: 1 });
    res.json(etkinlikler);
  } catch (err) {
    res.status(500).send('Etkinlikler getirilemedi');
  }
});


// === ETKİNLİK SİL ===
router.post('/etkinlik-sil', async (req, res) => {
  const { id } = req.body;

  try {
    await Etkinlik.findByIdAndDelete(id);
    res.redirect('/admin-panel.html');
  } catch (err) {
    console.error("Etkinlik silinemedi:", err);
    res.status(500).send('Etkinlik silinemedi');
  }
});

router.get('/toplu-etkinlik-ekle', async (req, res) => {
  try {
    const etkinlikler = [
      {
        baslik: "Tiyatro Gösterisi",
        aciklama: "Dram türünde özel bir oyun.",
        tarih: "2025-06-01",
        kategori: "tiyatro",
        fiyat: 100,
        resimYolu: "/uploads/tiyatro.jpg"
      },
      {
        baslik: "Konser Gecesi",
        aciklama: "Rock grubu sahnede!",
        tarih: "2025-06-15",
        kategori: "konser",
        fiyat: 150,
        resimYolu: "/uploads/konser.jpg"
      },
      {
        baslik: "Resim Sergisi",
        aciklama: "Ünlü ressamların eserleri sergilenecek.",
        tarih: "2025-07-01",
        kategori: "sergi",
        fiyat: 70,
        resimYolu: "/uploads/sergi.jpg"
      },
      {
        baslik: "Film Gösterimi",
        aciklama: "Bağımsız yapım kısa filmler gösterimi.",
        tarih: "2025-07-10",
        kategori: "film",
        fiyat: 90,
        resimYolu: "/uploads/film.jpg"
      },
      {
        baslik: "Spor Turnuvası",
        aciklama: "Futbol ve basketbol branşlarında yarışma.",
        tarih: "2025-08-01",
        kategori: "spor",
        fiyat: 120,
        resimYolu: "/uploads/spor.jpg"
      }
    ];

    await Etkinlik.insertMany(etkinlikler);
    res.send("✅ 5 etkinlik başarıyla fiyat ve kategoriyle eklendi!");
  } catch (err) {
    res.status(500).send("❌ Hata: " + err.message);
  }
});

router.post('/etkinlik-guncelle', async (req, res) => {
  const { id, baslik, aciklama, tarih, kategori, fiyat } = req.body;

  try {
    await Etkinlik.findByIdAndUpdate(id, {
      baslik,
      aciklama,
      tarih,
      kategori,
      fiyat
    });
    res.redirect('/admin-panel.html');
  } catch (err) {
    console.error("Etkinlik güncellenemedi:", err);
    res.status(500).send("Güncelleme sırasında hata oluştu.");
  }
});





module.exports = router;

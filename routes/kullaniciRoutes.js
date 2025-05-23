const express = require('express');
const router = express.Router();
const Kullanici = require('../models/Kullanici');


router.post('/giris', async (req, res) => {
  const email = req.body.email?.trim();
  const kullaniciAdi = req.body.kullaniciAdi?.trim();
  const sifre = req.body.sifre?.trim();

  console.log("GELEN VERİLER:", { email, kullaniciAdi, sifre });

  try {
    // 1. Kullanıcı var mı kontrol et
    let kullanici = await Kullanici.findOne({ email, kullaniciAdi });

    if (!kullanici) {
      // ❌ Kullanıcı yoksa → yeni kullanıcı oluştur
      kullanici = await Kullanici.create({
        email,
        kullaniciAdi,
        sifre,
        ilkGiris: true,
        rol: 'kullanici' // varsayılan rol
      });

      console.log("🆕 Yeni kullanıcı oluşturuldu:", kullanici);
    } else if (kullanici.sifre !== sifre) {
      // 🔒 Şifre eşleşmiyorsa hata
      console.log("❌ Şifre hatalı");
      return res.status(401).send("Hatalı şifre");
    }

    // 2. Oturum başlat
    req.session.kullaniciId = kullanici._id;

    // 3. Yönlendirme
    if (kullanici.ilkGiris) {
      return res.redirect('/sifre-degistir.html');
    }

    if (kullanici.rol === 'admin') {
      return res.redirect('/admin-panel.html');
    }

    res.redirect('/etkinlik.html');
  } catch (error) {
    console.error("🚨 Sunucu hatası:", error);
    res.status(500).send('Sunucu hatası');
  }
});


router.post("/sifre-degistir", async (req, res) => {
  const { yeniSifre } = req.body;
  const kullaniciId = req.session.kullaniciId;

  if (!kullaniciId) {
    return res.status(401).send("Yetkisiz erişim");
  }

  try {
    await Kullanici.findByIdAndUpdate(kullaniciId, {
      sifre: yeniSifre,
      ilkGiris: false
    });

    res.redirect("/etkinlik.html");
  } catch (err) {
    console.error(err);
    res.status(500).send("Bir hata oluştu");
  }
});


function sadeceAdmin(req, res, next) {
  if (!req.session.kullaniciId) return res.status(401).send("Giriş yapmalısınız");

  Kullanici.findById(req.session.kullaniciId).then(kullanici => {
    if (kullanici && kullanici.rol === "admin") {
      next();
    } else {
      res.status(403).send("Bu sayfaya erişim yetkiniz yok");
    }
  }).catch(err => {
    res.status(500).send("Sunucu hatası");
  });
}


module.exports = router;

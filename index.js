const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const kullaniciRoutes = require('./routes/kullaniciRoutes');
const etkinlikRoutes = require('./routes/etkinlikRoutes'); // bu da üstte olacak

const app = express(); // ✅ Bu mutlaka en üstte tanımlanmalı

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use(session({
  secret: 'gizli_kelime',
  resave: false,
  saveUninitialized: true
}));

mongoose.connect('mongodb://localhost:27017/veritabani');

// Routes
app.use('/', kullaniciRoutes);
app.use('/', etkinlikRoutes); // ✅ artık doğru yerde

app.listen(3000, () => {
  console.log('Sunucu 3000 portunda çalışıyor');
});

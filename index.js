const express = require('express');
const bodyParser = require('body-parser');
const TelegramBot = require('node-telegram-bot-api');
const mysql = require('mysql2');
const fs = require('fs');

const token = '7671033714:AAGezlzZD2uIU4Tm-xZwbuizQZahMyOVbUc';  // توکن ربات
const url = 'https://telegram-bot-2-w75g.onrender.com';       // آدرس دامنه‌ی رندر (بعداً جایگزین کن)

const bot = new TelegramBot(token, { webHook: { port: 3000 } });
bot.setWebHook(`${url}/bot${token}`);  // تنظیم Webhook

// اتصال به دیتابیس Aiven
const connection = mysql.createConnection({
  host: 'mysql-27ee023f-nevermind1381-fe86.h.aivencloud.com',
  port: 21660,
  user: 'avnadmin',
  password: 'AVNS_WFpqO-p05fQlaS70UL-',
  database: 'defaultdb',
  ssl: {
    ca: fs.readFileSync('./ca.pem')
  }
});

const app = express();
app.use(bodyParser.json());

// روت وب‌هوک تلگرام
app.post(`/bot${token}`, (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

// هندلر /start
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;

  bot.sendMessage(chatId, 'سلام 👋\nبرای مشاهده لیست کالاها دکمه زیر را بزنید:', {
    reply_markup: {
      keyboard: [['📋 منو']],
      resize_keyboard: true,
      one_time_keyboard: true
    }
  });
});

// هندلر منو
bot.onText(/منو|menu/i, (msg) => {
  const chatId = msg.chat.id;

  connection.query('SELECT * FROM products', (err, results) => {
    if (err) {
      console.error('❌ خطا در اجرای کوئری:', err.message);
      bot.sendMessage(chatId, 'خطایی در دریافت لیست کالاها رخ داد.');
      return;
    }

    if (results.length === 0) {
      bot.sendMessage(chatId, 'کالایی برای نمایش وجود ندارد.');
      return;
    }

    let message = '📋 *منو:*\n\n';
    results.forEach((product, i) => {
      message += `${i + 1}. ${product.name} - ${product.price} تومان\n`;
    });

    bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
  });
});


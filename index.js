const express = require('express');
const bodyParser = require('body-parser');
const TelegramBot = require('node-telegram-bot-api');
const mysql = require('mysql2');
const fs = require('fs');

const token = '7671033714:AAGezlzZD2uIU4Tm-xZwbuizQZahMyOVbUc';  // توکن ربات
const url = 'https://telehook.onrender.com';       // آدرس دامنه‌ی رندر (بعداً جایگزین کن)

const bot = new TelegramBot(token, { webHook: { port: 3000 } });
bot.setWebHook(`${url}/bot${token}`);  // تنظیم Webhook

const app = express();
app.use(bodyParser.json());

// روت وب‌هوک تلگرام
app.post(`/bot${token}`, (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

// بخش‌های قبلی همانند قبل باقی می‌ماند...

// هندلر /start
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;

  bot.sendMessage(chatId, 'سلام 👋\nخوش اومدی به ربات فروشگاه ما!\nبرای مشاهده لیست کالاها دکمه‌ی زیر رو بزن یا از دستور /menu استفاده کن:', {
    reply_markup: {
      keyboard: [['📋 منو'], ['ℹ️ راهنما']],
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

    let message = '📋 *منوی کالاها:*\n\n';
    results.forEach((product, i) => {
      message += `${i + 1}. ${product.name} - ${product.price} تومان\n`;
    });

    bot.sendMessage(chatId, message, { parse_mode: 'Markdown' }).then(() => {
      bot.sendMessage(chatId, 'اگه سوالی داشتی، کافیه بنویسی یا از /help استفاده کنی.');
    });
  });
});

// هندلر راهنما
bot.onText(/\/help|راهنما|ℹ️/i, (msg) => {
  const chatId = msg.chat.id;
  const helpText = `📘 راهنما:\n
🔹 /start - شروع و خوش‌آمدگویی  
🔹 /menu - نمایش منوی کالاها  
🔹 سوال داری؟ فقط بنویس 😊`;

  bot.sendMessage(chatId, helpText);
});

// پاسخ به پیام‌های رایج کاربر
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text.toLowerCase();

  if (text.includes('سلام')) {
    bot.sendMessage(chatId, 'سلام به روی ماهت! 🌞');
  } else if (text.includes('ممنون') || text.includes('مرسی')) {
    bot.sendMessage(chatId, 'قابلی نداشت 😊 هر زمان خواستی در خدمتتم.');
  } else if (text.includes('کمک')) {
    bot.sendMessage(chatId, 'برای کمک می‌تونی از دستور /help استفاده کنی یا سوالتو مستقیم بپرسی.');
  }
});

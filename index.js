const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

// توکن ربات شما
const TOKEN = "7671033714:AAGezlzZD2uIU4Tm-xZwbuizQZahMyOVbUc";
const TELEGRAM_API = https://api.telegram.org/bot${TOKEN};
const WEBHOOK_PATH = /webhook/${TOKEN};
const PORT = process.env.PORT || 3000;

app.post(WEBHOOK_PATH, async (req, res) => {
  const message = req.body.message;
  if (message && message.text) {
    const chatId = message.chat.id;
    const text = message.text;

    // ارسال پاسخ
    await axios.post(${TELEGRAM_API}/sendMessage, {
      chat_id: chatId,
      text: شما گفتید: ${text}
    });
  }
  res.sendStatus(200);
});

app.get("/", (req, res) => {
  res.send("ربات تلگرام فعال است!");
});

app.listen(PORT, () => {
  console.log(Server is running on port ${PORT});
});

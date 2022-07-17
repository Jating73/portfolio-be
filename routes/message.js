const express = require('express');
const router = express.Router();

router.post('/send_text_message', (req, res) => {
    res.send("Text Message Send");
});

router.post('/send_email_message', (req, res) => {
    res.send("Email Message Send");
});

router.post('/send_whatsapp_message', (req, res) => {
    res.send("Whatsapp Message Send");
});

module.exports = router;
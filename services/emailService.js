const nodemailer = require('nodemailer');

// Transporter létrehozása (itt most Gmail példa, de cseréld ki a sajátodra)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER || 'ernokerekes24@gmail.com',
        pass: process.env.EMAIL_PASS || 'valprfkyccnegvzz'
    }
});

async function sendOrderConfirmationEmail(toEmail, username, orderDetails) {
    // Ellenőrző logok
    console.log('Email küldés paraméterei:');
    console.log('toEmail:', toEmail);
    console.log('username:', username);
    console.log('orderDetails:', orderDetails);

    // Biztonsági ellenőrzés
    if (!toEmail || !username) {
        throw new Error('Hiányzó címzett vagy felhasználónév');
    }

    const mailOptions = {
        from: '"Core Build" <ernokerekes24@gmail.com>',
        to: toEmail,
        subject: 'Rendelés visszaigazolása',
        text: `Kedves ${username}!\n\nRendelésed sikeresen rögzítettük.\n` +
              `Rendelési azonosító: ${orderDetails.order_id || 'N/A'}\n` +
              `Termék azonosító: ${orderDetails.product_id || 'N/A'}\n` +
              `Mennyiség: ${orderDetails.quantity || 'N/A'}\n` +
              `Fizetési mód: ${orderDetails.fizetesi_mod || 'N/A'}\n\n` +
              `Köszönjük a vásárlást!\nCore Build csapata`,
        html: `<p>Kedves ${username}!</p>` +
              `<p>Rendelésed sikeresen rögzítettük.</p>` +
              `<ul>` +
              `<li><strong>Rendelési azonosító:</strong> ${orderDetails.order_id || 'N/A'}</li>` +
              `<li><strong>Termék azonosító:</strong> ${orderDetails.product_id || 'N/A'}</li>` +
              `<li><strong>Mennyiség:</strong> ${orderDetails.quantity || 'N/A'}</li>` +
              `<li><strong>Fizetési mód:</strong> ${orderDetails.fizetesi_mod || 'N/A'}</li>` +
              `</ul>` +
              `<p>Köszönjük a vásárlást!</p>` +
              `<p>Core Build csapata</p>`
    };

    console.log('mailOptions:', mailOptions);

    const info = await transporter.sendMail(mailOptions);
    console.log('Email elküldve:', info.messageId);
    return info;
}

module.exports = { sendOrderConfirmationEmail };
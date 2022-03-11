const Razorpay = require('razorpay');

const razorpayInstance = new Razorpay({
    key_id: process.env.PAYKEYID,
    key_secret: process.env.PAYKEYSEC
});

exports.razorpayInstance = razorpayInstance;
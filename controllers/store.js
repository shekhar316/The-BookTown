const db = require("../utils/db")
const fs = require('fs')
const mail = require("../utils/mail")
const ejs = require("ejs")
const res = require("express");
const Razorpay = require('razorpay');
const { v4: uuidv4 } = require('uuid');

const razorpayInstance = new Razorpay({
    key_id: process.env.PAYKEYID,
    key_secret: process.env.PAYKEYSEC
});

exports.viewPbooks = (req, res) => {
    const sql = `select * from pebooks`
    db.con.query(sql, function (err, result) {
        if (err) {
            console.log(err);
        } else {
            res.render("pebooks", { ebookData: result})
        }
    });
}

exports.viewPbookbyid = (req, res) => {
    var id = req.params.id
    var sql = `select * from pebooks where pebookID = ${id}`;
    db.con.query(sql, function (err, result) {
        if (err) {
            console.log(err);
        }else {
            res.render("viewPbookById", { Data: result});
        }
    });
}

exports.buy = (req, res) => {
    var id = req.params.id;
    var sql = `select * from pebooks where pebookID = ${id}`;
    db.con.query(sql, function (err, result) {
        if (err) {
            console.log(err);
        }else {
            var amount = Math.round(result[0].Price) * 100;
            var currency = "INR"
            var receipt = req.session.userid + "_" + result[0].pebookID + "_" + uuidv4();
            var notes = {
                "pbookid" : id,
                "userid" : req.session.userid,
            }
            razorpayInstance.orders.create({amount, currency, receipt, notes},
                (err, order)=>{
                    if(err){
                        console.log(err);
                    }
                    else{
                        res.render("test.ejs", {
                            order: order
                        })
                    }
                }
            )
        }
    });

}


exports.save = (req, res) => {
    const id = req.params.id;
    var price = req.params.amount;
    price = price/100;
    const receipt = req.params.receipt;
    const userid = req.session.userid;
    const {razorpay_order_id, razorpay_payment_id, razorpay_signature} = req.body;
    var sql = `INSERT into payments values ('${razorpay_order_id}', '${razorpay_payment_id}','${id}', '${userid}', '${price}', '${receipt}', '${razorpay_signature}', NOW())`;
    db.con.query(sql, function (err, result) {
        if (err) {
            console.log(err);
        }else {
            res.redirect("/store/sendbook/" + id);
        }
    });
}


exports.sendbook = (req, res) => {
    var id = req.params.id;
    var sql = `select * from pebooks where pebookID = ${id}`;
    db.con.query(sql, function (err, result) {
        if (err) {
            console.log(err);
        }else {
            var ident = result[0].identifier;
            var text = "Please find the attached paid ebook you have ordered from our website.";
            ejs.renderFile(process.env.DIRNAME + "/views/email.ejs", {msg: text}, function (err, data){
                if(err){
                    console.log(err)
                }else{
                    const mailOptions = {
                        from: mail.fromEmail,
                        to: req.session.email,
                        subject: 'Order Successful',
                        html: data,
                        attachments: [{
                            path: process.env.DIRNAME + '/Files/store/' + ident + '.pdf'
                        }]
                    };
                    mail.sendMail(mailOptions)
                    res.render("index", {
                        alert: "yes",
                        title: "Ordered",
                        text: "Your book will be sent to your registered email shortly.",
                        icon: "success"})
                }
            })
        }
    });

}
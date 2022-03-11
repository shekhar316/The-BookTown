const db = require("../utils/db")
const fs = require('fs')
const mail = require("../utils/mail")
const ejs = require("ejs")
const res = require("express");
const fileupload = require('express-fileupload');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require("bcrypt");

exports.profile = (req, res)=>{
    const id = req.session.userid;
    const sql = `select * from users where id = '${id}'`;
    db.con.query(sql, function (err, userData){
        if(err) {
            console.log(err);
        }else{
            let date = new Date(userData[0].dob);
            userData[0].dob = date.toDateString();
            const userD = userData[0];
            res.render("profile", { user: userD})
        }
    });
}

exports.view = (req, res) => {
    const id = req.session.userid;
    const sql = `select * from transactions where userid = '${id}'`;
    db.con.query(sql, function (err, result) {
        if (err) {
            console.log(err);
        } else {
            const final = result;
            final.forEach(function myFunction(i) {
                if(i.issueTill){
                    var date = new Date(i.issueTill);
                    i.issueTill = date.toDateString();
                }else{
                    i.issueTill = "On Hold"
                }
                if(i.issueDate){
                    date = new Date(i.issueDate);
                    i.issueDate = date.toDateString();
                }
                if(i.returnDate){
                    date = new Date(i.returnDate);
                    i.returnDate = date.toDateString();
                }
            })
            res.render("userDash", { bookData: final})
        }
    });
}



exports.hold = (req, res) => {
    const bookid = req.params.bookid;
    const userid = req.session.userid;
    var sql = `INSERT INTO transactions (bookid, userid, issueDate, status) VALUES ('${bookid}', '${userid}', NOW(), 'H')`;
    db.con.query(sql, function (err, result) {
        if(err){
            console.log(err);
            res.render("index", {
                alert: "yes",
                title: "Sorry..",
                text: "Something went wrong.",
                icon: "error",})
        }else {
            decreaseBookcount(bookid);
            console.log("1 record inserted");
            res.render("index", {
                alert: "yes",
                title: "Book on Hold.",
                text: "Please collect your book from library within next 24 hours..",
                icon: "success"})
        }

    });
}

function decreaseBookcount(bookid){
    var sql = `UPDATE books SET Available=Available-1 WHERE bookID = '${bookid}'`;
    db.con.query(sql, function (err, result) {
        if(err){
            console.log(err);
        }
    });
}


exports.update = (req, res) => {
    const {address, city, state, pin, email} = req.body;
    // console.log(email);
    // console.log(pin);
    var sql = `UPDATE users SET address = '${address}', state = '${state}', pin = '${pin}', city = '${city}' where email = '${email}'`;
    db.con.query(sql, function (err, result) {
        if(err){
            console.log(err);
            res.render("index", {
                alert: "yes",
                title: "Sorry..",
                text: "Something went wrong.",
                icon: "error",})
        }else {
            console.log("1 record updated.");
            res.render("index", {
                alert: "yes",
                title: "Profile Updated.",
                text: "Your address is updated successfully.",
                icon: "success"})
        }

    });
}

exports.order = (req, res) => {
    const id = req.session.userid;
    const sql = `select * from payments where userid = '${id}'`;
    db.con.query(sql, function (err, result) {
        if (err) {
            console.log(err);
        } else {
            const final = result;
            final.forEach(function myFunction(i) {
                if(i.date){
                    var date = new Date(i.date);
                    i.date = date.toDateString();
                }
            })
            res.render("userOrder", { bookData: final})
        }
    });
}
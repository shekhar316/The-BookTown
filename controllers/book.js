const db = require("../utils/db")
const fs = require('fs')
const mail = require("../utils/mail")
const ejs = require("ejs")
const res = require("express");
const fileupload = require('express-fileupload');
const { v4: uuidv4 } = require('uuid');

exports.viewbooks = (req, res) => {
    const sql = `select * from books`;
    db.con.query(sql, function (err, result) {
        if (err) {
            console.log(err);
        } else {
            res.render("viewbooks", { bookData: result})
        }
    });
}

exports.viewbookbyid = (req, res) => {
    var id = req.params.id
    var sql = `select * from books where bookID = ${id}`;
    db.con.query(sql, function (err, result) {
        if (err) {
            console.log(err);
        }else {
            res.render("viewBookById", { Data: result});
        }
    });
}
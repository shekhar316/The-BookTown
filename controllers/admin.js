const db = require("../utils/db")
const fs = require('fs')
const mail = require("../utils/mail")
const ejs = require("ejs")
const res = require("express");
const fileupload = require('express-fileupload');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require("bcrypt");

exports.addbookget = (req, res) => {
    res.render("addbook");
}

exports.addStore = (req, res) => {
    res.render("addStoreBook");
}

exports.addbook = (req, res) => {
    const { title, author, isbn, publisher, year, edition, issue, read } = req.body;
    var uid = uuidv4();
    var imgurl = "";

    if (req.files) {
        var file = req.files.bookImage
        // var filename = file.name;
        // var fileExt = filename.substring(filename.lastIndexOf(".") + 1, filename.length);
        imgurl = uid + '.jpg';
        file.mv('AppData/bookImg/' + imgurl, function (err) {
            if (err) {
                console.log(err);
            } else {
                console.log("Image uploaded.");
            }
        })
    } else {
        console.log("No Files found.")
    }

    var sql = `INSERT INTO books (identifier, Title, Author, ISBN, Publisher, PublicationYear, Edition, Total, TotalRead, Available) VALUES ('${uid}', '${title}', '${author}', '${isbn}', '${publisher}', '${year}', '${edition}', '${issue}', '${read}', '${issue}')`;
    db.con.query(sql, function (err, result) {
        if (err) {
            try {
                // removing the uploaded image
                fs.unlinkSync('AppData/bookImg/' + uid + '.jpg')
            } catch(err) {
                console.error(err)
            }
            res.render("index", {
                alert: "yes",
                title: "Sorry",
                text: "Something went wrong.",
                icon: "error"})
            console.log(err);
        } else {
            res.render("index", {
                alert: "yes",
                title: "Success",
                text: "Book is added successfully.",
                icon: "success"})
            console.log("Record Inserted.")
        }
    });
};

exports.issuebook = (req, res) => {
    var bookId = req.params.bookid;
    res.render("findUser", {bookId: bookId});
}

exports.findUser = (req, res) => {
    const{email, bookId} = req.body;
    var sql = `SELECT * from users WHERE email = '${email}'`;
    db.con.query(sql, async function (err, result) {
        if (err) {
            console.log(err);
            res.render("index", {
                alert: "yes",
                title: "Sorry",
                text: "Something went wrong.",
                icon: "error",
            })
        }
        if(result.length > 0){
            var sql = `select * from books where bookID = ${bookId}`;
            db.con.query(sql, function (err, result2) {
                if (err) {
                    console.log(err);
                    res.render("index", {
                        alert: "yes",
                        title: "Sorry",
                        text: "Something went wrong.",
                        icon: "error",
                    })
                }else {
                    if(result2[0].Available > 0){
                        res.render("issue", {userData: result, bookData: result2})
                    }else{
                        res.render("index", {
                            alert: "yes",
                            title: "Sorry",
                            text: "This book is not available.",
                            icon: "error",
                        })
                    }
                }
            });
        }else{
            res.render("index", {
                alert: "yes",
                title: "No User",
                text: "Please check user's email.",
                icon: "error",
            })
        }

    });
}

exports.issue = (req, res) => {
    const {bookid, userid, rdate} = req.body;
    var sql = `INSERT INTO transactions (bookid, userid, issueDate, issueTill, status) VALUES ('${bookid}', '${userid}', NOW(), '${rdate}', 'I')`;
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
                title: "Book Issued.",
                text: "Book is issue successfully.",
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

function incBookcount(bookid){
    var sql = `UPDATE books SET Available=Available+1 WHERE bookID = '${bookid}'`;
    db.con.query(sql, function (err, result) {
        if(err){
            console.log(err);
        }
    });
}


exports.store = (req, res) => {
    const sql = `select * from pebooks`
    db.con.query(sql, function (err, result) {
        if (err) {
            console.log(err);
        } else {
            res.render("adminStoreManage", { ebookData: result})
        }
    });
}


exports.deleteFromStore = (req, res) => {
    const sql = `delete from pebooks where pebookID = '${req.params.id}'`
    db.con.query(sql, function (err, result) {
        if (err) {
            console.log(err);
        } else {
            res.render("index", {
                alert: "yes",
                title: "Done.",
                text: "Book deleted from store.",
                icon: "success"})
        }
    });
}


exports.addStoreBook = (req, res) => {
    const { title, author, isbn, price, publisher, year, edition } = req.body;
    var uid = uuidv4();
    var imgurl = "";
    var fileurl = ""
    if (req.files) {
        var file1 = req.files.bookImage
        var file2 = req.files.book
        // var filename = file.name;
        // var fileExt = filename.substring(filename.lastIndexOf(".") + 1, filename.length);
        imgurl = uid + '.jpg';
        fileurl = uid + '.pdf';
        file1.mv('AppData/ebookstore/' + imgurl, function (err) {
            if (err) {
                console.log(err);
            } else {
                console.log("Image uploaded.");
            }
        })
        file2.mv('Files/store/' + fileurl, function (err) {
            if (err) {
                console.log(err);
            } else {
                console.log("File uploaded.");
            }
        })
    } else {
        console.log("No Files found.")
    }

    var sql = `INSERT INTO pebooks (identifier, Title, Author, ISBN, Price, Publisher, PublicationYear, Edition) VALUES ('${uid}', '${title}', '${author}', '${isbn}', '${price}', '${publisher}', '${year}', '${edition}')`;
    db.con.query(sql, function (err, result) {
        if (err) {
            try {
                // removing the uploaded image
                fs.unlinkSync('AppData/bookImg/' + uid + '.jpg')
                fs.unlinkSync('Files/store/' + uid + '.pdf')
            } catch(err) {
                console.error(err)
            }
            res.render("index", {
                alert: "yes",
                title: "Sorry",
                text: "Something went wrong.",
                icon: "error"})
            console.log(err);
        } else {
            res.render("index", {
                alert: "yes",
                title: "Success",
                text: "Book is added to store successfully.",
                icon: "success"})
            console.log("Record Inserted.")
        }
    });
};


exports.updatePrice = (req, res) => {
    res.render("updateStoreBook", {eid : req.params.id, oldp : req.params.old});
}



exports.updatePricePost = (req, res) => {
    var sql = `UPDATE pebooks SET Price='${req.body.new}' WHERE pebookID = '${req.body.id}'`;
    db.con.query(sql, function (err, result) {
        if(err){
            console.log(err);
        }else{
            res.render("index", {
                alert: "yes",
                title: "Success",
                text: "Book is updated successfully.",
                icon: "success"})
            console.log("Record Updated.")
        }
    });
}

exports.fzone = (req, res) => {
    const sql = `select * from ebooks`;
    db.con.query(sql, function (err, result) {
        if (err) {
            console.log(err);
        } else {
            res.render("adminEbookManage", { ebookData: result})
        }
    });
}

exports.deleteFromFzone = (req, res) => {
    const sql = `delete from ebooks where ebookID = '${req.params.id}'`
    db.con.query(sql, function (err, result) {
        if (err) {
            console.log(err);
        } else {
            res.render("index", {
                alert: "yes",
                title: "Done.",
                text: "Book deleted from store.",
                icon: "success"})
        }
    });
}


exports.deletefromlib = (req, res) => {
    const sql = `delete from books where bookID = '${req.params.id}'`
    db.con.query(sql, function (err, result) {
        if (err) {
            console.log(err);
        } else {
            res.render("index", {
                alert: "yes",
                title: "Done.",
                text: "Book deleted from library.",
                icon: "success"})
        }
    });
}

exports.addfzone = (req, res) => {
    res.render("addfZoneBook");
}

exports.addZoneBook = (req, res) => {
    const { title, author, isbn, publisher, year, edition } = req.body;
    var uid = uuidv4();
    var imgurl = "";
    var fileurl = ""
    if (req.files) {
        var file1 = req.files.bookImage
        var file2 = req.files.book
        // var filename = file.name;
        // var fileExt = filename.substring(filename.lastIndexOf(".") + 1, filename.length);
        imgurl = uid + '.jpg';
        fileurl = uid + '.pdf';
        file1.mv('AppData/ebookImg/' + imgurl, function (err) {
            if (err) {
                console.log(err);
            } else {
                console.log("Image uploaded.");
            }
        })
        file2.mv('Files/ebooks/' + fileurl, function (err) {
            if (err) {
                console.log(err);
            } else {
                console.log("File uploaded.");
            }
        })
    } else {
        console.log("No Files found.")
    }

    var sql = `INSERT INTO ebooks (identifier, Title, Author, ISBN, Publisher, PublicationYear, Edition) VALUES ('${uid}', '${title}', '${author}', '${isbn}', '${publisher}', '${year}', '${edition}')`;
    db.con.query(sql, function (err, result) {
        if (err) {
            try {
                // removing the uploaded image
                fs.unlinkSync('AppData/ebookImg/' + uid + '.jpg')
                fs.unlinkSync('Files/ebooks/' + uid + '.pdf')
            } catch(err) {
                console.error(err)
            }
            res.render("index", {
                alert: "yes",
                title: "Sorry",
                text: "Something went wrong.",
                icon: "error"})
            console.log(err);
        } else {
            res.render("index", {
                alert: "yes",
                title: "Success",
                text: "Book is added to free zone successfully.",
                icon: "success"})
            console.log("Record Inserted.")
        }
    });
}

exports.updateQuantity = (req, res) => {
    const ti = req.params.ti;
    const tr = req.params.tr;
    const avl = req.params.avl;
    const id = req.params.id;
    res.render("update", {ti: ti, tr: tr, avl: avl, id: id});
}

exports.updateQuantityPost = (req, res) => {
    var sql = `UPDATE books SET Total='${req.body.ti}', TotalRead='${req.body.tr}', Available='${req.body.avl}' WHERE bookID = '${req.body.id}'`;
    db.con.query(sql, function (err, result) {
        if(err){
            console.log(err);
        }else{
            res.render("index", {
                alert: "yes",
                title: "Success",
                text: "Book is updated successfully.",
                icon: "success"})
            console.log("Record Updated.")
        }
    });
}

exports.transaction = (req, res) => {
    const sql = `select * from transactions`;
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
            res.render("transactions", { bookData: final})
        }
    });
}

exports.transactionUpdate = (req, res) => {
    const sql = `select * from transactions where id = '${req.params.id}'`;
    db.con.query(sql, function (err, result) {
        if (err) {
            console.log(err);
        } else {
            res.render("transactionsUpdate", { bookData: result})
        }
    });
}

exports.transactionUpdatePost = (req, res) => {
    if(req.body.it){
        var status = 'I';
        var it = req.body.it;
        var sql = `UPDATE transactions SET issueTill='${it}', status='${status}' WHERE id = '${req.body.id}'`;
        db.con.query(sql, function (err, result) {
            if(err){
                console.log(err);
            }else{
                decreaseBookcount(req.body.id);
                res.render("index", {
                    alert: "yes",
                    title: "Success",
                    text: "Transaction is updated successfully.",
                    icon: "success"})
                console.log("Record Updated.")
            }
        });
    }else{
        var status = 'R';
        var rd = req.body.rd;
        var sql = `UPDATE transactions SET returnDate='${rd}', status='${status}' WHERE id = '${req.body.id}'`;
        db.con.query(sql, function (err, result) {
            if(err){
                console.log(err);
            }else{
                incBookcount(req.body.id)
                res.render("index", {
                    alert: "yes",
                    title: "Success",
                    text: "Transaction is updated successfully.",
                    icon: "success"})
                console.log("Record Updated.")
            }
        });
    }
}
const express = require("express");
const bodyParser = require("body-parser");
const invoiceRouter = express.Router();
const authenticate = require("../authenticate");
const Invoices = require("../models/invoice");
const Books = require("../models/books");

invoiceRouter.use(bodyParser.json());

invoiceRouter
  .route("/")
  .get(authenticate.verifyUser, (req, res, next) => {
    Invoices.find({})
      .then(
        (invoice) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(invoice);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .post(authenticate.verifyUser, (req, res, next) => {
    Invoices.create(req.body)
      .then(
        (invoice) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(invoice);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .put(authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 500;
    res.send("Put operation not supported");
  })
  .delete(authenticate.verifyUser, (req, res, next) => {
    Invoices.remove({})
      .then(
        (data) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(data);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  });
invoiceRouter
  .route("/latest_invoice")
  .get(authenticate.verifyUser, (req, res, next) => {
    Invoices.find()
      .sort({ _id: -1 })
      .limit(1)
      .then(
        (data) => {
          console.log(data.length);
          if (data.length === 0) {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json({ invoice: "GQ0000001" });
          }
          let invoice = data[0].invoiceNumber;
          invoiceStartTerm = invoice.substring(0, 3);
          invoiceEndTerm = parseInt(invoice.substring(3));
          newInvoiceEndTerm = (invoiceEndTerm + 1).toString();
          if (newInvoiceEndTerm.length < 7) {
            let addingTerm = "";
            for (let i = 0; i < 7 - newInvoiceEndTerm.length; i++) {
              addingTerm = addingTerm + "0";
            }
            newInvoiceEndTerm = addingTerm + newInvoiceEndTerm;
          }
          newInvoice = `${invoiceStartTerm}${newInvoiceEndTerm}`;
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json({ invoice: newInvoice });
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  });
invoiceRouter
  .route("/:invoice_number")
  .get(authenticate.verifyUser, (req, res, next) => {
    Invoices.findOne({ invoiceNumber: req.params.invoice_number })
      .then(
        (data) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(data);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .post(authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 500;
    res.send("Post operation not supported..");
  })
  .put(authenticate.verifyUser, (req, res, next) => {
    Invoices.findOneAndUpdate(
      { invoiceNumber: req.params.invoice_number },
      {
        $set: req.body,
      },
      { new: true }
    )
      .then(
        (data) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(data);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .delete(authenticate.verifyUser, (req, res, next) => {
    Invoices.findOneAndRemove({ invoiceNumber: req.params.invoice_number })
      .then(
        (data) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(data);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  });

module.exports = invoiceRouter;

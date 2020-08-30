const express = require("express");
const bodyParser = require("body-parser");
const bookRouter = express.Router();
const mongoose = require("mongoose");
const authenticate = require("../authenticate");
const Books = require("../models/books");

bookRouter.use(bodyParser.json());

function addBook(body) {
  var queries = [];
  for (var skuid in body) {
    var jsonData1 = {
      updateOne: {
        filter: { skuId: skuid.toString() },
        update: { $inc: { stocks: body[skuid] } },
      },
    };
    queries.push(jsonData1);
  }
  return queries;
}

bookRouter
  .route("/")
  .get(authenticate.verifyUser, (req, res, next) => {
    Books.find({})
      .then(
        (book) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(book);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .post(authenticate.verifyUser, (req, res, next) => {
    Books.create(req.body)
      .then(
        (book) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(book);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  });

bookRouter.post("/updateMany", authenticate.verifyUser, (req, res, next) => {
  console.log(req.body);
  Books.bulkWrite(addBook(req.body))
    .then(
      (data) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(data);
      },
      (err) => next(err, BulkWriteResult.writeErrors.errmsg)
    )
    .catch((err) => next(err));
});
bookRouter.post("/checking", authenticate.verifyUser, (req, res, next) => {
  Books.find({ skuId: { $in: JSON.parse(req.body.skuId) } })
    .then(
      (docs) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(docs);
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
});

bookRouter
  .route("/:sku_id")
  .get(authenticate.verifyUser, (req, res, next) => {
    Books.findOne({ skuId: req.params.sku_id })
      .then(
        (book) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(book);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .post(authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end("Post Operation not supported");
  })
  .put(authenticate.verifyUser, (req, res, next) => {
    Books.findOneAndUpdate(
      { skuId: req.params.sku_id },
      {
        $set: req.body,
      },
      { new: true }
    )
      .then(
        (book) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(book);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .delete(authenticate.verifyUser, (req, res, next) => {
    Books.findOneAndRemove({ skuId: req.params.bookId })
      .then(
        (resp) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(resp);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  });
bookRouter.post(
  "/:sku_id/addOneToStock",
  authenticate.verifyUser,
  (req, res, next) => {
    Books.findOne({ skuId: req.params.sku_id })
      .then(
        (book) => {
          book.stocks = book.stocks + 1;
          book
            .save()
            .then(
              (book) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(book);
              },
              (err) => next(err)
            )
            .catch((err) => next(err));
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  }
);
bookRouter.post(
  "/:sku_id/removeOneFromStock",
  authenticate.verifyUser,
  (req, res, next) => {
    Books.findOne({ skuId: req.params.sku_id })
      .then(
        (book) => {
          book.stocks = book.stocks - 1;
          book
            .save()
            .then(
              (book) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(book);
              },
              (err) => next(err)
            )
            .catch((err) => next(err));
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  }
);

module.exports = bookRouter;

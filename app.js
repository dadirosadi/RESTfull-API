// required all depedency
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

// inisialization express on app
const app = express();

// using templete engine ejs
app.set("view engine", "ejs");

// use body parser to parse a request
app.use(bodyParser.urlencoded({ extended: true }));

// using all css and javacript on public folder
app.use(express.static("public"));

// connect to mongodb
mongoose.connect("mongodb://localhost:27017/wikiDB", { useNewUrlParser: true });

// make schema to database
const articleSchema = {
  title: String,
  content: String
};

// make model for article schema
const Article = mongoose.model("Article", articleSchema);

//////////////////////////// REQUEST TARGETING ALL ARTICLE \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

// chaining route using router
app
  .route("/articles")
  .get((req, res) => {
    Article.find((err, result) => {
      if (err) {
        res.send(err);
      } else {
        res.send(result);
      }
    });
  })
  .post((req, res) => {
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content
    });

    newArticle.save(err => {
      if (!err) {
        res.send("Succesfully add new article");
      } else {
        res.send(err);
      }
    });
  })
  .delete((req, res) => {
    Article.deleteMany(err => {
      if (!err) {
        res.send("Successfully delete all article");
      } else {
        res.send(err);
      }
    });
  });

//////////////////////////// REQUEST TARGETING SPECIFIC ARTICLE \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

app
  .route("/articles/:articleTitle")
  .get((req, res) => {
    Article.findOne({ title: req.params.articleTitle }, (err, result) => {
      if (!err) {
        res.send(result);
      } else {
        res.send(err);
      }
    });
  })
  .put((req, res) => {
    Article.update(
      {
        title: req.params.articleTitle
      },
      { title: req.body.title, content: req.body.content },
      { overwrite: true },
      err => {
        if (!err) {
          res.send("Successfuly update using PUT");
        } else {
          res.send(err);
        }
      }
    );
  })
  .patch((req, res) => {
    Article.update(
      { title: req.params.articleTitle },
      {
        $set: req.body
      },
      err => {
        if (!err) {
          res.send("Successfully updated using patch http");
        } else {
          res.send(err);
        }
      }
    );
  })
  .delete((req, res) => {
    Article.deleteOne({ title: req.params.articleTitle }, err => {
      if (!err) {
        res.send(
          `Successfully Delete article with title ${req.params.articleTitle}`
        );
      } else {
        res.send(err);
      }
    });
  });

// run a server on port 3000
app.listen(3000, () => {
  console.log("server is running");
});

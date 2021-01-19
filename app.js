//jshint esversion:6
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const app = express();
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));
app.set("view engine", "ejs");

mongoose.connect("mongodb://localhost:27017/wikiDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const wikiSchema = new mongoose.Schema({
  title: String,
  content: String
});

const Article = mongoose.model("Article", wikiSchema);

app.route("/articles")
  .get( function(req, res) {

    Article.find({}, function(err, foundArticles) {
      if (!err)
        res.send(foundArticles);

      else
        res.send(err);

    });
  })

  .post( function(req, res) {
    const article = new Article({
      title: req.body.title,
      content: req.body.content
    });
    article.save(function(err) {
      if (!err)
        res.send("Successfully Added to DB");

      else
        res.send("There are some issues");

    });

  })

  .delete( function(req, res) {
    Article.deleteMany(function(err) {
      if (!err)
        res.send("Successfully Deleted the Entire DB");

      else
        res.send("There seems to be some issue with the process");

    });

  });


  app.route("/articles/:articleTitle")

  .get(function(req,res){

   Article.findOne({title:req.params.articleTitle},function(err,foundArticle){

    if(foundArticle)
    res.send(foundArticle);

    else
  res.send("There were some issues while connecting to the dataBase.Please try again later");
});

  })

  .put(function(req,res){
Article.update({
  title:req.params.articleTitle
},
{
title:req.body.title,
content:req.body.content
},
{
  overwrite:true
},
function(err){
if(!err)
res.send("Successfully Updated DataBase");

else
res.send("DataBase Updation Failed   "+ err);

});
})

.patch((req,res)=>{

Article.update({
  title:req.params.articleTitle},
  {$set:req.body},
  function(err){
if(!err)
res.send("Successfully Updated The Patch");

else
res.send("Error");


  });
})

.delete((req,res)=>{

Article.deleteOne({title:req.params.articleTitle},function(err){
if(!err)
res.send("Successfully Deleted The Article");
else
res.send(err);
});

});


app.listen("3000", (req, res) => {
  console.log("Server Started on Port 3000");
});

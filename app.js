//Storing dependencies into a variable

var express = require ('express');
var request = require ('request');
var cheerio = require ('cheerio');
var fs = require ('fs');

//Storing port number and our full app
var port = 8081;
var app = express();

//step 1: Setting up the boilerpalte and routing
app.get('/wikipedia', function(req, res){

  var url = 'http://en.wikipedia.org/wiki/Butterfly';

  request(url, function(error, response, html) {
    if(!error) {
      // res.send(html);
      var $ = cheerio.load(html);
      var data = {
        articleTitle :'',
        articleImg : '',
        articleParagraph : ''
      }

//hashtag means id, . means class
      $('#content').filter(function(){
        data.articleTitle = $(this).find('#firstHeading').text();
        data.articleImg = $(this).find('img').first().attr('src');
        data.articleParagraph = $(this).find('p:nth-of-type(2)').text();
      });

      res.send(data);

      fs.writeFile('wiki-output.js', JSON.stringify(data, null, 4), function(error){
        console.log('File written on hard drive!');
      });

    }

  });

 //All the web scraping magic will happen here
  // res.send('Hello World!');

});

app.get('/imdb', function(req, res){

  var url = 'http://www.imdb.com/chart/top';

  request(url, function(error, response, html) {

    if(!error) {
      // res.send(html);
      var $ = cheerio.load(html);

      var data = [];

      $('.lister-list').filter(function(){
        $(this).find('tr').each(function(i, elem){
         data[i] = "'" + $(this).find('.posterColumn').find('img').attr('src') + "'";
         });
      });

      res.send(data);

      fs.writeFile('imdb-output.js', 'var imdb_list = [' + data + ']',  function(error){
        console.log('File written on hard drive!');
      });

    }

  });

});

app.listen(port);
console.log('Magic happens on port' + port);

exports = module.exports = app;

var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app = express();

app.get('/cercle/music', function(req, res) {
  url =
    'https://www.decodedmagazine.com/?s=cercle';
 request(url, function(error, response, html) {
    if (!error) {
  var $ = cheerio.load(html);

      var link;
      var resultSet = [];

      $('#archive search-results-posts div').each(function(i, elm) {
        var data = $(this);

        var link = data
          .children()
          .first()
          .children()
          .first()
          .attr('href');
        

        resultSet.push({
          link: link
        });
      });
    }

    fs.writeFile('cercle.json', JSON.stringify(resultSet, null, 4), function(
      err
    ) {

      console.log(
        'File successfully written! - Check your project directory for the cercle.json file'
      );
    });

    // Finally, we'll just send out a message to the browser reminding you that this app does not have a UI.
    res.send('Check your console!');
	
	
  });
});

function sanitizeData(data) {
  var santized = data.replace(/\n/g, '').trim();
  return santized;
}

app.listen('8081');

console.log('Magic happens on port 8081');

exports = module.exports = app;

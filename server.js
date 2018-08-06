var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app = express();

app.get('/scrape', function(req, res) {
  url =
    'https://www.digitalmarketplace.service.gov.uk/digital-outcomes-and-specialists/opportunities?q=google';

  request(url, function(error, response, html) {
    if (!error) {
      var $ = cheerio.load(html);

      var link, metadata, description;

      var result = [];
      var resultSet = [];

      $('#js-dm-live-search-results div').each(function(i, elm) {
        var data = $(this);

        var link = data
          .children()
          .first()
          .children()
          .first()
          .attr('href');

        var title = data
          .children()
          .first()
          .text();

        var description = data
          .children()
          .last()
          .text();

        var importantMetadataSet = [];

        data
          .children('ul')
          .filter('.search-result-important-metadata')
          .children()
          .each(function(j, elmnt) {
            importantMetadataSet.push({ importantMetadata: $(this).text() });
          });

        var metadataSet = [];

        data
          .children('ul')
          .filter('.search-result-metadata')
          .children()
          .each(function(k, elmn) {
            metadataSet.push({ metadata: $(this).text() });
          });

        resultSet.push({
          description: description,
          title: title,
          link: link,
          importantMetadataSet: importantMetadataSet,
          metadataSet: metadataSet,
        });
      });
    }

    fs.writeFile('output.json', JSON.stringify(resultSet, null, 4), function(
      err
    ) {
      console.log(
        'File successfully written! - Check your project directory for the output.json file'
      );
    });

    // Finally, we'll just send out a message to the browser reminding you that this app does not have a UI.
    res.send('Check your console!');
  });
});

app.listen('8081');

console.log('Magic happens on port 8081');

exports = module.exports = app;

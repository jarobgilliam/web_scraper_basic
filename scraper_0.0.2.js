var request = require('request');
var cheerio = require('cheerio');
var URL = require('url-parse');

var WebScraper = function(home_page) {
  this.origin_site = home_page;
  this.page_data = [];
  this.visited_pages = [];
  this.error_reports = [];
};

WebScraper.prototype.stripLinks = function(page) {
  // takes page data and converts it into a list of links
  var links = [];

  for (var key in page) {
    console.log(page[key]);
  }
};

WebScraper.prototype.getLinks = function(url) {



};

WebScraper.prototype.analyze = function(links) {

};

WebScraper.prototype.filterLinks = function(links) {

};

WebScraper.prototype.request = function(url, cb) {
  var context = this;
  var requested_page;


  request(url, function(error, response, body) {
    if (error) {
      console.log('There has been an error. See report.');
      context.error_reports.push(error);
    }

    if (response && response.statusCode === 200) {
      console.log('Status Code 200 -- Visiting:', url);
      var $ = cheerio.load(body);
      requested_page =  $('a');
    }

    cb.call(context, requested_page);
  });

  
  
};

WebScraper.prototype.init = function(url) {
  // This is the task managing process that ensures node's asynchronous
  // behavior can be controlled. 

  // Consider loop.
};

tester = new WebScraper('https://www.facebook.com');
tester.request('https://www.facebook.com', function(page) {
  tester.stripLinks(page);
});

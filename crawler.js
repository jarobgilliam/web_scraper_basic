'use strict'

var request = require('request');
var cheerio = require('cheerio');
var URL = require('url-parse');

var WebScraper = function(scrape_target) {
  // Trackers
  this.error_reports = [];
  this.sites_visited = [];
  this.visits = 0;
  this.depth = 0;
  this.scrape_target = scrape_target;

  // Set our maximums for recursive purposes
  this.max_vists = 10;
  this.max_depth = 10;

}

WebScraper.prototype.request = function(site) {
  // Requests a page and returns a list of all embedded links.
  var context = this;
  var links = [];
  var site_collection;
  var page = site || 'http://www.stackoverflow.com';



  request(page, function(error, response, body) {
    if (error) {
      console.log('There has been an error. See report.');
      context.error_reports.push(error);
    }

    if (response && response.statusCode === 200) {
      console.log('Status Code 200 -- Visiting:', page);
      var $ = cheerio.load(body);
      site_collection = $('a');

      // parse site_collection to strip out individual links.
      var temp = [];
      for (var key in site_collection) {
        site_collection[key].attribs && temp.push(site_collection[key].attribs.href);
      }

      // CLEAN UP LINKS HERE
      context.cleanUp(temp, 'http');
      // console.log(temp);
    }
  });
}

WebScraper.prototype.cleanUp = function(links) {
  var links = links;
  var improved = [];
  var args = Array.prototype.slice.call(arguments, 1);



  for (var i = 0; i < links.length; i++) {
    var item = links[i];
    console.log(item);
    for (var j = 0; j < args.length; j++) {
      var tester = args[j]
      if (item && item.indexOf(tester) > -1) {
        improved.push(item);
      }
    }
  }

  console.log('Improved:', improved);

}

var scraper = new WebScraper();
scraper.request();
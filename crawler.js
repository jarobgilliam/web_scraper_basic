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
        var reference = site_collection[key].attribs
        reference && reference.href);
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
      if (item && item.slice(0,4) === 'http') {
        improved.push(item);
      }
    }
  }
  // Improved now contains an array of all links from the site of the form
  // 'http...'. We are only scraping a single website, so many of these are
  // unnecessary. We do want to collect them for data purposes, however.
  
  // IMPLEMENT DATA CONFIGURATION HERE
  console.log('Improved:', improved);

}

WebScraper.prototype.dataConfigure = function(links) {
  var new_links = [];
  for (var i = 0; i < links.length; i++) {

    // variable reset
    item = null;
    parts = null;
    suffix = null;
    name = null;
    identifier = null;
    prefixes = null;
    file_type = null;
    file_name = null;
    location = null;

    var item = links[i];
    var parts, left, right;
    // We need to chop off the http:// or https://
    item = item.split('//')[1];

    if (item.indexOf('/') > -1) {
      parts = item.split('/');
      left = parts.shift();
      right = parts.join('/');
    } else {
      left = item;
      right = null;
    }

    left && (left = left.split('.'));
    right && (right = right.split('/'));


    var suffix = left.pop();
    var name = left.pop();
    var identifier = left.pop();
    var prefixes = left;


    var file_name, file_type;

    if (right && right[right.length-1].indexOf('.') > -1) {
      var file = right.pop();
      file = file.split('.');
      file_name = file[0];
      file_type = file[1];
    }
    var location = right;
    var obj  = {
      'suffix' : suffix,
      'name' : name,
      'identifier' : identifier,
      'prefixes' : prefixes,
      'file_name' : file_name,
      'file_type' : file_type,
      'location' : location
    };
    new_links.push(obj);
  }
  return new_links;
};
  

var scraper = new WebScraper();
scraper.request();
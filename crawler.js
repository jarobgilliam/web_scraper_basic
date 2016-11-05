'use strict'

var request = require('request');
var cheerio = require('cheerio');
var URL = require('url-parse');

var WebScraper = function(scrape_target) {
  // Trackers
  this.error_reports = [];
  this.sites_visited = [];
  // this.visits = 0;
  // this.depth = 0;
  this.scrape_target = scrape_target;

  // Set our maximums for recursive purposes
  // this.max_vists = 10;
  // this.max_depth = 10;
  // Make this set automatically in the future.
  this.origin_name = 'facebook';
};

WebScraper.prototype.request = function(site) {
  // Requests a page and returns a list of all embedded links.
  // console.log('request is happening');
  var context = this;
  var links = [];
  var site_collection;
  // Have this set automatically in the future.
  var page = site || 'https://www.facebook.com/';



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
        reference && temp.push(reference.href);
      }
      // CLEAN UP LINKS HERE
      context.cleanUp(temp, 'http');
    }
    else {
    }
  });
};

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
  this.dataConfigure(improved);
};

WebScraper.prototype.dataConfigure = function(links) {
  var new_links = [];
  var context = this;
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
    route = null;


    var item = links[i];
    var original_link = item;
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
    if (left[left.length] === 'www') {
      var identifier = left.pop();
    }
    var prefixes = left;


    var file_name, file_type;

    if (right && right[right.length-1].indexOf('.') > -1) {
      var file = right.pop();
      file = file.split('.');
      file_name = file[0];
      file_type = file[1];
    }

    var route = right;
    var obj  = {
      'suffix' : suffix,
      'name' : name,
      'identifier' : identifier,
      'prefixes' : prefixes,
      'file_name' : file_name,
      'file_type' : file_type,
      'route' : route,
      'original_link' : original_link
    };
    new_links.push(obj);
    // console.log('new links:', new_links);
  }
  var new_searches = []
  for (var i = 0; i < new_links.length; i++) {
    if(new_links[i].name === this.origin_name) {
      new_searches.push(new_links[i]['original_link']);
    }
  }
  // Parse out links we've already searched.

  // Collect an array of strings of links we've visited
  // new_searches is an array of strings we'd like to visit
    // Delete any intersections from new_searches

  var visited_sites = [];
  for (var i = 0; i < this.sites_visited.length; i++) {
    var site = this.sites_visited[i];

    visited_sites.push(site['original_link']);
  }

  var visit_next = new_searches;

  console.log('Visited:', visited_sites);
  // implement n log n algorithm using visited_sites and visit_next;

  var intersected = this.intersection(visited_sites, visit_next);
  var temp = [];
  for (var i = 0; i < visit_next.length; i++) {
    for (var j = 0; j < intersected.length; j++) {
      if(visit_next[i] !== intersected[j] && temp.indexOf(visit_next[i]) < 0) {
        temp.push(visit_next[i]);
      }
    }
  }
  visit_next = temp;

  console.log('intersected:', intersected);
  console.log('Visit Next:', visit_next);


  this.request(intersected);
  // Add visited links to sites_visited;
  this.sites_visited.push(intersected);






  setTimeout(function() {
    context.followNew(new_searches);
  }, 1000);
};

WebScraper.prototype.followNew = function(new_searches) {
  for (var i = 0; i < new_searches.length; i++) {
    this.request(new_searches[i]);
  }
  // var searching = setInterval(function() {

  // }, 1000)
};

WebScraper.prototype.intersection = function(visited, to_visit) {
  var a = visited;
  var b = to_visit;
  a.sort();
  b.sort();

  var x = 0;
  var y = 0;
  var iterating = true;
  var intersections = [];

  while (iterating) {
    if (x >= a.length || y >= b.length) {
      iterating = false;
    } else if (a[x] > b[y]) {
      y++;
    } else if (a[x] < b[y]) {
      x++;
    } else {
      intersections.push(a[x]);
      x++;
    }
  }

  return intersections;
};


  
/*==================== INITIALIZE AND RUN =====================*/
var scraper = new WebScraper();
scraper.request();


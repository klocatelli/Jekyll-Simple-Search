/*
 * search.js
 * ~~~~~~~~~~~~~~~~
 *
 * Based on Sphinx' searchtools.js
 *
 */

if(!Object.keys) {
  Object.keys = function(o){
    if (o !== Object(o)) {
      throw new TypeError('Object.keys called on non-object');
    }
    var ret=[],p;
    for (p in o) {
      if (Object.prototype.hasOwnProperty.call(o,p)) {
        ret.push(p);
      }
    }
    return ret;
 };
}

/**
 * small function to check if an array contains
 * a given item.
 */
$.contains = function(arr, item) {
  for (var i = 0; i < arr.length; i++) {
    if (arr[i] == item) {
      return true;
    }
  }
  return false;
};

/**
 * Search Module
 */
var Search = {

  _index : null,
  _queued_query : null,

  loadIndex : function(url) {
    $.ajax({type: "GET", url: url, data: null, success: null,
            dataType: "script", cache: true});
  },

  setIndex : function(index) {
    var q;
    this._index = index;
    if ((q = this._queued_query) !== null) {
      this._queued_query = null;
      Search.query(q[0], q[1]);
    }
  },

  hasIndex : function() {
      return this._index !== null;
  },

  deferQuery : function(query, callback) {
      this._queued_query = [query, callback];
  },

  /**
   * perform a search for something
   */
  performSearch : function(query, callback) {
    // index already loaded, the browser was quick!
    if (this.hasIndex()) {
      this.query(query, callback);
    } else {
      this.deferQuery(query, callback);
    }
  },

  query : function(query, callback) {
    var stopwords = ["and","then","into","it","as","are","in","if","for","no","there","their","was","is","be","to","that","but","they","not","such","with","by","a","on","these","of","will","this","near","the","or","at"];

    // Stem the searchterms and add them to the correct list
    var stemmer = new Stemmer();
    var searchterms = [];
    var tmp = query.split(/\s+/);
    var i, j, word, stem;
    for (i = 0; i < tmp.length; i++) {
      if (!tmp[i] || stopwords.indexOf(tmp[i]) != -1 || tmp[i].length < 3 || tmp[i].match(/^\d+$/)) {
        // skip this "word"
        continue;
      }
      // stem the word
      stem = stemmer.stemWord(tmp[i]).toLowerCase();
      // only add if not already in the list
      if (searchterms.indexOf(stem) === -1) {
        searchterms.push(stem);
      }
    }

    // prepare search
    var filenames = this._index.filenames;
    var titles = this._index.titles;
    var terms = this._index.terms;
    var file_matches = [];

    // perform the search on the required terms
    for (i = 0; i < searchterms.length; i++) {
      word = searchterms[i];
      var files = terms[word];
      if (files) {
        for (j = 0; j < files.length; j++) {
          if (file_matches.indexOf(files[j]) == -1) {
             file_matches.push(files[j]);
          }
        }
      }
    }

    // now sort the results by descending by title
    file_matches.sort(function (a, b) {
      var left = titles[a].toLowerCase();
      var right = titles[b].toLowerCase();
      return (left < right) ? -1 : ((left > right) ? 1 : 0);
    });

    // Create sorted result array for the rendering callback
    var results = [];
    for (i = 0; i < file_matches.length; i++) {
        var index = file_matches[i];
        results.push({
          title: titles[index],
          filename: filenames[index]
        });
    }
    callback(results);
  }
};

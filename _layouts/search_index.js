---
---
/*
 * search.js
 * ~~~~~~~~~~~~~~~~
 *
 * Based on Sphinx' searchtools.js
 *
 */

/**
 * Search Module
 */
var Search = {

  _index : {{ page.index_data }},

  /**
   * perform a search for something
   */
  performSearch : function(query, callback) {
    var stopwords = ["and","then","into","it","as","are","in","if","for","no","there","their","was","is","be","to","that","but","they","not","such","with","by","a","on","these","of","will","this","near","the","or","at"];

    // Stem the searchterms and add them to the correct list
    var searchterms = [];
    var tmp = query.split(/\s+/);
    var i, j, word, stem;
    for (i = 0; i < tmp.length; i++) {
      if (!tmp[i] || stopwords.indexOf(tmp[i]) != -1 || tmp[i].length < 3 || tmp[i].match(/^\d+$/)) {
        // skip this "word"
        continue;
      }
      // stem the word
      stem = stemmer(tmp[i]).toLowerCase();
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
    if (callback !== undefined) callback(results);
  }
};

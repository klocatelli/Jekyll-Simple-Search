A simple client-side search system for Jekyll, that doesn't require any 3rd party APIs like IndexTank. Inspired by the search system the [Sphinx doc generator](http://sphinx.pocoo.org/) uses.
This is mostly a proof-of-concept. It works and I use it for [my site](http://www.klocatelli.name), but the code is probably sub-par (those lines of ruby are literally my first lines of ruby).

Here's how it works (more or less):

* At run time, a search index is generated. The index has the following structure:
    * An array of URIs
    * An array of titles
    * A given integer represents an article IDs, it maps into the URI and title arrays.
    * A hashtable with stemmed words as indices and an array of article IDs
    * The index is json-ified and inlined in the javascript search module
    
* From the index structure, the simple search system can easily follows:
    * For a given query, split into words
    * Stem each word
    * Look up the document IDs for the word, and merge them into an array of matched document IDs
    * Look up the document titles/URIs
    * Sort by title
    * Display

This search system is incredibly simple, and its results reflect this. However that's completely acceptable; many jekyll sites on github have relatively few posts. A useful query matches only a few posts, and the titles are sufficient for the user to find what they want.

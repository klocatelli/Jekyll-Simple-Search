$:.unshift(File.dirname(__FILE__)) unless
  $:.include?(File.dirname(__FILE__)) || $:.include?(File.expand_path(File.dirname(__FILE__)))
require 'stemmer_en.rb'

module JekyllSearch
  class SearchLanguage
    STOPWORDS = Set["a", "and", "are", "as", "at", "be", "but", "by", "for", 
                    "if", "in", "into", "is", "it", "near", "no", "not", "of", 
                    "on", "or", "such", "that", "the", "their", "then", 
                    "there", "these", "they", "this", "to", "was", "will", "with"]

    def split(input)
      input.scan(/\w+/)
    end

    def filter(word)
      word.length < 3 or STOPWORDS.include?(word) or (!!Float(s) rescue false)
    end
    
    def stem(word)
      word.stem.downcase
    end
  end
  
  class IndexBuilder
    def initialize
      @lang = SearchLanguage::new
      @titles = Hash::new
      @mapping = Hash::new {|hash, key| hash[key] = []} 
    end
    
    def freeze
      filenames = @titles.keys
      titles = @titles.values
      fn2index = Hash[filenames.each_with_index.map {|value, i| [value, i]}]
      # Basically just duplicates the stem occurance map, replacing file names in the array value
      # with array indexes to filenames.
      terms = Hash[@mapping.each.map do |stem, files| 
                  [stem, files.map {|file| fn2index[file] if fn2index.include? file}.compact]
              end]
                      
      return {'filenames'=>filenames, 'titles'=>titles, 'terms'=>terms}
    end
    
    def feed(filename, title, contents)
      @titles[filename] = title
      
      def add_word(word, fn)
        w = @lang.stem(word)
        @mapping[w] << fn unless @mapping[w].include? fn or @lang.filter(word)
      end

      @lang.split(title).each {|x| add_word(x, filename)}
      @lang.split(contents).each {|x| add_word(x, filename)}
    end
  end
end

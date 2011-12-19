require 'json'
$:.unshift(File.dirname(__FILE__)) unless
  $:.include?(File.dirname(__FILE__)) || $:.include?(File.expand_path(File.dirname(__FILE__)))
require 'lib/search.rb'

module Jekyll
  class SearchIndex < Page
    def initialize(site, base, output_dir, index_struct)
      @site = site
      @base = base
      @dir  = output_dir
      @name = 'search_index.js'
      self.process(@name)
      # Read the YAML data from the layout page.
      self.read_yaml(File.join(base, '_layouts'), 'search_index.js')
      self.data['index_data'] = index_struct.to_json
    end
    
  end

  class Site
    def write_search_index(output_dir, index_struct)
      index = SearchIndex.new(self, self.source, output_dir, index_struct)
      index.render(self.layouts, site_payload)
      index.write(self.dest)
      # Record the fact that this page has been added, otherwise Site::cleanup will remove it.
      self.pages << index
    end
  end
  
  
  # Jekyll hook - the generate method is called by jekyll, and generates all of the category pages.
  class GenerateSearchIndex < Generator
    safe true
    priority :low

    def generate(site)
        dir = site.config['search_dir'] || 'javascript'
        q = JekyllSearch::IndexBuilder::new
        site.posts.each do |post|
          q.feed(post.data['permalink'] || post.url, post.data['title'], post.content)

        end
        site.write_search_index(dir, q.freeze)  
    end

  end
  
end

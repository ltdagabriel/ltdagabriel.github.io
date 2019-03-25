---
title: When using :through assocations validations firing on join model multiple times
labels: activerecord, stale
layout: issue
---

This is related to #7661 and I am opening this ticket to demonstrate the problem,

``` ruby
class Article < ActiveRecord::Base
  attr_accessible :content, :title
  has_many :article_tags
  has_many :tags, :through => :article_tags

  before_validation :add_to_default_tag, :on => :create

  def add_to_default_tag
    if self.tags.empty?
      self.tags << Tag.find_or_create_by_title("default")
    end
  end
end

class Tag < ActiveRecord::Base
  attr_accessible :title

  has_many :article_tags
  has_many :articles, :through => :article_tags
end

class ArticleTag < ActiveRecord::Base
  attr_accessible :article_id, :name, :tag_id

  belongs_to :article
  belongs_to :tag

  validate :check_stuff

  private
  def check_stuff
    puts "whoa"
  end

end

article = Article.new(:title => "hemant", :content => "kumar")
article.save
=> Whoa
=> Whoa
=> Whoa
```

For the lazy, there is a repo https://github.com/gnufied/try_through which reproduces the same problem.  I can perhaps add some ActiveRecord tests as well quickly. 


---
title: ActiveRecord 5.1.5 query cache not working
labels: activerecord
layout: issue
---

### Steps to reproduce

Given the following MiniTest which implements a Sinatra app using ActiveRecord:

```ruby
require 'minitest'
require 'minitest/autorun'
require 'active_record'
require 'sinatra/base'
require 'rack/test'

class CachedQueryTest < Minitest::Test
  include Rack::Test::Methods

  class ApplicationRecord < ActiveRecord::Base
    self.abstract_class = true
  end

  class Article < ApplicationRecord
  end

  class ActiveRecordTestApp < Sinatra::Application
    post '/cached_request' do
      Article.cache do
        # Do two queries (second should cache.)
        Article.count
        Article.count
      end
    end
  end

  def app
    ActiveRecordTestApp
  end

  def setup
    ActiveRecord::Base.establish_connection( adapter: 'sqlite3',
                                             database: ':memory:')
    migrate_db
  end

  def migrate_db
    Article.exists?
  rescue ActiveRecord::StatementInvalid
    ActiveRecord::Schema.define(version: 20180101000000) do
      create_table 'articles', force: :cascade do |t|
        t.string   'title'
        t.datetime 'created_at', null: false
        t.datetime 'updated_at', null: false
      end
    end
  end

  def test_cached_query
    # Make sure Article table exists
    migrate_db

    ActiveRecord::Base.logger = Logger.new(STDOUT)

    # Do query with cached query
    post '/cached_request'
  end
end
```

### Expected behavior

I expect the output to look like:

```
-- create_table("articles", {:force=>:cascade})
   -> 0.0023s
D, [2018-02-16T12:38:07.046295 #18646] DEBUG -- :    (0.2ms)  SELECT COUNT(*) FROM "articles"
D, [2018-02-16T12:38:07.046709 #18646] DEBUG -- :   CACHE  (0.0ms)  SELECT COUNT(*) FROM "articles"
.
```

### Actual behavior

Instead it looks like:

```
-- create_table("articles", {:force=>:cascade})
   -> 0.0024s
D, [2018-02-16T12:41:06.446559 #19878] DEBUG -- :    (0.2ms)  SELECT COUNT(*) FROM "articles"
D, [2018-02-16T12:41:06.447383 #19878] DEBUG -- :    (0.2ms)  SELECT COUNT(*) FROM "articles"
.
```

### System configuration
**Rails version**: ActiveRecord `5.1.5` only.

**Ruby version**: 2.3.4

The expected behavior is produced on version `5.1.4` correctly. Is this a regression in version `5.1.5`? Related to https://github.com/rails/rails/pull/29609 perhaps?

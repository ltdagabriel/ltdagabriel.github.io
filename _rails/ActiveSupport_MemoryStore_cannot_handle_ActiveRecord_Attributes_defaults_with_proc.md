---
title: ActiveSupport::MemoryStore cannot handle ActiveRecord::Attributes defaults with proc
labels: With reproduction steps, activerecord
layout: issue
---

### Steps to reproduce
```ruby
begin
  require "bundler/inline"
rescue LoadError => e
  $stderr.puts "Bundler version 1.10 or later is required. Please update your Bundler"
  raise e
end

gemfile(true) do
  source "https://rubygems.org"

  git_source(:github) { |repo| "https://github.com/#{repo}.git" }

  # Activate the gem you are reporting the issue against.
  gem "activerecord", "5.1.4"
  gem "sqlite3"
end

require "active_record"
require "minitest/autorun"
require "logger"

# Ensure backward compatibility with Minitest 4
Minitest::Test = MiniTest::Unit::TestCase unless defined?(Minitest::Test)

# This connection will do for database-independent bug reports.
ActiveRecord::Base.establish_connection(adapter: "sqlite3", database: ":memory:")
ActiveRecord::Base.logger = Logger.new(STDOUT)

ActiveRecord::Schema.define do
  create_table :posts, force: true do |t|
  end

  create_table :comments, force: true do |t|
    t.integer :post_id
  end
end

class Post < ActiveRecord::Base
  has_many :comments
end

class Comment < ActiveRecord::Base
  belongs_to :post

  attribute :config, :string, default: -> { "value" }
end

class BugTest < Minitest::Test
  def test_memory_store_fetch
    store = ActiveSupport::Cache::MemoryStore.new
    comment = Comment.create!

    store.fetch(:key) { comment }
  end
end
```
### Expected behavior
I expect that MemoryStore returns me the cached object, but it fails with following backtrace

```
TypeError: no _dump_data is defined for class Proc
    /Users/fritz/.asdf/installs/ruby/2.3.5/lib/ruby/gems/2.3.0/gems/activesupport-5.1.4/lib/active_support/cache.rb:664:in `dump'
    /Users/fritz/.asdf/installs/ruby/2.3.5/lib/ruby/gems/2.3.0/gems/activesupport-5.1.4/lib/active_support/cache.rb:664:in `dup_value!'
    /Users/fritz/.asdf/installs/ruby/2.3.5/lib/ruby/gems/2.3.0/gems/activesupport-5.1.4/lib/active_support/cache/memory_store.rb:130:in `write_entry'
    /Users/fritz/.asdf/installs/ruby/2.3.5/lib/ruby/gems/2.3.0/gems/activesupport-5.1.4/lib/active_support/cache.rb:400:in `block in write'
    /Users/fritz/.asdf/installs/ruby/2.3.5/lib/ruby/gems/2.3.0/gems/activesupport-5.1.4/lib/active_support/cache.rb:555:in `block in instrument'
    /Users/fritz/.asdf/installs/ruby/2.3.5/lib/ruby/gems/2.3.0/gems/activesupport-5.1.4/lib/active_support/notifications.rb:168:in `instrument'
    /Users/fritz/.asdf/installs/ruby/2.3.5/lib/ruby/gems/2.3.0/gems/activesupport-5.1.4/lib/active_support/cache.rb:555:in `instrument'
    /Users/fritz/.asdf/installs/ruby/2.3.5/lib/ruby/gems/2.3.0/gems/activesupport-5.1.4/lib/active_support/cache.rb:398:in `write'
    /Users/fritz/.asdf/installs/ruby/2.3.5/lib/ruby/gems/2.3.0/gems/activesupport-5.1.4/lib/active_support/cache.rb:589:in `save_block_result_to_cache'
    /Users/fritz/.asdf/installs/ruby/2.3.5/lib/ruby/gems/2.3.0/gems/activesupport-5.1.4/lib/active_support/cache.rb:297:in `fetch'
    /Users/fritz/Library/Preferences/RubyMine2017.2/scratches/scratch_58.rb:53:in `test_memory_store_fetch'
```

### Actual behavior
It blows up with `TypeError: no _dump_data is defined for class Proc`

### System configuration
**Rails version**: 5.1.4 (also on 5.1-stable branch)
**Ruby version**: 2.3.5 & 2.4.2


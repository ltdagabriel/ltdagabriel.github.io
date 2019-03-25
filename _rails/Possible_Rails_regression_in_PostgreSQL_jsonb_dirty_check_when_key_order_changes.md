---
title: Possible Rails 5 regression in PostgreSQL jsonb dirty check when key order changes
labels: PostgreSQL, With reproduction steps, activerecord, attached PR, regression
layout: issue
---

Possibly due to the same reason as https://github.com/rails/rails/issues/27502 (for PostgreSQL's HStore columns).

### Steps to reproduce

The test below fails on Rails master and 5.0.2, but passes on 4.2.

Note, however, that it's possible it passes in Rails 4.2 due to other bugs related to in-place change detection of `jsonb` columns not working properly in 4.2.

```ruby
begin
  require 'bundler/inline'
rescue LoadError => e
  $stderr.puts 'Bundler version 1.10 or later is required. Please update your Bundler'
  raise e
end

gemfile(true) do
  source 'https://rubygems.org'
  gem 'rails', github: 'rails/rails'
  # gem 'rails', '5.0.2'
  # gem 'rails', '~> 4.2'
  gem 'pg'
end

require 'active_record'
require 'minitest/autorun'
require 'logger'

ActiveRecord::Base.establish_connection(adapter: 'postgresql', database: 'postgres')
ActiveRecord::Base.logger = Logger.new(STDOUT)

ActiveRecord::Schema.define do
  create_table :posts, force: true do |t|
    t.jsonb :data
  end
end

class Post < ActiveRecord::Base
end

class JsonbChangeDetectionTest < Minitest::Test
  def test_jsonb_not_changed
    post = Post.create! data: {'one' => 1, 'two' => 2}
    assert_equal({}, post.changes)

    post.data = {'one' => 1, 'two' => 2}
    assert_equal({}, post.changes)

    post.save!
    post.reload

    post.data = {'two' => 2, 'one' => 1}
    assert_equal({}, post.changes)
  end
end
```

### Expected behavior

Assigning equal hashes to a `jsonb` column would not mark the record as changed, even if the key order differs between the two hashes.

### Actual behavior

The `jsonb` attribute is marked as dirty when assigning an equal hash but with a different key order than the one stored in the DB.

The problem is that `jsonb` in PostgreSQL has an undefined order of object keys, but [`Jsonb#changed_in_place?` compares hashes in their serialized form](https://github.com/rails/rails/blob/8145880/activerecord/lib/active_record/connection_adapters/postgresql/oid/jsonb.rb#L16-L17) and for certain combinations of key ordering Rails will always consider the value as changed.

This seems to have been fixed for HStore in https://github.com/rails/rails/pull/27517.

### System configuration

**Rails version**: master and 5.0.2
**Ruby version**: 2.3.3 on macOS
**PostgreSQL version**: 9.6.2


---
title: group appends table_name with from
labels: activerecord
layout: issue
---

This used to work in rails 4.2 and 4.1 but now broken in 4.2-stable:

``` ruby
avg_by_users = Score.
      group(:user_id).
      select('AVG(scores.score) as avg_score', 'scores.user_id AS user_id')
avg = Score.
      from(avg_by_users,'avg_by_user').
      group('user_id').
      select('AVG(avg_score) AS avg_score')
avg.to_a
```

Error:
`no such column: scores.user_id: SELECT AVG(avg_score) AS avg_score FROM (SELECT AVG(scores.score) as avg_score, scores.user_id AS user_id FROM "scores" GROUP BY "scores"."user_id") avg_by_user GROUP BY "scores"."user_id"`

This change seems to be the culprit (it caused "scores." to erroneously prepended to "user_id" in GROUP BY ) :
https://github.com/rails/rails/commit/0662db16ade8f9ca40f4feda760472c9c7485db2#diff-bf6dd6226db3aab589916f09236881c7R874 

Full testcase:

``` ruby
unless File.exist?('Gemfile')
  File.write('Gemfile', <<-GEMFILE)
    source 'https://rubygems.org'
    gem 'rails', github: 'rails/rails', branch: '4-2-stable'
    #gem 'arel', github: 'rails/arel'
    #gem 'rails', 4.1
    gem 'sqlite3'
    gem 'pg'
    gem 'byebug'
  GEMFILE

  system 'bundle'
end

require 'bundler'
Bundler.setup(:default)

require 'active_record'
require 'minitest/autorun'
require 'logger'
require 'byebug'

ActiveRecord::Base.establish_connection(adapter: 'sqlite3', database: ':memory:')
ActiveRecord::Base.logger = Logger.new(STDOUT)

ActiveRecord::Schema.define do
  create_table "users", force: true do |t| end
  create_table "scores", force: true do |t|
    t.integer :score
    t.references :user
  end
end

class User < ActiveRecord::Base
  has_many :scores
end
class Score < ActiveRecord::Base
  belongs_to :user
end

class SubselectGroupTest < Minitest::Test
  def test_polymorphic_with_pluck
    avg_by_users = Score.
      group(:user_id).
      select('AVG(scores.score) as avg_score',
             'scores.user_id AS user_id')
    avg = Score.
      from(avg_by_users,'avg_by_user').
      group('user_id').
      select('AVG(avg_score) AS avg_score')
    avg.to_a
  end

end
```


---
title: Default scope shouldn't be used for updating counter cache
labels: activerecord
layout: issue
---

## Description

If model have `default_scope` with `where` call (which sometimes will not return model record itself) and it `has_many` association with configured counter cache, then on dependent model creation will be issued wrong SQL to update counter cache column:

``` sql
UPDATE "polls" SET "poll_answers_count" = COALESCE("poll_answers_count", 0) + 1 WHERE "polls"."id" IN (SELECT "polls"."id" FROM "polls" WHERE (polls.published_at < '2013-11-19 14:07:55.404327') AND "polls"."id" = 1
```

Note the polls have `published_at` set to `NULL` by default.  Unpublished poll will always have zero `poll_answers_count`. Sad.
## Expected behaviour

Use query based on `Poll.unscoped`, with no `where`s, `order`s or anything.
## Environment

Rails 4.0.1 on MRI 2.0.0 and PostgreSQL 9.1 
## How to reproduce

See the self-contained gist: https://gist.github.com/Envek/7546920

Create rails app with two tables:

``` ruby
create_table :polls do |t|
  t.datetime :published_at # it's NULL by default!
  t.integer :poll_answers_count, nullable: false, default: 0
  t.timestamps
end

create_table :poll_answers do |t|
  t.references :poll
end
```

and corresponding models:

``` ruby
class Poll < ActiveRecord::Base
  has_many :poll_answers, inverse_of: :poll

  # In most cases we want to deal only with published polls.
  # Admin panel controllers call `unscoped` explicitly.
  default_scope -> { where('polls.published_at <= ?', Time.now) }
end

class PollAnswer < ActiveRecord::Base
  belongs_to :poll, inverse_of: :poll_answers, counter_cache: true
end
```

In rails console create some polls and answers:

``` ruby
poll = Poll.create!
poll.poll_answers.create!
puts poll.poll_answers.size # See!
```
## Also
#8217 is possibly somewhat related (yes it's mine too)


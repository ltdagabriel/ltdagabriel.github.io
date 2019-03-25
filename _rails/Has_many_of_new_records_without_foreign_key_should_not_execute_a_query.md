---
title: Has many of new records without foreign key should not execute a query
labels: activerecord
layout: issue
---

Hi I think I found a problem with has many associations and new records, these are the steps to reproduce in a clean application

``` sh
rails new has_many_include
rails generate model Series name:string
rails generate model Title name:string series:references
bundle exec db:create db:migrate
```

Open app/models/series.rb to have this

``` ruby
class Series < ActiveRecord::Base
  attr_accessible :name

  has_many :titles # define the has_many association
end
```

Open the rails console

``` sh
bundle exec rails c
```

And execute the following

``` ruby
title = Title.create(:name => "Forrest Gump") # =>  #<Title id: 1, name: "Forrest Gump", series_id: nil>
series = Series.new(:name => "Wadus")
series.titles.include?(Title.first)
  Title Load (0.5ms)  SELECT "titles".* FROM "titles" LIMIT 1
  Title Exists (0.2ms)  SELECT 1 AS one FROM "titles" WHERE "titles"."series_id" IS NULL AND "titles"."id" = 1 LIMIT 1
 => true 
```

To clarify a `Title` can or not to belong to a `Series` objects so we can have titles with that foreign key as null

IMHO this code should not execute any query only checks the in memory collection of titles if it exists.

I added a test case for this on the 3-2-stable branch in my fork

https://github.com/pacoguzman/rails/commit/3e9018600bb60926434ed692a7d85982c81932f1


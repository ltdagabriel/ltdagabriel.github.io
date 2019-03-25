---
title: ORDER BY clause is not in SELECT list
labels: MySQL, activerecord
layout: issue
---

### Steps to reproduce

1) Create a new Rails 5 Application with two models:

``` bash
rails new OrderPluckDemo
rails g model Author name:string
rails g model Book name:string author:references rating:integer
```

2) Try to retrieve the ids of authors, sorted by the book rating (i.e. Authors with the top rated books first)

``` ruby
Author.includes(:books).order('books.rating').uniq.ids
```
### Expected behavior

An array of ids should be returned, sorted by top rating books.
This happens with Rails 4.2 and Arel 6.0.3
### Actual behavior

(under Rails 5.0 and Arel 7.0.0 / 7.1.0)

```
ActiveRecord::StatementInvalid: Mysql2::Error: Expression #1 of ORDER BY clause is not in SELECT list, references column 'SparkSeat_development.books.rating' which is not in SELECT list; this is incompatible with DISTINCT: SELECT DISTINCT `authors`.`id` FROM `authors` LEFT OUTER JOIN `books` ON `books`.`author_id` = `authors`.`id` ORDER BY books.rating
```
### Other information

Query executed is identical between versions:

``` sql
SELECT DISTINCT `authors`.`id` FROM `authors` LEFT OUTER JOIN `books` ON `books`.`author_id` = `authors`.`id` ORDER BY books.rating
```
### System configuration

**Rails version**:
5.0.0

**Ruby version**:
2.2.4p230

**Database**:
MySQL 5.7.13-0ubuntu0.16.04.2 (using mysql2 gem)


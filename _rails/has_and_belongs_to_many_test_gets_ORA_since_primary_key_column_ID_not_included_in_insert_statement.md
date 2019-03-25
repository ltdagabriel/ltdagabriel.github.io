---
title: has_and_belongs_to_many test gets ORA-01400 since primary key column "ID" not included in insert statement
labels: activerecord, attached PR, needs feedback
layout: issue
---

It has been reported to https://github.com/rsim/oracle-enhanced/issues/856 first. 
By doing investigation and found it has been triggered by https://github.com/rails/rails/commit/2df891dc then opened a issue here.
### Steps to reproduce

``` ruby
$ cd activerecord
$ ARCONN=oracle bundle exec ruby -W -w -I"lib:test" test/cases/associations/has_and_belongs_to_many_associations_test.rb -n test_has_and_belongs_to_many_in_a_namespaced_model_pointing_to_a_namespaced_model
```
### Expected behavior

This test should finish without any errors. 
since it have been running fine with Rails 4.2.6 and Oracle enhanced adapter 1.6.7.
### Actual behavior

``` ruby
ActiveRecord::StatementInvalid: OCIError: ORA-01400: cannot insert NULL into ("ARUNIT"."ARTICLES_MAGAZINES"."ID"): INSERT INTO "ARTICLES_MAGAZINES" ("ARTICLE_ID", "MAGAZINE_ID") VALUES (:a1, :a2)
```
- background

Oracle enhanced adapter does not support `auto_increment` `AUTOINCREMENT` features yet, 
then it needs to insert primary key column "ID" explicitly.

This test works successfully with Rails 4.2.6 and Oracle enhanced adapter 1.6.7. 
It explicitly inserts "ID" column.

``` sql
INSERT INTO "ARTICLES_MAGAZINES" ("MAGAZINE_ID", "ARTICLE_ID", "ID") VALUES (:a1, :a2, :a3)  [["magazine_id", 10000], ["article_id", 10000], ["id", 10000]]
```
### Other findings

Looks like https://github.com/rails/rails/commit/2df891dc triggers this behavior.
- ActiveRecord 4.2 (4-2-stable)

`pk_attribute?(name)` returns primary key name "id" based on self.class.primary_key

``` ruby
[427, 436] in /home/yahonda/git/rails/activerecord/lib/active_record/attribute_methods.rb
   427:     def readonly_attribute?(name)
   428:       self.class.readonly_attributes.include?(name)
   429:     end
   430:
   431:     def pk_attribute?(name)
=> 432:       name == self.class.primary_key
   433:     end
   434:
   435:     def typecasted_attribute_value(name)
   436:       _read_attribute(name)
(byebug) self.class.primary_key
"id"
(byebug) self.class
Publisher::Magazine::HABTM_Articles(id: integer, article_id: integer, magazine_id: integer)
(byebug) self.class.method(:primary_key).source_location
["/home/yahonda/git/rails/activerecord/lib/active_record/attribute_methods/primary_key.rb", 72]
(byebug)
```

``` ruby
/home/yahonda/git/rails/activerecord/lib/active_record/attribute_methods/primary_key.rb
62fd1d37 (Joshua Peek            2009-07-30 17:49:14 -0500  72)         def primary_key
4e380828 (Julius de Bruijn       2011-11-30 17:56:16 +0100  73)           @primary_key = reset_primary_key unless defined? @primary_key
4e380828 (Julius de Bruijn       2011-11-30 17:56:16 +0100  74)           @primary_key
62fd1d37 (Joshua Peek            2009-07-30 17:49:14 -0500  75)         end
```
- ActiveRecord 5.0 (5-0-stable)

`pk_attribute?(name)` returns always false since commit 2df891dc

``` ruby
[452, 461] in /home/yahonda/git/rails/activerecord/lib/active_record/attribute_methods.rb
   452:     def readonly_attribute?(name)
   453:       self.class.readonly_attributes.include?(name)
   454:     end
   455:
   456:     def pk_attribute?(name)
=> 457:       name == self.class.primary_key
   458:     end
   459:
   460:     def typecasted_attribute_value(name)
   461:       _read_attribute(name)
(byebug) self.class.primary_key
false
(byebug) self.class
Publisher::Magazine::HABTM_Articles(id: integer, article_id: integer, magazine_id: integer)
(byebug) self.class.method(:primary_key).source_location
["/home/yahonda/git/rails/activerecord/lib/active_record/associations/builder/has_and_belongs_to_many.rb", 79]
(byebug)
```

/home/yahonda/git/rails/activerecord/lib/active_record/associations/builder/has_and_belongs_to_many.rb

``` ruby
=============================================================================================
2df891dc (Aaron Patterson        2016-02-19 15:31:56 -0800  79)         def self.primary_key
2df891dc (Aaron Patterson        2016-02-19 15:31:56 -0800  80)           false
2df891dc (Aaron Patterson        2016-02-19 15:31:56 -0800  81)         end
=============================================================================================
```
### Workarounds

There are two workarounds found, each workaround has some kind of regressions and/or incompatibilities
with old version of Rails.
- Workaround 1 remove `self.primary_key`
  https://github.com/yahonda/rails/commit/31630bc6a6218c915eb0aeed23195d43d5867c42

This workaround causes this failure for all bundled adapters.

``` ruby
for i in sqlite3 mysql2 postgresql
do
ARCONN=$i bundle exec ruby -W -w -I"lib:test" test/cases/associations/has_and_belongs_to_many_associations_test.rb -n test_join_table_composite_primary_key_should_not_warn
done
```

``` ruby
  1) Failure:
HasAndBelongsToManyAssociationsTest#test_join_table_composite_primary_key_should_not_warn [test/cases/associations/has_and_belongs_to_many_associations_test.rb:160]:
Expected /WARNING: Rails does not support composite primary key\./ to not match "WARNING: Rails does not support composite primary key.\n\ncountries_treaties has composite primary key. Composite primary key is ignored.\n".
```
- Workaround 2 add `id: false`

https://github.com/yahonda/rails/commit/636443d31d43cba28b9991484d2a5c7464371526

It requires to add `id: false` for all habtm join tables, which is kind of incompatibilities with
old version of Rails for Oracle enhanced adapter users.
- Workaround 3  use composite primary key for habtm join table

https://github.com/yahonda/rails/commit/4406b11008040e15ae715197b93946cd5d4c2d97

It is similar with workadound 2, which is also kind of incompatibilities with
old version of Rails for Oracle enhanced adapter users.
### System configuration

**Rails version**:
5.0.0.rc1

**Arel version**:
7.0.0 with fix rails/arel#422 and rails/arel#430 

``` ruby
gem 'arel', github: 'yahonda/arel', branch: 'v700_oracle12'
```

**Oracle enhanced adapter version**:
Latest `rails5` branch

**Ruby version**:
ruby 2.3.1p112 (2016-04-26 revision 54768) [x86_64-linux]


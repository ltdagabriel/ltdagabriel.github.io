---
title: Unbounded memory growth when creating lots of AR objects inside transaction
labels: activerecord
layout: issue
---

Tested on 4.0.5, 4.1.1, and master. On Ubuntu 12.04 32bit, PostgreSQL 9.3, and Ruby 2.1.1 (github edition).

_The interesting thing is, if the AR objects aren't created inside a transaction, there's not as much memory growth._

``` ruby
require 'active_record'
require 'pg'

ActiveRecord::Base.establish_connection("postgres://localhost/test")

ActiveRecord::Base.connection.execute <<-SQL
drop table if exists coupons cascade;
drop table if exists sites cascade;
drop table if exists products cascade;
drop table if exists coupons_sites cascade;
drop table if exists coupons_products cascade;
create table coupons (id serial primary key, name text);
create table sites (id serial primary key);
create table products (id serial primary key);
create table coupons_sites (site_id int references sites, coupon_id int references coupons, primary key (site_id, coupon_id));
create table coupons_products (product_id int references products, coupon_id int references coupons, primary key (product_id, coupon_id));
SQL

class Coupon < ActiveRecord::Base
  has_and_belongs_to_many :products
  has_and_belongs_to_many :sites
end

class Product < ActiveRecord::Base
  has_and_belongs_to_many :coupons
end

class Site < ActiveRecord::Base
  has_and_belongs_to_many :coupons
end

Coupon.transaction do
  1.upto(250_000) do |i|
    Coupon.create!
    puts "Created #{ i } coupons..." if i % 500 == 0
  end
end
```


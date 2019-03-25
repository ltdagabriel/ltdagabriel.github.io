---
title: Precision option for arrays of timestamps are ignored on save.
labels: PostgreSQL, With reproduction steps, activerecord, regression
layout: issue
---

I am using ruby 2.3.3,  Rails 5.0.1 with PostgreSQL 9.6.1. I want to have an array of timestamps with a precision level of 6.

Given these migrations:

```
create_table :contracts do |t|
  t.datetime :start_date, null: false, precision: 6
  t.datetime :invoiced_dates, array: true, default: [], precision: 6
end
```

I would expect this to happen:

```
c = Contract.new

c.start_date = Time.current
c.invoiced_dates << Time.current
c.save

c.start_date.usec
  => something

c.invoiced_dates.first.usec
  => something
```

Instead, the datetimes stored in the array are stored with a precision value of 0. No milliseconds stored. The regular timestamp (datetime) column works fine.

```
c.start_date.usec
  => something

c.invoiced_dates.first.usec
  => 0
```

The table schema

```
rails_test=# \d+ contracts;
Table "public.contracts"
      Column       |               Type               |                       Modifiers                        | Storage  | Stats target | Description 
-------------------+----------------------------------+--------------------------------------------------------+----------+--------------+-------------
 id                | integer                          | not null default nextval('contracts_id_seq'::regclass) | plain    |              | 
 next_invoice_date | timestamp(6) without time zone   | not null                                               | plain    |              | 
 invoiced_dates    | timestamp(6) without time zone[] | default '{}'::timestamp without time zone[]            | extended |              | 
 created_at        | timestamp without time zone      | not null                                               | plain    |              | 
 updated_at        | timestamp without time zone      | not null                                               | plain    |              | 
Indexes:
    "contracts_pkey" PRIMARY KEY, btree (id)
Has OIDs: no
```

So looks like the migration is correct.

After using Rails to create a Contract, this is how the DB looks like:

```
rails_test=# select * from contracts;
 id |     next_invoice_date      |     invoiced_dates      |         created_at         |         updated_at         
----+----------------------------+-------------------------+----------------------------+----------------------------
  1 | 2016-12-28 21:26:14.445997 | {"2016-12-28 21:26:22"} | 2016-12-28 21:26:22.604793 | 2016-12-28 21:26:22.604793
(1 row)
```

As you can see the precision is not being stored correctly.

If we update the value manually:

```
rails_test=# UPDATE contracts set invoiced_dates = '{"2016-12-28 21:26:22.123456"}' where id = 1;                                                             
UPDATE 1
rails_test=# select * from contracts;                                                                                                                          id |     next_invoice_date      |         invoiced_dates         |         created_at         |         updated_at         
----+----------------------------+--------------------------------+----------------------------+----------------------------
  1 | 2016-12-28 21:26:14.445997 | {"2016-12-28 21:26:22.123456"} | 2016-12-28 21:26:22.604793 | 2016-12-28 21:26:22.604793
(1 row)
```

If then we use Rails's console and take a look at the value:

```
2.4.0-rc1 :007 > c = Contract.first
  Contract Load (3.5ms)  SELECT  "contracts".* FROM "contracts" ORDER BY "contracts"."id" ASC LIMIT $1  [["LIMIT", 1]]
 => #<Contract id: 1, next_invoice_date: "2016-12-28 21:26:14", invoiced_dates: [Wed, 28 Dec 2016 21:26:22 UTC +00:00], created_at: "2016-12-28 21:26:22", updated_at: "2016-12-28 21:26:22"> 
2.4.0-rc1 :008 > c.invoiced_dates
 => [Wed, 28 Dec 2016 21:26:22 UTC +00:00] 
2.4.0-rc1 :009 > c.invoiced_dates.first
 => Wed, 28 Dec 2016 21:26:22 UTC +00:00 
2.4.0-rc1 :010 > c.invoiced_dates.first.usec
 => 123456
```

As you can see, it shows the microseconds. So it looks like there is a bug in Active Record when it saves the value.

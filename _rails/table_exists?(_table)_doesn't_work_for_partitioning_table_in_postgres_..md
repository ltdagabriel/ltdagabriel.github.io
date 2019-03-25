---
title: table_exists?(:table) doesn't work for partitioning table in postgres 10.
labels: activerecord, attached PR
layout: issue
---

### Steps to reproduce
1. Create Declarative Partitioning in Postgres10 (https://www.postgresql.org/docs/10/static/ddl-partitioning.html)
```
CREATE TABLE measurement (
    city_id         int not null,
    logdate         date not null,
    peaktemp        int,
    unitsales       int
) PARTITION BY RANGE (logdate);

CREATE TABLE measurement_y2006m02 PARTITION OF measurement
    FOR VALUES FROM ('2006-02-01') TO ('2006-03-01');

CREATE TABLE measurement_y2006m03 PARTITION OF measurement
    FOR VALUES FROM ('2006-03-01') TO ('2006-04-01');
```
2. Check table_exists?('measurement')
`ActiveRecord::Base.connection.table_exists?('measurement')`
will return false. See **Actual behavior**

### Expected behavior
table_exists?(:table_name) will return `true` if partitioning tables in Postgres exist.

### Actual behavior
table_exists?(:table_name) returns `false ` for partitioning tables in Postgres/

We have a partitioning table in Postgres10
```
db => \d+ raw_data;
                                               Table "public.raw_data"
  Column  |       Type        | Collation | Nullable |        Default        | Storage  | Stats target | Description
----------+-------------------+-----------+----------+-----------------------+----------+--------------+-------------
 uid      | character varying |           | not null |                       | extended |              |
 received | double precision  |           |          |                       | plain    |              |
 format   | character varying |           |          | ''::character varying | extended |              |
 data_bin | bytea             |           | not null |                       | extended |              |
Partition key: RANGE (to_timestamp(received))
Partitions: raw_data_tsts_y2016m01 FOR VALUES FROM (MINVALUE) TO ('2017-01-01 00:00:00+00'),
            raw_data_tsts_y2017m01 FOR VALUES FROM ('2017-01-01 00:00:00+00') TO ('2017-02-01 00:00:00+00'),
```
But ActiveRecord table_exist? returns false
```
2.4.0 :002 > ActiveRecord::Base.connection.table_exists?('raw_data')
 => false
```
SQL But table exists:
```
2.4.0 :040 > ActiveRecord::Base.connection.execute("SELECT * FROM pg_catalog.pg_tables where tablename = 'raw_data';").each{ |t| p t};1
{"schemaname"=>"public", "tablename"=>"raw_data", "tableowner"=>"owner", "tablespace"=>nil, "hasindexes"=>false, "hasrules"=>false, "hastriggers"=>false, "rowsecurity"=>false}
```
The issue is that relkind for that kind of tables is 'p'
```
db=> SELECT c.relname, relkind FROM pg_class c LEFT JOIN pg_namespace n ON n.oid = c.relnamespace where relname='raw_data';
 relname  | relkind
----------+---------
 raw_data | p
```
But method data_source_sql requires relkind as 'r' for tables if I'm not wrong in reading code.
```
def data_source_sql(name = nil, type: nil)
            scope = quoted_scope(name, type: type)
            scope[:type] ||= "'r','v','m'" # (r)elation/table, (v)iew, (m)aterialized view

            sql = "SELECT c.relname FROM pg_class c LEFT JOIN pg_namespace n ON n.oid = c.relnamespace"
            sql << " WHERE n.nspname = #{scope[:schema]}"
            sql << " AND c.relname = #{scope[:name]}" if scope[:name]
            sql << " AND c.relkind IN (#{scope[:type]})"
            sql
end
```
### System configuration
**Rails version**:
5,1.6
**Ruby version**:
2.3.6
**PostgreSQL**:
10.3

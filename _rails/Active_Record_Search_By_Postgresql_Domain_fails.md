---
title: Active Record Search By Postgresql Domain fails
labels: activerecord
layout: issue
---

When trying to do search based on a  domain type in postgres,  getting the 

NoMethodError: undefined method `to_sym' for nil:NilClass

   /Users/doon/.rvm/gems/ruby-2.1.2@postgres_domain_bug/gems/activerecord-4.1.2.rc1/lib/active_record/connection_adapters/abstract/schema_statements.rb:686:in `type_to_sql'

Which appears to be related to trying to quote a null type, similar to  to #14678 and #7814 which deal with enums, as opposed to generic domain types..  In this case I get the unknown OID (which i can deal with), but then get  hit by the  quoting a null column type..  I've gotten around it by using find_by_sql as opposed to find_by or where 

here is gist that will replicate the issue.  (4.1.2RC1 against Postgresql 9.3.4

https://gist.github.com/doon/5bd48aa530bcbcad37b9


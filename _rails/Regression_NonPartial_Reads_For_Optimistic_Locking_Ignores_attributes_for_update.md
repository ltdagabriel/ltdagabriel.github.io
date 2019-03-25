---
title: Regression - Non-Partial Reads For Optimistic Locking Ignores #attributes_for_update
labels: activerecord
layout: issue
---

While testing the SQL Server adapter for 4.2.1.rc1, I noticed that the `test_partial_update_with_optimistic_locking` test was failing for us. SQL Server does not allow identity columns in updates so we override [attributes_for_update](https://github.com/rails-sqlserver/activerecord-sqlserver-adapter/blob/master/lib/active_record/connection_adapters/sqlserver/core_ext/attribute_methods.rb) to remove identity columns. This works for that test in 4.2.0, but not after this change (https://github.com/rails/rails/commit/cb277485f9d78f3661c7103e7b468812cc283223) done for issue #18385.

With that commit, optimistic locking does not seem to use the proper active record/model attribute chain. Would really like some opinions from @sgrif and @rafaelfranca Thanks!


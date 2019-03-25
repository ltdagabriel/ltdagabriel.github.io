---
title: PostgreSQL OID Bit column type issue on Rails 5
labels: PostgreSQL, activerecord, attached PR
layout: issue
---

On upgrade to Rails 5, I have issue with Postgres `bit` column type and overwriting reader method
You can see the issue: https://gist.github.com/morgoth/1d3725b3e73b91e164d5e20a81221e8f

It was working fine on Rails 4.2, now it raises:

```
NoMethodError: undefined method `[]' for #<ActiveRecord::ConnectionAdapters::PostgreSQL::OID::Bit::Data:0x00557ede32d2c0>
```
### System configuration

**Rails version**: 5.0.0

**Ruby version**: 2.3.1


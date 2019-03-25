---
title: Calculate duration it has been changed between 5.1.1 and 5.1.2
labels: activesupport
layout: issue
---

### Steps to reproduce

Related to: https://github.com/rails/rails/pull/29163

Rails 5.1.1

For simplification i cast `ActiveSupport::TimeWithZone` from DateTime but currently we getting this object directly from ActiveRecord (`created_at` and `updated_at`) for example.

```ruby
rental_end = DateTime.parse('01-01-2017 12:45:00').utc.in_time_zone('Europe/Berlin')
rental_start = DateTime.parse('01-01-2017 12:00:00').utc.in_time_zone('Europe/Berlin')
(rental_end - rental_start) / 1.hour
=> 0.75
```

### Expected behavior

I would say it's fine to keep ActiveSupport::Duration but should be mention in Changelog as breaking change.

### Actual behavior

Rails 5.1.2

```ruby
rental_end = DateTime.parse('01-01-2017 12:45:00').utc.in_time_zone('Europe/Berlin')
rental_start = DateTime.parse('01-01-2017 12:00:00').utc.in_time_zone('Europe/Berlin')
(rental_end - rental_start) / 1.hour
=> 2700.0 hours
```

Can be fixed with explicit conversion to scalar type (Float)

```ruby
rental_end = DateTime.parse('01-01-2017 12:45:00').utc.in_time_zone('Europe/Berlin')
rental_start = DateTime.parse('01-01-2017 12:00:00').utc.in_time_zone('Europe/Berlin')
(rental_end.to_f - rental_start.to_f) / 1.hour.to_f
=> 0.75
```


### System configuration
**Rails version**: 5.1.1

**Ruby version**: 2.4.1 2.4.1p111 (2017-03-22 revision 58053) [x86_64-linux]

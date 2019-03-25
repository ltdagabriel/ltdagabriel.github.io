---
title: as_json works differently for preload and eagerload
labels: activerecord, attached PR, docs
layout: issue
---

### Steps to reproduce

```
class Portfolio < ActiveRecord::Base
  has_many :tickets
end
class Ticket < ActiveRecord::Base
  belongs_to :portfolio
end

@tickets = Ticket.includes(:portfolio).select('tickets.*', 'SUBSTRING(tickets.title,1,4) as code')
@tickets.first.as_json
@tickets.references(:portfolio).first.as_json
```
### Expected behavior

`@tickets.first.as_json` should be equal to `@tickets.references(:portfolios).first.as_json`
### Actual behavior

`@tickets.first.as_json` includes the **code** (alias column defined in the `select`)
`@tickets.references(:portfolios).first.as_json` does not include the **code** (alias column defined in the `select`)
### Note

The problem arises only when `eager_load` is called by `includes`, `preload` works fine. More to that, using `joins` works fine aswell. 
### System configuration

**Rails version**: 4.2.6

**Ruby version**: 2.1.8


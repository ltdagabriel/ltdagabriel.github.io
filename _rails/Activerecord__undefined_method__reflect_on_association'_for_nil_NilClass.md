---
title: Activerecord 5: undefined method `_reflect_on_association' for nil:NilClass
labels: activerecord
layout: issue
---

### System configuration

**Rails version**: 4.2.6 and 5.0.0.beta3( and master)
**Ruby version**: 2.2.4
**Database**: Postgresql 9.3
**Webserver**: Sinatra
**Gemfile:**
- gem  'sinatra'
- # gem 'activerecord', '< 5.0'
- gem 'activerecord', github: 'rails/rails', branch: 'master'
- gem 'pg'

**Active record 4.2.6**: no problem;
**Last beta version and master version**: I have this error: undefined method `_reflect_on_association' for nil:NilClass

My models are linked to exist tables on remote database and I read a view and write into a table.

`
class User < ActiveRecord::Base
  # id, code, body, date_created
  self.table_name = 'view_users'
  self.primary_key = 'id'
  has_many :histories, :class_name => "UserHistory", :foreign_key => "users_id"
end
`

`
class UserHistory < ActiveRecord::Base
  # id, users_id, body, date_created
  self.table_name = 'giri.users_history'
  belongs_to :user, :class_name => "User", :foreign_key => "users_id"
end
`

If I try:
u = User.first
h = user.histories
I have the error **undefined method `_reflect_on_association' for nil:NilClass** on Activerecord 5 but not on Activerecord 4.2.6

Any suggestions?


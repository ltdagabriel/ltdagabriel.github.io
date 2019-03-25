---
title: Duplicate insert on autosave for specific HABTM-has_one combo
labels: With reproduction steps, activerecord, attached PR
layout: issue
---

### Steps to reproduce

``` ruby
class Organisation < ActiveRecord::Base
  has_one :user
end

class User < ActiveRecord::Base
  has_and_belongs_to_many :roles
  belongs_to :organisation
end

class Role < ActiveRecord::Base
  has_and_belongs_to_many :users
end

user = User.new
user.organisation = Organisation.new
user.roles << Role.new
user.save!
```

Here is my [Active Record Executable Test Case](https://gist.github.com/nbekirov/01c34d2b99ed5bcf9154)

This issue is related to [Rolify: Duplicate Roles #228](https://github.com/RolifyCommunity/rolify/issues/228)

Some observations:
- If I change the order of `has_and_belongs_to_many` and `belongs_to` in `User` there is no issue
- If I add `autosave: false` to `has_and_belongs_to_many` in `User` there is no issue

Here is an issue I've found that seems related but I don't think is quite the same: [has_and_belongs_to_many autosaves duplicate records](https://github.com/rails/rails/issues/3639)
### Expected behavior

One `User` with one `Organisation` and one `Role` saved

``` sql
INSERT INTO "organisations" DEFAULT VALUES
INSERT INTO "users" ("organisation_id") VALUES (?)  [["organisation_id", 1]]
INSERT INTO "roles" DEFAULT VALUES
INSERT INTO "roles_users" ("user_id", "role_id") VALUES (?, ?)  [["user_id", 1], ["role_id", 1]]
```
### Actual behavior

One `User` with one `Organisation` and **two** `Role`-s saved

``` sql
INSERT INTO "organisations" DEFAULT VALUES
INSERT INTO "users" ("organisation_id") VALUES (?)  [["organisation_id", 1]]
INSERT INTO "roles" DEFAULT VALUES
INSERT INTO "roles_users" ("user_id", "role_id") VALUES (?, ?)  [["user_id", 1], ["role_id", 1]]
INSERT INTO "roles_users" ("user_id", "role_id") VALUES (?, ?)  [["user_id", 1], ["role_id", 1]]
```
### System configuration

**Rails version**:
N/A

**Ruby version**:

``` bash
$ ruby -v
ruby 2.3.0p0 (2015-12-25 revision 53290) [x86_64-linux-gnu]
```


---
title: has_many conditions doesn't scope with nested hash
labels: activerecord
layout: issue
---

Lets say that there we have a setup with 3 models. 
1. A project model, that can has many users in several roles (and, a single user can be assigned to multiple roles).
2. A user model, that has many projects
3. A project_users model, that, next to user_id and project_id also has an attribute called role.

So, to assign a user (ID:1) as a development group in a project (ID:1) I would create a project_users model with (user_id:1, project_id:1, role: "developer"). Using a has_many relation, I would specify this in the project model as:

```
has_many :developers, :through => :project_users, :source => :user, 
         :conditions => {:project_users => {:role => :developer}}
```

The conditions hash takes care of only loading developers when you ask for `@project.developers`. However, when using `@project.developers.build` or `@project.developers.new`, or when adding a user by `@project.developers << User.create(name: "test")`, the new join model does not have the role attribute set. Perhaps worse, assigning a user using `@project.developers << @user` leads rails to believe that the user is added as a developer, but when reloading the project model the user is not saved as a developer. (the console shows that the join model is created with role=nil.)

```
@project.developers << @user 
# Results in: INSERT INTO "project_users" ("created_at", "project_id", "role", "updated_at", "user_id") VALUES (?, ?, ?, ?, ?)  [["created_at", Mon, 07 Nov 2011 10:37:00 UTC +00:00], ["project_id", 1], ["role", nil], ["updated_at", Mon, 07 Nov 2011 10:37:00 UTC +00:00], ["user_id", 1]]
@project.developers
# Returns the user from @user
@project.reload
@project.developers
# Returns an empty array
```

Perhaps this is intentional, perhaps I'm missing some code design trick that solves all this, but otherwise I would like to add this as a feature request. See also [this discussion on stackoverflow.com](http://stackoverflow.com/questions/7753162/rails-3-has-many-through-join-table-conditions-scoping/8025731#8025731)


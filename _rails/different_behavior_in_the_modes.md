---
title: different behavior in the modes
labels: activerecord, needs feedback
layout: issue
---

User model

``` ruby
class User < ActiveRecord::Base
  has_secure_password
  validates :password_confirmation, presence: true, if: :password_digest_changed?
  validates :password, length: { minimum: 6 }, confirmation: true, if: :password_digest_changed?
  validates :name, :email, presence: true
  validates :email, uniqueness: true
end
```

User migration

``` ruby
class CreateUsers < ActiveRecord::Migration
  def change
    enable_extension "uuid-ossp"
    create_table :users, id: :uuid do |t|
      t.string :name,             null: false
      t.string :email,            null: false
      t.string :password_digest,  null: false
      t.timestamps
    end
  end
end
```

```
$ rails c
```

``` ruby
Loading development environment (Rails 4.0.0.rc1)
2.0.0p0 :001 > credentials = { name: 'user', email: 'example@gmail.com', password: '123456', password_confirmation: '123456' }
 => {:name=>"user", :email=>"example@gmail.com", :password=>"123456", :password_confirmation=>"123456"} 
2.0.0p0 :002 > user = User.create!(credentials)
   (0.1ms)  BEGIN
  User Exists (0.7ms)  SELECT 1 AS one FROM "users" WHERE "users"."email" = 'example@gmail.com' LIMIT 1
  SQL (3.9ms)  INSERT INTO "users" ("created_at", "email", "name", "password_digest", "updated_at") VALUES ($1, $2, $3, $4, $5) RETURNING "id"  [["created_at", Fri, 03 May 2013 12:00:20 UTC +00:00], ["email", "example@gmail.com"], ["name", "user"], ["password_digest", "$2a$10$ObNf6FsqGw9Ue.murjOTgu6xMJINHk9eXiz67k/hB7DTKlf.yA2.."], ["updated_at", Fri, 03 May 2013 12:00:20 UTC +00:00]]
   (0.3ms)  COMMIT
 => #<User id: "5db033d7-022b-4c01-a711-44366f43f2d4", name: "user", email: "example@gmail.com", password_digest: "$2a$10$ObNf6FsqGw9Ue.murjOTgu6xMJINHk9eXiz67k/hB7DT...", created_at: "2013-05-03 12:00:20", updated_at: "2013-05-03 12:00:20"> 
2.0.0p0 :003 > 
```

```
$ RAILS_ENV=test rails c
```

``` ruby
Loading test environment (Rails 4.0.0.rc1)
2.0.0p0 :001 > credentials = { name: 'user', email: 'example@gmail.com', password: '123456', password_confirmation: '123456' }
 => {:name=>"user", :email=>"example@gmail.com", :password=>"123456", :password_confirmation=>"123456"} 
2.0.0p0 :002 > user = User.create!(credentials)
   (0.1ms)  BEGIN
  User Exists (0.6ms)  SELECT 1 AS one FROM "users" WHERE "users"."email" = 'example@gmail.com' LIMIT 1
  SQL (2.9ms)  INSERT INTO "users" ("created_at", "email", "name", "password_digest", "updated_at") VALUES ($1, $2, $3, $4, $5)  [["created_at", Fri, 03 May 2013 12:00:08 UTC +00:00], ["email", "example@gmail.com"], ["name", "user"], ["password_digest", "$2a$04$f0Da7PvhoBrg61bJuBclH.vSOadzU8lkI5nCuTwGBul.g7FR5VbRW"], ["updated_at", Fri, 03 May 2013 12:00:08 UTC +00:00]]
PG::Error: ERROR:  null value in column "id" violates not-null constraint
DETAIL:  Failing row contains (null, user, example@gmail.com, $2a$04$f0Da7PvhoBrg61bJuBclH.vSOadzU8lkI5nCuTwGBul.g7FR5VbRW, null, null, 2013-05-03 12:00:08.735155, 2013-05-03 12:00:08.735155).
: INSERT INTO "users" ("created_at", "email", "name", "password_digest", "updated_at") VALUES ($1, $2, $3, $4, $5)
   (0.1ms)  ROLLBACK
```


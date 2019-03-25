---
title: Transaction problem of active storage
labels: activestorage
layout: issue
---

### Steps to reproduce

added test to activestorage/test/models/attachments_test.rb

```ruby
  test "transaction test" do
    @user.avatar.attach create_blob(filename: "funky.jpg", data: "funky.jpg")

    perform_enqueued_jobs do
      e = assert_raises NoMethodError do
        ActiveRecord::Base.transaction do
          @user.avatar.attach create_blob(filename: "town.jpg", data: "town.jpg")
          foo!
        end
      end
    end

    assert_equal "funky.jpg", @user.reload.avatar.filename.to_s
    assert_equal "funky.jpg", @user.reload.avatar.download
  end
```

### Expected behavior

Processing is rolled back, funky.jpg remains as a record, and funky.jpg can be downloaded.

When updating a record, there may be a validation error in elements other than AS.
If you create a transaction, you also expect the behavior of rolling back files at this time.

Actually, `#purge_later` processing as callback is defined as `after_destroy_commit.`
https://github.com/rails/rails/blob/master/activestorage/lib/active_storage/attached/macros.rb#L47

However, under the influence of the following code it seems that `#purge_later` will be running before commit.
https://github.com/rails/rails/blob/master/activestorage/lib/active_storage/attached/one.rb#L32

How about stopping calling `#purge_later` in `#attach` and adding a condition other than `attached?` to the condition of `#purge_later` in `attched/one.rb` ?
https://github.com/rails/rails/blob/master/activestorage/lib/active_storage/attached/one.rb#L65

### Actual behavior

```bash
 $ > bundle exec rake test TEST=test/models/attachments_test.rb TESTOPTS="--name=test_transaction_test"
Missing service configuration file in test/service/configurations.yml
== 20170806125915 CreateActiveStorageTables: migrating ========================
-- create_table(:active_storage_blobs)
   -> 0.0009s
-- create_table(:active_storage_attachments)
   -> 0.0011s
== 20170806125915 CreateActiveStorageTables: migrated (0.0021s) ===============

==  ActiveStorageCreateUsers: migrating =======================================
-- create_table(:users)
   -> 0.0003s
==  ActiveStorageCreateUsers: migrated (0.0004s) ==============================

Run options: --name=test_transaction_test --seed 2624

# Running:

E

Error:
ActiveStorage::AttachmentsTest#test_transaction_test:
Errno::ENOENT: No such file or directory @ rb_sysopen - /var/folders/k5/20ls9d1173n5_gyvbrbwwlj00000gn/T/active_storage_tests20180404-36880-1xgsfyj/KM/Ph/KMPhTUemVRXARBZKP9aB6Dqn



bin/rails test /Users/username/.ghq/github.com/rails/rails/activestorage/test/models/attachments_test.rb:46



Finished in 0.081944s, 12.2035 runs/s, 24.4069 assertions/s.
1 runs, 2 assertions, 0 failures, 1 errors, 0 skips
```

### System configuration
**Rails version**: master branch(a07d0680787ced3c04b362fa7a238c918211ac70)

**Ruby version**: ruby 2.4.2p198 (2017-09-14 revision 59899) [x86_64-darwin17]

cc: @georgeclaghorn


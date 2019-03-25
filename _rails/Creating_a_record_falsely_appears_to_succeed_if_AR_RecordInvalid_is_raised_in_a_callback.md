---
title: Creating a record falsely appears to succeed if AR::RecordInvalid is raised in a callback
labels: activerecord
layout: issue
---

Hello,

If `.create` is used to create a record and an `ActiveRecord::RecordInvalid` exception is raised in an `after_save` callback say, then the returned record will appear to have been persisted even though the transaction has been rolled back.

``` ruby
class Foo < ActiveRecord::Base
  after_save { raise ActiveRecord::RecordInvalid.new(Foo.new) }
end

foo = Foo.create
foo.persisted? # => true
foo.id # => not nil

Foo.find(foo.id) # raises ActiveRecord::RecordNotFound
```

If `.new` and `#save` are used instead, then at least the return value of `#save` can be inspected even if the record remains in a similar, misleading state.

Here's a test that highlights the issue:

```
diff --git a/activerecord/test/cases/transactions_test.rb b/activerecord/test/cases/transactions_test.rb
index 110a187..878e656 100644
--- a/activerecord/test/cases/transactions_test.rb
+++ b/activerecord/test/cases/transactions_test.rb
@@ -204,6 +204,25 @@ class TransactionTest < ActiveRecord::TestCase
     end
   end

+  def test_callback_rollback_in_create_with_record_invalid_exception
+    new_topic = Topic.new(:title => "A new topic")
+
+    begin
+      Topic.class_eval <<-eoruby, __FILE__, __LINE__ + 1
+        remove_method(:after_create_for_transaction)
+        def after_create_for_transaction
+          raise ActiveRecord::RecordInvalid.new(Author.new)
+        end
+      eoruby
+
+      new_topic = Topic.create(:title => "A new topic")
+      assert !new_topic.persisted?
+      assert_nil new_topic.id
+    ensure
+      remove_exception_raising_after_create_callback_to_topic
+    end
+  end
+
   def test_nested_explicit_transactions
     Topic.transaction do
       Topic.transaction do
```

Thanks.


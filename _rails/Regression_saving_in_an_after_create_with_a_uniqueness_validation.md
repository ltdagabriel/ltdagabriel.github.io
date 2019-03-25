---
title: Regression saving in an after_create with a uniqueness validation
labels: With reproduction steps, activerecord, attached PR
layout: issue
---

Currently, on master, if you save a record in an `after_create` on a model with a uniqueness validation, the validation always fails.  This was previously working in 5.0.0.beta2 and also works on rails 4.2.5.

I have git bisected this to: https://github.com/rails/rails/pull/23581

Note: From #23581, changing from `id` to `id_was` breaks `after_create` and `after_save` callbacks because `id_was` trails `id` for these callbacks.  In other words, the `id_was` value is the pre-save/pre-create value.  In my example below, `id_was` is nil in the `after_create`, while `id` is not nil.

Full recreation script and output is here:
https://gist.github.com/jrafanie/083fff24b2c1532d2545

**With rails master**: 
Because `id_was` is nil, the validation query from the gist above looks like this:

```
Topic Exists (0.1ms)  SELECT  1 AS one FROM "topics" WHERE "topics"."title" = ? AND ("topics"."id" IS NOT NULL) LIMIT ?  [["title", "test"], ["LIMIT", 1]]
```

Note, the "topics"."id" where clause doesn't exclude itself, the just saved object, so the validation fails!

**With gem 'rails', "=5.0.0.beta2"**:
The validation works correctly by issuing the following query:

```
Topic Exists (0.1ms)  SELECT  1 AS one FROM "topics" WHERE "topics"."title" = ? AND ("topics"."id" != ?) LIMIT ?  [["title", "test"], ["id", 1], ["LIMIT", 1]]
```

Note, the "topics"."id" where clause excludes itself, the just saved object, so the validation passes.

I have hacked the change from #23581 to use the `id` if `id_was` is nil and all tests pass.  Clearly, this isn't correct but I wanted to try the easiest thing.

``` diff
diff --git a/activerecord/lib/active_record/validations/uniqueness.rb b/activerecord/lib/active_record/validations/uniqueness.rb
index 13053be..4a80cda 100644
--- a/activerecord/lib/active_record/validations/uniqueness.rb
+++ b/activerecord/lib/active_record/validations/uniqueness.rb
@@ -18,7 +18,7 @@ module ActiveRecord
         relation = build_relation(finder_class, table, attribute, value)
         if record.persisted?
           if finder_class.primary_key
-            relation = relation.where.not(finder_class.primary_key => record.id_was)
+            relation = relation.where.not(finder_class.primary_key => record.id_was || record.id)
           else
             raise UnknownPrimaryKey.new(finder_class, "Can not validate uniqueness for persisted record without primary key.")
           end
```


---
title: Rails 5.0.2 Jsonb attribute has incorrect value after save
labels: activerecord, attached PR, regression
layout: issue
---

After upgrading Rails from v5.0.1 to v5.0.2 one of specs in my app started to fail. After further investigation I discovered that a `jsonb` attribute which stores array of hashes doesn't behave in the same way as it used to in v5.0.1 and earlier versions.

After creating a new model and passing an array of hashes to my `jsonb` attribute, I can access the value with no issues. The getter returns an array of hashes as expected. Right after calling `save` on the model the getter is no longer returning an array of hashes, but an array of stringified JSONs instead. The correct behavior is restored after calling `reload`. 

I looked at the diff in ActiveRecord gem between v5.0.1 and v5.0.2 and discovered that the commit 11cad58 which fixes #27514 is responsible for my problem. The issue disappeared after reverting this commit from v5.0.2 tag.

My database is Postgresql 9.5.2.

### Steps to reproduce

1. Create a new model: 

```bash
bundle exec rails g model Thing col:jsonb
```

2. Edit the migration file and add `array: true` to the attribute:

```ruby
class CreateThings < ActiveRecord::Migration[5.0]
  def change
    create_table :things do |t|
      t.jsonb :col, array: true

      t.timestamps
    end
  end
end
```

3. run the migration (the database needs to be **Postgresql**):

```bash
bundle exec rake db:migrate
```

4. open the console:

```bash
bundle exec rails c
```

5. In the console:

```ruby
irb(main):001:0> t = Thing.new(col: [{foo: "bar"}])
=> #<Thing id: nil, col: [{"foo"=>"bar"}], created_at: nil, updated_at: nil>

irb(main):003:0> t.col.first # OK
=> {"foo"=>"bar"}

irb(main):004:0> t.save
=> true

irb(main):003:0> t.col.first # ERROR: stringified JSON instead of Hash!
=> "{\"foo\":\"bar\"}"

irb(main):004:0> t.reload
=> #<Thing id: 1,.....


irb(main):003:0> t.col.first # OK again
=> {"foo"=>"bar"}
```

### Expected behavior

The `jsonb` attribute should contain an array of hashes after the object has been persisted.

### Actual behavior

The `jsonb` attribute contains an array of stringified JSONs after the object has been persisted.

### System configuration
**Rails version**: 5.0.2

**Ruby version**: 2.3.3p222


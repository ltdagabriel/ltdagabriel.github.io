---
title: Postgres hstore conflicts with serialization
labels: PostgreSQL, activerecord, attached PR
layout: issue
---

Think of the following object:

``` ruby
class User < ActiveRecord::Base
  class Options
    class Serializer
      def self.load(hash)
        Options.new(hash)
      end

      def self.dump(object)
        object.to_hash
      end
    end

    attr_accessor :background

    def to_hash
      { background: background }
    end

    private

    def initialize(attributes)
      self.background = attributes[:background]
    end
  end

  serialize :options, Options::Serializer
end
```

The `options` column is a Postgre `hstore` one supported since Rails 4.0.0.

When object gets initialized of fetched from database, `User::Options::Serializer.load` receives a hash (Rails typecasted pg's hstore into a hash).

However, when duplicating an object, `User::Options::Serializer.load` gets the raw Postgres hstore; which is unexpected.

I've found a workaround which is to check the type of input and if it's a string convert it to a hash using `#string_to_hstore`. But it's not the right thing to do, is it?

I've created an app and a test to better demonstrate this situation:
https://github.com/leods92/hstore_dup_bug

Maybe this was by design but I don't think so since Rails tends to be very standard and to meet one's expectations.
One might argue that since I'm using a Serializer, input should be unserialized. Okay, great, but in this case `Serializer.load` should _always_ get hstore raw string.
I don't really agree with that since a Serializer should only handle its own serialization not typecasting.

Maybe the problem is in `active_record/attribute_methods/serialization.rb` on `#read_attribute_before_type_cast`.
I feel that I'm very close to understand the whole process but since I've already spent hours on this I decided to post this and let somebody more experienced give his thoughts on this.

Some issues that might be related to this problem:
https://github.com/rails/rails/issues/5797
https://github.com/rails/rails/issues/4837


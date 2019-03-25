---
title: Updating a PostgreSQL array column with UTF-8 text messes up the encoding
labels: With reproduction steps, activerecord, needs feedback
layout: issue
---

### Steps to reproduce

Assuming a database table with an array column:

```
create_table :examples do |t|
  t.text :array_of_text, default: [], array: true
end
```

And a corresponding model:

```
class Example < ApplicationRecord
end
```

Inserting some UTF-8 text in the array column changes the encoding of the text to binary:

```
> e = Example.create(array_of_text: ['Mørk'])
   (0.2ms)  BEGIN
  SQL (0.6ms)  INSERT INTO "examples" ("array_of_text") VALUES ($1) RETURNING "id"  [["array_of_text", "{M\xC3\xB8rk}"]]
   (3.3ms)  COMMIT
> e.array_of_text.first => "M\xC3\xB8rk"
> e.array_of_text.first.encoding => #<Encoding:ASCII-8BIT>
```

Reloading the object reverts back to UTF-8:

```
> e.reload
> e.array_of_text.first => "Mørk"
> e.array_of_text.first.encoding => #<Encoding:UTF-8>
```

The behavior can be reproduced on update as well.
The behavior can be reproduced with array of strings columns as well.
The behavior cannot be reproduced on simple text or string columns.
### Expected behavior

The encoding of the text is preserved after the create/update.
### System configuration

**Rails version**: 5.0.0.1 or 5.1.0.alpha
**Ruby version**: 2.3.1
**PostgreSQL**: 9.5.4

The behavior cannot be reproduced with rails 4.2.7.1 using the same system configuration.
### Executable test

```
begin
  require "bundler/inline"
rescue LoadError => e
  $stderr.puts "Bundler version 1.10 or later is required. Please update your Bundler"
  raise e
end

gemfile(true) do
  source "https://rubygems.org"
  gem "rails", github: "rails/rails"
  gem "pg"
end

require "active_record"
require "minitest/autorun"
require "logger"

ActiveRecord::Base.establish_connection(adapter: "postgresql", host: "localhost", port: 5432, database: "example_database", user: "example", password: "example")
ActiveRecord::Base.logger = Logger.new(STDOUT)

ActiveRecord::Schema.define do
  create_table :examples, force: true do |t|
    t.text :array_of_text, default: [], array: true
  end
end

class Example < ActiveRecord::Base
end

class BugTest < Minitest::Test
  def test_array_column
    example = Example.create!(array_of_text: ["Mørk"])

    text = example.array_of_text.first
    assert_equal "Mørk", text
    assert_equal Encoding::UTF_8, text.encoding
  end
end
```


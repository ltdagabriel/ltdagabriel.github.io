---
title: Adding foreign key fails on db:schema:load task for some table names
labels: activerecord, regression
layout: issue
---

After migrating to 4.2.1 the `db:schema:load` task fails on:

``` ruby
add_foreign_key "examples", "waves", name: "examples_wave_id_fk"
```

due to `config/initializers/inflections.rb` with a custom inflection:

``` ruby
ActiveSupport::Inflector.inflections do |inflect|
  inflect.irregular 'wave', 'waves'
end
```

not being loaded. Because of that:

``` ruby
>> 'waves'.singularize
=> 'wafe' #should be 'wave'
```

and the task crashes with `ActiveRecord::StatementInvalid: PG::UndefinedColumn: ERROR: column "wafe_id" does not exist`.

It was introduced in 4f357ea104b0a69db332f6af17ffef174715bbc7. If this is intentional is there any workaround?


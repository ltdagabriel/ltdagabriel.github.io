---
title: Rails 3.2.12 breaks some find_by_sql queries 
labels: activerecord
layout: issue
---

I'm using the [ajaxful_rating](https://github.com/edgarjs/ajaxful-rating) gem on a project, and upgrading to 3.2.12 broke a complex join query with this [method](https://github.com/edgarjs/ajaxful-rating/blob/rails3/lib/axr/model.rb#L235-L246):

```
    # Finds rateable objects by Rate's attribute.
    def find_statement(attr_name, attr_value, dimension = nil)
      sql = "SELECT DISTINCT r2.* FROM rates r1 INNER JOIN "\
        "#{self.base_class.table_name} r2 ON r1.rateable_id = r2.id WHERE "

      sql << sanitize_sql_for_conditions({
        :rateable_type => self.base_class.name,
        attr_name => attr_value,
        :dimension => (dimension.to_s if dimension)
      }, 'r1')

      find_by_sql(sql)
    end
```

Under 3.2.12 this caused a Postgres error:

```
ActiveRecord::StatementInvalid (PG::Error: ERROR:  relation "r1" does not exist
LINE 5:              WHERE a.attrelid = '"r1"'::regclass
                                        ^
:             SELECT a.attname, format_type(a.atttypid, a.atttypmod),
                     pg_get_expr(d.adbin, d.adrelid), a.attnotnull, a.atttypid, a.atttypmod
              FROM pg_attribute a LEFT JOIN pg_attrdef d
                ON a.attrelid = d.adrelid AND a.attnum = d.adnum
             WHERE a.attrelid = '"r1"'::regclass
               AND a.attnum > 0 AND NOT a.attisdropped
             ORDER BY a.attnum
):
```

I was able to get this working under 3.2.12 using a revised method:

```
  def find_statement(attr_name, attr_value, dimension = nil)

    sql = "SELECT DISTINCT r2.* FROM rates r1 INNER JOIN "\
      "#{self.base_class.table_name} r2 ON r1.rateable_id = r2.id WHERE "

    sql << sanitize_sql_for_conditions({
      :rateable_type => self.base_class.name.to_s,
      attr_name => attr_value.to_s,
      :dimension => (dimension.to_s if dimension)
    }, 'r1')

    find_by_sql(sql)
  end
```

As you can see, I've only added `to_s` to the _rateable_type_ and _attr_name_ conditions. I believe this is related to the [quoting changes](https://github.com/rails/rails/compare/v3.2.11...v3.2.12#L9R29) made to ActiveRecord in 3.2.12, but I don't know the code well enough to pinpoint this yet.


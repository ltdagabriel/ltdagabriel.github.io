---
title: PostgreSQL adapter can't handle exception if it doesn't support "#result"
labels: activerecord
layout: issue
---

When logging the SQL, the exception fed to `translate_exception` 

on [`activerecord/lib/active_record/connection_adapters/postgresql_adapter.rb:600`](https://github.com/rails/rails/blob/master/activerecord/lib/active_record/connection_adapters/postgresql_adapter.rb#L600):

``` ruby
        def translate_exception(exception, message)
          case exception.result.try(:error_field, PGresult::PG_DIAG_SQLSTATE) # <= L600
          when UNIQUE_VIOLATION
            RecordNotUnique.new(message, exception)
          when FOREIGN_KEY_VIOLATION
            InvalidForeignKey.new(message, exception)
          else
            super
          end
        end
```

isn't a DB error but a TypeError from the quoting `type_cast` 

[`activerecord/lib/active_record/connection_adapters/abstract/quoting.rb:76`](https://github.com/rails/rails/blob/master/activerecord/lib/active_record/connection_adapters/abstract/quoting.rb#L76):

``` ruby
      def type_cast(value, column)
        return value.id if value.respond_to?(:quoted_id)

        case value
        when String, ActiveSupport::Multibyte::Chars
          value = value.to_s
          return value unless column

          case column.type
          when :binary then value
          when :integer then value.to_i
          when :float then value.to_f
          else
            value
          end

        when true, false
          if column && column.type == :integer
            value ? 1 : 0
          else
            value ? 't' : 'f'
          end
          # BigDecimals need to be put in a non-normalized form and quoted.
        when nil then nil
        when BigDecimal then value.to_s('F')
        when Numeric then value
        when Date, Time then quoted_date(value)
        when Symbol then value.to_s
        else
          to_type = column ? " to #{column.type}" : ""
          raise TypeError, "can't cast #{value.class}#{to_type}" # <= L76
        end
      end
```

so `exception.result` on line 600 yields a `NoMethodError`, `exception` being a `TypeError`.


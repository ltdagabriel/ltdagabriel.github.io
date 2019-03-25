---
title: Using becomes! on an association does not properly set the changed_attribute for the STI column
labels: activerecord, attached PR
layout: issue
---

In Rails 4.1.6, when calling becomes! on an association, the single table inheritance column in the changed_attributes hash is nil instead of the previous value.

I have a unit test below that tests 4 different scenarios. The last test is the one that is failing:

```
unless File.exist?('Gemfile')
    File.write('Gemfile', <<-GEMFILE)
    source 'https://rubygems.org'
    gem 'rails', '~> 4.1.6'
    gem 'sqlite3'
    GEMFILE

    system 'bundle'
end

require 'bundler'
Bundler.setup(:default)

require 'active_record'
require 'minitest/autorun'
require 'logger'

# This connection will do for database-independent bug reports.
ActiveRecord::Base.establish_connection(adapter: 'sqlite3', database: ':memory:')
ActiveRecord::Base.logger = Logger.new(STDOUT)

ActiveRecord::Schema.define do
    create_table :suppliers do |t|
        t.string :name
    end

    create_table :accounts do |t|
        t.string :type
        t.belongs_to :supplier
        t.string :account_number
    end
end

class Supplier < ActiveRecord::Base
    has_one :account
end

class Account < ActiveRecord::Base; end
class AccountA < Account; end
class AccountB < Account; end

class BugTest < Minitest::Test

    def test_changing_type
        account = AccountA.create!
        new_account = account.becomes!(AccountB)

        assert_equal 'AccountA', new_account.changed_attributes[:type]
    end

    def test_changing_type_with_reload
        account = AccountA.create!
        account.reload
        new_account = account.becomes!(AccountB)

        assert_equal 'AccountA', new_account.changed_attributes[:type]
    end

    def test_changing_type_through_association
        supplier = Supplier.create!
        supplier.account = AccountA.create!
        new_account = supplier.account.becomes!(AccountB)

        assert_equal 'AccountA', new_account.changed_attributes[:type]
    end

    def test_changing_type_through_association_with_reload
        supplier = Supplier.create!
        supplier.account = AccountA.create!
        supplier.reload
        new_account = supplier.account.becomes!(AccountB)

        assert_equal 'AccountA', new_account.changed_attributes[:type]
    end

end
```

Has anyone else run into this?


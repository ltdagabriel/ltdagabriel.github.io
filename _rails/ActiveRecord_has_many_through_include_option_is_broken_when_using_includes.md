---
title: ActiveRecord has_many :through :include option is broken when using includes
labels: activerecord
layout: issue
---

The has_many :through ":include" option gets interpreted differently (wrongly?) by eager loading (that is, foo.includes[…]).
In that mode, Rails interprets it relative to the "through" (association) model, instead of the "source" (associated) model.
In the example below, this will work for eager loading, but not regularly …  

```
:include => {:category => :company}
```

I believe that option should be interpreted relative to the "source" model, and this is how it is interpreted regularly, when the model accessor APIs are used.
So, this works regularly, but not for eager loading… 

```
:include => :company
```

To get the same "include" option to work for both modes, a workaround is to add an identically named relation to the through model.

I modified the model from #8663 and tried in Rails 3.2.13, but it is still the same behavior.

Models:

```
class Company < ActiveRecord::Base
  attr_accessible :name, :status

  ACTIVE = 'Active'
end

class Category < ActiveRecord::Base
  attr_accessible :name

  belongs_to :company
  has_many :product_categories
  has_many :products, through: :product_categories
end

class Product < ActiveRecord::Base
  attr_accessible :name

  has_many :product_categories
  has_many :categories, through: :product_categories
  has_many :active_categories, through: :product_categories, :source => :category, :include => :company,
      :conditions => ["companies.status = ?", Company::ACTIVE]
end

class ProductCategory < ActiveRecord::Base
  belongs_to :product
  belongs_to :category
end
```

**includes breaks on include option**

Works: 

```
1.9.3-p286 :001 > Product.first.active_categories
Product.first.active_categories
  Product Load (0.1ms)  SELECT "products".* FROM "products" LIMIT 1
  SQL (0.2ms)  SELECT "categories"."id" AS t0_r0, "categories"."name" AS t0_r1, "categories"."created_at" AS t0_r2, "categories"."updated_at" AS t0_r3, "categories"."company_id" AS t0_r4, "companies"."id" AS t1_r0, "companies"."name" AS t1_r1, "companies"."status" AS t1_r2, "companies"."created_at" AS t1_r3, "companies"."updated_at" AS t1_r4 FROM "categories" LEFT OUTER JOIN "companies" ON "companies"."id" = "categories"."company_id" INNER JOIN "product_categories" ON "categories"."id" = "product_categories"."category_id" WHERE "product_categories"."product_id" = 1 AND (companies.status = 'Active')
 => [] 
```

Fails: 

```
1.9.3-p286 :002 > Product.includes(:active_categories)
Product.includes(:active_categories)
  Product Load (0.2ms)  SELECT "products".* FROM "products" 
ActiveRecord::ConfigurationError: Association named 'company' was not found; perhaps you misspelled it?
    from /Users/nomorogbe/.rvm/gems/ruby-1.9.3-p286/gems/activerecord-3.2.13/lib/active_record/associations/join_dependency.rb:112:in `build'
    from /Users/nomorogbe/.rvm/gems/ruby-1.9.3-p286/gems/activerecord-3.2.13/lib/active_record/associations/join_dependency.rb:123:in `block in build'
    from /Users/nomorogbe/.rvm/gems/ruby-1.9.3-p286/gems/activerecord-3.2.13/lib/active_record/associations/join_dependency.rb:122:in `each'
    from /Users/nomorogbe/.rvm/gems/ruby-1.9.3-p286/gems/activerecord-3.2.13/lib/active_record/associations/join_dependency.rb:122:in `build'
    from /Users/nomorogbe/.rvm/gems/ruby-1.9.3-p286/gems/activerecord-3.2.13/lib/active_record/associations/join_dependency.rb:18:in `initialize'
    from /Users/nomorogbe/.rvm/gems/ruby-1.9.3-p286/gems/activerecord-3.2.13/lib/active_record/relation/finder_methods.rb:220:in `new'
    from /Users/nomorogbe/.rvm/gems/ruby-1.9.3-p286/gems/activerecord-3.2.13/lib/active_record/relation/finder_methods.rb:220:in `construct_join_dependency_for_association_find'
    from /Users/nomorogbe/.rvm/gems/ruby-1.9.3-p286/gems/activerecord-3.2.13/lib/active_record/relation/finder_methods.rb:210:in `find_with_associations'
```

Latter fails because it is interpreting the option relative to the association model (ProductCategory).

**Patching the include**

Patch the :include option as follows: :include => {:category => :company}

Fails: 

```
1.9.3-p286 :001 > Product.first.active_categories
Product.first.active_categories
  Product Load (0.1ms)  SELECT "products".* FROM "products" LIMIT 1
ActiveRecord::ConfigurationError: Association named 'category' was not found; perhaps you misspelled it?
    from /Users/nomorogbe/.rvm/gems/ruby-1.9.3-p286/gems/activerecord-3.2.13/lib/active_record/associations/join_dependency.rb:112:in `build'
    from /Users/nomorogbe/.rvm/gems/ruby-1.9.3-p286/gems/activerecord-3.2.13/lib/active_record/associations/join_dependency.rb:127:in `block in build'
    from /Users/nomorogbe/.rvm/gems/ruby-1.9.3-p286/gems/activerecord-3.2.13/lib/active_record/associations/join_dependency.rb:126:in `each'
    from /Users/nomorogbe/.rvm/gems/ruby-1.9.3-p286/gems/activerecord-3.2.13/lib/active_record/associations/join_dependency.rb:126:in `build'
    from /Users/nomorogbe/.rvm/gems/ruby-1.9.3-p286/gems/activerecord-3.2.13/lib/active_record/associations/join_dependency.rb:123:in `block in build'
    from /Users/nomorogbe/.rvm/gems/ruby-1.9.3-p286/gems/activerecord-3.2.13/lib/active_record/associations/join_dependency.rb:122:in `each'
    from /Users/nomorogbe/.rvm/gems/ruby-1.9.3-p286/gems/activerecord-3.2.13/lib/active_record/associations/join_dependency.rb:122:in `build'
    from /Users/nomorogbe/.rvm/gems/ruby-1.9.3-p286/gems/activerecord-3.2.13/lib/active_record/associations/join_dependency.rb:18:in `initialize'
    from /Users/nomorogbe/.rvm/gems/ruby-1.9.3-p286/gems/activerecord-3.2.13/lib/active_record/relation/finder_methods.rb:220:in `new'
    from /Users/nomorogbe/.rvm/gems/ruby-1.9.3-p286/gems/activerecord-3.2.13/lib/active_record/relation/finder_methods.rb:220:in `construct_join_dependency_for_association_find'
    from /Users/nomorogbe/.rvm/gems/ruby-1.9.3-p286/gems/activerecord-3.2.13/lib/active_record/relation/finder_methods.rb:210:in `find_with_associations'
```

Works: 

```
1.9.3-p286 :002 > Product.includes(:active_categories)
Product.includes(:active_categories)
  Product Load (0.2ms)  SELECT "products".* FROM "products" 
  SQL (0.3ms)  SELECT "product_categories"."id" AS t0_r0, "product_categories"."product_id" AS t0_r1, "product_categories"."category_id" AS t0_r2, "product_categories"."created_at" AS t0_r3, "product_categories"."updated_at" AS t0_r4, "categories"."id" AS t1_r0, "categories"."name" AS t1_r1, "categories"."created_at" AS t1_r2, "categories"."updated_at" AS t1_r3, "categories"."company_id" AS t1_r4, "companies"."id" AS t2_r0, "companies"."name" AS t2_r1, "companies"."status" AS t2_r2, "companies"."created_at" AS t2_r3, "companies"."updated_at" AS t2_r4 FROM "product_categories" LEFT OUTER JOIN "categories" ON "categories"."id" = "product_categories"."category_id" LEFT OUTER JOIN "companies" ON "companies"."id" = "categories"."company_id" WHERE "product_categories"."product_id" IN (1) AND (companies.status = 'Active')
 => [#<Product id: 1, name: "Awesome Product", created_at: "2012-12-31 14:41:10", updated_at: "2012-12-31 14:41:10">] 
1.9.3-p286 :003 > 
```

Former fails because it is interpreting the option relative to the associated model (Category).

**Workaround**

Patch the ProductCategory class; add this line: 

```
has_one :company, :through => :category
```

**Revert the earlier include patch above** and retry both cases. Both cases now work.

```
1.9.3-p286 :001 > Product.first.active_categories
Product.first.active_categories
  Product Load (0.2ms)  SELECT "products".* FROM "products" LIMIT 1
  SQL (0.2ms)  SELECT "categories"."id" AS t0_r0, "categories"."name" AS t0_r1, "categories"."created_at" AS t0_r2, "categories"."updated_at" AS t0_r3, "categories"."company_id" AS t0_r4, "companies"."id" AS t1_r0, "companies"."name" AS t1_r1, "companies"."status" AS t1_r2, "companies"."created_at" AS t1_r3, "companies"."updated_at" AS t1_r4 FROM "categories" LEFT OUTER JOIN "companies" ON "companies"."id" = "categories"."company_id" INNER JOIN "product_categories" ON "categories"."id" = "product_categories"."category_id" WHERE "product_categories"."product_id" = 1 AND (companies.status = 'Active')
 => [] 
1.9.3-p286 :002 > Product.includes(:active_categories)
Product.includes(:active_categories)
  Product Load (0.4ms)  SELECT "products".* FROM "products" 
  SQL (0.3ms)  SELECT "product_categories"."id" AS t0_r0, "product_categories"."product_id" AS t0_r1, "product_categories"."category_id" AS t0_r2, "product_categories"."created_at" AS t0_r3, "product_categories"."updated_at" AS t0_r4, "companies"."id" AS t1_r0, "companies"."name" AS t1_r1, "companies"."status" AS t1_r2, "companies"."created_at" AS t1_r3, "companies"."updated_at" AS t1_r4 FROM "product_categories" LEFT OUTER JOIN "categories" ON "categories"."id" = "product_categories"."category_id" LEFT OUTER JOIN "companies" ON "companies"."id" = "categories"."company_id" WHERE "product_categories"."product_id" IN (1) AND (companies.status = 'Active')
 => [#<Product id: 1, name: "Awesome Product", created_at: "2012-12-31 14:41:10", updated_at: "2012-12-31 14:41:10">] 
1.9.3-p286 :003 > 
```

By adding an identically named relation to the association model, can workaround the issue.
Also, could add an "active" scope to Category, instead of using the "active_categories" relation:

```
product.categories.active  instead of: product.active_categories
```

but this defeats the purpose, because I deliberately wanted to use the relation for performance reasons:
1. Rails appears to cache things effectively when the relation is  used, as opposed to the scope
2. The relation can be used for eager loading, as opposed to the scope

Can use the testrepo https://github.com/rrouse/testrepo with the migration script below; did not have permission to create a branch off that with my changes.

```
class CreateCompanies < ActiveRecord::Migration

  def up
    create_table :companies do |t|
      t.string :name
      t.string :status
      t.timestamps
    end

    add_column :categories, :company_id, :integer, :null => true
  end

  def down
    remove_column :categories, :company_id
    drop_table :companies
  end
end
```


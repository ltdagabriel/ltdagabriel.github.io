---
title: ActiveRecord::Associations::CollectionAssociation#sum bug for new records
labels: activerecord
layout: issue
---

``` ruby
class Cart < ActiveRecord::Base
  has_many :line_items

  def total
    line_items.sum(&:price)
  end
end

class LineItem < ActiveRecord::Base
  belongs_to :product
  belongs_to :cart

  attr_accessible :amount, :product

  def price
    product.price * amount
  end
end


product = Product.create!(name: 'Ruby shirt', price: 2.25)
cart = Cart.new
cart.line_items.build do |item|
  item.amount = 2
  item.products = product
end

cart.line_items.sum(&:price)
#=> 0

cart.line_items.to_a.sum(&:price)
#=> #<BigDecimal:7ff4d34ca7c8,'0.0',9(36)>

cart.line_items.map(&:price).sum
#=> #<BigDecimal:7ff4d3373b40,'0.0',9(36)>
```

It seems in (Rails 3.2.8, Ruby 1.9.3) that `has_many` is creating
[`collection.sum`](https://github.com/rails/rails/blob/959fb8ea651fa6638aaa7caced20d921ca2ea5c1/activerecord/lib/active_record/associations/collection_association.rb#L181).
Though this isn't reflected in [A Guide to Active Record Associations](http://guides.rubyonrails.org/association_basics.html#the-has_many-association)
or [ActiveRecord::Associations::ClassMethods API docs](http://api.rubyonrails.org/classes/ActiveRecord/Associations/ClassMethods.html);
though it is briefly listed in the "_Collection associations (one-to-many / many-to-many)_"
chart, but not anywhere else in the doc.

According to the code, it will always try to hit the database using a SQL `sum`.
However, in this particular instance, the model isn't saved. So there's nothing
in the database. I would think it should pull from the cached copy.

Also, there is the potential where the `model` is saved, but the `collection`
was modified but not saved yet (i.e. with a `build`); this could cause
un-expected sums.

Line 28 in the code above returns 0 ignoring the built association.

A sample app with the issue reproduced is available here: https://github.com/cupakromer/sum_bug

I've added unit sests are in test/unit/cart_test.rb

To reproduce this issue:
- Clone this repo
- Run `bundle`
- Run `rake`


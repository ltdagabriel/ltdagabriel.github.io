---
title: Nested attributes should be included when wrapping parameters into root elements.
labels: activerecord, attached PR
layout: issue
---

Presume the use case of an app where friends recommend media to each other.

``` ruby
# app/models/recommendation.rb

class Recommendation < ActiveRecord::Base
    belongs_to :from, class_name: 'User', foreign_key: 'from_id'
    belongs_to :to, class_name: 'User', foreign_key: 'to_id'
    belongs_to :media

    accepts_nested_attributes_for :media
end
```

If an Angular `ngResource`/`$resource` query submits a JSON POST request equivalent to the traditional `x-www-form-urlencoded` payload, it will look like this*:

``` javascript
{
  "source_id": "1",
  "target_id": "2",
  "media_attributes": {
    "name": "Harry Potter",
    "media_type_id": "1"
  }
}
```

\* - I did have to manually change the `media` property to `media_attributes` before calling `$save()`.

According to the documentation for [`ActionController::ParamsWrapper`](http://api.rubyonrails.org/classes/ActionController/ParamsWrapper.html):

> On ActiveRecord models with no `:include` or `:exclude` option set, it will only wrap the parameters returned by the class method `attribute_names`.

As a result, the params as used by my `RecommendationsController` look like this:

``` ruby
{
  "source_id" => "1",
  "target_id" => "2",
  "media_attributes" => {
    "name" => "Harry Potter",
    "media_type_id" => "1"
  },
  "recommendation" => {
    "source_id" => "1",
    "target_id" => "2",
  }
```

This is because [attribute_names](http://api.rubyonrails.org/classes/ActiveRecord/AttributeMethods/ClassMethods.html#method-i-attribute_names) simply returns a list of column names.

The current workaround, also documented by [this StackOverflow answer](http://stackoverflow.com/questions/19574595/rails-4-not-updating-nested-attributes-via-json), is to use the `wrap_parameters` class method to explicitly include the nested attribute key:

``` ruby
# app/controllers/recommendations_controller.rb

class RecommendationsController < ApplicationController
    wrap_parameters include: [:source_id, :target_id, :media_attributes]

    # ...
end
```

However, I believe that default behavior goes against reasonable expectations.

Either the code is wrong, or the first line of the `ParamsWrapper` docs is wrong:

> Wraps the parameters hash into a nested hash. This will allow clients to submit POST requests without having to specify any root elements.

If the Rails team considers this behavior to be expected, then the docs should be updated to read (emphasis for visual diff purposes):

> Wraps the **top-level keys** of the parameters hash into a nested hash. This will allow clients to submit POST requests **for non-nested model objects** without having to specify any root elements.

I think a reasonable fix would be to create a new method to use instead of `attribute_names()` which returns the union of `attribute_names()` and the names of any keys used for accepting nested attributes.


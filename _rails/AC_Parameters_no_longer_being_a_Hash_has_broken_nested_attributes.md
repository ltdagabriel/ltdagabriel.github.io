---
title: AC::Parameters no longer being a Hash has broken nested attributes
labels: regression
layout: issue
---

Since AC::Parameters is no longer derived from Hash, and each nested "hash" inside Parameters is also an instance of AC::Parameters,   https://github.com/rails/rails/blob/master/activerecord/lib/active_record/nested_attributes.rb#L446  raises an error since it only allows Hash or Array, https://github.com/rails/rails/blob/master/activerecord/lib/active_record/nested_attributes.rb#L446 calls #map which isnt supported on AC::Parameters, and https://github.com/rails/rails/blob/master/activerecord/lib/active_record/nested_attributes.rb#L471 calls #with_indifferent_access which isn't supported on AC::Parameters.   

I'm willing to submit a fix if wanted, just wondered whether the preferred solution would be to have AC::Parameters call #to_h on accessed elements so they return filtered hashes rather than AC::Parameters instances, or update the nested_attributes code to support AC::Parameters


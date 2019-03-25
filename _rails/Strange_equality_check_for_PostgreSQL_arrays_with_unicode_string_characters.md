---
title: Strange equality check for PostgreSQL arrays with unicode string characters
labels: PostgreSQL, activerecord, attached PR, third party issue
layout: issue
---

Recently I stumbled upon a problem with `changed?` method on array columns in AR. Assigning identical arrays to created AR model generates changes even though arrays are equal. I managed to observe the behaviour only with array containing unicode strings.

More descriptive example with failing test:

``` ruby
 def test_change_of_unicode_string_in_array
    x = PgArray.create!(tags: ['nový']) # 'new'

    assert_not(x.changed?)

    x.tags = ['nový']

    assert_not(x.changed?) # Failure: Expected true to be nil or false

    x.reload
    x.tags << 'modrý' # 'blue'

    assert_equal(x.tags, ['nový', 'modrý'])
    assert(x.changed?)

    x.save!

    assert_not(x.changed?)
  end
```

Test passes with value `novy` instead of unicode one `nový`. This probably isn't a proper behaviour. Am I missing some settings or is this a bug?


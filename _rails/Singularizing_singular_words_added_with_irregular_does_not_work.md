---
title: Singularizing singular words added with #irregular does not work
labels: activesupport
layout: issue
---

In my initializer, I write:

``` ruby
ActiveSupport::Inflector.inflections { |inflect| inflect.irregular("is", "are") }
```

Then the following occurs: "is".pluralize => "are", "are".singularize => "is", "are".pluralize => "are",
but "is".singularize => "i".

I traced this down to the following code in active_support / inflector / methods.rb:

``` ruby
def irregular(singular, plural)
  ...
  if singular[0,1].upcase == plural[0,1].upcase
    ...
  else
    plural(Regexp.new("#{singular[0,1].upcase}(?i)#{singular[1..-1]}$"), plural[0,1].upcase + plural[1..-1])
    plural(Regexp.new("#{singular[0,1].downcase}(?i)#{singular[1..-1]}$"), plural[0,1].downcase + plural[1..-1])
    plural(Regexp.new("#{plural[0,1].upcase}(?i)#{plural[1..-1]}$"), plural[0,1].upcase + plural[1..-1])
    plural(Regexp.new("#{plural[0,1].downcase}(?i)#{plural[1..-1]}$"), plural[0,1].downcase + plural[1..-1])
    singular(Regexp.new("#{plural[0,1].upcase}(?i)#{plural[1..-1]}$"), singular[0,1].upcase + singular[1..-1])
    singular(Regexp.new("#{plural[0,1].downcase}(?i)#{plural[1..-1]}$"), singular[0,1].downcase + singular[1..-1])
  end
end
```

Note that the code does not include the following lines:

``` ruby
singular(Regexp.new("#{singular[0,1].upcase}(?i)#{singular[1..-1]}$"), singular[0,1].upcase + singular[1..-1])
singular(Regexp.new("#{singular[0,1].downcase}(?i)#{singular[1..-1]}$"), singular[0,1].downcase + singular[1..-1])
```

which would ensure that "is".singular => "is".  It seems like this is an oversight.


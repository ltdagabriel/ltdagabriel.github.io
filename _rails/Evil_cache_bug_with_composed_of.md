---
title: Evil cache bug with composed_of
labels: activerecord
layout: issue
---

The method

```
----------------------
activerecord-3.1.0.rc4/lib/active_record/aggregations.rb
----------------------
235         def writer_method(name, class_name, mapping, allow_nil, converter)
236           define_method("#{name}=") do |part|
237             if part.nil? && allow_nil
238               mapping.each { |pair| self[pair.first] = nil }
239               @aggregation_cache[name] = nil
240             else
241               unless part.is_a?(class_name.constantize) || converter.nil?
242                 part = converter.respond_to?(:call) ?
243                   converter.call(part) :
244                   class_name.constantize.send(converter, part)
245               end
246  
247               mapping.each { |pair| self[pair.first] = part.send(pair.last) }
248               @aggregation_cache[name] = part.freeze
249             end
250           end
251         end
```

is broken at line 247 due to caching. The problem is that rails does type conversions on activerecord fields. So for example if I have an AR class Foo with a field bar declared as an integer in the db then

```
foo = new Foo
foo.bar = "10.0"
puts foo.bar.class

=> Integer
```

However composed_of assumes that the there is no conversion during setting the object. Thus the aggregate objects will be returned with a string field rather than an integer field because the converted object was not read back and put in the cache.
The solution is to add an extra line in the above method that reads back the attribute after writing and caches the converted value and not the original value.

Something like

```

        def writer_method(name, class_name, mapping, allow_nil, converter)
          define_method("#{name}=") do |part|
            if part.nil? && allow_nil
              mapping.each { |pair| self[pair.first] = nil }
              @aggregation_cache[name] = nil
            else
              unless part.is_a?(class_name.constantize) || converter.nil?
                part = converter.respond_to?(:call) ?
                  converter.call(part) :
                  class_name.constantize.send(converter, part)
              end

              mapping.each { |pair| 
                  self[pair.first] = part.send(pair.last)
                  # Cache the converted attribute in the aggregate part
                  part.send("#{pair.last}=", self[pair.first]
               }
              @aggregation_cache[name] = part.freeze
            end
          end
        end
```


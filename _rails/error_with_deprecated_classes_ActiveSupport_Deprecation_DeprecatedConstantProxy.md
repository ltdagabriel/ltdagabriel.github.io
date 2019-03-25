---
title: error with deprecated classes ActiveSupport::Deprecation::DeprecatedConstantProxy
labels: activesupport
layout: issue
---

I have a BufferedLogger subclass like this: 

class BufferedLogger < ActiveSupport::BufferedLogger;
  some_code....
end

When testing against  rails 4 master I get this error:

wrong argument type ActiveSupport::Deprecation::DeprecatedConstantProxy (expected Class)


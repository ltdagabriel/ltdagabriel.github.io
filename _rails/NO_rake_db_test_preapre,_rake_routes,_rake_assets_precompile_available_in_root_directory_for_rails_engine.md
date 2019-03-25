---
title: NO rake db:test:preapre, rake routes, rake assets:precompile available in root directory for rails engine
labels: engines, railties
layout: issue
---

After creating rails engine project, certain rake tasks disappear from the root directory. For example, rake db:test:prepare, rake routes and rake assets:precompile for the engine created with:

rails plugin new rails_engine --mountable 

Most of the rake tasks disappears if the engine is created with the command below:

rails plugin new rails_engine --mountable --skip-test-unit

However all the rake tasks mentioned above are available under dummy directory. Is this a bug? If it is, any idea of how to fix it? Thanks.


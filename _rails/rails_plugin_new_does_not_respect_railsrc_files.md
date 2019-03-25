---
title: `rails plugin new` does not respect railsrc files
labels: attached PR, railties
layout: issue
---

Using Rails 4.0.0.rc1, and given the following railsrc file:

```
$ cat ~/.railsrc
--skip-bundle
--skip-test-unit
```

Running:

```
$ rails plugin new foo
      create  
      create  README.rdoc
      create  Rakefile
      create  foo.gemspec
      create  MIT-LICENSE
      create  .gitignore
      create  Gemfile
      create  lib/foo.rb
      create  lib/tasks/foo_tasks.rake
      create  lib/foo/version.rb
      create  test/test_helper.rb
      create  test/foo_test.rb
      append  Rakefile
  vendor_app  test/dummy
         run  bundle install
```

Expected: Test::Unit files should be skipped and `bundle install` should not be run.

Actual: Test::unit files were created and `bundle install` was run.

I also tried with the following two invocations:

```
$ rails plugin new foo --rc=~/.railsrc
$ rails plugin new foo --rc ~/.railsrc
```

The results were the same. The railsrc file is readable, and takes effect when running the normal `rails new` command.


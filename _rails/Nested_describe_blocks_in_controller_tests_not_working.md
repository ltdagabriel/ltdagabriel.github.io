---
title: Nested describe blocks in controller tests not working
labels: activesupport
layout: issue
---

Edge rails seems to have the same problem as described in blowmage/minitest-rails#58

Nesting describe blocks causes trouble:

``` ruby
describe DataSetsController do
  describe "index action" do
    it "outputs a summary of data sets" do
      get :index

      response.must_be :success?
    end
  end
end
```

gives us the errors:

```
  1) Error:
test_0001_outputs a summary of data sets(DataSetsController::index action):
NameError: wrong constant name index action
```

```
  2) Error:
test_0001_outputs a summary of data sets(DataSetsController::index action):
NoMethodError: undefined method `each' for nil:NilClass
```

This works fine:

``` ruby
describe DataSetsController do
  it "outputs a summary of data sets for the index action" do
    get :index

    response.must_be :success?
  end
end
```

An more oddly, so does this:

``` ruby
describe DataSetsController do
  describe "index action" do
    it "outputs a summary of data sets" do
      get :index

      response.must_be :success?
    end
  end

  test("blank") {}
end
```


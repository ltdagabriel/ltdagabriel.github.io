---
title: IntegrationTest: params not encoded correctly in a GET JSON request
labels: actionpack
layout: issue
---

### Steps to reproduce

A JSON GET request with params in an IntegrationTest in Rails 5 isn't encoding the params correctly. Seems to encode the params as the key of the encoded hash with a value of nil. There is log output below that demonstrates what I'm talking about. In the meantime these are the full steps to replicate:

```
rails new robots --api
cd robots
rails generate scaffold post title:string
rails db:migrate
bundle install
rails test
```

Open `test/controllers/posts_controller_test.rb` and update the first test case from:

``` ruby
  test "should get index" do
    get posts_url, as: :json
    assert_response :success
  end
```

to include a parameter like below:

``` ruby
  test "should get index" do
    get posts_url, params: { authentication_token: 'test' }, as: :json
    assert_response :success
  end
```

Run `tail -f log/test.log` and then run `rails test`. In the log output you should see something like:

```
------------------------------------------
PostsControllerTest: test_should_get_index
------------------------------------------
  Post Load (0.1ms)  SELECT  "posts".* FROM "posts" WHERE "posts"."id" = ? LIMIT ?  [["id", 980190962], ["LIMIT", 1]]
Started GET "/posts.json?%7B%22authentication_token%22%3A%22test%22%7D" for 127.0.0.1 at 2016-08-02 23:42:17 -0400
Processing by PostsController#index as JSON
  Parameters: {"{\"authentication_token\":\"test\"}"=>nil, "post"=>{}}
  Post Load (0.1ms)  SELECT "posts".* FROM "posts"
Completed 200 OK in 2ms (Views: 1.8ms | ActiveRecord: 0.1ms)
   (0.1ms)  rollback transaction
   (0.1ms)  begin transaction
```

The important line being the parameters output:

```
  Parameters: {"{\"authentication_token\":\"test\"}"=>nil, "post"=>{}}
```

For other requests such as PUT or POST this is not an issue and the params are encoded correctly. This prevents accessing a valid param. I noticed this while upgrading our Rails 4.2 app to Rails 5.
### Expected behavior

Should be seeing the correct encoding of params as if it were a PUT or POST request. The logs should look like (and thus allow accessing of params in controller code):

```
  Parameters: {"authentication_token"=>"test", "post"=>{}}
```
### System configuration

**Rails version**: 5.0.0

**Ruby version**: 2.2.3p173


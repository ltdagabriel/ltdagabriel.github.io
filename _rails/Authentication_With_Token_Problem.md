---
title: Authentication With Token Problem
labels: actionpack
layout: issue
---

So I've been building an API and ran into a rather unique problem: When using a token value for http authentication w/token that has a `=` character I would lose the data after and any `=` characters. This caused a significant confusion and problem.

I set out to fix the problem and discovered some code that might use a refactor:

``` ruby
# rails/actionpack/lib/action_controller/metal/http_authentication.rb:433

# Parses the token and options out of the token authorization header.
# If the header looks like this:
#   Authorization: Token token="abc", nonce="def"
# Then the returned token is "abc", and the options is {:nonce => "def"}
#
# request - ActionDispatch::Request instance with the current headers.
#
# Returns an Array of [String, Hash] if a token is present.
# Returns nil if no token is found.
def token_and_options(request)
  if request.authorization.to_s[/^Token (.*)/]
    values = Hash[$1.split(',').map do |value|
      value.strip!                      # remove any spaces between commas and values
      key, value = value.split(/\=\"?/) # split key=value pairs
      if value
        value.chomp!('"')                 # chomp trailing " in value
        value.gsub!(/\\\"/, '"')          # unescape remaining quotes
        [key, value]
      end
    end.compact]
    [values.delete("token"), values.with_indifferent_access]
  end
end
```

This code, when given the Authorization text: `Token token="abc", nonce="def"` would produce the value: `["abc", { :nonce => "def" }]` which is entirely correct.

However, when given the text: `Token token="rcHu+HzSFw89Ypyhn/896A==", nonce="def"` it would result in a truncated value: `["rcHu+HzSFw89Ypyhn/896A", { :nonce => "def" }]`. Worse is if your random value contained a `=` earlier in the value, say with the text: `Token token="rcHu+=HzSFw89Ypyhn/896A=", nonce="def"` you would get the return value `["rcHu+", {"nonce"=>"def"}]`.

This is obviously problematic, but I wanted to make sure it was correct, so I hunted down the header RFC:

[The RFC2616](http://www.w3.org/Protocols/rfc2616/rfc2616-sec2.html#sec2.2) documents the grammar for header field values:

> A string of text is parsed as a single word if it is quoted using double-quote marks.
> 
> ```
> quoted-string  = ( <"> *(qdtext | quoted-pair ) <"> )
> qdtext         = <any TEXT except <">>
> ```
> 
> The backslash character ("\") MAY be used as a single-character quoting mechanism only within quoted-string and comment constructs.
> 
> ```
> quoted-pair    = "\" CHAR
> ```

Now that we know that `=` characters can exist in these values I now had to write code to allow it. This actually lead me to another problem: The text in a field value containing: `\\"` would return the value `\"`. So after identifying two problems with the current method I decided to rewrite it and break it up into this:

``` ruby
def token_and_options(request)
  authorization = request.authorization.to_s
  if authorization[/Token .+/]
    params = token_params_from authorization_request
    [params.shift.last, Hash[params].with_indifferent_access]
  end
end

def token_params_from(authorization)
  raw = authorization.split(/,*\s+/).drop 1
  rewrite_param_values params_array_from raw
end

def params_array_from(raw_params)
  raw_params.map { |p| p.split(%r/=(.+)?/) }
end

def rewrite_param_values(params_array)
  params_array.each { |p| p.last.gsub! /^"|"$/, '' }
end
```

I then ran all the tests. This is where I decided to make an issue instead of a pull request:

```
Finished tests in 0.046664s, 428.5959 tests/s, 878.6216 assertions/s.

  1) Failure:
test_0020_authentication request with valid credential(HttpTokenAuthenticationTest) [test/controller/http_token_authentication_test.rb:111]:
Expected response to be a <success>, but was <401>
```

Looking into the test I see this source:

``` ruby
# rails/actionpack/test/controller/http_token_authentication_test.rb

test "authentication request with valid credential" do
  @request.env['HTTP_AUTHORIZATION'] = encode_credentials('"quote" pretty', :algorithm => 'test')
  get :display

  assert_response :success
  assert assigns(:logged_in)
  assert_equal 'Definitely Maybe', @response.body
end
```

Futher I find that the test was spitting out this for the Authorization text: `Token token="\"quote\" pretty", algorithm="test"`. It appears to me that it's attempting to test escaped strings as field values. The problem is that there are no specifications for this. The only details we have is that the `quoted-string` value **cant** be the `"` character.

Thus the two reasons for this issue:
1. I don't believe that we should stop the use of the `"`, because we don't need to.
2. This test should be removed as it's not required to test this sort of thing, it's not implied by the RFC.

I don't think we need to follow that rule because the below modified code I wrote has no problem dealing with texts field values with `"` characters:

``` ruby
def token_and_options(request)
  authorization_request = request.authorization.to_s
  if authorization_request[/Token .+/]
    params = token_params_from authorization_request
    [params.shift.last, Hash[params].with_indifferent_access]
  end
end

def token_params_from(authorization)
  raw = authorization.sub(/^Token /, '').split(/(?:,|;|\s)\s*/)
  rewrite_param_values params_array_from raw
end

def params_array_from(raw_params)
  raw_params.map { |param| param.split(%r/=(.+)?/) }
end

def rewrite_param_values(array_params)
  array_params.each { |param| param.last.gsub! /^"|"$/, '' }
end
```

Here are the different cases I've documented (first is old method, second is new method):

``` ruby
# The text value: Token token="lifo"
["lifo", {}]
["lifo", {}]

# The text value: Token token="lifo", algorithm="test"
["lifo", {"algorithm"=>"test"}]
["lifo", {"algorithm"=>"test"}]

# The text value: Token token="rcHu+HzSFw89Ypyhn/896A==", nonce="def"
["rcHu+HzSFw89Ypyhn/896A", {"nonce"=>"def"}]
["rcHu+HzSFw89Ypyhn/896A==", {"nonce"=>"def"}]

# The text value: Token token="rcHu+=HzSFw89Ypyhn/896A==f34", nonce="def"
["rcHu+", {"nonce"=>"def"}]
["rcHu+=HzSFw89Ypyhn/896A==f34", {"nonce"=>"def"}]

# The text value: Token token="rcHu+\\\\"/896A", nonce="def"
["rcHu+\\\"/896A", {"nonce"=>"def"}]
["rcHu+\\\\\"/896A", {"nonce"=>"def"}]

# The text value: Token token="lifo"; algorithm="test"
["lifo\"; algorithm", {}]
["lifo", {"algorithm"=>"test"}]

# The text value: Token token="lifo" algorithm="test"
["lifo\" algorithm", {}]
["lifo", {"algorithm"=>"test"}]

# The text value: Token token="lifo"    algorithm="test"
["lifo\"\talgorithm", {}]
["lifo", {"algorithm"=>"test"}]

# The text value: Token token="\"quote\" pretty", algorithm="test"
["\"quote\" pretty", {"algorithm"=>"test"}]
["\\\"quote\\", {"algorithm"=>"test", "pretty"=>nil}]
```

You may have noticed also that my code allows for the `;`, ' ', and '\t' character to be a seperator. Clearly the RFC allows for many more, but I figure this is enough for now.


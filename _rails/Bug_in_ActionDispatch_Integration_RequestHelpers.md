---
title: Bug in ActionDispatch::Integration::RequestHelpers
labels: With reproduction steps, actionpack, attached PR
layout: issue
---

https://github.com/rails/rails/blob/master/actionpack/lib/action_dispatch/testing/integration.rb

I believe, this part of code is intended to check if the request args (if any) has only following keys: params, headers, env, xhr. 

``` ruby
REQUEST_KWARGS = %i(params headers env xhr)
def kwarg_request?(args)
  args[0].respond_to?(:keys) && args[0].keys.any? { |k| REQUEST_KWARGS.include?(k) }
end

def non_kwarg_request_warning
  ActiveSupport::Deprecation.warn(<<-MSG.strip_heredoc)
    ActionDispatch::IntegrationTest HTTP request methods will accept only
    the following keyword arguments in future Rails versions:
    #{REQUEST_KWARGS.join(', ')}

    Examples:

    get '/profile',
      params: { id: 1 },
      headers: { 'X-Extra-Header' => '123' },
      env: { 'action_dispatch.custom' => 'custom' },
      xhr: true
  MSG
end
```

However, there are two problems with this code.

First one is with the _kwarg_request?_ method itself. It returns true even if only one of the arguments is from the allowed list.

``` ruby
# Will return false
kwarg_request?({foo: 10})
# Will return true and do not trigger deprecation warning in the request methods (get, post...)
kwarg_request?({headers: {}, foo: 10})
```

I believe 'any?' in its implementation should be replaced with 'all?':

``` ruby
def kwarg_request?(args)
  args[0].respond_to?(:keys) && args[0].keys.all? { |k| REQUEST_KWARGS.include?(k) }
end
```

The second possible problem (I'm not sure, maybe it is indented behavior and I misunderstand something) is with the allowed args themselves: what about 'as' arg? Fore example look at the example in the current documentation: 

``` ruby
post articles_path, params: { article: { title: 'Ahoy!' } }, as: :json
```

It seems that 'as' should be added to the allowed args list:

``` ruby
REQUEST_KWARGS = %i(params headers env xhr as)
```

If I'm right with all this stuff I'm ready to prepare a pull request.
### System configuration

**Rails version**: 5.0.0.beta4


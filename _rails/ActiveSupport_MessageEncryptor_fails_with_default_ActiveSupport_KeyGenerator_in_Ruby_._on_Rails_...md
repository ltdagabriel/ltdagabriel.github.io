---
title: ActiveSupport::MessageEncryptor fails with default ActiveSupport::KeyGenerator in Ruby 2.4 on Rails 5.0.1
labels: With reproduction steps, activesupport
layout: issue
---

### Steps to reproduce

Following the steps in http://api.rubyonrails.org/classes/ActiveSupport/MessageEncryptor.html under Ruby 2.4

### Expected behavior
The following should work:

`salt  = SecureRandom.random_bytes(64)`

`key   = ActiveSupport::KeyGenerator.new('password').generate_key(salt) # => "\x89\xE0\x156\xAC..."`

`crypt = ActiveSupport::MessageEncryptor.new(key)                       # => #<ActiveSupport::MessageEncryptor ...>`

`encrypted_data = crypt.encrypt_and_sign('my secret data')              # => "NlFBTTMwOUV5UlA1QlNEN2xkY2d6eThYWWh..."`

`crypt.decrypt_and_verify(encrypted_data)                               # => "my secret data"`

### Actual behavior
ActiveSupport::MessageEncryptor:encrypt_and_sign raises
ArgumentError: key must be 32 bytes

`Loading development environment (Rails 5.0.1)`
`irb(main):001:0> salt  = SecureRandom.random_bytes(64)`
`=> "R\xBA\xE1Z\xC4e\xBF;\xB5\x96\xA6|\x84\xB8\x8C\xA1c\xCC\xF6'\x11\x00\nKxA\x98`\x83`k\xF8mWFSk\x83\xE3\xE3\xC4y\eb\x9C\xF8-\xA11\x14\xBC@\xF31\xB24:\x1Ccr\x8F\xCE\bI"`
`irb(main):002:0> key   = ActiveSupport::KeyGenerator.new('password').generate_key(salt)`
`=> "\v\xD1$\x8Dq\x7F5iE\x95\xF6\xFD\t\xB9\x1A\xE6\x9E\xBE\xA9\xF4B\x1A\xA6sc\x86\xE9g\x81\xBF\x17\xD2\xEA\xC0WY\xB7\x89\x87\xCC\xA5V\xBEs#\xE4A0\xF0\t[\xC4\r\"\x03\xEC\x06Ke\xCB\x1F\xB8\xF4\xE6"`
`irb(main):003:0> crypt = ActiveSupport::MessageEncryptor.new(key)`
`=> #<ActiveSupport::MessageEncryptor:0x007f0179635660 @secret="\v\xD1$\x8Dq\x7F5iE\x95\xF6\xFD\t\xB9\x1A\xE6\x9E\xBE\xA9\xF4B\x1A\xA6sc\x86\xE9g\x81\xBF\x17\xD2\xEA\xC0WY\xB7\x89\x87\xCC\xA5V\xBEs#\xE4A0\xF0\t[\xC4\r\"\x03\xEC\x06Ke\xCB\x1F\xB8\xF4\xE6", @sign_secret=nil, @cipher="aes-256-cbc", @verifier=#<ActiveSupport::MessageVerifier:0x007f0179635570 @secret="\v\xD1$\x8Dq\x7F5iE\x95\xF6\xFD\t\xB9\x1A\xE6\x9E\xBE\xA9\xF4B\x1A\xA6sc\x86\xE9g\x81\xBF\x17\xD2\xEA\xC0WY\xB7\x89\x87\xCC\xA5V\xBEs#\xE4A0\xF0\t[\xC4\r\"\x03\xEC\x06Ke\xCB\x1F\xB8\xF4\xE6", @digest="SHA1", @serializer=ActiveSupport::MessageEncryptor::NullSerializer>, @serializer=Marshal>`
`irb(main):004:0> encrypted_data = crypt.encrypt_and_sign('my secret data')`
```
ArgumentError: key must be 32 bytes
	from /project/.rbenv/versions/2.4.0/lib/ruby/gems/2.4.0/gems/activesupport-5.0.1/lib/active_support/message_encryptor.rb:79:in `key='
	from /project/.rbenv/versions/2.4.0/lib/ruby/gems/2.4.0/gems/activesupport-5.0.1/lib/active_support/message_encryptor.rb:79:in `_encrypt'
	from /project/.rbenv/versions/2.4.0/lib/ruby/gems/2.4.0/gems/activesupport-5.0.1/lib/active_support/message_encryptor.rb:60:in `encrypt_and_sign'
	from (irb):4
	from /project/.rbenv/versions/2.4.0/lib/ruby/gems/2.4.0/gems/railties-5.0.1/lib/rails/commands/console.rb:65:in `start'
	from /project/.rbenv/versions/2.4.0/lib/ruby/gems/2.4.0/gems/railties-5.0.1/lib/rails/commands/console_helper.rb:9:in `start'
	from /project/.rbenv/versions/2.4.0/lib/ruby/gems/2.4.0/gems/railties-5.0.1/lib/rails/commands/commands_tasks.rb:78:in `console'
	from /project/.rbenv/versions/2.4.0/lib/ruby/gems/2.4.0/gems/railties-5.0.1/lib/rails/commands/commands_tasks.rb:49:in `run_command!'
	from /project/.rbenv/versions/2.4.0/lib/ruby/gems/2.4.0/gems/railties-5.0.1/lib/rails/commands.rb:18:in `<top (required)>'
	from bin/rails:4:in `require'
	from bin/rails:4:in `<main>'
```

### System configuration
**Rails version**: 5.0.1

**Ruby version**: 2.4


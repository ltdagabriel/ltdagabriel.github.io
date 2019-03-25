---
title: ActiveJob does not support GlobalID for keyword arguments
labels: activejob, attached PR
layout: issue
---

## As arguments:

``` ruby
class DeliverMessageJob < ActiveJob::Base
  queue_as :default

  def perform(to_user)
  end
end
```

``` shell
[ActiveJob] Enqueued DeliverMessageJob (Job ID: 4e634bba-04cb-463e-803a-280875ddb31c) to Sidekiq(Hyper.default) with arguments: gid://hyper/User/032f6db6-06c2-4fc9-9170-1c6297ede07b
```
## As keyword arguments:

``` ruby
class DeliverMessageJob < ActiveJob::Base
  queue_as :default

  def perform(to_user:)
  end
end
```

```
[ActiveJob] Enqueued DeliverMessageJob (Job ID: 0cf51f97-9b76-415d-a684-0d8d01bb4285) to Sidekiq(Hyper.default) with arguments: {:to_user=>#<User id: "032f6db6-06c2-4fc9-9170-1c6297ede07b">
```
## Gemfile.lock

```
GIT
  remote: git://github.com/linjunpop/rong_cloud.git
  revision: b2a0101f2ebcf9586f69075a741c3d5dd1778f29
  specs:
    rong_cloud (0.1.0)

GIT
  remote: git://github.com/rails-api/active_model_serializers.git
  revision: 8d3a89e106a2be49e52185a766ac90b6628b2979
  specs:
    active_model_serializers (0.10.0.rc2)
      actionpack (>= 4.0)
      activemodel (>= 4.0)
      railties (>= 4.0)

GEM
  remote: https://rubygems.org/
  remote: https://rails-assets.org/
  specs:
    actionmailer (4.2.4)
      actionpack (= 4.2.4)
      actionview (= 4.2.4)
      activejob (= 4.2.4)
      mail (~> 2.5, >= 2.5.4)
      rails-dom-testing (~> 1.0, >= 1.0.5)
    actionpack (4.2.4)
      actionview (= 4.2.4)
      activesupport (= 4.2.4)
      rack (~> 1.6)
      rack-test (~> 0.6.2)
      rails-dom-testing (~> 1.0, >= 1.0.5)
      rails-html-sanitizer (~> 1.0, >= 1.0.2)
    actionview (4.2.4)
      activesupport (= 4.2.4)
      builder (~> 3.1)
      erubis (~> 2.7.0)
      rails-dom-testing (~> 1.0, >= 1.0.5)
      rails-html-sanitizer (~> 1.0, >= 1.0.2)
    active_link_to (1.0.3)
      actionpack
    activejob (4.2.4)
      activesupport (= 4.2.4)
      globalid (>= 0.3.0)
    activemodel (4.2.4)
      activesupport (= 4.2.4)
      builder (~> 3.1)
    activerecord (4.2.4)
      activemodel (= 4.2.4)
      activesupport (= 4.2.4)
      arel (~> 6.0)
    activerecord-colored_log_subscriber (0.1.0)
      activerecord (>= 3.2, < 5.0)
    activesupport (4.2.4)
      i18n (~> 0.7)
      json (~> 1.7, >= 1.7.7)
      minitest (~> 5.1)
      thread_safe (~> 0.3, >= 0.3.4)
      tzinfo (~> 1.1)
    ansi (1.5.0)
    api-pagination (4.1.1)
    arel (6.0.3)
    assert_json (0.4.1)
      activesupport
    autoprefixer-rails (5.2.1.3)
      execjs
      json
    bcrypt (3.1.10)
    binding_of_caller (0.7.2)
      debug_inspector (>= 0.0.1)
    builder (3.2.2)
    bullet (4.14.7)
      activesupport (>= 3.0.0)
      uniform_notifier (~> 1.9.0)
    byebug (5.0.0)
      columnize (= 0.9.0)
    cancancan (1.12.0)
    capistrano (3.4.0)
      i18n
      rake (>= 10.0.0)
      sshkit (~> 1.3)
    capistrano-bundler (1.1.4)
      capistrano (~> 3.1)
      sshkit (~> 1.2)
    capistrano-chruby (0.1.2)
      capistrano (~> 3.0)
      sshkit (~> 1.3)
    capistrano-passenger (0.1.1)
      capistrano (~> 3.0)
    capistrano-rails (1.1.3)
      capistrano (~> 3.1)
      capistrano-bundler (~> 1.1)
    capistrano-sidekiq (0.5.3)
      capistrano
      sidekiq
    celluloid (0.16.1)
      timers (~> 4.0.0)
    coderay (1.1.0)
    coffee-rails (4.1.0)
      coffee-script (>= 2.2.0)
      railties (>= 4.0.0, < 5.0)
    coffee-script (2.4.1)
      coffee-script-source
      execjs
    coffee-script-source (1.9.1.1)
    colorize (0.7.7)
    columnize (0.9.0)
    connection_pool (2.2.0)
    dalli (2.7.4)
    database_cleaner (1.4.1)
    debug_inspector (0.0.2)
    erubis (2.7.0)
    execjs (2.6.0)
    factory_girl (4.5.0)
      activesupport (>= 3.0.0)
    factory_girl_rails (4.5.0)
      factory_girl (~> 4.5.0)
      railties (>= 3.0.0)
    faker (1.5.0)
      i18n (~> 0.5)
    font-awesome-rails (4.4.0.0)
      railties (>= 3.2, < 5.0)
    globalid (0.3.6)
      activesupport (>= 4.1.0)
    haml (4.0.7)
      tilt
    hitimes (1.2.2)
    http_accept_language (2.0.5)
    httplog (0.2.10)
    i18n (0.7.0)
    jpush (3.2.1)
    jquery-fileupload-rails (0.4.5)
      actionpack (>= 3.1)
      railties (>= 3.1)
      sass (>= 3.2)
    jquery-rails (4.0.4)
      rails-dom-testing (~> 1.0)
      railties (>= 4.2.0)
      thor (>= 0.14, < 2.0)
    jquery-ui-rails (5.0.5)
      railties (>= 3.2.16)
    json (1.8.3)
    kaminari (0.16.3)
      actionpack (>= 3.0.0)
      activesupport (>= 3.0.0)
    loofah (2.0.3)
      nokogiri (>= 1.5.9)
    mail (2.6.3)
      mime-types (>= 1.16, < 3)
    metaclass (0.0.4)
    method_source (0.8.2)
    mime-types (2.4.3)
    mini_portile (0.6.2)
    minitest (5.8.0)
    minitest-reporters (1.0.20)
      ansi
      builder
      minitest (>= 5.0)
      ruby-progressbar
    mocha (1.1.0)
      metaclass (~> 0.0.1)
    nested_form (0.3.2)
    net-scp (1.2.1)
      net-ssh (>= 2.6.5)
    net-ssh (2.9.2)
    netrc (0.10.3)
    newrelic_rpm (3.13.0.299)
    nokogiri (1.6.6.2)
      mini_portile (~> 0.6.0)
    pg (0.18.2)
    polyamorous (1.2.0)
      activerecord (>= 3.0)
    pry (0.10.1)
      coderay (~> 1.1.0)
      method_source (~> 0.8.1)
      slop (~> 3.4)
    pry-byebug (3.2.0)
      byebug (~> 5.0)
      pry (~> 0.10)
    pry-doc (0.8.0)
      pry (~> 0.9)
      yard (~> 0.8)
    pry-rails (0.3.4)
      pry (>= 0.9.10)
    puma (2.13.4)
    qiniu (6.5.0)
      json (~> 1.8)
      mime-types (~> 2.4.3)
      rest-client (~> 1.7.3)
      ruby-hmac (~> 0.4)
    qiniu_direct_uploader (0.0.5)
      coffee-rails (>= 3.2.1)
      jquery-fileupload-rails (~> 0.4.1)
      qiniu (>= 6.2.1)
      rails (>= 3.2)
      sass-rails (>= 3.2.5)
    rack (1.6.4)
    rack-pjax (0.8.0)
      nokogiri (~> 1.5)
      rack (~> 1.1)
    rack-protection (1.5.3)
      rack
    rack-test (0.6.3)
      rack (>= 1.0)
    rails (4.2.4)
      actionmailer (= 4.2.4)
      actionpack (= 4.2.4)
      actionview (= 4.2.4)
      activejob (= 4.2.4)
      activemodel (= 4.2.4)
      activerecord (= 4.2.4)
      activesupport (= 4.2.4)
      bundler (>= 1.3.0, < 2.0)
      railties (= 4.2.4)
      sprockets-rails
    rails-api (0.4.0)
      actionpack (>= 3.2.11)
      railties (>= 3.2.11)
    rails-assets-moment (2.10.6)
    rails-assets-rome (2.1.22)
    rails-deprecated_sanitizer (1.0.3)
      activesupport (>= 4.2.0.alpha)
    rails-dom-testing (1.0.7)
      activesupport (>= 4.2.0.beta, < 5.0)
      nokogiri (~> 1.6.0)
      rails-deprecated_sanitizer (>= 1.0.1)
    rails-html-sanitizer (1.0.2)
      loofah (~> 2.0)
    rails-i18n (4.0.4)
      i18n (~> 0.6)
      railties (~> 4.0)
    rails_12factor (0.0.3)
      rails_serve_static_assets
      rails_stdout_logging
    rails_admin (0.7.0)
      builder (~> 3.1)
      coffee-rails (~> 4.0)
      font-awesome-rails (>= 3.0, < 5)
      haml (~> 4.0)
      jquery-rails (>= 3.0, < 5)
      jquery-ui-rails (~> 5.0)
      kaminari (~> 0.14)
      nested_form (~> 0.3)
      rack-pjax (~> 0.7)
      rails (~> 4.0)
      remotipart (~> 1.0)
      safe_yaml (~> 1.0)
      sass-rails (>= 4.0, < 6)
    rails_serve_static_assets (0.0.4)
    rails_stdout_logging (0.0.4)
    railties (4.2.4)
      actionpack (= 4.2.4)
      activesupport (= 4.2.4)
      rake (>= 0.8.7)
      thor (>= 0.18.1, < 2.0)
    rake (10.4.2)
    ransack (1.7.0)
      actionpack (>= 3.0)
      activerecord (>= 3.0)
      activesupport (>= 3.0)
      i18n
      polyamorous (~> 1.2)
    rdoc (4.2.0)
    redis (3.2.1)
    redis-namespace (1.5.2)
      redis (~> 3.0, >= 3.0.4)
    remotipart (1.2.1)
    rest-client (1.7.3)
      mime-types (>= 1.16, < 3.0)
      netrc (~> 0.7)
    rolify (4.1.1)
    rollbar (2.2.0)
    ruby-hmac (0.4.0)
    ruby-progressbar (1.7.5)
    safe_yaml (1.0.4)
    sass (3.4.18)
    sass-rails (5.0.3)
      railties (>= 4.0.0, < 5.0)
      sass (~> 3.1)
      sprockets (>= 2.8, < 4.0)
      sprockets-rails (>= 2.0, < 4.0)
      tilt (~> 1.1)
    sdoc (0.4.1)
      json (~> 1.7, >= 1.7.7)
      rdoc (~> 4.0)
    select2-rails (3.5.9.3)
      thor (~> 0.14)
    sidekiq (3.4.2)
      celluloid (~> 0.16.0)
      connection_pool (~> 2.2, >= 2.2.0)
      json (~> 1.0)
      redis (~> 3.2, >= 3.2.1)
      redis-namespace (~> 1.5, >= 1.5.2)
    sinatra (1.4.6)
      rack (~> 1.4)
      rack-protection (~> 1.4)
      tilt (>= 1.3, < 3)
    slop (3.6.0)
    spring (1.3.6)
    sprockets (3.3.3)
      rack (~> 1.0)
    sprockets-rails (2.3.2)
      actionpack (>= 3.0)
      activesupport (>= 3.0)
      sprockets (>= 2.8, < 4.0)
    sshkit (1.7.1)
      colorize (>= 0.7.0)
      net-scp (>= 1.1.2)
      net-ssh (>= 2.8.0)
    thor (0.19.1)
    thread_safe (0.3.5)
    tilt (1.4.1)
    timers (4.0.1)
      hitimes
    turbolinks (2.5.3)
      coffee-rails
    twitter-bootstrap-rails (3.2.0)
      actionpack (~> 4.1)
      execjs (~> 2.2)
      rails (~> 4.1)
      railties (~> 4.1)
    tzinfo (1.2.2)
      thread_safe (~> 0.1)
    uglifier (2.7.2)
      execjs (>= 0.3.0)
      json (>= 1.8.0)
    uniform_notifier (1.9.0)
    web-console (2.2.1)
      activemodel (>= 4.0)
      binding_of_caller (>= 0.7.2)
      railties (>= 4.0)
      sprockets-rails (>= 2.0, < 4.0)
    yard (0.8.7.6)

PLATFORMS
  ruby

DEPENDENCIES
  active_link_to
  active_model_serializers!
  activerecord-colored_log_subscriber
  api-pagination
  assert_json
  autoprefixer-rails
  bcrypt (~> 3.1.7)
  bullet
  byebug
  cancancan
  capistrano-chruby
  capistrano-passenger
  capistrano-rails
  capistrano-sidekiq
  coffee-rails (~> 4.1.0)
  dalli
  database_cleaner
  factory_girl_rails
  faker
  http_accept_language
  httplog
  jpush
  jquery-rails
  kaminari
  minitest-reporters
  mocha
  newrelic_rpm
  pg
  pry-byebug
  pry-doc
  pry-rails
  puma
  qiniu
  qiniu_direct_uploader
  rails (= 4.2.4)
  rails-api
  rails-assets-moment!
  rails-assets-rome!
  rails-i18n (~> 4.0.0)
  rails_12factor
  rails_admin
  ransack
  rolify
  rollbar
  rong_cloud!
  sass-rails (~> 5.0)
  sdoc (~> 0.4.0)
  select2-rails
  sidekiq
  sinatra
  spring
  timers (= 4.0.1)
  turbolinks
  twitter-bootstrap-rails
  uglifier (>= 1.3.0)
  web-console (~> 2.0)

BUNDLED WITH
   1.10.6
```


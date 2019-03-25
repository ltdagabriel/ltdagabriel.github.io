---
title: uninitialized constant ActiveRecord::Associations::HasManyThroughAssociation
labels: activerecord
layout: issue
---

It's unclear what caused the issue, but we got a one-off error when loading a page in our application:

```
NameError: uninitialized constant ActiveRecord::Associations::HasManyThroughAssociation
```

The line of code that triggered the error:

``` ruby
Campaign.includes(steps: :alphabetized_recipients).find(params[:campaign_id])
```

Stack trace:

```
[GEM_ROOT]/gems/activerecord-4.2.7.1/lib/active_record/reflection.rb:457 :in `association_class`
[GEM_ROOT]/gems/activerecord-4.2.7.1/lib/active_record/reflection.rb:889 :in `association_class`
[GEM_ROOT]/gems/activerecord-4.2.7.1/lib/active_record/associations.rb:162 :in `association`
[GEM_ROOT]/gems/activerecord-4.2.7.1/lib/active_record/associations/preloader.rb:156 :in `block in grouped_records`
[GEM_ROOT]/gems/activerecord-4.2.7.1/lib/active_record/associations/preloader.rb:154 :in `each`
[GEM_ROOT]/gems/activerecord-4.2.7.1/lib/active_record/associations/preloader.rb:154 :in `grouped_records`
[GEM_ROOT]/gems/activerecord-4.2.7.1/lib/active_record/associations/preloader.rb:143 :in `preloaders_for_one`
[GEM_ROOT]/gems/activerecord-4.2.7.1/lib/active_record/associations/preloader.rb:115 :in `preloaders_on`
[GEM_ROOT]/gems/activerecord-4.2.7.1/lib/active_record/associations/preloader.rb:129 :in `block (2 levels) in preloaders_for_hash`
[GEM_ROOT]/gems/activerecord-4.2.7.1/lib/active_record/associations/preloader.rb:128 :in `each`
[GEM_ROOT]/gems/activerecord-4.2.7.1/lib/active_record/associations/preloader.rb:128 :in `flat_map`
[GEM_ROOT]/gems/activerecord-4.2.7.1/lib/active_record/associations/preloader.rb:128 :in `block in preloaders_for_hash`
[GEM_ROOT]/gems/activerecord-4.2.7.1/lib/active_record/associations/preloader.rb:124 :in `each`
[GEM_ROOT]/gems/activerecord-4.2.7.1/lib/active_record/associations/preloader.rb:124 :in `flat_map`
[GEM_ROOT]/gems/activerecord-4.2.7.1/lib/active_record/associations/preloader.rb:124 :in `preloaders_for_hash`
[GEM_ROOT]/gems/activerecord-4.2.7.1/lib/active_record/associations/preloader.rb:113 :in `preloaders_on`
[GEM_ROOT]/gems/activerecord-4.2.7.1/lib/active_record/associations/preloader.rb:103 :in `block in preload`
[GEM_ROOT]/gems/activerecord-4.2.7.1/lib/active_record/associations/preloader.rb:102 :in `each`
[GEM_ROOT]/gems/activerecord-4.2.7.1/lib/active_record/associations/preloader.rb:102 :in `flat_map`
[GEM_ROOT]/gems/activerecord-4.2.7.1/lib/active_record/associations/preloader.rb:102 :in `preload`
[GEM_ROOT]/gems/activerecord-4.2.7.1/lib/active_record/relation.rb:645 :in `block in exec_queries`
[GEM_ROOT]/gems/activerecord-4.2.7.1/lib/active_record/relation.rb:644 :in `each`
[GEM_ROOT]/gems/activerecord-4.2.7.1/lib/active_record/relation.rb:644 :in `exec_queries`
[GEM_ROOT]/gems/activerecord-4.2.7.1/lib/active_record/relation.rb:515 :in `load`
[GEM_ROOT]/gems/activerecord-4.2.7.1/lib/active_record/relation.rb:243 :in `to_a`
[GEM_ROOT]/gems/activerecord-4.2.7.1/lib/active_record/relation/finder_methods.rb:475 :in `find_take`
[GEM_ROOT]/gems/activerecord-4.2.7.1/lib/active_record/relation/finder_methods.rb:105 :in `take`
[GEM_ROOT]/gems/activerecord-4.2.7.1/lib/active_record/relation/finder_methods.rb:442 :in `find_one`
[GEM_ROOT]/gems/activerecord-4.2.7.1/lib/active_record/relation/finder_methods.rb:423 :in `find_with_ids`
[GEM_ROOT]/gems/activerecord-4.2.7.1/lib/active_record/relation/finder_methods.rb:71 :in `find`
[PROJECT_ROOT]/app/controllers/steps_controller.rb:24 :in `campaign`
[PROJECT_ROOT]/app/controllers/steps_controller.rb:7 :in `block (2 levels) in index`
[GEM_ROOT]/gems/actionpack-4.2.7.1/lib/action_controller/metal/mime_responds.rb:217 :in `respond_to`
[PROJECT_ROOT]/app/controllers/steps_controller.rb:4 :in `index`
[GEM_ROOT]/gems/actionpack-4.2.7.1/lib/action_controller/metal/implicit_render.rb:4 :in `send_action`
[GEM_ROOT]/gems/actionpack-4.2.7.1/lib/abstract_controller/base.rb:198 :in `process_action`
[GEM_ROOT]/gems/actionpack-4.2.7.1/lib/action_controller/metal/rendering.rb:10 :in `process_action`
[GEM_ROOT]/gems/actionpack-4.2.7.1/lib/abstract_controller/callbacks.rb:20 :in `block in process_action`
[GEM_ROOT]/gems/activesupport-4.2.7.1/lib/active_support/callbacks.rb:117 :in `call`
[GEM_ROOT]/gems/activesupport-4.2.7.1/lib/active_support/callbacks.rb:555 :in `block (2 levels) in compile`
[GEM_ROOT]/gems/activesupport-4.2.7.1/lib/active_support/callbacks.rb:505 :in `call`
[GEM_ROOT]/gems/activesupport-4.2.7.1/lib/active_support/callbacks.rb:92 :in `__run_callbacks__`
[GEM_ROOT]/gems/activesupport-4.2.7.1/lib/active_support/callbacks.rb:778 :in `_run_process_action_callbacks`
[GEM_ROOT]/gems/activesupport-4.2.7.1/lib/active_support/callbacks.rb:81 :in `run_callbacks`
[GEM_ROOT]/gems/actionpack-4.2.7.1/lib/abstract_controller/callbacks.rb:19 :in `process_action`
[GEM_ROOT]/gems/actionpack-4.2.7.1/lib/action_controller/metal/rescue.rb:29 :in `process_action`
[GEM_ROOT]/gems/actionpack-4.2.7.1/lib/action_controller/metal/instrumentation.rb:32 :in `block in process_action`
[GEM_ROOT]/gems/activesupport-4.2.7.1/lib/active_support/notifications.rb:164 :in `block in instrument`
[GEM_ROOT]/gems/activesupport-4.2.7.1/lib/active_support/notifications/instrumenter.rb:20 :in `instrument`
[GEM_ROOT]/gems/activesupport-4.2.7.1/lib/active_support/notifications.rb:164 :in `instrument`
[GEM_ROOT]/gems/actionpack-4.2.7.1/lib/action_controller/metal/instrumentation.rb:30 :in `process_action`
[GEM_ROOT]/gems/actionpack-4.2.7.1/lib/action_controller/metal/params_wrapper.rb:250 :in `process_action`
[GEM_ROOT]/gems/activerecord-4.2.7.1/lib/active_record/railties/controller_runtime.rb:18 :in `process_action`
[GEM_ROOT]/gems/actionpack-4.2.7.1/lib/abstract_controller/base.rb:137 :in `process`
[GEM_ROOT]/gems/actionview-4.2.7.1/lib/action_view/rendering.rb:30 :in `process`
[GEM_ROOT]/gems/rack-mini-profiler-0.10.1/lib/mini_profiler/profiling_methods.rb:76 :in `block in profile_method`
[GEM_ROOT]/gems/actionpack-4.2.7.1/lib/action_controller/metal.rb:196 :in `dispatch`
[GEM_ROOT]/gems/actionpack-4.2.7.1/lib/action_controller/metal/rack_delegation.rb:13 :in `dispatch`
[GEM_ROOT]/gems/actionpack-4.2.7.1/lib/action_controller/metal.rb:237 :in `block in action`
[GEM_ROOT]/gems/actionpack-4.2.7.1/lib/action_dispatch/routing/route_set.rb:74 :in `dispatch`
[GEM_ROOT]/gems/actionpack-4.2.7.1/lib/action_dispatch/routing/route_set.rb:43 :in `serve`
[GEM_ROOT]/gems/actionpack-4.2.7.1/lib/action_dispatch/journey/router.rb:43 :in `block in serve`
[GEM_ROOT]/gems/actionpack-4.2.7.1/lib/action_dispatch/journey/router.rb:30 :in `each`
[GEM_ROOT]/gems/actionpack-4.2.7.1/lib/action_dispatch/journey/router.rb:30 :in `serve`
[GEM_ROOT]/gems/actionpack-4.2.7.1/lib/action_dispatch/routing/route_set.rb:817 :in `call`
[GEM_ROOT]/gems/newrelic_rpm-3.16.2.321/lib/new_relic/agent/instrumentation/middleware_tracing.rb:96 :in `call`
[GEM_ROOT]/gems/newrelic_rpm-3.16.2.321/lib/new_relic/rack/agent_hooks.rb:30 :in `traced_call`
[GEM_ROOT]/gems/newrelic_rpm-3.16.2.321/lib/new_relic/agent/instrumentation/middleware_tracing.rb:96 :in `call`
[GEM_ROOT]/gems/newrelic_rpm-3.16.2.321/lib/new_relic/rack/browser_monitoring.rb:32 :in `traced_call`
[GEM_ROOT]/gems/newrelic_rpm-3.16.2.321/lib/new_relic/agent/instrumentation/middleware_tracing.rb:96 :in `call`
[GEM_ROOT]/gems/rack-1.6.4/lib/rack/etag.rb:24 :in `call`
[GEM_ROOT]/gems/newrelic_rpm-3.16.2.321/lib/new_relic/agent/instrumentation/middleware_tracing.rb:96 :in `call`
[GEM_ROOT]/gems/rack-1.6.4/lib/rack/conditionalget.rb:25 :in `call`
[GEM_ROOT]/gems/newrelic_rpm-3.16.2.321/lib/new_relic/agent/instrumentation/middleware_tracing.rb:96 :in `call`
[GEM_ROOT]/gems/rack-1.6.4/lib/rack/head.rb:13 :in `call`
[GEM_ROOT]/gems/newrelic_rpm-3.16.2.321/lib/new_relic/agent/instrumentation/middleware_tracing.rb:96 :in `call`
[GEM_ROOT]/gems/actionpack-4.2.7.1/lib/action_dispatch/middleware/params_parser.rb:27 :in `call`
[GEM_ROOT]/gems/newrelic_rpm-3.16.2.321/lib/new_relic/agent/instrumentation/middleware_tracing.rb:96 :in `call`
[GEM_ROOT]/gems/rack-attack-5.0.1/lib/rack/attack.rb:147 :in `call`
[GEM_ROOT]/gems/newrelic_rpm-3.16.2.321/lib/new_relic/agent/instrumentation/middleware_tracing.rb:96 :in `call`
[GEM_ROOT]/gems/actionpack-4.2.7.1/lib/action_dispatch/middleware/flash.rb:260 :in `call`
[GEM_ROOT]/gems/newrelic_rpm-3.16.2.321/lib/new_relic/agent/instrumentation/middleware_tracing.rb:96 :in `call`
[GEM_ROOT]/gems/rack-1.6.4/lib/rack/session/abstract/id.rb:225 :in `context`
[GEM_ROOT]/gems/rack-1.6.4/lib/rack/session/abstract/id.rb:220 :in `call`
[GEM_ROOT]/gems/newrelic_rpm-3.16.2.321/lib/new_relic/agent/instrumentation/middleware_tracing.rb:96 :in `call`
[GEM_ROOT]/gems/actionpack-4.2.7.1/lib/action_dispatch/middleware/cookies.rb:560 :in `call`
[GEM_ROOT]/gems/newrelic_rpm-3.16.2.321/lib/new_relic/agent/instrumentation/middleware_tracing.rb:96 :in `call`
[GEM_ROOT]/gems/activerecord-4.2.7.1/lib/active_record/query_cache.rb:36 :in `call`
[GEM_ROOT]/gems/newrelic_rpm-3.16.2.321/lib/new_relic/agent/instrumentation/middleware_tracing.rb:96 :in `call`
[GEM_ROOT]/gems/activerecord-4.2.7.1/lib/active_record/connection_adapters/abstract/connection_pool.rb:653 :in `call`
[GEM_ROOT]/gems/newrelic_rpm-3.16.2.321/lib/new_relic/agent/instrumentation/middleware_tracing.rb:96 :in `call`
[GEM_ROOT]/gems/actionpack-4.2.7.1/lib/action_dispatch/middleware/callbacks.rb:29 :in `block in call`
[GEM_ROOT]/gems/activesupport-4.2.7.1/lib/active_support/callbacks.rb:88 :in `__run_callbacks__`
[GEM_ROOT]/gems/activesupport-4.2.7.1/lib/active_support/callbacks.rb:778 :in `_run_call_callbacks`
[GEM_ROOT]/gems/activesupport-4.2.7.1/lib/active_support/callbacks.rb:81 :in `run_callbacks`
[GEM_ROOT]/gems/actionpack-4.2.7.1/lib/action_dispatch/middleware/callbacks.rb:27 :in `call`
[GEM_ROOT]/gems/newrelic_rpm-3.16.2.321/lib/new_relic/agent/instrumentation/middleware_tracing.rb:96 :in `call`
[GEM_ROOT]/gems/actionpack-4.2.7.1/lib/action_dispatch/middleware/remote_ip.rb:78 :in `call`
[GEM_ROOT]/gems/newrelic_rpm-3.16.2.321/lib/new_relic/agent/instrumentation/middleware_tracing.rb:96 :in `call`
[GEM_ROOT]/gems/actionpack-4.2.7.1/lib/action_dispatch/middleware/debug_exceptions.rb:17 :in `call`
[GEM_ROOT]/gems/newrelic_rpm-3.16.2.321/lib/new_relic/agent/instrumentation/middleware_tracing.rb:96 :in `call`
[GEM_ROOT]/gems/actionpack-4.2.7.1/lib/action_dispatch/middleware/show_exceptions.rb:30 :in `call`
[GEM_ROOT]/gems/newrelic_rpm-3.16.2.321/lib/new_relic/agent/instrumentation/middleware_tracing.rb:96 :in `call`
[GEM_ROOT]/gems/railties-4.2.7.1/lib/rails/rack/logger.rb:38 :in `call_app`
[GEM_ROOT]/gems/railties-4.2.7.1/lib/rails/rack/logger.rb:20 :in `block in call`
[GEM_ROOT]/gems/activesupport-4.2.7.1/lib/active_support/tagged_logging.rb:68 :in `block in tagged`
[GEM_ROOT]/gems/activesupport-4.2.7.1/lib/active_support/tagged_logging.rb:26 :in `tagged`
[GEM_ROOT]/gems/activesupport-4.2.7.1/lib/active_support/tagged_logging.rb:68 :in `tagged`
[GEM_ROOT]/gems/railties-4.2.7.1/lib/rails/rack/logger.rb:20 :in `call`
[GEM_ROOT]/gems/newrelic_rpm-3.16.2.321/lib/new_relic/agent/instrumentation/middleware_tracing.rb:96 :in `call`
[GEM_ROOT]/gems/request_store-1.3.1/lib/request_store/middleware.rb:9 :in `call`
[GEM_ROOT]/gems/newrelic_rpm-3.16.2.321/lib/new_relic/agent/instrumentation/middleware_tracing.rb:96 :in `call`
[GEM_ROOT]/gems/actionpack-4.2.7.1/lib/action_dispatch/middleware/request_id.rb:21 :in `call`
[GEM_ROOT]/gems/newrelic_rpm-3.16.2.321/lib/new_relic/agent/instrumentation/middleware_tracing.rb:96 :in `call`
[GEM_ROOT]/gems/rack-1.6.4/lib/rack/methodoverride.rb:22 :in `call`
[GEM_ROOT]/gems/newrelic_rpm-3.16.2.321/lib/new_relic/agent/instrumentation/middleware_tracing.rb:96 :in `call`
[GEM_ROOT]/gems/rack-1.6.4/lib/rack/runtime.rb:18 :in `call`
[GEM_ROOT]/gems/newrelic_rpm-3.16.2.321/lib/new_relic/agent/instrumentation/middleware_tracing.rb:96 :in `call`
[GEM_ROOT]/gems/rack-timeout-0.4.2/lib/rack/timeout/core.rb:122 :in `block in call`
[GEM_ROOT]/gems/rack-timeout-0.4.2/lib/rack/timeout/support/timeout.rb:19 :in `timeout`
[GEM_ROOT]/gems/rack-timeout-0.4.2/lib/rack/timeout/core.rb:121 :in `call`
[GEM_ROOT]/gems/newrelic_rpm-3.16.2.321/lib/new_relic/agent/instrumentation/middleware_tracing.rb:96 :in `call`
[GEM_ROOT]/gems/activesupport-4.2.7.1/lib/active_support/cache/strategy/local_cache_middleware.rb:28 :in `call`
[GEM_ROOT]/gems/newrelic_rpm-3.16.2.321/lib/new_relic/agent/instrumentation/middleware_tracing.rb:96 :in `call`
[GEM_ROOT]/gems/actionpack-4.2.7.1/lib/action_dispatch/middleware/static.rb:120 :in `call`
[GEM_ROOT]/gems/newrelic_rpm-3.16.2.321/lib/new_relic/agent/instrumentation/middleware_tracing.rb:96 :in `call`
[GEM_ROOT]/gems/font_assets-0.1.12/lib/font_assets/middleware.rb:29 :in `call`
[GEM_ROOT]/gems/newrelic_rpm-3.16.2.321/lib/new_relic/agent/instrumentation/middleware_tracing.rb:96 :in `call`
[GEM_ROOT]/gems/rack-1.6.4/lib/rack/sendfile.rb:113 :in `call`
[GEM_ROOT]/gems/newrelic_rpm-3.16.2.321/lib/new_relic/agent/instrumentation/middleware_tracing.rb:96 :in `call`
[GEM_ROOT]/gems/actionpack-4.2.7.1/lib/action_dispatch/middleware/ssl.rb:24 :in `call`
[GEM_ROOT]/gems/newrelic_rpm-3.16.2.321/lib/new_relic/agent/instrumentation/middleware_tracing.rb:96 :in `call`
[GEM_ROOT]/gems/rack-utf8_sanitizer-1.3.2/lib/rack/utf8_sanitizer.rb:19 :in `call`
[GEM_ROOT]/gems/newrelic_rpm-3.16.2.321/lib/new_relic/agent/instrumentation/middleware_tracing.rb:96 :in `call`
[GEM_ROOT]/gems/newrelic_rpm-3.16.2.321/lib/new_relic/agent/instrumentation/middleware_tracing.rb:96 :in `call`
[GEM_ROOT]/gems/newrelic_rpm-3.16.2.321/lib/new_relic/agent/instrumentation/middleware_tracing.rb:96 :in `call`
[GEM_ROOT]/gems/newrelic_rpm-3.16.2.321/lib/new_relic/agent/instrumentation/middleware_tracing.rb:96 :in `call`
[GEM_ROOT]/gems/rack-mini-profiler-0.10.1/lib/mini_profiler/profiler.rb:171 :in `call`
[GEM_ROOT]/gems/newrelic_rpm-3.16.2.321/lib/new_relic/agent/instrumentation/middleware_tracing.rb:96 :in `call`
[GEM_ROOT]/gems/railties-4.2.7.1/lib/rails/engine.rb:518 :in `call`
[GEM_ROOT]/gems/railties-4.2.7.1/lib/rails/application.rb:165 :in `call`
[GEM_ROOT]/gems/railties-4.2.7.1/lib/rails/railtie.rb:194 :in `public_send`
[GEM_ROOT]/gems/railties-4.2.7.1/lib/rails/railtie.rb:194 :in `method_missing`
[GEM_ROOT]/gems/newrelic_rpm-3.16.2.321/lib/new_relic/agent/instrumentation/middleware_tracing.rb:96 :in `call`
[GEM_ROOT]/gems/rack-1.6.4/lib/rack/static.rb:124 :in `call`
[GEM_ROOT]/gems/newrelic_rpm-3.16.2.321/lib/new_relic/agent/instrumentation/middleware_tracing.rb:96 :in `call`
[GEM_ROOT]/gems/puma-3.6.0/lib/puma/configuration.rb:225 :in `call`
[GEM_ROOT]/gems/puma-3.6.0/lib/puma/server.rb:578 :in `handle_request`
[GEM_ROOT]/gems/puma-3.6.0/lib/puma/server.rb:415 :in `process_client`
[GEM_ROOT]/gems/puma-3.6.0/lib/puma/server.rb:275 :in `block in run`
[GEM_ROOT]/gems/puma-3.6.0/lib/puma/thread_pool.rb:116 :in `block in spawn_thread`
```
### System configuration

**Rails version**: 4.2.7.1

**Ruby version**: 2.3.1p112


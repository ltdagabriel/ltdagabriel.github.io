---
title: ActionCable ignores namespaces
labels: With reproduction steps, actioncable, attached PR
layout: issue
---

### Steps to reproduce

When the ActionCable is determining valid class names for connection, it ignores namespaces.

To reproduce create a channel in a namespace, and attempt to connect to it.
### Expected behavior

Given a `Namespace::ExampleChannel` defined in `/app/channels/namespace/example_channel.rb` I expect to be able to call `App.cable.subscriptions.create "Namespace::ExampleChannel"` in order to subscribe to this channel.
### Actual behavior

Code fails with `[NameError - uninitialized constant ExampleChannel]`

This happens because the `channel_classes` method attempts to get the class names of all valid channels [here](https://github.com/rails/rails/blob/c420bedda775db093e03c3f7fa20b931f5546eb3/actioncable/lib/action_cable/server/base.rb#L75). This in turn uses the `channel_class_names` method [here](https://github.com/rails/rails/blob/a26a3a075637215c9028308436ca89cba8da2ed5/actioncable/lib/action_cable/server/configuration.rb#L23), which converts the basename of all the channel files into camelized names. Finally, the original `channel_classes` method attempts to constantize the converted basename, which will not work because the it will be missing the namespace.

The `channel_class_names` function should not use basename, and instead should be more aware of the absolute channel path. 

For the sake of consistency, I recommend something like this:

In `ActionCable::Engine` [here](https://github.com/rails/rails/blob/1dcf2800146f654065c697511dcbcea5c23c114a/actioncable/lib/action_cable/engine.rb#L39) add line:

``` ruby
self.channel_root_path = Rails.application.paths['app/channels'].absolute_current
```

In `ActionCable::Configuration` [here](https://github.com/rails/rails/blob/a26a3a075637215c9028308436ca89cba8da2ed5/actioncable/lib/action_cable/server/configuration.rb#L24) change the line to:

``` ruby
Pathname.new(channel_path).to_s.replace("#{channel_root_path}/", '').split('.').first.camelize
```


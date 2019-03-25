---
title: Extension is always appended to assets, config.assets.enabled changes behaviour
labels: asset pipeline
layout: issue
---

Rails version: 3.2.3

As documented here: http://api.rubyonrails.org/classes/ActionView/Helpers/AssetTagHelper/StylesheetTagHelpers.html#method-i-stylesheet_link_tag
extension should not be appended if there is already one.
But when I create an empty rails app, add the asset `file.ext.css` to the `app/assets/stylesheets` folder and include it with `<%= stylesheet_link_tag    "file.ext", :media => "all" %>`, css extension gets appended.

With `config.assets.enabled = false` it works as documented, i.e. css is not appended.

Probably this is the cause: #3715

So either the documentation should be changed or that patch should be reverted.
And the behaviour should not depend on `config.assets.enabled` flag.


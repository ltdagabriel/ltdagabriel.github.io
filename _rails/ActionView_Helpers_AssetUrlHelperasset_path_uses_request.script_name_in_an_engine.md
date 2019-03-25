---
title: ActionView::Helpers::AssetUrlHelper#asset_path uses request.script_name in an engine
labels: asset pipeline
layout: issue
---

I encountered the following problem with current master branch (4.0.0.beta):

The asset_path method seems to use the `request.script_name` information to determine the correct url for the assets. 
But when you try to include assets per `assets_path` **in an engine** (or a depending method e.g. `stylesheet_link_tag`) than this `script_name` is prefixed to the urls.

Steps to reproduce:
1. Generate a fresh rails 4.0.0.beta project
2. Generate a fresh isolated mountable engine (like the example in the edge guide) with a dummy controller and a dummy method `foo#bar` which uses a layout.
3. Require the engine as a gem in the rails `Gemfile`
4. Mount the engine, e.g. `mount Blorgh::Engine, :at => 'blorgh'`
5. Start the server

Problem: The stylesheet-link url is generates 

```
 stylesheet_link_tag("blorgh/application") => "/blorgh/assets/blorgh/application.css?body=1"
```

I temporarily fix this problem by setting `config.relative_url_root = ''` in `application.rb` of the main project.


---
title: Live streaming doesn't work with basic authentication or builder
labels: actionpack
layout: issue
---

The depot application in Agile Web Development with Rails is a store where the products are books.  I looked into adding a "download" action which would download an ebook using live streaming.  After I did that, other actions started to fail.  It is understandable that other actions in the same controller would perform differently, but I didn't expect hangs.

Basic scenario: rails new depot; cd depot; rails generate scaffold Product title; rake db:migrate; rails server.  At that point, navigate to http://localhost:3000/products/, and create a single new product using whatever title you like.

Replace app/controllers/products_controller.rb with https://gist.github.com/rubys/5801812

Create app/views/products/index.xml.builder with https://gist.github.com/rubys/5801817

With builder, hangs are intermittent. Navigate to http://localhost:3000/products.xml and refresh the page repeatedly (⌘R or F5).

With authentication hangs are repeatable.  Navigate to http://localhost:3000/products/1/edit


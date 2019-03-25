---
title: No longer able to functional test APIs
labels: regression
layout: issue
---

The change introduced in #1203 makes an incorrect assumption. While it's true that you can only have strings in the params hash when using `application/x-www-form-urlencoded`, other request formats like JSON and XML can quite happily include fixnums and other values.


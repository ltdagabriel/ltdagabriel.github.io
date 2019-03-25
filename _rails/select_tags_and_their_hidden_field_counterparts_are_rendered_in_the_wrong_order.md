---
title: select tags and their hidden field counterparts are rendered in the wrong order
labels: actionview, attached PR
layout: issue
---

Currently if you render a select tag with the form helper you end up with a hidden field followed by the select tag. This is fine in most cases, but on older versions of IE, when you are wrapping said select tag with a label tag, the label will get associated with the hidden field rather than the select. Subtle, but it has caused us some usability bugs.

The culprit is here: 
https://github.com/rails/rails/blob/master/actionview/lib/action_view/helpers/tags/base.rb#L126

The solution is simply to swap the order of the `+` operands.


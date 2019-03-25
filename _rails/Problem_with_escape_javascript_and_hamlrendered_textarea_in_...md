---
title: Problem with escape_javascript and haml-rendered textarea in 3.2.3
labels: actionview, third party issue
layout: issue
---

My Rails 3.2.2 application was working fine, but after upgrading to 3.2.3, some of my ajax requests stopped working.   I'm not sure what exactly is the problem yet, but I suspect it is either a combination of issue #5191 and/or commit c8168a7cdcdda114f634e8a429ba7ebac86eaf18.

 In my ajax response, I'm rendering a partial in haml that contains a textarea and then calling escape_javascript on the rendered html before prepending the data back to the dom.

Here is the rendered javascript response:

``` javascript
$('#repeater').prepend("<textarea class=\"text optional count[20,50]\" cols=\"40\" id=\"editBookForm4fab007b4f9f2503d500018b_book_comment\" name=\"book[comment]\" rows=\"6\">
<\/textarea>\n\n");
```

The javascript is broken because the closing tag for the string is on the next line.

Looking at the value passed to the escape_javascript function in the debugger, i see the value is:

``` html
<textarea class="text optional count[20,50]" cols="40" id="editBookForm4fab007b4f9f2503d500018b_book_comment" name="book[comment]" rows="6"><haml:newline/></textarea>
```

What is interesting is the 

```
<haml:newline/>
```

in between the text area's.

At the moment, escape_javascript does not replace haml:newline/.


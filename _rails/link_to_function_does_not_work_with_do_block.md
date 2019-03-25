---
title: link_to_function does not work with do block
labels: actionview
layout: issue
---

Hi, 
i am missing "do block" nottation on link_to_function. I wrote some code which is working fine for me atm.

  def link_to_function(*args, &block)
    #(name, function, html_options={})
    if block_given?
      options      = args.first || {}
      html_options = args.second
      link_to_function(capture(&block), options, html_options)
    else
      name         = args[0]
      function     = args[1]
      html_options = args[2] || {}

```
  html_options = convert_options_to_data_attributes(options, html_options)

  onclick = "#{"#{html_options[:onclick]}; " if html_options[:onclick]}#{function}; return false;"
  href = html_options[:href] || '#'

  content_tag(:a, name, html_options.merge(:href => href, :onclick => onclick))
end
```

  end

cause i dont realy know github and and bugtesting maybe somebody can test and push this code

thx


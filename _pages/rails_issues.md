---
layout: page
title: Ruby on Rails List
permalink: /rails_issue
---

{% for issue in site.rails %}
<div class="alert alert-success" role="alert">
  <a href="{{ issue.url | prepend: site.baseurl }}">
          <h5>{{ issue.title | truncatewords: 10 }}</h5>
  </a>
</div>
{% endfor %}
---
title: Set a tag of a collection rendering
labels: actionview
layout: issue
---

Could useful set the tag of  a collection when you render it, like backboneJS?

for example , given a partial:

``` erb
<span><%=post.autor%></span>
<span><%=post.created_at%></span>
```

you could render inside two different tags

``` erb
<ul>
<%= render @posts,:tag=>'li'%>
</ul>
```

output:

``` html
<ul>
<li>
 <span>one</span> 
 <span>Tomorrow</span>
 </li>

<li>
 <span>two</span> 
 <span>Today</span>
 </li>
</ul> 
```

or

``` erb
<div>
<%= render @posts,:tag=>'div'%>
</div>
```

output:

``` html
<div>
<div>
 <span>one</span> 
 <span>Tomorrow</span>
 </div>

<div>
 <span>two</span> 
 <span>Today</span>
 </div>
</div> 

```

or without any tag
i posted this, in the #6006


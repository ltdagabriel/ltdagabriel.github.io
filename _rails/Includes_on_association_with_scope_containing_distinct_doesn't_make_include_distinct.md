---
title: Includes on association with scope containing distinct doesn't make include distinct
labels: With reproduction steps, activerecord, attached PR
layout: issue
---

### Steps to reproduce

Sorry that I haven't yet put together a code reproduction of this. I can do that if needed. I'm boiling down from the test case + fix in my company's application.

Create a scoped association where the scope is `joins(:b).distinct`. Use `A.includes(:b).bs` to see that the b model is duplicated (SQL log shows that distinct isn't used). 
### Expected behavior

The SQL included should have distinct in it, and the result shouldn't have duplicates.
### Actual behavior

The SQL doesn't have distinct in it; items are duplicated.
### System configuration

**Rails version**: 4.2.7

**Ruby version**: 2.2.4
### Ideas to Fix

I saw https://github.com/rails/rails/blob/4-2-stable/activerecord/lib/active_record/associations/preloader/association.rb#L146 and decided to see if I could fix it locally. I added 

```
    scope.distinct! preload_values[:distinct] || values[:distinct]
```

and it passes my test cases locally.


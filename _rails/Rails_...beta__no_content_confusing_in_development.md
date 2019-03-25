---
title: Rails 5.0.0.beta - 204 no content confusing in development
labels: actionview
layout: issue
---

When a controllers method is reached but the template can not be found, Rails now returns 204 No Content.

As a result, the browser does not refresh but more important - the current page whatever it was, does not clear an error if one is being displayed. For a few moments I thought I'd run into my prior issue.

Now, I experienced this when I renamed a controller and a route but forgot to move the views directory, a naive thing. In previous version of Rails this would have tried to render and failed, and I'm sure this new behaviour is here for a reason. However, I think some here may see how this could momentarily cause confusion -- would blanking out the current error if one is shown here a good idea? This would at least then cause someone to turn to their log to see what is happening.


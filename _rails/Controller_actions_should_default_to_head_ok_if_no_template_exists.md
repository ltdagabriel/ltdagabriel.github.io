---
title: Controller actions should default to head :ok if no template exists
labels: actionpack
layout: issue
---

It's a great default for controllers that generate HTML that we default to rendering the corresponding template, but it's a hassle for API-controllers. The default should be "everything went fine" in both cases. So let's instead return `head :ok` for actions with no corresponding templates, rather than raising an error. That'll slim down API controller methods that simply worked, and need no further instructions.


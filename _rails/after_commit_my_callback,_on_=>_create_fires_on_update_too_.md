---
title: after_commit :my_callback, :on => :create fires on update too 
labels: activerecord
layout: issue
---

After upgrading from 4.0.0.beta1 to 4.1.0.rc2 my after_commit hooks are now getting triggered on update too, despite the :on => :create option.


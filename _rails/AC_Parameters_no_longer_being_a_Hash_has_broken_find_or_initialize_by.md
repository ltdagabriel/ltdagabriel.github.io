---
title: AC::Parameters no longer being a Hash has broken find_or_initialize_by
labels: activerecord
layout: issue
---

Strong parameters can no longer be passed to find_or_initialize_by since it expects a Hash to be passed through to the find_by cal which errors with "Cannot visit ActionController::Parameters.


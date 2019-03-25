---
title: Getter called for validating numericality
labels: activerecord
layout: issue
---

### Steps to reproduce

https://gist.github.com/alexkuebo/dc366487b5f16e2481f191fa003b2986

### Expected behavior
Until rails 5.2.0 the validation of an attribute with overwritten getter succeeded because it uses `#{attr_name}_before_type_cast`.

### Actual behavior
Since rails 5.2.1 (specifically commit https://github.com/rails/rails/commit/c15d8b3a21bf1ae3ca9f09ca9cad8cc3828aa9be) the validation fails because it uses the getter.

### System configuration
**Rails version**: 5.2.1

**Ruby version**: 2.5.1


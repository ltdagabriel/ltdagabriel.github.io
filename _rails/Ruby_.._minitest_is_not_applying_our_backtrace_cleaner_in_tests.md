---
title: Ruby 1.9.2 minitest is not applying our backtrace cleaner in tests
labels: activesupport
layout: issue
---

When Turn is off, you get the full backtrace when a test fails. It's not scrubbed with the backtrace cleaner.


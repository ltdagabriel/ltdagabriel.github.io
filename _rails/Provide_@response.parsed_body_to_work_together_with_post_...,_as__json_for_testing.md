---
title: Provide @response.parsed_body to work together with post ..., as: :json for testing
labels: actionpack, attached PR
layout: issue
---

If you post JSON in testing, it's likely you want to test JSON coming back too. Providing @response.parsed_body will save everyone from having to do `JSON.parse @response.body` over and over again.


---
title: Postgresql Action Cable connection adapter breaks code-reloading in development
labels: With reproduction steps, actioncable, attached PR
layout: issue
---

### Steps to reproduce

Initial state:
1. Create a `Widget` model.
1. Create an Action Cable channel which is loaded on the root url.
1. Configure the Postgres adapter for Action Cable in development.

I've created a minimal application with a minimal configuration [here](https://github.com/mcolyer/actioncable-postgres-issue) .

Once the application is running:
1. Load the root url ("/") in a browser.
1. Restart the server and wait for the websocket to re-connect.
1. Edit the `Widget` model file to require code-reloading.
1. Reload the root url in the browser

I've added some debug logging to illustrate how many AR connections are used at a given time as well as the backtraces when they are checked out. 

Based on my investigation so far I'm guessing that the reloading code isn't expecting a long lived database connection (from the postgresql connection adapter) to be running.

### Expected behavior
Code reloading works as it normally does.

### Actual behavior
It hangs (and sometimes deadlocks the process)

### System configuration
**Rails version**: 5.0.1

**Ruby version**: 2.3.1


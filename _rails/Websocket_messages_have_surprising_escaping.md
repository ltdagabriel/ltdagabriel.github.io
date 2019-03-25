---
title: Websocket messages have surprising escaping
labels: actioncable, attached PR
layout: issue
---

_From @KevinMcHugh on August 20, 2015 19:33_

I've got ActionCable running in a Rails 4 app and it's wonderful, it feels very rails-y already. Thank you to everyone for your hard work.

In writing my client of the ActionCable websockets, I was surprised that the messages to subscribe and follow channels are as following:
`{"command":"subscribe","identifier":"{\"channel\":\"CommentsChannel\"}"}`
and
`{"command":"message","identifier":"{\"channel\":\"CommentsChannel\"}","data":"{\"message_id\":1,\"action\":\"follow\"}"}`
(pulled from the example app in [rails/actioncable-examples](https://github.com/rails/actioncable-examples)).

Generating those messages in my client (a rails-agnostic ReactJS app) was more complicated than it could have been. I was surprised that those messages weren't:
`{"command":"subscribe","identifier": {"channel": "CommentsChannel"}}`
and
`{"command":"message","identifier": {"channel":"CommentsChannel"}",
  "data":"{"message_id":1,"action":"follow"}"}`

The latter is more easily serialized and easier to generate. I think I'm missing some aspect that makes the escaped `identity` and `data` values superior. Is there a principle or detail here that I should know about for continuing to develop code against ActionCable?

(This isn't a bug, but it made developing JS against ActionCable painful in a surprising way. If this isn't the correct place for me to ask my question, I apologize and would be happy to know where I should be asking this sort of thing.)

_Copied from original issue: rails/actioncable#64_


---
title: ActionMailer overrides header[:parts_order] when a block is passed to #mail
labels: actionmailer
layout: issue
---

We discovered that our application's mails were displaying as plaintext in Gmail. After some investigation, we realized the mime parts were being sent in the opposite of the normal order - instead of text then html it was being mailed as html then text. According to the RFC, the mail client should render the last compatible mimepart, which Gmail does.

So, I started digging into our stack and trying to figure out why the order was getting flopped and setting header[:parts_order] in our mailer had no effect. 

I realized this mail in particular was the only one where we were passing a block to #mail.

``` ruby
mail do |format|
  format.html
  format.text 
end
```

Some more chugging through ActionMailer and I discovered that if a block is passed into mail, #collect_responses_and_parts_order sets the parts_order for the email, which overrides header[:parts_order]. Aha! So reordering the format.\* lines in my block set the correct order in my mail.

I don't know if this is a documentation issue or a problem with the API - nowhere in the documentation is it very explicit that changing the order of the mail block also changes the order of the mail parts. 

It's weird to me because I'm used to writing format.\* stuff in the controller, and obviously in the context of a typical ActionController instance that order doesn't matter, but in ActionMailer it does - which strikes me as confusing. I'd suggest that ActionMailer should respect parts_order if it is set, or perhaps even ignore the order of the passed block completely.

Let me know if you guys think this is a documentation problem or an API problem, and I'll investigate a fix.


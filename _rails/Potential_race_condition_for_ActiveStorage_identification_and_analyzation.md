---
title: Potential race condition for ActiveStorage identification and analyzation
labels: activestorage, attached PR
layout: issue
---

I think I may have spotted a potential race condition in ActiveStorage with how it identifies and analyzes blobs. I noticed in our application that some blobs will be identified and some will be analysed, but not both. This is curious because a bug was fixed in #31138 which meant that the `AnalyzeJob` should merge it's metadata onto the existing metadata - so blobs should end up being identified and analyzed.

In our application our queue is quite short, so I suspected that the `AnalyzeJob` was picking up blobs before they had even been identified. Looking at the attachment code it seemed that the blob was identified inline *before* it was queued to be analzyed. It seemed to be as though it was being queued first - and my queue picked the record up before the identification was complete.

```
class ActiveStorage::Attachment < ActiveRecord::Base
  after_create_commit :identify_blob, :analyze_blob_later

  private
    def identify_blob
      blob.identify
    end

    def analyze_blob_later
      blob.analyze_later unless blob.analyzed?
    end
end
```

Upon diving further I came across this line in the documentation: [`In case there are multiple transactional callbacks as seen below, the order is reversed`](http://api.rubyonrails.org/classes/ActiveRecord/Callbacks.html). If I'm understanding this correctly, it sounds to me like the `analyze_blob_later` method is being called first. There is another issue #20911 which discusses the inconsistent ordering of callbacks.

I think that the order of the after create callbacks need to be flipped around so that the `AnalyzeJob` will be able to get a blob after it has been identified and so there is no potential for the identification and analyzing to overwrite each other in a race condition. It would mean each record will be updated correctly with their identification and analyzing result rather than one or the other.

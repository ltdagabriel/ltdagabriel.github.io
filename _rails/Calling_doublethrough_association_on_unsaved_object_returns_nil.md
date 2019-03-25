---
title: Calling double-through association on unsaved object returns nil
labels: With reproduction steps, activerecord, attached PR
layout: issue
---

Example of the issue:

``` ruby
class Response < ActiveRecord::Base
  belongs_to(
    :answer_choice,
    class_name: :AnswerChoice,
    primary_key: :id,
    foreign_key: :answer_choice_id
  )

  has_one :question, through: :answer_choice, source: :question
  has_one :poll, through: :question, source: :poll
end
```

``` ruby
class AnswerChoice < ActiveRecord::Base
  belongs_to(
    :question,
    class_name: :Question,
    primary_key: :id,
    foreign_key: :question_id
  )
end
```

``` ruby
class Question < ActiveRecord::Base
  belongs_to(
    :poll,
    class_name: :Poll,
    primary_key: :id,
    foreign_key: :poll_id
  )
end
```

``` ruby
class Poll < ActiveRecord::Base
end
```

In this example, when you create a new `response`, you can call `response.question` and get the corresponding question. When you try to call `response.poll` on an unsaved `response`, you get a return value of nil and no query is made to the database. Calling `response.question.poll` works fine, as does calling `response.question` on a `response` saved in the database. The issue seems to only come up when you call a double-through association on an unsaved object. For example, when you want to validate a `response` based on whether the `user` giving the response was the one who created the `poll` (so we wouldn't want them rigging their own poll!).


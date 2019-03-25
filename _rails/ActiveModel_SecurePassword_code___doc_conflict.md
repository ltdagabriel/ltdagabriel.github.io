---
title: ActiveModel::SecurePassword code / doc conflict
labels: activemodel
layout: issue
---

The documentation for ActiveModel::SecurePassword in master on github says that

```
  # Validations for presence of password, confirmation of password (using
  # a "password_confirmation" attribute) are automatically added.
  # You can add more validations by hand if need be.
```

Which makes perfect sense to me. password is required, password_confirmation is required, standard stuff. This commend has been there from the first commit

However the actual code is 

```
    attr_reader :password

    validates_confirmation_of :password
    validates_presence_of :password_digest
```

As you can see it is validating the presence of password_digest instead of password.

Now, in a blog post by @bcardarella at http://bcardarella.com/post/4668842452/exploring-rails-3-1-activemodel-securepassword he implies that validating the presence of password_digest is the correct outcome (Maybe it was at the time and got changed after or he read the code and not the comments?). 

Personally I think it is very very strange to be validating the presence of password_digest instead of the password attr itself as it leads to error messages on fields that the user cannot even see on their forms and a failure to generate the password_digest when the password and password_confirmation are present should raise an exception to my mind.

Personally I would prefer the code to be changed to match the documentation but either way I believe there is a conflict which should be resolved.


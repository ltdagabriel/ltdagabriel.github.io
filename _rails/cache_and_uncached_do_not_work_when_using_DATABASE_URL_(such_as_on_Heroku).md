---
title: cache and uncached do not work when using DATABASE_URL (such as on Heroku)
labels: activerecord
layout: issue
---

`ActiveRecord::Base` `cache` and `uncached` are only live when there are configurations present:

``` ruby
def cache(&block)
  if ActiveRecord::Base.configurations.blank?
    yield
  else
    connection.cache(&block)
  end
end

def uncached(&block)
  if ActiveRecord::Base.configurations.blank?
    yield
  else
    connection.uncached(&block)
  end
end
```

However, when using `DATABASE_URL` to specify the database configuration, `ActiveRecord::Base.configurations` is never populated:

``` ruby
initializer "active_record.initialize_database" do |app|
  ActiveSupport.on_load(:active_record) do
    db_connection_type = "DATABASE_URL"
    unless ENV['DATABASE_URL']
      db_connection_type  = "database.yml"
      self.configurations = app.config.database_configuration
    end
    Rails.logger.info "Connecting to database specified by #{db_connection_type}"

    establish_connection
  end
end
```

Which means that explicit calls to `cache` and `uncached` are never live on such environments. Such as Heroku.

I checked to make sure that `ActiveRecord::Base.configurations` wasn't being populated elsewhere in the stack, and it's not. In my local console, it has configurations. In the heroku console, it's empty.

This theory is consistent with a bug that I am seeing in one of my applications. However it seems pretty unlikely that this wouldn't have been noticed sooner by many many people. So maybe there is something particular about my environment. However this does seem to still be the cause and probably not an ideal way to check if ActiveRecord is configured.


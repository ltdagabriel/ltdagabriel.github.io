---
title: Setting controller on scope block in routes file - regression in 3.2.13
labels: actionpack, regression
layout: issue
---

I'm not sure if this is the same issue as #9697 or not, but my nested `scope` routes don't work anymore in 3.2.13 (but they do in 3.2.12):

``` ruby
scope '/job', :controller => :job do
  scope '/:id', :action => :manage_applicant, :as => "job_manage_applicant", :constraints => { :id => /\d+/ } do
    get '/deselected', :active_tab => 0
    get '/active', :active_tab => 1
    get '/hired', :active_tab => 2
    get '', :active_tab => 1
  end
end
```

In 3.2.12, `rake routes` returns:

```
job_manage_applicant_deselected GET    /job/:id/deselected(.:format)    job#manage_applicant {:subdomain=>"clients", :id=>/\d+/, :active_tab=>0}
    job_manage_applicant_active GET    /job/:id/active(.:format)        job#manage_applicant {:subdomain=>"clients", :id=>/\d+/, :active_tab=>1}
     job_manage_applicant_hired GET    /job/:id/hired(.:format)         job#manage_applicant {:subdomain=>"clients", :id=>/\d+/, :active_tab=>2}
           job_manage_applicant GET    /job/:id(.:format)               job#manage_applicant {:subdomain=>"clients", :id=>/\d+/, :active_tab=>1}
```

However, in 3.2.13:

```
job_manage_applicant_deselected GET    /job/:id/deselected(.:format)    deselected#manage_applicant {:subdomain=>"clients", :id=>/\d+/, :active_tab=>0}
    job_manage_applicant_active GET    /job/:id/active(.:format)        active#manage_applicant {:subdomain=>"clients", :id=>/\d+/, :active_tab=>1}
     job_manage_applicant_hired GET    /job/:id/hired(.:format)         hired#manage_applicant {:subdomain=>"clients", :id=>/\d+/, :active_tab=>2}
           job_manage_applicant GET    /job/:id(.:format)               job#manage_applicant {:subdomain=>"clients", :id=>/\d+/, :active_tab=>1}
```

And then I get `ActionController::RoutingError`s about `uninitialized constant ActiveController`, etc.

The same behaviour is exhibited even if I put the `controller` option on the inner scope, or even on each specific route. Only this form worked:

``` ruby
scope '/job' do
  scope '/:id', :action => :manage_applicant, :as => "job_manage_applicant", :constraints => { :id => /\d+/ } do
    get '/deselected' => 'job#manage_applicant', :active_tab => 0
    get '/active' => 'job#manage_applicant', :active_tab => 1
    get '/hired' => 'job#manage_applicant', :active_tab => 2
    get '', :active_tab => 1
  end
end
```

Which, of course, is not very DRY.


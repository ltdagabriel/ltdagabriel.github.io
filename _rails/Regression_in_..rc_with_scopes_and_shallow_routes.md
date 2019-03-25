---
title: Regression in 4.1.rc1 with scopes and shallow routes
labels: actionpack, regression, routing
layout: issue
---

I have the following routes setup:

```
  scope shallow_path: 'projects', shallow_prefix: 'project' do
    resources :projects do
      resources :files, controller: 'project_files', shallow: true
    end
  end
```

In beta1 this produced:

```
             Prefix Verb   URI Pattern                               Controller#Action
    project_files GET    /projects/:project_id/files(.:format)     project_files#index
                  POST   /projects/:project_id/files(.:format)     project_files#create
 new_project_file GET    /projects/:project_id/files/new(.:format) project_files#new
edit_project_file GET    /projects/files/:id/edit(.:format)        project_files#edit
     project_file GET    /projects/files/:id(.:format)             project_files#show
                  PATCH  /projects/files/:id(.:format)             project_files#update
                  PUT    /projects/files/:id(.:format)             project_files#update
                  DELETE /projects/files/:id(.:format)             project_files#destroy
         projects GET    /projects(.:format)                       projects#index
                  POST   /projects(.:format)                       projects#create
      new_project GET    /projects/new(.:format)                   projects#new
     edit_project GET    /projects/:id/edit(.:format)              projects#edit
          project GET    /projects/:id(.:format)                   projects#show
                  PATCH  /projects/:id(.:format)                   projects#update
                  PUT    /projects/:id(.:format)                   projects#update
                  DELETE /projects/:id(.:format)                   projects#destroy
```

but in rc1 it produces (notice the double prefixes on the project files routes)

```
                  Prefix Verb   URI Pattern                                        Controller#Action
   project_project_files GET    /projects/projects/:project_id/files(.:format)     project_files#index
                         POST   /projects/projects/:project_id/files(.:format)     project_files#create
new_project_project_file GET    /projects/projects/:project_id/files/new(.:format) project_files#new
       edit_project_file GET    /projects/files/:id/edit(.:format)                 project_files#edit
            project_file GET    /projects/files/:id(.:format)                      project_files#show
                         PATCH  /projects/files/:id(.:format)                      project_files#update
                         PUT    /projects/files/:id(.:format)                      project_files#update
                         DELETE /projects/files/:id(.:format)                      project_files#destroy
                projects GET    /projects(.:format)                                projects#index
                         POST   /projects(.:format)                                projects#create
             new_project GET    /projects/new(.:format)                            projects#new
            edit_project GET    /projects/:id/edit(.:format)                       projects#edit
                 project GET    /projects/:id(.:format)                            projects#show
                         PATCH  /projects/:id(.:format)                            projects#update
                         PUT    /projects/:id(.:format)                            projects#update
                         DELETE /projects/:id(.:format)                            projects#destroy
```


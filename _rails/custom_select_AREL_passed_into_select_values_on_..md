---
title: custom select AREL passed into `select_values` on 4.0
labels: activerecord, attached PR, regression
layout: issue
---

seems as the use-case I present was working with **3.2** but no longer does on **4.0**, it ends up with yet another :  _NoMethodError: undefined method `reverse' for nil:NilClass_

here's the code that fails (reproducable e.g. with the mysql2 adapter):

``` ruby
role = Role.create! :name => "main", :description => "main role"
Role.create! :name => "user", :description => "user role"

Right.create! :name => "r0", :hours => 0
r1 = Right.create! :name => "r1", :hours => 1
r2 = Right.create! :name => "r2", :hours => 2
Right.create! :name => "r3", :hours => 3

role.permission_groups.create! :right => r1.reload
role.permission_groups.create! :right => r2.reload

connection = ActiveRecord::Base.connection
groups = role.reload.permission_groups.select('right_id')

assert_equal [ r1.id, r2.id ], connection.select_values(groups)
```

models / migrations :

``` ruby
class CreateRightsAndRoles < ActiveRecord::Migration
  def self.up
    create_table :role_assignments do |t| 
      t.column :role_id, :integer
      t.column :user_id, :integer
    end

    create_table :roles do |t| 
      t.column :name, :string
      t.column :description, :string
    end 

    create_table :permission_groups do |t|
      t.column :right_id, :integer, :null => false
      t.column :role_id, :integer, :null => false
    end 

    create_table :rights do |t| 
      t.column :name, :string
      t.column :controller_name, :string
      t.column :actions, :string
      t.column :hours, :float, :null => false
    end
  end

  def self.down
    drop_table :role_assignments
    drop_table :roles
    drop_table :permission_groups
    drop_table :rights
  end
end

class Right < ActiveRecord::Base
  has_many :permission_groups, :dependent => :destroy
  has_many :roles, :through => :permission_groups
end

class Role < ActiveRecord::Base
  has_many :permission_groups, :dependent => :destroy
  has_many :rights, :through => :permission_groups
  has_many :role_assignments, :dependent => :destroy

  def has_right?(right)
    rights.include? right
  end
end

class PermissionGroup < ActiveRecord::Base
  belongs_to :right
  belongs_to :role
end

class RoleAssignment < ActiveRecord::Base
  belongs_to :user
  belongs_to :role
end
```

back-trace :

```
  NoMethodError: undefined method `reverse' for nil:NilClass
/opt/local/rvm/gems/ruby-1.9.3-p429@jdbc/gems/activerecord-4.0.0/lib/active_record/connection_adapters/abstract/database_statements.rb:14:in `block in to_sql'
/opt/local/rvm/gems/ruby-1.9.3-p429@jdbc/gems/arel-4.0.0/lib/arel/visitors/bind_visitor.rb:26:in `call'
/opt/local/rvm/gems/ruby-1.9.3-p429@jdbc/gems/arel-4.0.0/lib/arel/visitors/bind_visitor.rb:26:in `visit_Arel_Nodes_BindParam'
/opt/local/rvm/gems/ruby-1.9.3-p429@jdbc/gems/arel-4.0.0/lib/arel/visitors/visitor.rb:19:in `visit'
/opt/local/rvm/gems/ruby-1.9.3-p429@jdbc/gems/arel-4.0.0/lib/arel/visitors/to_sql.rb:517:in `visit_Arel_Nodes_Equality'
/opt/local/rvm/gems/ruby-1.9.3-p429@jdbc/gems/arel-4.0.0/lib/arel/visitors/visitor.rb:19:in `visit'
/opt/local/rvm/gems/ruby-1.9.3-p429@jdbc/gems/arel-4.0.0/lib/arel/visitors/to_sql.rb:499:in `block in visit_Arel_Nodes_And'
/opt/local/rvm/gems/ruby-1.9.3-p429@jdbc/gems/arel-4.0.0/lib/arel/visitors/to_sql.rb:499:in `map'
/opt/local/rvm/gems/ruby-1.9.3-p429@jdbc/gems/arel-4.0.0/lib/arel/visitors/to_sql.rb:499:in `visit_Arel_Nodes_And'
/opt/local/rvm/gems/ruby-1.9.3-p429@jdbc/gems/arel-4.0.0/lib/arel/visitors/visitor.rb:19:in `visit'
/opt/local/rvm/gems/ruby-1.9.3-p429@jdbc/gems/arel-4.0.0/lib/arel/visitors/to_sql.rb:216:in `block in visit_Arel_Nodes_SelectCore'
/opt/local/rvm/gems/ruby-1.9.3-p429@jdbc/gems/arel-4.0.0/lib/arel/visitors/to_sql.rb:215:in `each'
/opt/local/rvm/gems/ruby-1.9.3-p429@jdbc/gems/arel-4.0.0/lib/arel/visitors/to_sql.rb:215:in `each_with_index'
/opt/local/rvm/gems/ruby-1.9.3-p429@jdbc/gems/arel-4.0.0/lib/arel/visitors/to_sql.rb:215:in `visit_Arel_Nodes_SelectCore'
/opt/local/rvm/gems/ruby-1.9.3-p429@jdbc/gems/arel-4.0.0/lib/arel/visitors/mysql.rb:41:in `visit_Arel_Nodes_SelectCore'
/opt/local/rvm/gems/ruby-1.9.3-p429@jdbc/gems/arel-4.0.0/lib/arel/visitors/to_sql.rb:175:in `block in visit_Arel_Nodes_SelectStatement'
/opt/local/rvm/gems/ruby-1.9.3-p429@jdbc/gems/arel-4.0.0/lib/arel/visitors/to_sql.rb:175:in `each'
/opt/local/rvm/gems/ruby-1.9.3-p429@jdbc/gems/arel-4.0.0/lib/arel/visitors/to_sql.rb:175:in `visit_Arel_Nodes_SelectStatement'
/opt/local/rvm/gems/ruby-1.9.3-p429@jdbc/gems/arel-4.0.0/lib/arel/visitors/mysql.rb:36:in `visit_Arel_Nodes_SelectStatement'
/opt/local/rvm/gems/ruby-1.9.3-p429@jdbc/gems/arel-4.0.0/lib/arel/visitors/visitor.rb:19:in `visit'
/opt/local/rvm/gems/ruby-1.9.3-p429@jdbc/gems/arel-4.0.0/lib/arel/visitors/visitor.rb:5:in `accept'
/opt/local/rvm/gems/ruby-1.9.3-p429@jdbc/gems/arel-4.0.0/lib/arel/visitors/to_sql.rb:68:in `accept'
/opt/local/rvm/gems/ruby-1.9.3-p429@jdbc/gems/arel-4.0.0/lib/arel/visitors/bind_visitor.rb:11:in `accept'
/opt/local/rvm/gems/ruby-1.9.3-p429@jdbc/gems/activerecord-4.0.0/lib/active_record/connection_adapters/abstract/database_statements.rb:13:in `to_sql'
/opt/local/rvm/gems/ruby-1.9.3-p429@jdbc/gems/activerecord-4.0.0/lib/active_record/connection_adapters/abstract/database_statements.rb:44:in `select_values'
```


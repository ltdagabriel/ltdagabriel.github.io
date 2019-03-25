---
title: has_many :through model using STI appears to use fixed (and sometimes wrong) table name in the condition on the inheritance type column
labels: activerecord, needs feedback, stale
layout: issue
---

Using Rails 3.2.5

It appears that the condition of the form

``` sql
table.inheritance_column IN ('type')
```

when querying on models using single table inheritance uses a fixed table name (e.g., `groups` in the below example).  This occasionally results in the condition being on the wrong table and returning the wrong results from this query, as shown below.

To reproduce, I created a fresh application and set up a simple contrived example:

Migration:

``` ruby
class CreateTables < ActiveRecord::Migration
  def up
    create_table :leagues do |t|
    end

    create_table :players do |t|
    end

    create_table :groups do |t|
      t.belongs_to :league
      t.string :type
    end

    create_table :memberships do |t|
      t.belongs_to :group
      t.belongs_to :player
    end
  end

  def down
  end
end
```

Models:

``` ruby
class League < ActiveRecord::Base
  has_many :league_groups
  has_many :players,
    :through => :league_groups
  has_many :groups,
    :through => :players
end

class Group < ActiveRecord::Base
  has_many :memberships
  has_many :players, :through => :memberships
end

class LeagueGroup < Group
  belongs_to :league
end

class PlayerGroup < Group
end

class Membership < ActiveRecord::Base
  belongs_to :player
  belongs_to :group
end

class Player < ActiveRecord::Base
  has_many :memberships
  has_many :groups, :through => :memberships
end
```

Data setup:

``` ruby
league = League.create!

league_group = LeagueGroup.new
league_group.league = league
league_group.save!

player_group = PlayerGroup.create!

player = Player.create!

league_membership = Membership.new
league_membership.player = player
league_membership.group = league_group
league_membership.save!

player_membership = Membership.new
player_membership.player = player
player_membership.group = player_group
player_membership.save!
```

Then, to reproduce the problem, execute

``` ruby
league.groups
```

This outputs

```
[#<LeagueGroup id: 1, league_id: 1, type: "LeagueGroup">]
```

(notice the PlayerGroup is missing) and generates the SQL

``` sql
SELECT "groups".* FROM "groups"
 INNER JOIN "memberships" ON "groups"."id" = "memberships"."group_id"
 INNER JOIN "players" ON "memberships"."player_id" = "players"."id"
 INNER JOIN "memberships" "memberships_groups_join" ON "players"."id" = "memberships_groups_join"."player_id"
 INNER JOIN "groups" "league_groups_groups_join" ON "memberships_groups_join"."group_id" = "league_groups_groups_join"."id"
 WHERE "groups"."type" IN ('LeagueGroup') AND "league_groups_groups_join"."league_id" = 1
```

However, I think it should be using

``` sql
    "league_groups_groups_join"."type" IN ('LeagueGroup')
```

A (less than ideal) workaround to this is changing the `has_many :league_groups` in `League` to this:

``` ruby
  has_many :league_groups,
    :class_name => 'Group',
    :conditions => {:type => 'LeagueGroup'}
```

so that `league.groups` correctly returns

```
[#<LeagueGroup id: 1, league_id: 1, type: "LeagueGroup">, #<PlayerGroup id: 2, league_id: nil, type: "PlayerGroup">]
```

and generates the correct SQL

``` sql
SELECT "groups".* FROM "groups"
 INNER JOIN "memberships" ON "groups"."id" = "memberships"."group_id"
 INNER JOIN "players" ON "memberships"."player_id" = "players"."id"
 INNER JOIN "memberships" "memberships_groups_join" ON "players"."id" = "memberships_groups_join"."player_id"
 INNER JOIN "groups" "league_groups_groups_join" ON "memberships_groups_join"."group_id" = "league_groups_groups_join"."id"
 WHERE "league_groups_groups_join"."league_id" = 1 AND "league_groups_groups_join"."type" = 'LeagueGroup'
```

Thanks!


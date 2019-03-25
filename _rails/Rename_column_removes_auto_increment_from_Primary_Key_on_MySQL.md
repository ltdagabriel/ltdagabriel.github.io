---
title: Rename_column removes auto increment from Primary Key on MySQL
labels: activerecord
layout: issue
---

When working with a legacy database and having to rename the id column the SQL sent to the DB is for example 

"ALTER TABLE `some_table` CHANGE `ID` `id` int(11) NOT NULL", although Auto Increment is enabled on the column. Thus Auto Increment is removed and when creating new items an exception is thrown.

"execute("ALTER TABLE `performances` CHANGE `ID` `id` int(11) NOT NULL AUTO_INCREMENT" in the migration solves that problem, but still rename_column should probably reset the current attributes.

Rails Version:
Rails 3.1.0

MySqL Version:
Ver 14.14 Distrib 5.1.58, for debian-linux-gnu (i686) using readline 6.2


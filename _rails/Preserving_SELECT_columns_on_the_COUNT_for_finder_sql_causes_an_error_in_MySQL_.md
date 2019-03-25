---
title: Preserving SELECT columns on the COUNT for finder_sql causes an error in MySQL 
labels: activerecord
layout: issue
---

Since #3503, the COUNT clause of a finder_sql relationship is being rewritten from COUNT(*) to COUNT(table_name.*). This does not appear to be valid syntax in MySQL:

```
mysql> SELECT COUNT( table_name.* ) FROM `table_name`;
ERROR 1064 (42000): You have an error in your SQL syntax; check the manual that corresponds to your MySQL server version for the right syntax to use near '* ) FROM `table_name`' at line 1
```

I've checked these specific versions against both MyISAM and InnoDB tables:

```
mysql  Ver 14.14 Distrib 5.5.15, for osx10.6 (i386) using readline 5.1
mysql  Ver 14.14 Distrib 5.1.41, for debian-linux-gnu (x86_64) using readline 6.1
```


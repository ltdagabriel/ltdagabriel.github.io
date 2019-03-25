---
title: [Regression 4.0.10.rc1 & 4.1.6.rc1] PG::SyntaxError ActiveRecord removes spaces from SQL
labels: activerecord, regression
layout: issue
---

In Rails 4.0.9 or 4.1.5 this query is generated:

``` sql
SELECT DISTINCT "properties"."id", CASE WHEN contacts.is_company THEN 
UPPER(contacts.company) ELSE UPPER(contacts.name) END AS alias_0 FROM "properties" LEFT 
OUTER JOIN "things" ON "things"."property_id" = "properties"."id" LEFT OUTER JOIN "contacts" ON 
"contacts"."id" = "properties"."contact_id" ORDER BY CASE WHEN contacts.is_company THEN 
UPPER(contacts.company) ELSE UPPER(contacts.name) END LIMIT 10
```

But in 4.0.10.rc1 & 4.1.6.rc1 the sql looks like this:

``` sql
SELECT DISTINCT "properties"."id", 
CASEWHENcontacts.is_companyTHENUPPER(contacts.company)ELSEUPPER(contacts.name)END 
AS alias_0 FROM "properties" LEFT OUTER JOIN "things" ON "things"."property_id" = "properties"."id" 
LEFT OUTER JOIN "contacts" ON "contacts"."id" = "properties"."contact_id" ORDER BY CASE WHEN 
contacts.is_company THEN UPPER(contacts.company) ELSE UPPER(contacts.name) END LIMIT 10
```

Which obviously results in a PG::SyntaxError:

```
ERROR -- : PG::SyntaxError: ERROR:  syntax error at or near "("
LINE 1: ...cts.is_companyTHENUPPER(contacts.company)ELSEUPPER(contacts....
                                                             ^
```

Standalone test case: https://gist.github.com/nathany/5ae1e7bbc7bae86bca20


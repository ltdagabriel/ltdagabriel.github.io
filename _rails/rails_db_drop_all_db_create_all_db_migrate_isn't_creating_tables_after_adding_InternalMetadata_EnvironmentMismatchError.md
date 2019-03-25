---
title: `rails db:drop:all db:create:all db:migrate` isn't creating tables after adding InternalMetadata/EnvironmentMismatchError
labels: activerecord
layout: issue
---

Right now `rails db:drop:all db:create:all db:migrate` leaves DB without any tables, before adding internal metadata this command resulted in migrated DB.
Unfortunately I can't bisect the issue because in many commits dropping/creating/migration in a single run is broken, but AFAICS the issue emerged after adding InternalMetadata/EnvironmentMismatchError.

The first bad commit could be any of:
d70c68d76abcbc24ef0e56b7a7b580d0013255dd
f6628adc11e2e57db75030fca9bae035be5cd95b
c1a1595740b243bed02f5e59090cc58dac77bbf3
de2cb20117af68cef4126d8998cc63e178c58187
302e92359cc88258ae15a82454c58408a4b8157e
a76c4233a9ee9ffbf413c4b8353e73e8ffbeb3a5
350ae6cdc1ea83e21c23abd10e7e99c9a0bbdbd2
ab40d71ff88f99ee4219747fcc8774514ec50ef8
7b065f623f2a56d74eca88ed27970c71a76f0a17
921997675258147fdc2bbbca0da4fb0c771c218d
30391e9ddba745d6bdc0b23f526ecf432dfe6adf
900bfd94a9c3c45484d88aa69071b7a52c5b04b4
34ac8a1e98e85b28fe3ee02a83c85cdaa4b77714
We cannot bisect more!

cc @schneems 


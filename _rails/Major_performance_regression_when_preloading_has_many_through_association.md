---
title: Major performance regression when preloading has_many_through association
labels: activerecord
layout: issue
---

Between Rails 3.2 and 4.1.0 beta, the performance of preloading a has_many_through association has declined. A commit, #12090, brought performance back to the range of one third the speed of Rails 3.2. However, between a3dd738c38df634a46a2261a0de27fd31de7ae51 and the current codebase, the performance has again dropped approximately 5.5 times.

Here are some benchmarks.

```
                                         3.2.14 - postgresql
                                              user     system      total        real
limit 100 has_many                         0.070000   0.000000   0.070000 (  0.086018)
limit 100 has_many_through                 0.030000   0.000000   0.030000 (  0.034133)
limit 100 double has_many_through          0.040000   0.010000   0.050000 (  0.057401)
limit 1000 has_many                        0.110000   0.000000   0.110000 (  0.122771)
limit 1000 has_many_through                0.230000   0.010000   0.240000 (  0.249680)
limit 1000 double has_many_through         0.460000   0.000000   0.460000 (  0.488896)

                                         4.1.0.beta (a3dd738c38df634a46a2261a0de27fd31de7ae51) - postgresql
                                              user     system      total        real
limit 100 has_many                         0.060000   0.000000   0.060000 (  0.070222)
limit 100 has_many_through                 0.070000   0.010000   0.080000 (  0.075542)
limit 100 double has_many_through          0.090000   0.010000   0.100000 (  0.107504)
limit 1000 has_many                        0.130000   0.000000   0.130000 (  0.136422)
limit 1000 has_many_through                0.680000   0.010000   0.690000 (  0.719953)
limit 1000 double has_many_through         1.320000   0.010000   1.330000 (  1.343767)

                                         4.1.0.beta - postgresql
                                              user     system      total        real
limit 100 has_many                         0.020000   0.000000   0.020000 (  0.025983)
limit 100 has_many_through                 0.130000   0.000000   0.130000 (  0.140196)
limit 100 double has_many_through          0.130000   0.010000   0.140000 (  0.149074)
limit 1000 has_many                        0.140000   0.000000   0.140000 (  0.152584)
limit 1000 has_many_through                3.490000   0.030000   3.520000 (  3.542585)
limit 1000 double has_many_through         7.250000   0.030000   7.280000 (  7.390997)
```

To be clear, the issue does not occur using eager_load, only when using preload.

A quick look at the call graph shows invocations of hash[]= have jumped from 8865 to almost 9.4 million. 

```
# Rails 3.2.14     0.19%     0.19%   0.01    0.01    0.00    0.00    8865        Hash#[]=
# Rails 4.1.0 beta 76.78%    15.66%  114.09  23.27   0.00    90.82   9384486     Hash#[]=
```

I've created a gist for other to repeat my tests in case I've missed something major.
https://gist.github.com/njakobsen/6393783

Through a process of elimination, I identified a likely source of the regression to this commit e5299c1ef693ef434f55811027a7da975cd55ba5. All subsequent commits that I tested exhibited the slow performance, all preceding commits I tested did not. I know @tenderlove has been working on preloader recently, reducing the number of objects that are created, perhaps he can shed some light onto the major structural he's been applying, and how we might help optimize this section of code.


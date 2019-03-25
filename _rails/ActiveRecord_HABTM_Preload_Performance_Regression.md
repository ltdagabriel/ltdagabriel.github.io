---
title: ActiveRecord HABTM Preload Performance Regression
labels: activerecord, attached PR, regression
layout: issue
---

I found that some requests in our application started timing out after upgrading to Rails 4.1.1. It turns out this was because preloading HABTM queries is extremely slow for some reason. I created a minimal benchmark based on the ActiveRecord bug template to demonstrate the issue: https://gist.github.com/vikhyat/768c4fe883de83a799a4

These are the results of the benchmark:

```
       user     system      total        real
Preload: 20  0.060000   0.000000   0.060000 (  0.063410)
Preload: 40  0.200000   0.000000   0.200000 (  0.198193)
Preload: 60  0.420000   0.000000   0.420000 (  0.424104)
Preload: 80  0.710000   0.000000   0.710000 (  0.705614)
Preload: 100  1.100000   0.000000   1.100000 (  1.101897)
Preload: 120  1.580000   0.000000   1.580000 (  1.576200)
Preload: 140  2.140000   0.000000   2.140000 (  2.142106)
Preload: 160  2.790000   0.000000   2.790000 (  2.794206)
Preload: 180  3.530000   0.000000   3.530000 (  3.526480)
Preload: 200  4.330000   0.000000   4.330000 (  4.336192)
Preload: 220  5.290000   0.010000   5.300000 (  5.292490)
Preload: 240  6.280000   0.000000   6.280000 (  6.276606)
Preload: 260  7.300000   0.000000   7.300000 (  7.301626)
Preload: 280  8.590000   0.000000   8.590000 (  8.589534)
Preload: 300  9.690000   0.000000   9.690000 (  9.696744)
Preload: 320 11.120000   0.010000  11.130000 ( 11.120075)
Preload: 340 12.470000   0.000000  12.470000 ( 12.475323)
Preload: 360 14.040000   0.010000  14.050000 ( 14.049947)
Preload: 380 15.570000   0.000000  15.570000 ( 15.570407)
Preload: 400 17.300000   0.000000  17.300000 ( 17.303420)
Preload: 420 19.090000   0.010000  19.100000 ( 19.091995)
Preload: 440 20.950000   0.000000  20.950000 ( 20.948938)
Preload: 460 22.960000   0.010000  22.970000 ( 22.967456)
Preload: 480 24.940000   0.000000  24.940000 ( 24.950712)
Preload: 500 27.150000   0.010000  27.160000 ( 27.148344)
```

Definitely doesn't look like linear time complexity, which I would've expected here. It is so bad that it ends up being faster to just let an n+1 query happen.

```
       user     system      total        real
n+1:     20  0.050000   0.000000   0.050000 (  0.054664)
n+1:     40  0.100000   0.000000   0.100000 (  0.091517)
n+1:     60  0.130000   0.000000   0.130000 (  0.132433)
n+1:     80  0.170000   0.000000   0.170000 (  0.173936)
n+1:     100  0.220000   0.000000   0.220000 (  0.218220)
n+1:     120  0.260000   0.000000   0.260000 (  0.259074)
n+1:     140  0.300000   0.000000   0.300000 (  0.303388)
n+1:     160  0.350000   0.000000   0.350000 (  0.345752)
n+1:     180  0.390000   0.000000   0.390000 (  0.390691)
n+1:     200  0.430000   0.000000   0.430000 (  0.435159)
n+1:     220  0.480000   0.000000   0.480000 (  0.479689)
n+1:     240  0.530000   0.000000   0.530000 (  0.523980)
n+1:     260  0.560000   0.000000   0.560000 (  0.561001)
n+1:     280  0.610000   0.010000   0.620000 (  0.615086)
n+1:     300  0.660000   0.000000   0.660000 (  0.658709)
n+1:     320  0.690000   0.000000   0.690000 (  0.696682)
n+1:     340  0.740000   0.000000   0.740000 (  0.733654)
n+1:     360  0.770000   0.000000   0.770000 (  0.774647)
n+1:     380  0.830000   0.000000   0.830000 (  0.828438)
n+1:     400  0.870000   0.000000   0.870000 (  0.876504)
n+1:     420  0.930000   0.000000   0.930000 (  0.926957)
n+1:     440  0.980000   0.010000   0.990000 (  0.979548)
n+1:     460  0.990000   0.000000   0.990000 (  0.989413)
n+1:     480  1.030000   0.000000   1.030000 (  1.034881)
n+1:     500  1.120000   0.000000   1.120000 (  1.118535)
```

I tried to figure out what was going on using StackProf and I think the cause of this problem is that the join table does not have any primary key, because these are the results:

```
==================================
  Mode: cpu(1000)
  Samples: 4573 (0.00% miss rate)
  GC: 202 (4.42%)
==================================
     TOTAL    (pct)     SAMPLES    (pct)     FRAME
      1754  (38.4%)        1754  (38.4%)     ActiveRecord::Core#update_attributes_from_transaction_state
      1722  (37.7%)        1722  (37.7%)     block (2 levels) in ActiveRecord::AttributeMethods::Read#read_attribute
       343   (7.5%)         343   (7.5%)     ActiveRecord::AttributeMethods::PrimaryKey::ClassMethods#primary_key
      4114  (90.0%)         248   (5.4%)     ActiveRecord::AttributeMethods::PrimaryKey#id
      4229  (92.5%)         124   (2.7%)     ActiveRecord::Core#==
      1762  (38.5%)          39   (0.9%)     block in ActiveRecord::AttributeMethods::Read#read_attribute
```

I'm guessing the cause of this is that HABTM relations are now treated as has_many through internally?

Adding `def id; nil; end` to the model returned by through_model [here](https://github.com/rails/rails/blob/master/activerecord/lib/active_record/associations/builder/has_and_belongs_to_many.rb#L50-L78) results in a drastic improvement:

```
       user     system      total        real
Preload: 20  0.020000   0.000000   0.020000 (  0.028965)
Preload: 40  0.070000   0.000000   0.070000 (  0.067398)
Preload: 60  0.130000   0.000000   0.130000 (  0.132211)
Preload: 80  0.230000   0.000000   0.230000 (  0.225846)
Preload: 100  0.330000   0.010000   0.340000 (  0.336442)
Preload: 120  0.470000   0.000000   0.470000 (  0.464461)
Preload: 140  0.610000   0.000000   0.610000 (  0.617623)
Preload: 160  0.800000   0.000000   0.800000 (  0.800362)
Preload: 180  1.000000   0.000000   1.000000 (  1.000626)
Preload: 200  1.250000   0.000000   1.250000 (  1.250085)
Preload: 220  1.490000   0.000000   1.490000 (  1.486242)
Preload: 240  1.770000   0.000000   1.770000 (  1.767213)
Preload: 260  2.060000   0.000000   2.060000 (  2.067684)
Preload: 280  2.390000   0.000000   2.390000 (  2.384439)
Preload: 300  2.760000   0.000000   2.760000 (  2.763481)
Preload: 320  3.120000   0.000000   3.120000 (  3.125184)
Preload: 340  3.570000   0.010000   3.580000 (  3.570069)
Preload: 360  3.920000   0.000000   3.920000 (  3.923540)
Preload: 380  4.440000   0.000000   4.440000 (  4.437941)
Preload: 400  4.820000   0.000000   4.820000 (  4.823900)
Preload: 420  5.390000   0.000000   5.390000 (  5.393981)
Preload: 440  5.820000   0.010000   5.830000 (  5.821057)
Preload: 460  6.370000   0.000000   6.370000 (  6.366625)
Preload: 480  7.080000   0.000000   7.080000 (  7.083520)
Preload: 500  7.530000   0.000000   7.530000 (  7.531730)
```

Still not as good as the n+1 query version, though.


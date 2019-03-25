---
title: Upgrading from Rails 5.0.0.1 to 5.0.1 increases import from local CSV from 3 to 94 minutes
labels: activerecord, attached PR
layout: issue
---

I have a rake task which imports 38242 rows from a local CSV file. Even though it might not be the most efficient way, for each row `create!` is executed to create a new record. Just by updating Rails to 5.0.1, without changing anything else, the time to create these records increased tremendously. I couldn't find anything in the changelog that would indicate such an increase. 

Any ideas?

### The rake task basically looks like this

```
require 'csv'

namespace :csv do
  desc 'Import records from CSV file'
  task import: :environment do
    puts "#{Time.now}: Loading ..."

    csv_file = File.read(Rails.root.join('lib', 'assets', "data.csv"), encoding: Encoding::UTF_8)
    csv = CSV.parse(csv_file, headers: true)

    count = 0

    csv.each do |row|
      Record.create!(
        attribute1: row['attribute1'],
        attribute2: row['attribute2'],
        attribute3: row['attribute3'],
        attribute4: row['attribute4'],
        attribute5: row['attribute5']
      )

      count += 1
    end

    puts "#{Time.now}: Loaded #{count} rows."
  end
end

```

### Rails 5.0.0.1
Import in less than 3 minutes.
```
$ rake csv:import
2016-12-21 22:59:49 +0100: Loading ...
2016-12-21 23:02:37 +0100: Loaded 38242 rows.
```

### Rails 5.0.1
Import in almost 94 minutes.
```
$ rake csv:import
2016-12-22 08:32:49 +0100: Loading ...
2016-12-22 10:06:26 +0100: Loaded 38242 rows.
```

### System configuration
- Ruby 2.3.3
- Rails 5.0.1
- Puma 3.6.2
- Postgres 9.6
- Mac OS Sierra 10.12.2


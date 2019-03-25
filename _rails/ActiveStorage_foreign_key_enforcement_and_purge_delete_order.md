---
title: ActiveStorage foreign key enforcement and purge delete order
labels: activestorage
layout: issue
---

This issue is twofold:
1. The attachments table doesn't create a foreign key association in the database by default
2. 1 can't be done because of the order things happen in `#purge`

### Problem information
So, to ensure maximum enforcement in the database, I would want to the attachments table to have an foreign key to the blobs table. I can easily do this by specifying it in the migration:
````ruby
t.references :blob,     foreign_key: { to_table: :active_storage_blobs }, null: false
````

This works fine when initially adding an attachment.
But when I would delete it, the blob gets deleted first, then the attachment, creating a temporary case in which the FK wouldn't be used
````ruby
> some_model.image.purge
# ActiveStorage deletes the file, then immediately afterwards...
  ActiveStorage::Blob Destroy (1.3ms)  DELETE FROM "active_storage_blobs" WHERE "active_storage_blobs"."id" = $1  [["id", 1]]                                                                                                               
   (0.2ms)  ROLLBACK
ActiveRecord::InvalidForeignKey: PG::ForeignKeyViolation: ERROR:  update or delete on table "active_storage_blobs" violates foreign key constraint "fk_rails_c3b3935057" on table "active_storage_attachments"                            
DETAIL:  Key (id)=(1) is still referenced from table "active_storage_attachments".
: DELETE FROM "active_storage_blobs" WHERE "active_storage_blobs"."id" = $1 
````
### Expected behavior
The purge process should complete successfully. However, I see that the process should go a bit differently than it currently does:
1. The attachment gets deleted. At this point, there is no association to whatever model you were originally looking at.
2. ActiveStorage deletes the actual file from storage.
3. After confirming the file's deletion, the blob gets deleted.

If it follows these steps, then the foreign key association is ok. Having the FK be a part of the default migration is another story, which I'm strongly suggesting with this.

### Actual behavior
Blob gets deleted first, then attachment. Foreign key is not possible with this arrangement, and if something goes wrong this can lead to database orphans. Also it appears to do both deletes in separate transactions in a situation where this is successful.

### System configuration
**Rails version**:
5.2.0
**Ruby version**:
2.4.4

Further information can be provided if necessary.

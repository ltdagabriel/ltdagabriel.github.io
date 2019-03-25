---
title: Rails 3.2.0 + mysql2 0.3.11 + Model.select("some joined col.").includes = FAIL
labels: activerecord, needs feedback
layout: issue
---

Don't know if this is issue with mysql2 gem or ActiveRelation (feel free to redirect me), but using `.includes` on has_many association causes ARel to ignore call to `.select("...")`. 

``` ruby

class User::User < AR........
  # ...
  has_many :user_share, :class_name => 'User::RokShare', :foreign_key => :rs_user
  # ...

end

# later on...
      share = User::User.select('u_name, u_surname, rs_amount').where('rs_rok = ?', self.u_id).joins(:user_share).includes(:user_share).all
      unless share.nil? || share.empty?
        at['rok_share'] = share.collect { |s| [s.name, s.rs_amount] }
      end
```

gives:

```
  SQL (0.2ms)  SELECT `user_tbl_user`.`u_id` AS t0_r0, `user_tbl_user`.`u_number` AS t0_r1, `user_tbl_user`.`u_name` AS t0_r2, `user_tbl_user`.`u_surname` AS t0_r3, `user_tbl_user`.`u_password` AS t0_r4, `user_tbl_user`.`u_password_readonly` AS t0_r5, `user_tbl_user`.`u_brand` AS t0_r6, `user_tbl_user`.`u_active_from` AS t0_r7, `user_tbl_user`.`u_active_to` AS t0_r8, `user_tbl_user`.`u_street` AS t0_r9, `user_tbl_user`.`u_zip_code` AS t0_r10, `user_tbl_user`.`u_town` AS t0_r11, `user_tbl_user`.`u_phone` AS t0_r12, `user_tbl_user`.`u_mobile` AS t0_r13, `user_tbl_user`.`u_email` AS t0_r14, `user_tbl_user`.`u_birthday` AS t0_r15, `user_tbl_user`.`u_coop` AS t0_r16, `user_tbl_user`.`u_coop_birthday` AS t0_r17, `user_tbl_user`.`u_photo` AS t0_r18, `user_tbl_user`.`u_recruitment` AS t0_r19, `user_tbl_user`.`u_sponsor` AS t0_r20, `user_tbl_user`.`u_reference` AS t0_r21, `user_tbl_user`.`u_level` AS t0_r22, `user_tbl_user`.`u_f_manager` AS t0_r23, `user_tbl_user`.`u_f_ror` AS t0_r24, `user_tbl_user`.`u_f_rok` AS t0_r25, `user_tbl_user`.`u_in_rewards_list` AS t0_r26, `user_tbl_user`.`u_parent_rtm` AS t0_r27, `user_tbl_user`.`created_at` AS t0_r28, `user_tbl_user`.`updated_at` AS t0_r29, `user_tbl_user`.`u_login` AS t0_r30, `user_tbl_user`.`u_dismiss_argument` AS t0_r31, `user_tbl_user`.`u_active_from_calendar` AS t0_r32, `user_tbl_user`.`u_locale` AS t0_r33, `user_tbl_user`.`u_shown_name` AS t0_r34, `user_tbl_rok_share`.`rs_id` AS t1_r0, `user_tbl_rok_share`.`rs_rok` AS t1_r1, `user_tbl_rok_share`.`rs_user` AS t1_r2, `user_tbl_rok_share`.`rs_amount` AS t1_r3, `user_tbl_rok_share`.`created_at` AS t1_r4, `user_tbl_rok_share`.`updated_at` AS t1_r5, `user_tbl_rok_share`.`rs_min` AS t1_r6, `user_tbl_rok_share`.`rs_max` AS t1_r7 FROM `user_tbl_user` INNER JOIN `user_tbl_rok_share` ON `user_tbl_rok_share`.`rs_user` = `user_tbl_user`.`u_id` WHERE (rs_rok = 28151)
Completed 500 Internal Server Error in 21ms

NoMethodError (undefined method `rs_amount' for #<User::User:0x007f9be26463a8>):

```

Why?
Why it ignores my own call to `.select` ? I've tried to pass an array to .select to see if I'm just dumb.. but evidently it behaves the same way... just crashes.

**If using select with includes is a bad idea, because of how eager loading works, it should raise an exception right away and not mangle the SQL query this way...**

The same call but without the includes part (i.e. `share = User::User.select('u_name, u_surname, rs_amount').where('rs_rok = ?', self.u_id).joins(:user_share).all`) produces this SQL:

```
User::User Load (0.5ms)  SELECT u_name, u_surname, rs_amount FROM `user_tbl_user` INNER JOIN `user_tbl_rok_share` ON `user_tbl_rok_share`.`rs_user` = `user_tbl_user`.`u_id` WHERE (rs_rok = 28151)
```


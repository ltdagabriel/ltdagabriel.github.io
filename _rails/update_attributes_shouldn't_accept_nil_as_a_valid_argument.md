---
title: update_attributes shouldn't accept nil as a valid argument
labels: activerecord
layout: issue
---

This issue came along due to a simple typo in params

``` ruby
def update
    @financial_infos = FinancialInfo.find(params[:id])

    respond_to do |format|
      if @financial_infos.update_attributes(params[:financial_infos])
        format.json { head :no_content }
      else
        format.json { render json: @financial_infos.errors, status: :unprocessable_entity }
      end
    end
  end
```

There was a typo in the `:financial_info` symbol inside the params. As a result, the `params[:financial_infos]` expression was nil, and hence nil was being passed into update_attributes. The issue is no error was ever thrown, update_attributes just updated (nothing) and it proceeded to "work"

update_attributes should throw an error if nil is being passed as an argument (if you want to update nothing, it should either be an empty hash, or a hash with all the keys/values the same). Although it can be argued you should detect for nil, the above code is the default code made from the RoR scaffolder


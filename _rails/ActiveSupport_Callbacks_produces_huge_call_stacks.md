---
title: ActiveSupport::Callbacks produces huge call stacks
labels: activesupport, attached PR
layout: issue
---

Please bear with me on this one, I already spent 50+ hours debugging this issue:

I am porting a large (close to 50k lines) Rails application from Rails 4.0 to Rails 4.1. We have a rails41 branch which differs from our stable master branch only in the Gemfile.lock entries related to the core Rails gems. The master branch is running completely stable.

Unfortunately, with Rails 4.1 I am experiencing Ruby crashes that always occur somewhere in a long callback chain, although the same callback chain sometimes crashes and sometimes not. The result anyhow is that whenever I run rake spec or just work with the application I get a BUS error around every 3 minutes and the application dies completely. 

This is so strange I spent dozens of hours trying to fix it in our application, disabling gems, removing some of our internal libraries etc., to no result. I ended up painstakingly doing a complete git bisect, and I have found the single offending commit that breaks Rails/Ruby for us:

https://github.com/rails/rails/commit/23122ab2d4e239d35a154d5ec28c2afefdd012de

Before this commit everything runs fine, afterwards the crashes occur. Still, this seems to be one hell of an issue to debug. The Ruby-level backtrace of the BUS error sometimes shows includes the callback chain, and sometimes some apparently unrelated snippet of code - it seems something in the Ruby interpreter gets corrupted but not always produces an immediate crash. Typically, 8 out of 10 times I ran one of the crashing tests, I get something very similar to this (but in a great many of different places of the app):

```
c:0235 p:0000 s:1133 e:001132 LAMBDA /home/jarek/.rbenv/versions/2.1.4/lib/ruby/gems/2.1.0/gems/activesupport-4.1.7.1/lib/active_support/callbacks.rb:214 [FINISH]
c:0234 p:---- s:1127 e:001126 CFUNC  :call
c:0233 p:0010 s:1123 e:001122 LAMBDA /home/jarek/.rbenv/versions/2.1.4/lib/ruby/gems/2.1.0/gems/activesupport-4.1.7.1/lib/active_support/callbacks.rb:215 [FINISH]
c:0232 p:---- s:1117 e:001116 CFUNC  :call
c:0231 p:0010 s:1113 e:001112 LAMBDA /home/jarek/.rbenv/versions/2.1.4/lib/ruby/gems/2.1.0/gems/activesupport-4.1.7.1/lib/active_support/callbacks.rb:215 [FINISH]
c:0230 p:---- s:1107 e:001106 CFUNC  :call
c:0229 p:0010 s:1103 e:001102 LAMBDA /home/jarek/.rbenv/versions/2.1.4/lib/ruby/gems/2.1.0/gems/activesupport-4.1.7.1/lib/active_support/callbacks.rb:215 [FINISH]
c:0228 p:---- s:1097 e:001096 CFUNC  :call
c:0227 p:0010 s:1093 e:001092 LAMBDA /home/jarek/.rbenv/versions/2.1.4/lib/ruby/gems/2.1.0/gems/activesupport-4.1.7.1/lib/active_support/callbacks.rb:215 [FINISH]
c:0226 p:---- s:1087 e:001086 CFUNC  :call
c:0225 p:0010 s:1083 e:001082 LAMBDA /home/jarek/.rbenv/versions/2.1.4/lib/ruby/gems/2.1.0/gems/activesupport-4.1.7.1/lib/active_support/callbacks.rb:215 [FINISH]
c:0224 p:---- s:1077 e:001076 CFUNC  :call
c:0223 p:0010 s:1073 e:001072 LAMBDA /home/jarek/.rbenv/versions/2.1.4/lib/ruby/gems/2.1.0/gems/activesupport-4.1.7.1/lib/active_support/callbacks.rb:215 [FINISH]
c:0222 p:---- s:1067 e:001066 CFUNC  :call
c:0221 p:0010 s:1063 e:001062 LAMBDA /home/jarek/.rbenv/versions/2.1.4/lib/ruby/gems/2.1.0/gems/activesupport-4.1.7.1/lib/active_support/callbacks.rb:215 [FINISH]
c:0220 p:---- s:1057 e:001056 CFUNC  :call
c:0219 p:0010 s:1053 e:001052 LAMBDA /home/jarek/.rbenv/versions/2.1.4/lib/ruby/gems/2.1.0/gems/activesupport-4.1.7.1/lib/active_support/callbacks.rb:215 [FINISH]
c:0218 p:---- s:1047 e:001046 CFUNC  :call
c:0217 p:0010 s:1043 e:001042 LAMBDA /home/jarek/.rbenv/versions/2.1.4/lib/ruby/gems/2.1.0/gems/activesupport-4.1.7.1/lib/active_support/callbacks.rb:215 [FINISH]
c:0216 p:---- s:1037 e:001036 CFUNC  :call
c:0215 p:0010 s:1033 e:001032 LAMBDA /home/jarek/.rbenv/versions/2.1.4/lib/ruby/gems/2.1.0/gems/activesupport-4.1.7.1/lib/active_support/callbacks.rb:215 [FINISH]
c:0214 p:---- s:1027 e:001026 CFUNC  :call
c:0213 p:0010 s:1023 e:001022 LAMBDA /home/jarek/.rbenv/versions/2.1.4/lib/ruby/gems/2.1.0/gems/activesupport-4.1.7.1/lib/active_support/callbacks.rb:215 [FINISH]
c:0212 p:---- s:1017 e:001016 CFUNC  :call
c:0211 p:0010 s:1013 e:001012 LAMBDA /home/jarek/.rbenv/versions/2.1.4/lib/ruby/gems/2.1.0/gems/activesupport-4.1.7.1/lib/active_support/callbacks.rb:215 [FINISH]
c:0210 p:---- s:1007 e:001006 CFUNC  :call
c:0209 p:0010 s:1003 e:001002 LAMBDA /home/jarek/.rbenv/versions/2.1.4/lib/ruby/gems/2.1.0/gems/activesupport-4.1.7.1/lib/active_support/callbacks.rb:215 [FINISH]
c:0208 p:---- s:0997 e:000996 CFUNC  :call
c:0207 p:0010 s:0993 e:000992 LAMBDA /home/jarek/.rbenv/versions/2.1.4/lib/ruby/gems/2.1.0/gems/activesupport-4.1.7.1/lib/active_support/callbacks.rb:215 [FINISH]
c:0206 p:---- s:0987 e:000986 CFUNC  :call
c:0205 p:0010 s:0983 e:000982 LAMBDA /home/jarek/.rbenv/versions/2.1.4/lib/ruby/gems/2.1.0/gems/activesupport-4.1.7.1/lib/active_support/callbacks.rb:215 [FINISH]
c:0204 p:---- s:0977 e:000976 CFUNC  :call
c:0203 p:0010 s:0973 e:000972 LAMBDA /home/jarek/.rbenv/versions/2.1.4/lib/ruby/gems/2.1.0/gems/activesupport-4.1.7.1/lib/active_support/callbacks.rb:215 [FINISH]
c:0202 p:---- s:0967 e:000966 CFUNC  :call
c:0201 p:0010 s:0963 e:000962 LAMBDA /home/jarek/.rbenv/versions/2.1.4/lib/ruby/gems/2.1.0/gems/activesupport-4.1.7.1/lib/active_support/callbacks.rb:215 [FINISH]
c:0200 p:---- s:0957 e:000956 CFUNC  :call
c:0199 p:0010 s:0953 e:000952 LAMBDA /home/jarek/.rbenv/versions/2.1.4/lib/ruby/gems/2.1.0/gems/activesupport-4.1.7.1/lib/active_support/callbacks.rb:215 [FINISH]
c:0198 p:---- s:0947 e:000946 CFUNC  :call
c:0197 p:0081 s:0943 e:000942 METHOD /home/jarek/.rbenv/versions/2.1.4/lib/ruby/gems/2.1.0/gems/activesupport-4.1.7.1/lib/active_support/callbacks.rb:86
c:0196 p:0009 s:0935 E:ffffffc0 METHOD /home/jarek/.rbenv/versions/2.1.4/lib/ruby/gems/2.1.0/gems/activerecord-4.1.7.1/lib/active_record/callbacks.rb:310
c:0195 p:0032 s:0931 e:000930 METHOD /home/jarek/.rbenv/versions/2.1.4/lib/ruby/gems/2.1.0/gems/activerecord-4.1.7.1/lib/active_record/timestamp.rb:70
c:0194 p:0035 s:0926 e:000925 METHOD /home/jarek/.rbenv/versions/2.1.4/lib/ruby/gems/2.1.0/gems/activerecord-4.1.7.1/lib/active_record/persistence.rb:483
c:0193 p:0008 s:0922 e:000921 BLOCK  /home/jarek/.rbenv/versions/2.1.4/lib/ruby/gems/2.1.0/gems/activerecord-4.1.7.1/lib/active_record/callbacks.rb:302 [FINISH]
c:0192 p:---- s:0920 e:000919 CFUNC  :call
c:0191 p:0038 s:0917 e:000915 METHOD /home/jarek/.rbenv/versions/2.1.4/lib/ruby/gems/2.1.0/gems/activesupport-4.1.7.1/lib/active_support/callbacks.rb:113
c:0190 p:0086 s:0911 e:000910 LAMBDA /home/jarek/.rbenv/versions/2.1.4/lib/ruby/gems/2.1.0/gems/activesupport-4.1.7.1/lib/active_support/callbacks.rb:166
```

I have went as far as run a debug version of Ruby under gdb but the C-level backtrace is utterly meaningless:

```
#0  0xb7717472 in vm_exec_core (th=0xb92a1be0, initial=0) at vm_exec.c:46
#1  0xb772843d in vm_exec (th=0xb92a1be0) at vm.c:1398
#2  0xb7726c4a in invoke_block_from_c (th=0xb92a1be0, block=0xbf50b230, self=3128167180, argc=1, argv=0xb7020198, blockptr=0x0, cref=0x0, defined_class=3128167620) at vm.c:817
#3  0xb77270b2 in vm_invoke_proc (th=0xb92a1be0, proc=0xbf50b230, self=3128167180, defined_class=3128167620, argc=1, argv=0xb7020198, blockptr=0x0) at vm.c:881
#4  0xb772714e in rb_vm_invoke_proc (th=0xb92a1be0, proc=0xbf50b230, argc=1, argv=0xb7020198, blockptr=0x0) at vm.c:900
#5  0xb75e8bf5 in proc_call (argc=1, argv=0xb7020198, procval=2964385000) at proc.c:713
#6  0xb7714ad8 in call_cfunc_m1 (func=0xb75e8b60 <proc_call>, recv=2964385000, argc=1, argv=0xb7020198) at vm_insnhelper.c:1317
...
```

vm_exec.c:46 is the opening bracket of this internal Ruby function:

```
#if !OPT_CALL_THREADED_CODE
static VALUE
vm_exec_core(rb_thread_t *th, VALUE initial)
{
```

I am on Gentoo Linux and on ruby 2.1.5 in rbenv. My colleagues at work have reproduced the same issue on their Ubuntu laptops also on ruby 2.1.5 and rbenv. I have also reproduced it on ruby 2.1.5 installed directly from source and with rbenv completely and throughoutly removed. As mentioned the codebase is the same except for the single commit. I am of course willing to provide more detail, and whenever I have time I will try to narrow the single commit down to one individual change if possible, meanwhile I am awaiting suggestions how can you possibly approach further debugging something like this ^^

I realize from a Platonic viewpoint this might be considered a Ruby bug (in a well-defined language there should not exist a way to crash the interpreter, I guess), but with the level of complexity involved I hope you understand I probably would not receive much help if I reported such an issue in the Ruby bug tracker.


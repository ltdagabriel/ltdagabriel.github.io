---
title: ActiveRecord serialize corrupts character encodings for serialized Hashes
labels: activerecord
layout: issue
---

This is a duplicate of #792, re-filing because that ticket was prematurely closed and is not being re-opened despite comments mentioning it's still a problem. 

Still a problem for me with ruby 1.9.3 and Rails 3.2.3. 

ActiveRecord :serialize is sometimes changing serialized data to an ASCII-8bit encoding, even when it ought to be UTF-8. 

The problem reproduces really strangely, I hadn't yet figured out the reproduction case, but according to #792:

> However, I also make use of serialized Hashes in a number of models, and whenever I make a call to read their contents (which worked perfectly prior to the upgrade), I get the following puzzling behavior:
> If the contents contains ASCII-only data, it returns as UTF-8 (correctly), and is properly displayed.
> If the contents contains Unicode data, it returns as ASCII, and is displayed as escaped characters.

This matches my case -- a serialized Hash, where some hash values are 7 bit ASCII, and others contain unicode. Oddly, the ones that are 7-bit ASCII report `#encoding => UTF-8`, while the ones that contain Unicode chars report `#encoding => ASCII-8-bit`. 

In modern rails, the result is not "display as escaped chars", but instead an incompatible encoding exception. 

What is ActiveRecord #serialize _supposed_ to do with char encodings?  I don't really understand what's going on here. 


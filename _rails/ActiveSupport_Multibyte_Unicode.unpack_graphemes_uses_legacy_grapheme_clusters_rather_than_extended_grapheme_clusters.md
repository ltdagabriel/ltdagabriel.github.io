---
title: ActiveSupport::Multibyte::Unicode.unpack_graphemes uses legacy grapheme clusters rather than extended grapheme clusters
labels: activesupport, attached PR
layout: issue
---

According to [UAX29](http://www.unicode.org/reports/tr29/#Grapheme_Cluster_Boundaries):

> …the extended grapheme cluster boundaries are recommended for general processing, while the legacy grapheme cluster boundaries are maintained primarily for backwards compatibility with earlier versions of this specification.

`ActiveSupport::Multibyte::Unicode.unpack_graphemes` seems to use legacy grapheme clusters rather than extended grapheme clusters in opposition to the recommendation. This can be seen easily using an example from the [Unicode FAQ on characters and combining marks](http://www.unicode.org/faq/char_combmark.html#7). The following string:

``` ruby
"\u{0061}\u{0928}\u{093f}\u{4e9c}\u{10083}"
```

has 4 grapheme clusters according to the FAQ (which is implicitly using the extended grapheme cluster definition) and to the human eye, but `unpack_graphemes` returns 5:

``` ruby
[[97], [2344], [2367], [20124], [65667]]
```

`\u093f` is a spacing mark. The extended grapheme cluster definition says not to break before a spacing mark, but `unpack_graphemes` does just that. If extended grapheme clusters were used instead the result would be:

``` ruby
[[97], [2344, 2367], [20124], [65667]]
```

This would better match UAX29's recommendation and the way the human eye interprets these characters.


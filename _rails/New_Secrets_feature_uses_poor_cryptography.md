---
title: New Secrets feature uses poor cryptography
labels: attached PR, railties, security
layout: issue
---

        def new_cipher
          OpenSSL::Cipher.new("aes-256-cbc")
        end

        def cipher(mode, data)
          cipher = new_cipher.public_send(mode)
          cipher.key = key
          cipher.update(data) << cipher.final
        end


Unauthenticated CBC mode with a constant IV. This is not up to the minimum standards of how a modern cryptosystem should be designed. *Please* use an authenticated mode (GCM, or if unavailable, derive an authentication key and HMAC the ciphertext) and generate an unpredictable, random IV *each and every time* an encryption is performed.

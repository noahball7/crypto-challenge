# Agent Cryptopals Findings

Scope: independently test the new Cryptopals/OpenSSL clue angle for `challenge2.txt` line 1.

## Inputs

- Line 1 Base64 decodes to 74 bytes:
  `feb46849aa6c1b499826d7ccc4a0372e281c7053b294bf992fbb2d2bcc75764fb8dd9dac8d784834bfaad41b5605209005f9c025747062404d181c59ca29ca57e233def4a97d12daea48`
- Line 2 ROT47 decodes to `Where it all begaN_0mpxB5iVQ`.

## Source Checks

- Cryptopals challenge 18 specifies AES-CTR with key `YELLOW SUBMARINE`, nonce `0`, and a 16-byte keystream block built from `uint64_le(nonce) || uint64_le(block_count)`.
- NCC Group `cryptopals-py` is on `main`, not `master`; `challenge_18.py` uses `AES.MODE_ECB` and `struct.pack("QQ", nonce, count)` to create the CTR keystream. On this platform that matches little-endian `uint64` packing.
- OpenSSL raw key and password modes are different:
  - `-K 59454c4c4f57205355424d4152494e45` uses the literal 16-byte AES key `YELLOW SUBMARINE`.
  - `-pass pass:"YELLOW SUBMARINE"` derives key/IV first. OpenSSL 3.6.2 produced:
    - `-md md5 -nosalt`: key `96A45FE4BAEBCE34DC727167C157709D`, iv `BA997D762FC20CFD263C29966118FC36`
    - `-md sha256 -nosalt`: key `876A397347432EDE4FB5448A439B62E1`, iv `91E09DAA925FDC48E63440A868924AD1`

## Reproducible Test Results

Control for exact Cryptopals CTR:

```text
Cryptopals challenge 18 ciphertext -> Yo, VIP Let's kick it Ice, Ice, baby Ice, Ice, baby
```

Challenge line 1 under exact Cryptopals CTR with raw key `YELLOW SUBMARINE`, nonce `0`, counter `0`, little-endian:

```text
8865a30205ce5dab7b89d491a8b3f45cfaf01c8f2af9ad47e06132b8639b0557957d13679c037f7f7c70633de4f9a45dc4796b103d8a0c159c547a3e03466fe762b505c20e6c4b22c5d0
```

This is not UTF-8/plaintext.

OpenSSL AES-128-CTR with raw key `YELLOW SUBMARINE` and all-zero IV gives a different stream after block 0, as expected from OpenSSL's counter layout:

```text
8865a30205ce5dab7b89d491a8b3f45c42fca4bd83a7838a6aff95ecc2bc3d1f093666f5b5f03df6b4d6c76b6ccf07074f7ebaed630f3f6384c0cbe8b772de06525cc68764ec20072a71
```

No readable plaintext was found from:

- exact Cryptopals CTR over the decoded bytes, Base64 ASCII text, no-padding Base64 text, URL-safe text, reversed bytes, or base64-as-integer re-encodings;
- Cryptopals CTR with little-endian and big-endian nonce/counter variants, clue-derived nonce/counter values, and embedded prefix/suffix nonce layouts;
- OpenSSL AES-128-CTR raw-key mode with zero/prefix/suffix IVs;
- OpenSSL EVP-style password-derived AES-128-CTR using MD5/SHA1/SHA256 `EVP_BytesToKey`, plus PBKDF2 variants;
- AES-128-ECB/CBC raw-key and EVP-derived-key windows of lengths 16, 32, 48, and 64, with and without PKCS#7 unpadding.

Static Set 2/oracle checks:

- The 74 decoded bytes are not a multiple of AES's 16-byte block size.
- No 16-byte block repeats were found at any offset in decoded bytes or Base64 text variants.
- The Cypher Set 2 page points to PKCS#7, CBC/ECB implementation, byte-at-a-time ECB, and ECB cut-and-paste oracle mechanics. Those attacks require an encryption oracle or multiple chosen ciphertexts; line 1 alone does not expose a reproducible static cut-and-paste path.

## Conclusion

The Cryptopals connection is real as a clue source, but this pass found no recovered plaintext. The strongest negative result is that exact challenge 18 AES-CTR mechanics, exact raw key, OpenSSL raw-key CTR, and OpenSSL password-derived CTR all fail on line 1 under the tested representations.

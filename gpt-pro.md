# GPT Pro Solve Notes - Challenge 2

This is a cleaned version of the GPT Pro run that found the authenticated
Challenge 2 plaintext. The original paste was raw model output; this file keeps
the useful solve path and removes scratchpad churn.

## Final Answer

```text
It's all in the mind, y'know?
```

## Decisive Path

1. Decode the second line of `challenge2.txt` with ROT47.

   ```text
   Where it all begaN_0mpxB5iVQ
   ```

2. Treat `N_0mpxB5iVQ` as a YouTube ID for Theo's first public video.

3. Preserve the exact phrase from the video description:

   ```text
   A drum break might shatter it!
   ```

4. Inspect the first line as Base64.

   A normal Base64 decode gives 74 bytes beginning with:

   ```text
   fe b4 ...
   ```

5. Apply the "switch" / inversion idea to those decoded bytes:

   ```text
   byte ^ 0xff
   ```

   The first bytes become:

   ```text
   01 4b ...
   ```

   The leading `01` reads cleanly as a version byte.

6. Parse the inverted payload as:

   ```text
   v1 | salt16 | iv12 | tag16 | ciphertext29
   ```

7. Use the exact video phrase as the seed, including the exclamation mark:

   ```text
   A drum break might shatter it!
   ```

8. Derive the key using the Challenge 1-style KDF:

   ```text
   SHA256(seed || ":" || raw_salt)
   ```

9. Decrypt with AES-256-GCM and no AAD.

## Verified Fields

```text
version = 1
salt    = 4b97b65593e4b667d928333b5fc8d1d7
iv      = e38fac4d6b4066d044d2d433
tag     = 8a89b0472262537287b7cb40552be4a9
ct      = fadf6ffa063fda8b8f9dbfb2e7e3a635d635a81dcc210b5682ed2515b7
key     = 3bad585259600e6697e483b26072697313d584dbbf446f17e26ca5c36b0690be
```

Authenticated plaintext:

```text
It's all in the mind, y'know?
```

## Exact Hit Shape

The successful test shape was:

```text
not-v1-tagct
seed = A drum break might shatter it!
aad  = none
```

In raw hit-log form:

```text
HIT not-v1-tagct A drum break might shatter it!  b"It's all in the mind, y'know?"
```

## Important In-Flight Observation

Before the final hit, the run noticed a separate Base64 oddity:

```text
Preserving the noncanonical Base64 pad bits yields a 75-byte payload starting
with 03, making a versioned AEAD envelope more plausible than the raw 74-byte
decode.
```

That made a possible `v3` envelope look plausible:

```text
03 | salt16 | iv12 | ciphertext30 | tag16
```

It also pushed the search toward a possible locator surface in
`T3-Content/skatebench`:

```text
commit 6058ed9...
PR #5
hidden/bidirectional Unicode
test signatureHash
raw JSON line-separator characters
```

That line of investigation was useful search pressure, but it was not the final
authenticated decrypt. Direct `tre` / `laser` / `signatureHash` seed attempts
still failed under the leading AEAD parses.

## Why The Final Parse Is Strong

- AES-GCM authentication succeeds only with the exact seed phrase including `!`.
- The inverted byte stream starts with a plausible version byte, `0x01`.
- The remaining bytes fit standard AEAD field sizes exactly:

  ```text
  1 + 16 + 12 + 16 + 29 = 74
  ```

- The decrypted plaintext is also Yellow Submarine dialogue, matching the clue
  source.

## Reproduce

Run:

```sh
node scripts/verify_challenge2_solution.mjs
```

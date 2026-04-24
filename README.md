# Crypto Challenge

This repo contains my writeup and verification scripts for Theo's crypto
challenge work, with Challenge 2 as the main solved artifact.

## Challenge 2

Final plaintext:

```text
It's all in the mind, y'know?
```

The short solve chain:

1. Decode the second line of `challenge2.txt` with ROT47.
2. Follow the resulting YouTube ID to Theo's first video.
3. Preserve the exact clue phrase: `A drum break might shatter it!`
4. GPT Pro interpreted the later `switch laser` / inverted clue as an operation
   on line 1.
5. Base64-decode the first line, then invert each byte with `byte ^ 0xff`.
6. Parse the result as `v1 | salt16 | iv12 | tag16 | ciphertext29`.
7. Derive `SHA256(seed || ":" || raw_salt)` and decrypt with AES-256-GCM.

Run the verifier:

```sh
node scripts/verify_challenge2_solution.mjs
```

More detail:

- [Challenge 2 writeup](challenge2-answer.txt)
- [Challenge 2 process log](challenge2-process.txt)
- [Challenge 2 prompt](challenge2.txt)
- [GPT Pro solve transcript](gpt-pro.md)

## Why This Was Interesting

This was my first time working through this style of multi-step crypto puzzle,
so the process mattered almost as much as the final plaintext. The strongest
side trails were:

- Following Theo/X context and finding two Beatles-related tweets, which made
  the Yellow Submarine branch feel less random.
- Chasing the Project Glasswing and OpenBSD route through Anthropic's public
  security material, then testing whether the 74-byte blob was an
  OpenBSD/signify-shaped artifact.
- Checking the classic `YELLOW SUBMARINE` Cryptopals method before ruling it
  out as a direct solve path.
- Watching GPT Pro make the decisive final move: preserve the odd Base64
  details, test the inverted byte stream, parse `v1` with tag-before-ciphertext,
  and get the AES-GCM authentication hit with the exact video phrase.

Those branches did not all produce the answer, but they shaped the search and
helped separate real clues from tempting coincidences.

## Project Glasswing / Mythos Research

The Glasswing/Mythos trail was an important research branch because it connected
the glass/shatter clue, Theo's surrounding April 2026 AI-security context, and
Anthropic's public Project Glasswing material. It did not end up being the final
Challenge 2 key, but it produced the OpenBSD SACK vulnerability prompt and a
useful negative result for the solve process.

Curated notes:

- [Project Glasswing and OpenBSD SACK prompt](docs/research/openbsd-sack.md)
- [External source findings](docs/research/agent_external_findings.md)
- [Round 4 source-artifact search](docs/research/round4_source_artifact_findings.md)

Large raw browser captures, cloned repos, duplicated PDFs, and local dependency
folders are intentionally excluded from this public repo.

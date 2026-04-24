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
4. Base64-decode the first line, then invert each byte with `byte ^ 0xff`.
5. Parse the result as `v1 | salt16 | iv12 | tag16 | ciphertext29`.
6. Derive `SHA256(seed || ":" || raw_salt)` and decrypt with AES-256-GCM.

Run the verifier:

```sh
node scripts/verify_challenge2_solution.mjs
```

More detail:

- [Challenge 2 writeup](challenge2-answer.txt)
- [Challenge 2 process log](challenge2-process.txt)
- [Challenge 2 prompt](challenge2.txt)

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

# Round 2 Synthesis - Challenge 2
Date: 2026-04-23

## Key Findings

- The confirmed clue trail remains narrow: ROT47 line 2 -> Theo's oldest public upload -> video description quote -> *Yellow Submarine* blue-glass scene.
- Track C found that `N_0mpxB5iVQ` is currently Theo's oldest public YouTube upload, supporting `Where it all began` as literal.
- Track A found that the user's `1:15:44-1:15:47` timestamp likely marks the start of the blue-glass scene. The exact quote appears around `1:16:46-1:16:49` in a timed subtitle source.
- The strongest exact scene strings are `It's blue glass`, `It's Beatle-proof`, `Nothing is Beatle-proof`, `A drum break might shatter it`, `I've got a hole in my pocket`, `Yeah, it still works`, and `They're decanting`.
- Track D found no quick transform that turns line 1 into text or a valid signature. The 74-byte/signify shape is still notable but unconfirmed.
- Manual source search did not find a strong Theo-controlled repo/commit artifact for the Yellow Submarine phrases. GitHub code search was rate-limited, so this is not exhaustive.

## Current Interpretation

The best current model is:

1. Line 2 is a route, not a key.
2. The Theo video is a route, not a key.
3. The description quote identifies an exact scene.
4. The scene likely supplies either:
   - an exact seed string, still missing; or
   - an operation such as `hole`, `decant`, `break`, `delete`, or `extract`.

Challenge 1 suggests the solve probably requires an exact artifact/string rather than a semantic guess.

## Most Promising Next Paths

1. **Scene-operation path**
   - Prioritize the actual working action: `hole in my pocket` -> `still works` -> `decanting`.
   - Test deletion/extraction/inside-container operations only when tied to exact scene positions or strings.

2. **Exact artifact path**
   - Continue looking for an exact source artifact connected to the quote, especially Theo-controlled code, comments, or metadata.
   - Avoid broad Beatles trivia unless it connects to the exact scene.

3. **Music/sample path**
   - Low-confidence but interesting: `The Allergies - Funky Feeling` appears to sample/paraphrase `a drum break might shatter this`.
   - Only pursue if there is a Theo/video/audio bridge.

4. **Signature-shape path**
   - Line 1 and OpenBSD signify signatures both decode to 74 bytes.
   - Challenge2 does not start with `Ed`, so it is not a plain signify signature.
   - This branch needs a public key/message verification target before it becomes strong.

## Updated Probe Status

- Fast candidate probe: `node challenge2_probe.mjs`
- Latest run: `62,287` attempts over `334` active candidate variants, no hit.
- Operation probe: `node scripts/challenge2_operations_probe.mjs`
- Latest operation scan: no readable/magic transform beyond expected 74-byte signature-shape observations.

## Files

- `docs/research/round2/track_a_yellow_submarine_scene.md`
- `docs/research/round2/track_b_theo_source_search.md`
- `docs/research/round2/track_c_theo_first_video.md`
- `docs/research/round2/track_d_crypto_operations.md`
- `scripts/challenge2_operations_probe.mjs`

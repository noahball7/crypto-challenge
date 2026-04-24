# Track 1: Scene Hole Semantics

## Summary

The confirmed Yellow Submarine clue should be read as a scene mechanic, not broad Beatles trivia. The proposed solution in the clue, `drum break -> shatter`, fails in-scene because Ringo has no drumsticks. The working solution is Ringo's stored Sea of Holes object: he has a hole in his pocket, applies it to the blue glass ball/globe, and the trapped Sgt. Pepper figures are released/decanted.

Most useful solve direction: prioritize `hole`, `pocket`, `inside/outside`, `empty/decant`, and `still works` operations over another direct passphrase attempt with `drum break`.

Sources:

- Yellow Submarine Wiki transcript: https://yellowsubmarine.fandom.com/wiki/Yellow_Submarine/Transcript
- Yellow Submarine Wiki Sea of Holes page: https://yellowsubmarine.fandom.com/wiki/Sea_of_Holes
- SubtitleCat timed subtitles: https://www.subtitlecat.com/subs/101/Yellow.Submarine.1968.1080p.BluRay.x264-%5BYTS.AM%5D.html
- Scripts.com transcript page: https://www.scripts.com/script/yellow_submarine_23797/4
- ScriptSavant transcript/PDF: https://thescriptsavant.com/movies/Yellow_Submarine.pdf
- Donald Sauter DVD/subtitle comparison: https://donaldsauter.com/yellow-submarine-script.htm
- Wikipedia plot summary: https://en.wikipedia.org/wiki/Yellow_Submarine_%28film%29

## Exact Scene/Lore Around The Hole

The hole is introduced before the blue-glass scene. In the Sea of Holes, Jeremy is pulled through a hole; Ringo then picks up that hole, tests its properties, shrinks/tucks it away, and says he has a hole in his pocket. The Sea of Holes wiki describes the holes as functional passages, including holes that lead elsewhere, and specifically notes that this pocketed hole later helps save Pepperland.

The later target scene occurs after Pepperland is revived and the Beatles find the trapped Sgt. Pepper band in a blue glass ball/globe. The sequence is:

1. The object is noticed as a goldfish-bowl/glass-ball oddity.
2. It is identified as blue glass, with four figures inside.
3. The figures are identified as Sgt. Pepper's Lonely Hearts Club Band / Beatles doubles.
4. John says to break the glass.
5. The glass is called Beatle-proof.
6. Paul asks Ringo about drumsticks and suggests the drum-break/shatter idea.
7. Ringo has no drumsticks.
8. George tells him to check his pocket.
9. Ringo pulls out the Sea of Holes object and applies it to the globe.
10. The hole still works; smoke/color comes out, the ball disappears/opens/empties, and the trapped figures decant.

Timed subtitles place the opening goldfish-bowl cue at `01:15:43,854 --> 01:15:46,731`, then the drum-break line at `01:16:46,250 --> 01:16:49,252`, the pocket line at `01:16:51,255 --> 01:16:54,549`, and decanting at `01:17:07,938 --> 01:17:09,146`.

Important wording notes:

- Transcript sources vary between `me pocket` and `my pocket`; use both as candidates.
- Donald Sauter's comparison supports `drum break`, not `drum beat`, for the DVD subtitle wording.
- Donald Sauter also supports `coloured telly`, not `coloured jelly`, for the melting/disappearing glass sequence.
- The ScriptSavant PDF says the ball "gets empty" after Ringo sticks the hole on it; that wording makes `empty` a plausible operation word even though other transcripts use `decanting`.

## Operation Words

Highest-signal operation words, in scene order:

- `glass` / `blue glass`: container/wrapper; something transparent but resistant.
- `inside`: there is content trapped inside the container.
- `break`: initial physical extraction plan.
- `Beatle-proof`: direct/simple Beatles-key attack may be intentionally blocked.
- `drum break`: clue phrase and failed/false operation; useful as a pointer, less likely as final operation.
- `shatter`: proposed effect, not the successful effect.
- `pocket`: where the real tool is stored; suggests inner bytes/chars, hidden state, or wrapper removal.
- `hole`: actual working tool; suggests deletion, removal, gap extraction, zero/null, punched positions, or portal/opening.
- `still works`: reuse an earlier artifact/operation; the old Sea of Holes object remains valid later.
- `colored/coloured telly`: possible color/channel/display clue, lower priority than hole/pocket.
- `crystal`: glass-like transformation clue, lower priority.
- `empty`: ScriptSavant wording for the ball after the hole is applied.
- `decanting`: extraction from a container; contents are poured/released rather than decrypted by force.

## Candidate Exact Strings

Use these as exact candidate strings or seed material. Include punctuation/case variants only after the smaller canonical set fails.

P0 scene-mechanic strings:

```text
hole
hole in my pocket
hole in me pocket
I've got a hole in my pocket.
I've got a hole in me pocket.
Ringo
Ringo's hole
Sea of Holes
still works
Yeah, it still works.
decanting
They're decanting.
empty
gets empty
```

P1 container/resistance strings:

```text
blue glass
glass ball
glass globe
big glass ball
Beatle-proof
Nothing is Beatle-proof.
Break the glass.
inside
pocket
```

P2 clue/false-path strings:

```text
A drum break might shatter it.
A drum break might shatter it!
drum break
drumsticks
shatter
coloured telly
colored telly
crystal
```

Timing/position seeds:

```text
1:15:43
1:15:44
1:15:46
1:16:46
1:16:49
1:16:51
1:16:54
1:17:07
1:17:09
7543
7544
7646
7649
7651
7654
7707
7709
```

## How To Convert To Crypto/Text Operations

Recommended operation mapping:

1. Treat `drum break` as a pointer/decoy first.
   - It identifies Ringo and the scene.
   - In the scene, it does not execute because there are no drumsticks.
   - Therefore, do not keep broadening generic drum/audio/Beatles key lists unless a test actually validates them.

2. Treat `hole` as removal or extraction.
   - Remove contiguous byte/character windows from line 1.
   - Remove positions derived from `hole`, `hole in my pocket`, `Ringo`, `Sea of Holes`, and timestamps.
   - Extract only the removed positions as the "hole contents."
   - Test both raw bytes and Base64-text characters, because a hole can be made in either the encoded container or decoded payload.

3. Treat `pocket` as inside/outside segmentation.
   - Drop wrappers and inspect the interior: `inside = bytes[left:n-right]`.
   - Keep only wrappers: `outside = bytes[:left] + bytes[n-right:]`.
   - Try natural crypto cuts already relevant to challenge2: `2|8|64`, `12|ct|16`, `16|ct|16`, `24|ct|16`, `24|50`, first/last Base64 quartets.

4. Treat `blue glass ball/globe` as a container.
   - The payload may not be wrong; it may be trapped in a wrapper.
   - Look for operations that open, empty, or decant a container rather than brute-force decrypting it.
   - Candidate transforms: remove header, remove key-id-like segment, remove tag-sized segment, repair a magic header only if later verification/decryption succeeds.

5. Treat `decanting` / `empty` as output extraction.
   - After a hole operation, scan for plaintext in what comes out, not only what remains.
   - For each transform, classify printable UTF-8, JSON, ASCII armor, crypto magic, compression magic, and signature-sized blobs.
   - If line 1 remains signature-shaped, verify signatures rather than assuming decryptable ciphertext.

6. Treat `still works` as reuse.
   - Reuse the earlier clue artifact or transformation later in the chain.
   - Possible reuse targets: the ROT47 line-2 result, YouTube id, video timestamp, exact scene phrase, or challenge1-origin material.

7. Treat `Beatle-proof` as negative evidence.
   - A direct `Beatles`/`YellowSubmarine`/`drum break` passphrase route has already been weak.
   - The scene says the obvious Beatles/glass-breaking action is blocked; the successful action is a specific object Ringo already carries.

Concrete next tests:

- Add/check candidate strings above in `challenge2-candidates-active.txt`.
- Extend `scripts/challenge2_hole_probe.mjs` around exact `me/my` variants, `empty`, `gets empty`, and the SubtitleCat timestamp seeds.
- For every hole transform, pipe the result into the existing recognizers from `scripts/challenge2_operations_probe.mjs`.
- Keep only hits that produce clean plaintext, recognized envelope syntax, or verifiable signature behavior.

## Confidence/Gaps

Confidence: high that the clue resolves to the blue glass ball/globe scene in Yellow Submarine.

Confidence: high that `drum break` is the intended wording, not `drum beat`, based on the DVD/subtitle comparison and aligned transcript/subtitle sources.

Confidence: high that the actual successful mechanic is the pocketed Sea of Holes object, not drumsticks or shattering.

Confidence: medium that the intended crypto/text operation is deletion/extraction/container opening. This is the best semantic fit, but no transform is proven until line 1 yields reproducible plaintext or a verifiable cryptographic artifact.

Gaps:

- Public transcript/subtitle sources are not official studio materials.
- Timings vary by edition/encode. The `01:15:43-01:17:09` range above is from one SubtitleCat BluRay subtitle file.
- The exact challenge answer is still unresolved; this track only narrows operation semantics and candidate strings.

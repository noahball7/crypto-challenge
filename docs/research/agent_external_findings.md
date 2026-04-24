# Agent External Findings - Challenge 2

Checked: 2026-04-24.

Scope: current/external artifacts only. I did not identify a confirmed plaintext, seed, AAD, or repo commit that directly decrypts line 1.

## YouTube: `N_0mpxB5iVQ`

URL: https://www.youtube.com/watch?v=N_0mpxB5iVQ

Current metadata observed from the watch page / player JSON:

- Title: `iPhone 11 UltraWide Skate Footage Demo`
- Channel: `Theo - t3.gg` / `@t3dotgg`
- External channel id: `UCbRP3c757lWg9M-U7TyEkXA`
- Upload/publish date: `2019-09-23T22:51:52-07:00`
- Length: `255` seconds
- Category: `Sports`
- Keywords: `skateboarding`, `iphone`, `iphone11`, `iphonepro`
- Current view count observed in player JSON: `19421`
- Current like count observed in player JSON: `236`

Current description exact clue block:

```text
For no reason in particular: "A drum break might shatter it!"

^ if you DM me this phrase, you are disqualified and I will block you.
```

Other description text that may be candidate material:

- `Ferry Building in San Francisco`
- `"13mm" ultra wide lens`
- Instagram handles: `slayyterr`, `zesher`, `trendzwithbenifitz`, `skatesoon`, `austinfunk`, `mrweouthere`
- Theo handle: `fakiebigfoot`

Player JSON currently exposes an info-card teaser:

```text
View corrections
targetId: engagement-panel-error-corrections
cue range: 0-5000 ms
```

Important uncertainty: I found the correction teaser in `ytInitialPlayerResponse.cards`, but the initial watch page did not include an `engagement-panel-error-corrections` payload. The same `View corrections` card pattern also appeared on nearby Theo videos checked below, so I would not treat the teaser alone as puzzle-specific unless someone can make the panel content load.

Current auto "Key moments" / macro markers from the page:

```text
0:05  @slayyterr
0:25  @zesher
2:21  @skatesoon
2:29  @austinfunk
3:35  @mrweouthere
4:07  @fakiebigfoot (me)
```

No captions/transcript object was exposed for this skate video in `ytInitialPlayerResponse`.

## Yellow Submarine Source

The quote resolves cleanly to the glass-ball scene in *Yellow Submarine*.

ScriptSavant PDF source: https://thescriptsavant.com/movies/Yellow_Submarine.pdf

Exact source snippet around the clue:

```text
JOHN
Break the glass.
GEORGE
We can't. It's Beatle-proof.
JOHN
Nothing is Beatle-proof.
PAUL, to Ringo
Have you got your drumsticks with you? A drum break might shatter it.
RINGO
No, I haven't.
GEORGE
Have a look in your pocket.
1:15:50 "Baby you're a rich man" is heard.
RINGO
I've got a hole in my pocket. I wonder if...
Ringo sticks the hole on the ball. The ball gets empty.
```

Fandom transcript source: https://yellowsubmarine.fandom.com/wiki/Yellow_Submarine/Transcript

Fandom variant has `me pocket` rather than `my pocket`:

```text
Paul: (To Ringo.) Hey, have you got your drumsticks with you? A drum break might shatter it.
Ringo: No, I haven't.
George: Have a look in your pocket.
(Ringo does, pulling out the hole he picked up in the Sea of Holes.)
Ringo: I've got a hole in me pocket! I wonder if...
```

Earlier Fandom source for where the hole came from:

```text
(A Meanie pulls Jeremy through the hole. Ringo comes by and picks up the hole. He explores its properties, then tucks it away.)
Ringo: I've got a hole in me pocket.
```

Donald Sauter script comparison source: https://donaldsauter.com/yellow-submarine-script.htm

This verifies that `break`, not `beat`, is the DVD-subtitle wording:

```text
scs  Paul: A drum beat might shatter it.
dvd  Paul: A drum break might shatter it.
```

Candidate exact source phrases from this branch:

- `Beatle-proof`
- `Nothing is Beatle-proof`
- `drumsticks`
- `A drum break might shatter it`
- `Ringo`
- `hole in my pocket`
- `hole in me pocket`
- `Sea of Holes`
- `Baby you're a rich man`
- `They're decanting`
- `alter-ego man`

## Theo/X Around The Hint

Original X URL: https://x.com/theo/status/2041676800133300689

The logged-out X page embedded initial state with the exact tweet:

```text
full_text: "This might be my psychosis moment."
created_at: "2026-04-08T00:37:36.000Z"
source_name: "Twitter for iPhone"
```

Observed counts in the embedded state at check time:

```text
reply_count: 47
retweet_count: 19
favorite_count: 1394
quote_count: 8
bookmark_count: 69
```

User profile text exposed there:

```text
Full time CEO @t3dotchat. Part time YouTuber, investor, and developer
location: San Francisco, CA
```

## Nearby Theo Videos

Video: https://www.youtube.com/watch?v=TilDSWeiAlw

- Title: `The language holding our agents back.`
- Upload/publish date: `2026-04-07T01:21:20-07:00`
- Description source links:
  - https://github.com/RhysSullivan/executor
  - https://x.com/RhysSullivan/status/2030903539871154193
- The linked repo tagline is: `The missing integration layer for AI agents. Let them call any OpenAPI / MCP / GraphQL / custom js functions in secure environment.`

Video: https://www.youtube.com/watch?v=aFcVKzfkJPk

- Title: `Claude Mythos and the end of software`
- Upload/publish date: `2026-04-08T03:25:53-07:00`
- Description opening: `I....yeah. It's all over now.`
- Description source links:
  - https://www-cdn.anthropic.com/53566bf5440a10affd749724787c8913a2ae0841.pdf
  - https://www.anthropic.com/glasswing

These nearby videos also exposed `View corrections` cards in player JSON, so the card mechanic appears common across Theo videos and not necessarily unique to the puzzle.

## Anthropic / GitHub Artifacts Directly Connected To The Nearby Theo Video

Project Glasswing page: https://www.anthropic.com/glasswing

Potential exact clue material:

```text
Project Glasswing
Claude Mythos Preview
The project is named for the glasswing butterfly, Greta oto.
```

Appendix wording:

```text
the butterfly's transparent wings let it hide in plain sight
```

Mythos name note:

```text
From the Ancient Greek for "utterance" or "narrative"
```

Red Team post: https://red.anthropic.com/2026/mythos-preview/

It was published `April 7, 2026`, the same date as the psychosis tweet in US time. It includes SHA-3-style commitments and directly linked GitHub artifacts, but I found no exact bridge from those to challenge line 1.

Direct GitHub/security artifacts from the Red Team post:

- Linux commit: https://github.com/torvalds/linux/commit/e2f78c7ec1655fedd945366151ba54fcb9580508
  - Title: `futex: Require sys_futex_requeue() to have identical flags`
  - Commit text includes: `Nicholas reported that his LLM found it was possible to create a UaF when sys_futex_requeue() is used with different flags.`
- Botan advisory: https://github.com/randombit/botan/security/advisories/GHSA-v782-6fq4-q827
  - Title: `Certificate authentication bypass due to trust anchor confusion`
  - CVE: `CVE-2026-34580`
  - Credit: `Nicholas Carlini with Claude, Anthropic`

Hash commitments named in the Red Team post that may be candidate material if the puzzle wants exact commitments:

```text
b63304b28375c023abaa305e68f19f3f8ee14516dd463a72a2e30853
aab856123a5b555425d1538a37a2e6ca47655c300515ebfc55d238b0
aa4aff220c5011ee4b262c05faed7e0424d249353c336048af0f2375
b23662d05f96e922b01ba37a9d70c2be7c41ee405f562c99e1f9e7d5
c2e3da6e85be2aa7011ca21698bb66593054f2e71a4d583728ad1615
c1aa12b01a4851722ba4ce89594efd7983b96fee81643a912f37125b
6114e52cc9792769907cf82c9733e58d632b96533819d4365d582b03
```

## Search Results / Negative Checks

Searches for these did not surface a public direct solution or repo hit during this pass:

```text
"N_0mpxB5iVQ"
"A drum break might shatter it" "Theo"
site:github.com "N_0mpxB5iVQ"
"/rRoSapsG0mYJtfMxKA3LigccFOylL"
"Where it all begaN_0mpxB5iVQ"
"2041676800133300689" "N_0mpxB5iVQ"
```

## Current Best External-Artifact Takeaways

1. The best confirmed source phrase remains the *Yellow Submarine* glass-ball scene.
2. The scene's actual operation is not "drum break"; it is Ringo using a `hole` from the `Sea of Holes` / pocket to empty the ball.
3. `glass` is reinforced independently by Theo's same-day Mythos/Glasswing context, but I have not found a confirmed exact seed/AAD phrase from that branch.
4. The YouTube auto markers add exact candidate timestamps/handles, especially `4:07 @fakiebigfoot (me)`, but they are page-generated metadata, not clearly intentional puzzle text.
5. The YouTube correction card is real but currently unresolved; no hidden correction payload was found in the static watch-page data.

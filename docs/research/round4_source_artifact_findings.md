# Round 4 Source Artifact Findings - Challenge 2

Date: 2026-04-23

## Prompt

Find a likely Challenge-1-analogous external artifact/repo/commit/string seed for Challenge 2, using the new hint:

> Yesterdays puzzle is a blueprint for today's. If you could solve yesterday, today is not far from it.

## Confirmed Chain

- `challenge2.txt` line 2 ROT47 decodes to `Where it all begaN_0mpxB5iVQ`.
- `N_0mpxB5iVQ` is Theo's first YouTube video: `https://www.youtube.com/watch?v=N_0mpxB5iVQ`.
- The description contains: `For no reason in particular: "A drum break might shatter it!"`
- That phrase appears in *Yellow Submarine*.

## Live Search Results

Commands:

```sh
gh search code '"A drum break might shatter it"' --limit 50 --json repository,path,url,textMatches
gh search code '"A drum beat might shatter it"' --limit 50 --json repository,path,url,textMatches
gh search code '"drum break" "shatter"' --limit 100 --json repository,path,url,textMatches
gh search code '"Beatle-proof"' --limit 100 --json repository,path,url,textMatches
gh search code '"hole in my pocket" "Yellow Submarine"' --limit 100 --json repository,path,url,textMatches
```

Findings:

- Exact GitHub code search returned no hits for the quote, the `drum beat` variant, `drum break` plus `shatter`, `Beatle-proof`, or `hole in my pocket` plus `Yellow Submarine`.
- Web search for the exact quote mainly returned transcript/translation pages and the ScriptSavant PDF.
- Web search for the `drum beat` variant surfaced Donald Sauter's page as the strongest source-like artifact.

## Strongest Artifact Candidate

URL:

```text
https://donaldsauter.com/yellow-submarine-script.htm
```

Why this is stronger than generic transcript pages:

- It is not just a transcript; it is a source/correction artifact comparing Script City post-production script text (`scs`) against DVD subtitle text (`dvd`).
- It contains the exact correction pair:
  - `scs Paul: A drum beat might shatter it.`
  - `dvd Paul: A drum break might shatter it.`
- It contains the word from Theo's new hint, near the same correction list:
  - `dvd Jeremy: I must complete my bust, two novels, finish my blueprints...`
- It also contains nearby exact seed-like lines already considered important:
  - `This motor, I see, has a broken down thing.`
  - `Ipse Dixit, ha ha, just turn the screw.`
  - `Like coloured telly.`

## Theo-Controlled Repo Search

Commands:

```sh
gh api 'users/t3dotgg/repos?per_page=100&sort=pushed&type=owner' --paginate \
  --jq '.[] | [.full_name,.html_url,.pushed_at,.updated_at,.description] | @tsv'

gh search commits shatter --author t3dotgg --limit 50 --json repository,sha,url,commit
gh search commits drum --author t3dotgg --limit 50 --json repository,sha,url,commit
gh search commits hole --author t3dotgg --limit 50 --json repository,sha,url,commit
gh search commits beatle --author t3dotgg --limit 50 --json repository,sha,url,commit
```

Findings:

- No Theo-authored commit hits for `shatter`, `drum`, `hole`, or `beatle`.
- GitHub API became rate-limited during broader repo/branch checks.
- The known Challenge 1 repo, `t3dotgg/dogecoin-simulator`, still only shows the prior challenge branch/artifact.
- The plausible skate-themed Theo-content repo is `https://github.com/t3-content/skatebench`.
- Local clone of `t3-content/skatebench` showed no `beatle`, `yellow`, `submarine`, `ringo`, `drum`, `shatter`, `hole`, or seed-like puzzle constants.

## SHAttered Branch Status

The phrase still plausibly points to SHA-1 because of `shatter`, but the concrete SHAttered artifact path has not produced a seed:

- Candidate repo: `https://github.com/cr-marcstevens/sha1collisiondetection`
- Candidate commit: `680dfcba3ed621e1f420649af0c5a0166a916e6f`
- Candidate PDFs:
  - `test/shattered-1.pdf`
  - `test/shattered-2.pdf`
- Shared SHA-1: `38762cf7f55934b34d179ae6a4c80cadccbb7f0a`

Status: logically plausible, but no seed-like Theo/puzzle-specific string found, and prior crypto probes with these strings/hashes failed.

## Current Priority

P0 artifact:

```text
https://donaldsauter.com/yellow-submarine-script.htm
```

P0 seed/string candidates from that artifact:

```text
A drum beat might shatter it.
A drum break might shatter it.
drum beat -> drum break
Any old Ein, any old Ein, any, any old Einstein!
I must complete my bust, two novels, finish my blueprints...
This motor, I see, has a broken down thing.
Ipse Dixit, ha ha, just turn the screw.
Like coloured telly.
```

Interpretation:

- The new `blueprint` hint materially upgrades the Donald Sauter page because it contains `blueprints` in the same correction artifact that contains `drum beat -> drum break`.
- I do not have a confirmed Theo-controlled repo/commit for Challenge 2 yet.
- The most evidence-backed next move is to treat Donald Sauter's correction page as the external artifact equivalent, then test exact strings/corrections from that page before returning to SHAttered/Amen-break branches.

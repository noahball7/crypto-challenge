# Track 4: YouTube Search Path

## Summary

As of 2026-04-23, a direct fetch of YouTube search results for `Yellow Submarine movie` shows the first organic video result as:

- `The Beatles - Yellow Submarine Movie (1968) 1080p Blu-Ray HD`
- Video ID: `wWHVFCMrUk0`
- Channel display name: `Cristhofer_YT95CQ`
- Channel handle: `@Cristhofer_YT95CQ`
- Channel ID observed from YouTube watch/search data: `UC4f5GjENjzLo9rhEIvz-XWA`

This confirms the user-observed search path, but relevance remains uncertain because YouTube ranking is mutable and may be personalized. Treat `Cristhofer_YT95CQ`, especially `YT95CQ` / `95CQ`, as candidate key material, not as a confirmed clue.

Sources:

- YouTube search URL: https://www.youtube.com/results?search_query=Yellow+Submarine+movie
- Top result watch URL: https://www.youtube.com/watch?v=wWHVFCMrUk0
- Top result oEmbed metadata: https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=wWHVFCMrUk0&format=json
- Theo hint video: https://www.youtube.com/watch?v=N_0mpxB5iVQ
- Yellow Submarine script context: https://transcripts.simpleremix.com/script.php/yellow-submarine-1968-GbP

## Search Result Observation

Method: fetched YouTube's HTML search page with a generic browser user agent and parsed `ytInitialData`.

Observed first results for `Yellow Submarine movie`:

1. `wWHVFCMrUk0` - `The Beatles - Yellow Submarine Movie (1968) 1080p Blu-Ray HD` - `Cristhofer_YT95CQ` - `1:29:42` - `98,178 views` - `2 months ago`
2. `vefJAtG-ZKI` - `Yellow Submarine Original Trailer - 1968 (Beatles Official)` - `The Beatles`
3. `m2uTFF_3MaA` - official `Yellow Submarine` music video - `The Beatles`

The same first result appeared for both:

- `Yellow Submarine movie`
- `"Yellow Submarine movie"`

Uncertainty:

- YouTube search order can vary by time, region, cookies, account state, and removals.
- This path is plausible enough to test because it is directly downstream of the confirmed Theo-video description clue, but it should not be treated as stable evidence by itself.

## Channel/Video Metadata

Top search-result video:

- URL: https://www.youtube.com/watch?v=wWHVFCMrUk0
- Title: `The Beatles - Yellow Submarine Movie (1968) 1080p Blu-Ray HD`
- Video ID: `wWHVFCMrUk0`
- Channel display name from watch/oEmbed data: `Cristhofer_YT95CQ`
- Channel URL from oEmbed: https://www.youtube.com/@Cristhofer_YT95CQ
- Channel ID from watch/search data: `UC4f5GjENjzLo9rhEIvz-XWA`
- Duration: `1:29:42` / `5382` seconds
- Upload/publish timestamp observed in watch metadata: `2026-02-03T23:49:46-08:00`
- View count observed during fetch: `98178`

Theo hint video:

- URL: https://www.youtube.com/watch?v=N_0mpxB5iVQ
- Title: `iPhone 11 UltraWide Skate Footage Demo`
- Channel: `Theo - t3.gg`
- Channel ID: `UCbRP3c757lWg9M-U7TyEkXA`
- Upload timestamp observed in page metadata: `2019-09-23T22:51:52-07:00`
- Description contains the clue phrase `A drum break might shatter it!`

Yellow Submarine script context:

- The clue phrase appears in the scene where the Beatles try to break a blue glass bowl around Sgt. Pepper's band.
- Nearby script terms include `Beatle-proof`, `Nothing is Beatle-proof`, `drumsticks`, `hole in my pocket`, and `decanting`.
- Script reference lines from TranscriptDB show the phrase around lines 1080-1085.

Metadata caveat:

- A third-party analytics page exists for a similar name, `Cristhofer_YT95CQ Stems`, at channel ID `UCNY9683eHjOjUrh308KB72w`, with channel metadata such as Peru, join date `2022-06-19`, and about 23K subscribers: https://vling.net/en/channel/UCNY9683eHjOjUrh308KB72w/channel-info
- YouTube's current top-result watch/search data for `wWHVFCMrUk0` instead points to channel ID `UC4f5GjENjzLo9rhEIvz-XWA` and handle `@Cristhofer_YT95CQ`.
- Do not merge these similarly named channels without stronger evidence.

## ID-Like Strings and Candidate Key Material

Highest-priority strings from this path:

```text
Cristhofer_YT95CQ
YT95CQ
95CQ
Cristhofer
wWHVFCMrUk0
UC4f5GjENjzLo9rhEIvz-XWA
The Beatles - Yellow Submarine Movie (1968) 1080p Blu-Ray HD
Yellow Submarine Movie 1968 1080p Blu-Ray HD
1:29:42
5382
2026-02-03
2026-02-03T23:49:46-08:00
98178
```

Useful combined/contextual candidates:

```text
N_0mpxB5iVQ
wWHVFCMrUk0
N_0mpxB5iVQ:wWHVFCMrUk0
Where it all begaN_0mpxB5iVQ
Cristhofer_YT95CQ Yellow Submarine
Yellow Submarine Cristhofer_YT95CQ
Beatle-proof
Nothing is Beatle-proof
A drum break might shatter it!
hole in my pocket
```

Notes on `YT95CQ`:

- It is visually ID-like: six base64url-safe characters with mixed letters and digits.
- It may simply mean `YouTube 95 CQ` or be an arbitrary handle suffix.
- `95CQ`, `YT95CQ`, and the full display name should be tested before more speculative transforms.

## Relevance Assessment

Moderate-low confidence as a primary clue, moderate confidence as candidate key material.

Why it may matter:

- The path is naturally reachable from the confirmed clue chain: Theo video description -> Yellow Submarine quote -> YouTube search for the movie.
- The first result's channel name contains a compact suffix, `YT95CQ`, that looks more key-like than ordinary prose.
- The top video is a full-film upload, so a solver following the film clue could plausibly encounter it.

Why it may be incidental:

- Search rankings are unstable.
- The video was uploaded in February 2026, after the Theo hint video's 2019 upload and shortly before the April 2026 challenge.
- The upload appears to be a third-party Beatles/full-movie upload, not an obvious Theo-controlled artifact.
- No direct connection from Theo to `Cristhofer_YT95CQ` was found in this pass.

Working conclusion:

- Include these strings in decryption candidate generation.
- Do not anchor the solve path on this result unless one of the strings decrypts line 1 or another clue independently confirms it.

## Recommended Tests

1. Add exact candidate strings from this file to the passphrase corpus before broadening into transforms.
2. Test `Cristhofer_YT95CQ`, `YT95CQ`, `95CQ`, `wWHVFCMrUk0`, and `UC4f5GjENjzLo9rhEIvz-XWA` as raw UTF-8 passphrases.
3. Test lowercase, uppercase, punctuation-stripped, underscore-to-space, and underscore-stripped variants.
4. Test candidate joins with confirmed Beatles material, especially `Yellow Submarine`, `Beatle-proof`, `Nothing is Beatle-proof`, and the Theo video ID `N_0mpxB5iVQ`.
5. Test date/duration variants: `20260203`, `2026-02-03`, `5382`, `1:29:42`, and `89:42`.
6. If testing byte material, try base64url-decoding ID-like strings only where padding/length is valid, but keep raw string testing higher priority.
7. Re-run the YouTube search from a clean browser/session or alternate IP before assigning any weight to search rank as an intentional clue.
8. If a candidate decrypts to plausible text, require a reproducible decryption path for line 1 before treating this track as confirmed.

# Track C: Theo First Video Route

## Summary

`Where it all begaN_0mpxB5iVQ` cleanly splits as `Where it all began` plus YouTube ID `N_0mpxB5iVQ`. The ID resolves to Theo's `iPhone 11 UltraWide Skate Footage Demo`.

The best-supported interpretation of `where it all began` is: go to Theo's oldest currently public YouTube upload. `yt-dlp` over the public uploads playlist currently returns `N_0mpxB5iVQ` as the oldest item, after all newer videos.

I did not find a stronger hidden string in the first frame, last frame, comments, pinned comment, captions, transcript, or YouTube music metadata. The actionable clue remains the video description phrase: `A drum break might shatter it!`

## Video Metadata

- URL: `https://www.youtube.com/watch?v=N_0mpxB5iVQ`
- Video ID: `N_0mpxB5iVQ`
- Title: `iPhone 11 UltraWide Skate Footage Demo`
- Channel/uploader: `Theo - t3.gg`
- Channel handle: `@t3dotgg`
- Channel ID: `UCbRP3c757lWg9M-U7TyEkXA`
- Upload date from extractor: `2019-09-24`
- Upload timestamp from extractor: `1569304312` = `2019-09-24 05:51:52 UTC`
- Duration: `4:15`
- Category: `Sports`
- Tags: `skateboarding`, `iphone`, `iphone11`, `iphonepro`
- oEmbed title/author matched the above title/channel.
- Public uploads playlist check: oldest returned item was `N_0mpxB5iVQ` / `iPhone 11 UltraWide Skate Footage Demo`. This supports "where it all began" as "Theo's first public upload," with the caveat that hidden/private/deleted videos cannot be ruled out.

Sources checked:

- `https://www.youtube.com/watch?v=N_0mpxB5iVQ`
- `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=N_0mpxB5iVQ&format=json`
- `https://www.youtube.com/playlist?list=UUbRP3c757lWg9M-U7TyEkXA`

## Description/Comments/Transcript

Description exact text checked through `yt-dlp`:

```text
Had a fun day at the Ferry Building in San Francisco with the usual crew filming with the new iPhone. I was so hyped to play with the new "13mm" ultra wide lens and it exceeded my highest hopes. Genuinely feels like Apple made this camera for us.

Skaters featured:
https://www.instagram.com/slayyterr/
https://www.instagram.com/zesher/
https://www.instagram.com/trendzwithbenifitz/
https://www.instagram.com/skatesoon/
https://www.instagram.com/austinfunk/
https://www.instagram.com/mrweouthere/

Me: https://www.instagram.com/fakiebigfoot/

For no reason in particular: "A drum break might shatter it!"

^ if you DM me this phrase, you are disqualified and I will block you.
```

Comments:

- No pinned comment was returned by `yt-dlp`; all extracted comments had `is_pinned=false`.
- One uploader reply was returned. It answers a stabilization question: `no external stabilization`, Theo bought a gimbal but stopped using it, and the ultra-wide lens has no OIS but is wide enough to avoid looking bumpy.
- Current recent comments are contaminated by Puzzle V2 traffic, including `Where it all began`, `A drum break might shatter it!`, and `who's here from puzzle v2?`; these should not be treated as original clue material.
- Older non-puzzle comments mention skate tricks and camera/stabilization, for example `Switch Lazer bro!`, `switch varial heel?`, `tRPC Footage Demo`, and `Your friends are goood`. None looks like a cleaner route than the description.

Transcript/captions:

- `yt-dlp --list-subs` reported no subtitles and no automatic captions.
- Local Whisper tiny ASR over the downloaded video produced only `Thank you, sir.` at the start. I treat this as low-confidence/noisy ASR, not as confirmed transcript evidence.
- No reliable first/last spoken words were found.

## First/Last Frame or Audio Clues

First frame:

- Daytime shot at San Francisco Ferry Building with a skater rolling in front of the building.
- No overlay text, title card, QR code, or obvious hidden exact string was visible.
- Visual clue reinforces the description location: `Ferry Building`, `San Francisco`.

Last frame:

- Night waterfront/skate shot, again near the Ferry Building area.
- No overlay text or obvious hidden exact string was visible.

Audio/song:

- YouTube/`yt-dlp` did not expose `artist`, `track`, `album`, `creator`, `alt_title`, or music license metadata.
- The description's `drum break` wording is still the only strong audio-adjacent clue.
- I did not identify a song title or credited sample from video metadata. If the music itself matters, it likely requires external audio recognition or manual listening, not YouTube metadata.

## Candidate Exact Strings

Highest confidence from the intended route:

- `A drum break might shatter it!`
- `A drum break might shatter it`
- `Where it all began`
- `N_0mpxB5iVQ`
- `iPhone 11 UltraWide Skate Footage Demo`

Metadata/location candidates:

- `2019-09-24`
- `1569304312`
- `Ferry Building`
- `San Francisco`
- `13mm`
- `ultra wide`
- `Apple made this camera for us`
- `skateboarding`
- `iphone11`
- `iphonepro`

Skater/handle candidates:

- `slayyterr`
- `zesher`
- `trendzwithbenifitz`
- `skatesoon`
- `austinfunk`
- `mrweouthere`
- `fakiebigfoot`

Comment-derived, lower confidence:

- `no external stabilization`
- `ultra wide doesn't even have OIS`
- `it is just wide enough to not look bumpy`
- `Switch Lazer`
- `switch varial heel`
- `tRPC Footage Demo`
- `Your friends are goood`

Very low confidence ASR:

- `Thank you, sir.`
- `Thank you sir`

## Confidence/Gaps

Confidence:

- High: `N_0mpxB5iVQ` resolves to Theo's video; description contains `A drum break might shatter it!`; the video is currently the oldest returned item in Theo's public uploads playlist.
- Medium-high: `where it all began` means "first public Theo upload," not a first-frame or first-word extraction. This fits the playlist evidence and the wording.
- Medium: comments do not add a stable intended clue. Puzzle-era comments are obviously contaminated.
- Low: first/last frames contain hidden or exact-string material. I saw no visual text/overlay beyond location context.
- Low: local ASR output is meaningful. With no official captions and only one tiny-model phrase, it is not strong evidence.

Gaps:

- Hidden/private/deleted channel uploads cannot be checked from the public playlist.
- YouTube comments are volatile; current extraction is a snapshot from `2026-04-23`.
- I did not run a dedicated music-recognition service. YouTube metadata did not expose a song.
- First/last frame inspection used downloaded 360p video; no higher-resolution frame analysis was performed.

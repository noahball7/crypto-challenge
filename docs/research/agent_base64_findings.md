# Agent Base64 Findings

Date: 2026-04-24

## Scope

Investigated the requested five-step hypothesis around challenge 2 line 1:

- noncanonical Base64
- missing alphabet characters
- Base64 integer parse / compact envelope
- correction trail such as `beat -> break`
- hole/submarine/blueprint operations

No plaintext was recovered. No candidate plaintext should be submitted.

## Reproducible Base64 Facts

Command:

```sh
node - <<'NODE'
const fs=require('fs');
const [line1]=fs.readFileSync('challenge2.txt','utf8').trim().split(/\n/);
const s=line1.replace(/=+$/,'');
const A='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
const present=[...new Set(s)].sort().join('');
const missing=[...A].filter(c=>!s.includes(c)).join('');
console.log(JSON.stringify({
  line1Length:line1.length,
  noPadLength:s.length,
  decodedLength:Buffer.from(line1,'base64').length,
  presentCount:new Set(s).size,
  missingCount:missing.length,
  missing,
  missingVals:[...missing].map(c=>A.indexOf(c)),
  presentAscii:present,
  stdPresent:[...A].filter(c=>s.includes(c)).join(''),
  canonical:Buffer.from(line1,'base64').toString('base64'),
  sameCanonical:Buffer.from(line1,'base64').toString('base64')===line1,
  finalChar:s.at(-1),
  finalVal:A.indexOf(s.at(-1)),
  padBits:A.indexOf(s.at(-1))&3
},null,2));
NODE
```

Result:

```json
{
  "line1Length": 100,
  "noPadLength": 99,
  "decodedLength": 74,
  "presentCount": 53,
  "missingCount": 11,
  "missing": "DEHPTUbeu59",
  "missingVals": [3, 4, 7, 15, 19, 20, 27, 30, 46, 57, 61],
  "presentAscii": "+/01234678ABCFGIJKLMNOQRSVWXYZacdfghijklmnopqrstvwxyz",
  "stdPresent": "ABCFGIJKLMNOQRSVWXYZacdfghijklmnopqrstvwxyz01234678+/",
  "canonical": "/rRoSapsG0mYJtfMxKA3LigccFOylL+ZL7stK8x1dk+43Z2sjXhINL+q1BtWBSCQBfnAJXRwYkBNGBxZyinKV+Iz3vSpfRLa6kg=",
  "sameCanonical": false,
  "finalChar": "j",
  "finalVal": 35,
  "padBits": 3
}
```

Important implication: line 1 is valid but noncanonical Base64. For one `=` padding byte, the final sextet's low two pad bits should be zero. Here they are `3` (`0b11`). Canonicalizing changes the text suffix from `...6kj=` to `...6kg=`, but the decoded 74 bytes are identical.

## Base64 Integer Parse

Command:

```sh
node - <<'NODE'
const fs=require('fs');
const [line1]=fs.readFileSync('challenge2.txt','utf8').trim().split(/\n/);
const s=line1.replace(/=+$/,'');
const A='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
const raw=Buffer.from(line1,'base64');
let n=0n;
for (const ch of s) n=n*64n+BigInt(A.indexOf(ch));
const rawN=BigInt('0x'+raw.toString('hex'));
let hx=n.toString(16);
if(hx.length%2) hx='0'+hx;
const intBuf=Buffer.from(hx,'hex');
console.log(JSON.stringify({
  equationHolds:n===(rawN<<2n)+3n,
  hiddenPadBits:Number(n&3n),
  rawLen:raw.length,
  intParseLen:intBuf.length,
  intParseHexPrefix:intBuf.toString('hex').slice(0,30),
  intParseHexSuffix:intBuf.toString('hex').slice(-30)
},null,2));
NODE
```

Result:

```json
{
  "equationHolds": true,
  "hiddenPadBits": 3,
  "rawLen": 74,
  "intParseLen": 75,
  "intParseHexPrefix": "03fad1a126a9b06d26609b5f331280",
  "intParseHexSuffix": "6728a7295f88cf7bd2a5f44b6ba923"
}
```

This makes the integer parse a coherent compact-envelope candidate:

```text
v1 | salt16 | iv12 | ciphertext30 | tag16 = 75 bytes
```

Targeted authenticated AES-256-GCM testing against that 75-byte parse found no hit.

## Authenticated No-Hit Checks

Existing scripts:

```sh
node scripts/challenge2_non_aes_probe.mjs | head -n 80
node scripts/challenge2_operations_probe.mjs | head -n 120
node scripts/challenge2_hole_probe.mjs | head -n 120
node challenge2_probe_v2.mjs
```

Observed results:

- `challenge2_non_aes_probe.mjs`: Base53/base64-integer parses remained high entropy; no readable plaintext or real magic header.
- `challenge2_operations_probe.mjs`: basic break/hole/reverse/XOR/signature-shape transforms produced no readable plaintext or real magic header.
- `challenge2_hole_probe.mjs`: deterministic hole/delete/extract operations mostly produced expected lengths only; no readable plaintext or authenticated result.
- `challenge2_probe_v2.mjs`: `attempts=1522800 hits=0 seeds=141 layouts=12`.

Targeted integer-envelope AES-GCM probe:

```text
blobLen=75
blobPrefix=03fad1a1
seeds=445
aads=48
attempts=320400
hits=[]
```

Targeted missing-alphabet/pad-bit AES-GCM probe:

```text
missing=DEHPTUbeu59
missingVals=3,4,7,15,19,20,27,30,46,57,61
seeds=11
aads=10
attempts=1320
hits=[]
```

## Current Assessment

Strong signal:

- The noncanonical Base64 is real and precise.
- The hidden pad bits are exactly `3`.
- The Base64 integer parse yields a clean 75-byte shape that naturally fits a one-byte prefix plus the same `salt16|iv12|ct30|tag16` AES-GCM-style envelope.

No-hit:

- Standard raw Base64 `salt16|iv12|ct30|tag16` remains unauthenticated for existing high-signal candidates.
- Integer-parse compact envelope also did not authenticate under the bounded candidate/KDF/AAD set.
- Missing alphabet chars do not directly decode to text and did not work as seed/AAD in the bounded AES-GCM tests.
- Correction strings like `beat -> break`, `View corrections`, `breaktellyEin`, and hole/submarine scene strings remain useful clue material, but no tested direct cryptographic use has authenticated.

Next best move is not broad brute force. The noncanonical Base64 probably needs a specific instruction for how to use the two pad bits / integer parse / missing characters, or a new Theo-controlled artifact that supplies the exact seed/AAD.

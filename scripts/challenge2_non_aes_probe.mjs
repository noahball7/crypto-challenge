import crypto from "node:crypto";
import fs from "node:fs";

const [line1, line2 = ""] = fs.readFileSync("challenge2.txt", "utf8").trim().split(/\r?\n/);
const b64Text = line1.replace(/=+$/, "");
const raw = Buffer.from(line1, "base64");
const STD64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

function rot47(str) {
  return str.replace(/[!-~]/g, (ch) => String.fromCharCode(33 + ((ch.charCodeAt(0) - 33 + 47) % 94)));
}

function uniqueChars(str) {
  return [...new Set([...str])].join("");
}

function decodeBaseN(str, alphabet) {
  let n = 0n;
  const base = BigInt(alphabet.length);
  for (const ch of str) {
    const idx = alphabet.indexOf(ch);
    if (idx < 0) return null;
    n = n * base + BigInt(idx);
  }
  if (n === 0n) return Buffer.from([0]);
  let hex = n.toString(16);
  if (hex.length % 2) hex = `0${hex}`;
  return Buffer.from(hex, "hex");
}

function printableInfo(buf) {
  const utf = buf.toString("utf8");
  const invalid = utf.includes("\ufffd");
  const chars = [...utf];
  const printable = chars.filter((ch) => ch === "\n" || ch === "\r" || ch === "\t" || (ch >= " " && ch <= "~")).length;
  const ratio = chars.length ? printable / chars.length : 0;
  return { invalid, ratio, text: !invalid && ratio >= 0.82 ? utf : "" };
}

function entropy(buf) {
  const counts = new Map();
  for (const b of buf) counts.set(b, (counts.get(b) ?? 0) + 1);
  let e = 0;
  for (const n of counts.values()) {
    const p = n / buf.length;
    e -= p * Math.log2(p);
  }
  return e;
}

function maybeEmit(label, buf, extra = {}) {
  const p = printableInfo(buf);
  const hex = buf.toString("hex");
  const hits = [];
  const magics = [
    ["Ed-signify", Buffer.from("Ed")],
    ["json-object", Buffer.from("{")],
    ["json-array", Buffer.from("[")],
    ["gzip", Buffer.from([0x1f, 0x8b])],
    ["zlib", Buffer.from([0x78])],
    ["zip", Buffer.from("PK")],
    ["openssl-salted", Buffer.from("Salted__")],
    ["age", Buffer.from("age-")],
    ["ssh-ed25519", Buffer.from("ssh-ed25519")],
    ["armor", Buffer.from("-----")],
  ];
  for (const [name, magic] of magics) {
    if (buf.subarray(0, magic.length).equals(magic)) hits.push(name);
  }
  if (buf.length === 74) hits.push(buf.subarray(0, 2).toString("utf8") === "Ed" ? "signify-74-Ed" : "signify-74-no-magic");
  if (buf.length === 64) hits.push("ed25519-signature-length");
  if (buf.length === 32) hits.push("ed25519-key-or-hash-length");
  if (!p.invalid && p.ratio >= 0.82) hits.push("mostly-printable");
  if (hits.length || p.ratio >= 0.65 || extra.force) {
    console.log(JSON.stringify({
      label,
      length: buf.length,
      entropy: Number(entropy(buf).toFixed(3)),
      prefixHex: hex.slice(0, 48),
      suffixHex: hex.slice(-48),
      printableRatio: Number(p.ratio.toFixed(3)),
      text: p.text.slice(0, 180),
      hits,
      ...extra,
    }));
  }
}

function allBaseN() {
  const present = uniqueChars(b64Text);
  const alphabets = [
    ["base53-first-occurrence", present],
    ["base53-first-occurrence-rev", [...present].reverse().join("")],
    ["base53-ascii", [...present].sort().join("")],
    ["base53-ascii-rev", [...present].sort().reverse().join("")],
    ["base53-std64-order", [...STD64].filter((c) => present.includes(c)).join("")],
    ["base53-std64-order-rev", [...STD64].filter((c) => present.includes(c)).reverse().join("")],
    ["base64-int-std", STD64],
    ["base64-int-std-rev", [...STD64].reverse().join("")],
  ];
  for (const [name, alphabet] of alphabets) {
    const decoded = decodeBaseN(b64Text, alphabet);
    if (decoded) maybeEmit(name, decoded, { alphabet, force: true });
  }
}

function lineEdits() {
  const variants = new Map();
  const add = (name, text) => {
    if (/^[A-Za-z0-9+/]+$/.test(text)) variants.set(name, text);
  };

  add("as-b64-no-pad", b64Text);
  add("reverse-b64-text", [...b64Text].reverse().join(""));
  add("remove-plus", b64Text.replaceAll("+", ""));
  add("remove-slash", b64Text.replaceAll("/", ""));
  add("remove-non-alnum", b64Text.replace(/[^A-Za-z0-9]/g, ""));

  // The YouTube clue has scs "beat" vs dvd "break": model this as delete-r and k->t.
  const breakToBeat = b64Text.replaceAll("r", "").replaceAll("R", "").replaceAll("k", "t").replaceAll("K", "T");
  add("break-to-beat-delete-r-k-to-t", breakToBeat);
  const beatToBreak = b64Text.replaceAll("t", "rk").replaceAll("T", "RK");
  add("beat-to-break-insert-r-before-k", beatToBreak);

  // SCS/DVD labels as tiny edit masks.
  const maps = [
    ["scs-to-dvd", { s: "d", c: "v", S: "D", C: "V" }],
    ["dvd-to-scs", { d: "s", v: "c", D: "S", V: "C" }],
    ["beat-break-swap-r-t-k", { r: "t", R: "T", k: "r", K: "R", t: "k", T: "K" }],
  ];
  for (const [name, map] of maps) {
    add(name, [...b64Text].map((ch) => map[ch] ?? ch).join(""));
  }

  for (const [name, text] of variants) {
    try {
      const buf = Buffer.from(`${text}${"=".repeat((4 - (text.length % 4)) % 4)}`, "base64");
      maybeEmit(`b64-edit:${name}`, buf, { editedLength: text.length });
    } catch {}
  }
}

function shards() {
  for (const source of [
    ["raw-bytes", [...raw]],
    ["b64-char-codes", [...b64Text].map((ch) => ch.charCodeAt(0))],
    ["b64-std64-values", [...b64Text].map((ch) => STD64.indexOf(ch))],
  ]) {
    const [name, arr] = source;
    for (const mod of [2, 3, 4, 5, 6, 8, 10, 11, 16, 23, 47, 53]) {
      const parts = [];
      for (let rem = 0; rem < mod; rem++) parts.push(arr.filter((_, i) => i % mod === rem));
      for (let rem = 0; rem < mod; rem++) {
        const buf = Buffer.from(parts[rem]);
        maybeEmit(`shard:${name}:mod${mod}:rem${rem}`, buf);
      }
      // A cheap "shatter and reassemble" family: reverse part order, reverse each part.
      maybeEmit(`reassemble:${name}:mod${mod}:reverse-parts`, Buffer.from(parts.toReversed().flat()));
      maybeEmit(`reassemble:${name}:mod${mod}:reverse-each`, Buffer.from(parts.map((p) => p.toReversed()).flat()));
    }
  }
}

function holeDeletes() {
  const seeds = [
    "hole", "Ringo", "drum break", "drum beat", "shatter", "blueprint", "blueprints",
    "A drum break might shatter it!", "A drum beat might shatter it.",
  ];
  const widths = [1, 2, 3, 4, 8, 10, 12, 16, 23];
  for (const seed of seeds) {
    const digest = crypto.createHash("sha256").update(seed).digest();
    for (const width of widths) {
      const pos = digest[0] % Math.max(1, raw.length - width + 1);
      const buf = Buffer.concat([raw.subarray(0, pos), raw.subarray(pos + width)]);
      maybeEmit(`hole:raw:sha256(${seed}):pos${pos}:width${width}`, buf);
    }
  }
  for (const pos of [0, 1, 2, 8, 10, 12, 16, 23, 24, 28, 30, 32, 42, 44, 53, 58, 64, 72]) {
    for (const width of widths) {
      if (pos + width <= raw.length) {
        const buf = Buffer.concat([raw.subarray(0, pos), raw.subarray(pos + width)]);
        maybeEmit(`hole:raw:pos${pos}:width${width}`, buf);
      }
    }
  }
}

function signatureShapes() {
  const cands = [
    ["raw", raw],
    ["replace-header-Ed", Buffer.concat([Buffer.from("Ed"), raw.subarray(2)])],
    ["drop-header-tail64", raw.subarray(10)],
    ["last64", raw.subarray(-64)],
    ["first64", raw.subarray(0, 64)],
    ["base64-int-std", decodeBaseN(b64Text, STD64)],
  ];
  for (const [name, buf] of cands) {
    if (!buf) continue;
    if (buf.length === 74) {
      console.log(JSON.stringify({
        label: `signify-shape:${name}`,
        magic: buf.subarray(0, 2).toString("hex"),
        keyId: buf.subarray(2, 10).toString("hex"),
        sigPrefix: buf.subarray(10, 18).toString("hex"),
        sigSuffix: buf.subarray(-8).toString("hex"),
      }));
    } else if (buf.length === 64) {
      console.log(JSON.stringify({
        label: `ed25519-sig64:${name}`,
        sigPrefix: buf.subarray(0, 8).toString("hex"),
        sigSuffix: buf.subarray(-8).toString("hex"),
      }));
    }
  }
}

console.log(JSON.stringify({
  summary: "inputs",
  line1Length: line1.length,
  noPadLength: b64Text.length,
  distinctSymbols: new Set(b64Text).size,
  finalChar: b64Text.at(-1),
  finalStd64Value: STD64.indexOf(b64Text.at(-1)),
  finalPadBits: STD64.indexOf(b64Text.at(-1)) & 0b11,
  rawLength: raw.length,
  line2Rot47: rot47(line2),
}));

allBaseN();
lineEdits();
shards();
holeDeletes();
signatureShapes();

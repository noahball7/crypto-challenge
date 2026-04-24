import crypto from "node:crypto";
import fs from "node:fs";

const [line1, line2 = ""] = fs.readFileSync("challenge2.txt", "utf8").trim().split(/\n/);
const raw = Buffer.from(line1, "base64");

const messages = [
  line1,
  line2,
  "Where it all begaN_0mpxB5iVQ",
  "https://www.youtube.com/watch?v=N_0mpxB5iVQ",
  "A drum break might shatter it!",
  "A drum break might shatter it.",
  "I've got a hole in my pocket.",
  "hole in my pocket",
  "Project Glasswing",
  "Claude Mythos Preview",
  "Claude Mythos is the start of the end. I think this is my psychosis moment.",
];

const clueStrings = [
  "Ed",
  "hole",
  "hole in my pocket",
  "Ringo",
  "Beatle-proof",
  "drum break",
  "shatter it",
  "Yellow Submarine",
  "Project Glasswing",
  "Claude Mythos Preview",
  "start of the end",
  "1:15:44",
  "1:16:46",
];

function uniqueBuffers(entries) {
  const seen = new Set();
  const out = [];
  for (const entry of entries) {
    const key = `${entry.name}:${entry.bytes.toString("hex")}`;
    if (!seen.has(key)) {
      seen.add(key);
      out.push(entry);
    }
  }
  return out;
}

function printableScore(bytes) {
  const text = bytes.toString("utf8");
  if (!text || text.includes("\uFFFD")) return 0;
  const printable = [...text].filter((char) => char === "\n" || char === "\r" || char === "\t" || (char >= " " && char <= "~")).length;
  return printable / text.length;
}

function xorRepeating(bytes, key) {
  const out = Buffer.alloc(bytes.length);
  for (let i = 0; i < bytes.length; i += 1) out[i] = bytes[i] ^ key[i % key.length];
  return out;
}

function removeIndex(bytes, index) {
  return Buffer.concat([bytes.subarray(0, index), bytes.subarray(index + 1)]);
}

function removeRange(bytes, start, length) {
  return Buffer.concat([bytes.subarray(0, start), bytes.subarray(start + length)]);
}

function moduloShard(bytes, mod, rem) {
  return Buffer.from([...bytes].filter((_, i) => i % mod === rem));
}

const transforms = [
  { name: "raw", bytes: raw },
  { name: "reverse-bytes", bytes: Buffer.from([...raw].reverse()) },
  { name: "drop-first-2", bytes: raw.subarray(2) },
  { name: "drop-last-2", bytes: raw.subarray(0, -2) },
  { name: "replace-first-2-with-Ed", bytes: Buffer.concat([Buffer.from("Ed"), raw.subarray(2)]) },
  { name: "prepend-Ed-drop-first-2", bytes: Buffer.concat([Buffer.from("Ed"), raw.subarray(2)]) },
  { name: "drop-first-last", bytes: raw.subarray(1, -1) },
  { name: "drop-first-last-2", bytes: raw.subarray(2, -2) },
];

for (const pos of [0, 1, 2, 8, 10, 12, 16, 24, 28, 32, 37, 44, 46, 58, 64, 72, 73]) {
  if (pos >= 0 && pos < raw.length) transforms.push({ name: `remove-byte-${pos}`, bytes: removeIndex(raw, pos) });
}

for (const start of [0, 2, 8, 10, 12, 16, 24, 28, 32, 37, 44, 46, 58]) {
  for (const length of [2, 4, 8, 12, 16]) {
    if (start + length <= raw.length) {
      transforms.push({ name: `remove-range-${start}-${length}`, bytes: removeRange(raw, start, length) });
    }
  }
}

for (const mod of [2, 3, 4, 5, 8, 10, 16]) {
  for (let rem = 0; rem < mod; rem += 1) {
    transforms.push({ name: `mod-shard-${mod}-${rem}`, bytes: moduloShard(raw, mod, rem) });
  }
}

for (const clue of clueStrings) {
  const key = Buffer.from(clue, "utf8");
  transforms.push({ name: `xor-text-${clue}`, bytes: xorRepeating(raw, key) });
  transforms.push({ name: `xor-sha256-${clue}`, bytes: xorRepeating(raw, crypto.createHash("sha256").update(key).digest()) });
}

const reversedBase64 = line1.split("").reverse().join("");
try {
  transforms.push({ name: "reverse-base64-decode", bytes: Buffer.from(reversedBase64, "base64") });
} catch {
  // Invalid reversed base64 is not useful.
}

function classify(entry) {
  const { name, bytes } = entry;
  const score = printableScore(bytes);
  const hex = bytes.toString("hex");
  const text = score > 0.9 ? bytes.toString("utf8") : "";
  const hits = [];

  if (bytes.length === 74) {
    hits.push({
      type: bytes.subarray(0, 2).toString("utf8") === "Ed" ? "signify-candidate" : "signify-length-no-magic",
      header: bytes.subarray(0, 2).toString("hex"),
      keyId: bytes.subarray(2, 10).toString("hex"),
      sigPrefix: bytes.subarray(10, 18).toString("hex"),
    });
  }

  const magic = [
    ["json", Buffer.from("{")],
    ["openssl-salted", Buffer.from("Salted__")],
    ["gzip", Buffer.from([0x1f, 0x8b])],
    ["zlib-78", Buffer.from([0x78])],
    ["zip", Buffer.from("PK")],
    ["age", Buffer.from("age-")],
    ["armor", Buffer.from("-----")],
    ["ed", Buffer.from("Ed")],
  ];

  for (const [label, prefix] of magic) {
    if (bytes.subarray(0, prefix.length).equals(prefix)) hits.push({ type: "magic", label });
  }

  if (score > 0.85) hits.push({ type: "printable", score: Number(score.toFixed(3)), text });

  if (hits.length > 0) {
    console.log(JSON.stringify({ transform: name, length: bytes.length, prefix: hex.slice(0, 32), hits }));
  }
}

for (const entry of uniqueBuffers(transforms)) classify(entry);

console.log(JSON.stringify({ summary: true, rawLength: raw.length, transforms: transforms.length, messages: messages.length }));

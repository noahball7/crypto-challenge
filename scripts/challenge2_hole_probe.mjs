import crypto from "node:crypto";
import fs from "node:fs";

const [line1, line2 = ""] = fs.readFileSync("challenge2.txt", "utf8").trim().split(/\n/);
const raw = Buffer.from(line1, "base64");

const seeds = [
  "hole",
  "hole in my pocket",
  "I've got a hole in my pocket.",
  "I have got a hole in my pocket",
  "Ringo",
  "Sea of Holes",
  "still works",
  "Yeah, it still works.",
  "decanting",
  "They're decanting.",
  "blue glass",
  "Beatle-proof",
  "Nothing is Beatle-proof.",
  "A drum break might shatter it.",
  "1:15:44",
  "1:16:46",
  "N_0mpxB5iVQ",
  "Where it all began",
];

const knownLengths = new Set([20, 24, 30, 32, 34, 38, 42, 46, 50, 58, 64, 72, 74]);

function unique(items) {
  return [...new Set(items)];
}

function printableScore(bytes) {
  const text = bytes.toString("utf8");
  if (!text || text.includes("\uFFFD")) return 0;
  const printable = [...text].filter((char) => char === "\n" || char === "\r" || char === "\t" || (char >= " " && char <= "~")).length;
  return printable / text.length;
}

function indexesFromSeed(seed, length, count) {
  const digest = crypto.createHash("sha256").update(seed).digest();
  const positions = [];
  let counter = 0;
  while (positions.length < count) {
    const block = crypto.createHash("sha256").update(seed).update(String(counter)).digest();
    for (let i = 0; i < block.length && positions.length < count; i += 1) {
      const pos = block[i] % length;
      if (!positions.includes(pos)) positions.push(pos);
    }
    counter += 1;
  }
  // Include first digest bytes deterministically too.
  for (const byte of digest) {
    const pos = byte % length;
    if (!positions.includes(pos)) positions.push(pos);
    if (positions.length >= count) break;
  }
  return positions.slice(0, count).sort((a, b) => a - b);
}

function removePositions(bytes, positions) {
  const remove = new Set(positions);
  return Buffer.from([...bytes].filter((_, i) => !remove.has(i)));
}

function extractPositions(bytes, positions) {
  return Buffer.from(positions.map((i) => bytes[i]));
}

function classify(label, bytes, meta = {}) {
  const hits = [];
  const score = printableScore(bytes);
  if (score > 0.85) hits.push({ type: "printable", score: Number(score.toFixed(3)), text: bytes.toString("utf8") });
  if (bytes.length === 74) hits.push({ type: "signify-length", header: bytes.subarray(0, 2).toString("hex"), keyId: bytes.subarray(2, 10).toString("hex") });
  if (bytes.length === 72) hits.push({ type: "ed25519-sig-without-header-keyid-or-compact-blob" });
  if (bytes.length === 64) hits.push({ type: "ed25519-signature-sized" });
  if (bytes.subarray(0, 2).toString("utf8") === "Ed") hits.push({ type: "ed-magic", keyId: bytes.subarray(2, 10).toString("hex") });
  if (bytes.subarray(0, 1).toString("utf8") === "{") hits.push({ type: "json-ish" });
  if (bytes.subarray(0, 8).toString("utf8") === "Salted__") hits.push({ type: "openssl-salted" });
  if (bytes.subarray(0, 5).toString("utf8") === "age-e") hits.push({ type: "age-ish" });
  if (knownLengths.has(bytes.length) || hits.length) {
    console.log(JSON.stringify({ label, length: bytes.length, prefix: bytes.toString("hex").slice(0, 32), ...meta, hits }));
  }
}

function testByteHoles() {
  for (const seed of seeds) {
    for (const holeSize of [1, 2, 4, 8, 10, 12, 14, 16, 24, 32]) {
      if (holeSize >= raw.length) continue;
      const positions = indexesFromSeed(seed, raw.length, holeSize);
      classify(`bytes.remove.seed.${seed}.${holeSize}`, removePositions(raw, positions), { positions });
      classify(`bytes.extract.seed.${seed}.${holeSize}`, extractPositions(raw, positions), { positions });
    }
  }

  for (const start of [0, 1, 2, 8, 10, 12, 16, 24, 28, 32, 37, 44, 46, 50, 58, 64]) {
    for (const size of [1, 2, 4, 8, 10, 12, 14, 16, 24, 32]) {
      if (start + size <= raw.length) {
        const positions = Array.from({ length: size }, (_, i) => start + i);
        classify(`bytes.remove.contiguous.${start}.${size}`, removePositions(raw, positions), { positions });
        classify(`bytes.extract.contiguous.${start}.${size}`, extractPositions(raw, positions), { positions });
      }
    }
  }
}

function testBase64Holes() {
  const chars = [...line1.replace(/=+$/, "")];
  for (const seed of seeds) {
    for (const holeSize of [1, 2, 4, 8, 10, 12, 16, 20, 24]) {
      if (holeSize >= chars.length) continue;
      const positions = indexesFromSeed(seed, chars.length, holeSize);
      const kept = chars.filter((_, i) => !positions.includes(i)).join("");
      const extracted = positions.map((i) => chars[i]).join("");
      for (const [kind, value] of [["remove", kept], ["extract", extracted]]) {
        const padded = value + "=".repeat((4 - (value.length % 4)) % 4);
        try {
          classify(`base64.${kind}.seed.${seed}.${holeSize}`, Buffer.from(padded, "base64"), { positions, text: value });
        } catch {
          // Ignore invalid base64 fragments.
        }
      }
    }
  }
}

function testInsideOutside() {
  // Pocket/container interpretations: remove wrappers and inspect inside/outside.
  for (const left of [1, 2, 4, 8, 10, 12, 16, 24, 28, 32]) {
    for (const right of [1, 2, 4, 8, 10, 12, 16, 24, 28, 32]) {
      if (left + right < raw.length) {
        classify(`bytes.inside.drop-${left}-${right}`, raw.subarray(left, raw.length - right), { left, right });
        classify(`bytes.outside.keep-${left}-${right}`, Buffer.concat([raw.subarray(0, left), raw.subarray(raw.length - right)]), { left, right });
      }
    }
  }
}

testByteHoles();
testBase64Holes();
testInsideOutside();

console.log(JSON.stringify({ summary: true, rawLength: raw.length, base64Length: line1.length, seeds: seeds.length }));

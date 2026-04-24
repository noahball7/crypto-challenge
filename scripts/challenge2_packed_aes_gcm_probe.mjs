import crypto from "node:crypto";
import fs from "node:fs";

const [line1, line2 = ""] = fs.readFileSync("challenge2.txt", "utf8").trim().split(/\n/);
const blob = Buffer.from(line1, "base64");

if (blob.length !== 74) {
  throw new Error(`Expected 74 decoded bytes, got ${blob.length}`);
}

const packed = {
  salt: blob.subarray(0, 16),
  iv: blob.subarray(16, 28),
  ct: blob.subarray(28, -16),
  tag: blob.subarray(-16),
};

function rot47(value) {
  return [...value]
    .map((char) => {
      const code = char.charCodeAt(0);
      if (code < 33 || code > 126) return char;
      return String.fromCharCode(33 + ((code + 14) % 94));
    })
    .join("");
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function readCandidateFile(path) {
  if (!fs.existsSync(path)) return [];
  return fs
    .readFileSync(path, "utf8")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"));
}

function variants(value) {
  const words = value.split(/\s+/).filter(Boolean);
  const noPunctuation = value.replace(/[^\w]/g, "");
  return unique([
    value,
    value.toLowerCase(),
    value.toUpperCase(),
    [...value].reverse().join(""),
    words.toReversed().join(" "),
    value.replaceAll(" ", ""),
    value.replaceAll(" ", "_"),
    value.replaceAll(" ", "-"),
    noPunctuation,
  ]);
}

function keyDerivations(seed, salt) {
  const raw = Buffer.from(seed, "utf8");
  return [
    ["sha256(seed)", crypto.createHash("sha256").update(raw).digest()],
    ["sha256(seed:salthex)", crypto.createHash("sha256").update(`${seed}:${salt.toString("hex")}`).digest()],
    ["sha256(seed:saltbytes)", crypto.createHash("sha256").update(Buffer.concat([raw, Buffer.from(":"), salt])).digest()],
    ["sha256(seed||saltbytes)", crypto.createHash("sha256").update(Buffer.concat([raw, salt])).digest()],
    ["sha256(salthex:seed)", crypto.createHash("sha256").update(`${salt.toString("hex")}:${seed}`).digest()],
    ["sha256(saltbytes:seed)", crypto.createHash("sha256").update(Buffer.concat([salt, Buffer.from(":"), raw])).digest()],
    ["pbkdf2-sha256-1000", crypto.pbkdf2Sync(raw, salt, 1_000, 32, "sha256")],
    ["pbkdf2-sha256-10000", crypto.pbkdf2Sync(raw, salt, 10_000, 32, "sha256")],
  ];
}

function looksPlaintext(buf) {
  const text = buf.toString("utf8");
  if (!text || text.includes("\uFFFD")) return false;
  const printable = [...text].filter((char) => char === "\n" || char === "\r" || char === "\t" || (char >= " " && char <= "~")).length;
  return printable / text.length > 0.9;
}

function decrypt(key, aad) {
  const decipher = crypto.createDecipheriv("aes-256-gcm", key, packed.iv, { authTagLength: 16 });
  if (aad) decipher.setAAD(Buffer.from(aad, "utf8"));
  decipher.setAuthTag(packed.tag);
  return Buffer.concat([decipher.update(packed.ct), decipher.final()]);
}

const decodedHint = rot47(line2);
const activeSeeds = unique(readCandidateFile("challenge2-candidates-active.txt").flatMap(variants));
const extraSeeds = unique([
  decodedHint,
  "Where it all began",
  "Where it all begaN_0mpxB5iVQ",
  "N_0mpxB5iVQ",
  "A drum break might shatter it!",
  "I've got a hole in my pocket.",
  "Half a hole, anyway. I gave the rest to Jeremy.",
  "you-cant-teach-an-old-dog-new-hashes",
  "xWeNeverMadeItToTheMooNx",
].flatMap(variants));

const seeds = unique([...activeSeeds, ...extraSeeds]);

const aadBases = unique([
  "",
  line2,
  decodedHint,
  "challenge2",
  "challenge-2",
  "yellow-submarine",
  "yellow_submarine",
  "Yellow Submarine",
  "yellow-submarine:ringo-hole:v2",
  "yellow-submarine:hole-in-my-pocket:v2",
  "ringo-hole:v2",
  "ringo:hole:v2",
  "N_0mpxB5iVQ",
  "theo:t3:v2",
  "t3dotgg:yellow-submarine:v2",
  "t3dotgg:ringo-hole:v2",
  "dogecoin-simulator:old-dog-hashes:v2",
]);
const aads = unique(aadBases.flatMap(variants));

let attempts = 0;
const hits = [];

for (const seed of seeds) {
  for (const [kdf, key] of keyDerivations(seed, packed.salt)) {
    for (const aad of aads) {
      attempts += 1;
      try {
        const plaintext = decrypt(key, aad);
        if (looksPlaintext(plaintext)) {
          hits.push({ seed, kdf, aad, plaintext: plaintext.toString("utf8") });
        }
      } catch {
        // Authentication failures are expected for wrong seeds/AADs.
      }
    }
  }
}

console.log(
  JSON.stringify(
    {
      layout: "salt16|iv12|ct30|tag16",
      salt: packed.salt.toString("hex"),
      iv: packed.iv.toString("hex"),
      ctLength: packed.ct.length,
      tag: packed.tag.toString("hex"),
      seeds: seeds.length,
      aads: aads.length,
      attempts,
      hits,
    },
    null,
    2,
  ),
);

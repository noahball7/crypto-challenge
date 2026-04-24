import crypto from "node:crypto";
import fs from "node:fs";

const [line1, line2 = ""] = fs.readFileSync("challenge2.txt", "utf8").trim().split(/\n/);
const raw = Buffer.from(line1, "base64");

function rot47(str) {
  return str.replace(/[!-~]/g, (char) =>
    String.fromCharCode(33 + ((char.charCodeAt(0) - 33 + 47) % 94)),
  );
}

function readSshString(buffer, offset) {
  const length = buffer.readUInt32BE(offset);
  const start = offset + 4;
  const end = start + length;
  return [buffer.subarray(start, end), end];
}

function sshEd25519PublicKey(line) {
  const [type, b64] = line.trim().split(/\s+/);
  if (type !== "ssh-ed25519" || !b64) return null;
  const blob = Buffer.from(b64, "base64");
  let offset = 0;
  const [innerType, afterType] = readSshString(blob, offset);
  offset = afterType;
  const [key, afterKey] = readSshString(blob, offset);
  if (afterKey !== blob.length || innerType.toString("utf8") !== "ssh-ed25519" || key.length !== 32) {
    return null;
  }
  return key;
}

function openPgpPackets(buffer) {
  const packets = [];
  let offset = 0;
  while (offset < buffer.length) {
    const tagByte = buffer[offset++];
    if ((tagByte & 0x80) === 0) break;

    let tag;
    let length;
    if ((tagByte & 0x40) !== 0) {
      tag = tagByte & 0x3f;
      const first = buffer[offset++];
      if (first < 192) {
        length = first;
      } else if (first < 224) {
        const second = buffer[offset++];
        length = ((first - 192) << 8) + second + 192;
      } else if (first === 255) {
        length = buffer.readUInt32BE(offset);
        offset += 4;
      } else {
        break;
      }
    } else {
      tag = (tagByte >> 2) & 0x0f;
      const lengthType = tagByte & 0x03;
      if (lengthType === 0) length = buffer[offset++];
      else if (lengthType === 1) {
        length = buffer.readUInt16BE(offset);
        offset += 2;
      } else if (lengthType === 2) {
        length = buffer.readUInt32BE(offset);
        offset += 4;
      } else {
        length = buffer.length - offset;
      }
    }

    packets.push({ tag, body: buffer.subarray(offset, offset + length) });
    offset += length;
  }
  return packets;
}

function readMpi(buffer, offset) {
  if (offset + 2 > buffer.length) return null;
  const bits = buffer.readUInt16BE(offset);
  const length = Math.ceil(bits / 8);
  const start = offset + 2;
  if (start + length > buffer.length) return null;
  return [buffer.subarray(start, start + length), start + length, bits];
}

function openPgpEd25519PublicKeys(armoredOrB64) {
  const body = armoredOrB64.includes("BEGIN PGP")
    ? armoredOrB64
        .split(/\r?\n/)
        .filter((line) => line && !line.startsWith("-----") && !line.includes(":") && !line.startsWith("="))
        .join("")
    : armoredOrB64;
  const packets = openPgpPackets(Buffer.from(body, "base64"));
  const keys = [];

  for (const packet of packets) {
    if (packet.tag !== 6 && packet.tag !== 14) continue;
    const body = packet.body;
    if (body.length < 6 || body[0] !== 4) continue;

    const algorithm = body[5];
    if (algorithm !== 22) continue; // EdDSA legacy OpenPGP algorithm id.

    let offset = 6;
    const curveOidLength = body[offset++];
    offset += curveOidLength;
    if (offset > body.length) continue;
    const qMpi = readMpi(body, offset);
    if (!qMpi) continue;
    const [q] = qMpi;

    // Ed25519 Q is usually encoded as 0x40 || 32-byte native key.
    if (q.length === 33 && q[0] === 0x40) keys.push(q.subarray(1));
    else if (q.length === 32) keys.push(q);
  }

  return keys;
}

function signifyPublicKey(text) {
  const b64 = text
    .split(/\r?\n/)
    .find((line) => line && !line.startsWith("untrusted comment:"));
  if (!b64) return null;
  const decoded = Buffer.from(b64, "base64");
  if (decoded.length !== 42) return null;
  return {
    keyId: decoded.subarray(2, 10).toString("hex"),
    publicKey: decoded.subarray(10),
  };
}

function keyObject(rawKey) {
  const ed25519SpkiPrefix = Buffer.from("302a300506032b6570032100", "hex");
  return crypto.createPublicKey({
    key: Buffer.concat([ed25519SpkiPrefix, rawKey]),
    format: "der",
    type: "spki",
  });
}

function uniqueByHex(entries) {
  const seen = new Set();
  return entries.filter((entry) => {
    const hex = entry.bytes.toString("hex");
    if (seen.has(hex)) return false;
    seen.add(hex);
    return true;
  });
}

async function fetchText(url) {
  const response = await fetch(url, { headers: { "user-agent": "challenge2-ed25519-probe" } });
  if (!response.ok) throw new Error(`${url}: ${response.status}`);
  return response.text();
}

async function main() {
  const gistRaw = await fetchText(
    "https://gist.githubusercontent.com/t3dotgg/6c2771dbf31033a506b632a067cfaf33/raw/d4349ec12052ca672cd6c4f2d0937f12525897a2/theo-puzzle-v2.txt",
  );
  const openbsd78BasePub = await fetchText("https://ftp.openbsd.org/pub/OpenBSD/7.8/openbsd-78-base.pub");
  const openbsd78Patch = await fetchText(
    "https://ftp.openbsd.org/pub/OpenBSD/patches/7.8/common/025_sack.patch.sig",
  );
  const sshKeysText = await fetchText("https://github.com/t3dotgg.keys");
  const gpgKeys = await (await fetch("https://api.github.com/users/t3dotgg/gpg_keys")).json();

  const publicKeys = [];
  for (const [index, line] of sshKeysText.trim().split(/\r?\n/).entries()) {
    const key = sshEd25519PublicKey(line);
    if (key) publicKeys.push({ name: `ssh-ed25519-${index + 1}`, bytes: key });
  }
  for (const gpgKey of gpgKeys) {
    const rawKeys = [
      ...openPgpEd25519PublicKeys(gpgKey.raw_key ?? ""),
      ...openPgpEd25519PublicKeys(gpgKey.public_key ?? ""),
      ...gpgKey.subkeys.flatMap((subkey) => openPgpEd25519PublicKeys(subkey.public_key ?? "")),
    ];
    for (const [index, key] of rawKeys.entries()) {
      publicKeys.push({ name: `gpg-${gpgKey.key_id}-${index + 1}`, bytes: key });
    }
  }
  const openbsdPubkey = signifyPublicKey(openbsd78BasePub);
  if (openbsdPubkey) {
    publicKeys.push({ name: `openbsd-78-base-${openbsdPubkey.keyId}`, bytes: openbsdPubkey.publicKey });
  }

  const signatureCandidates = uniqueByHex([
    { name: "signify-tail-10-74", bytes: raw.subarray(10) },
    { name: "drop-header-2-tail-10-74", bytes: Buffer.concat([Buffer.from("Ed"), raw.subarray(2)]).subarray(10) },
    { name: "first-64", bytes: raw.subarray(0, 64) },
    { name: "offset-2-66", bytes: raw.subarray(2, 66) },
    { name: "offset-8-72", bytes: raw.subarray(8, 72) },
    { name: "last-64", bytes: raw.subarray(-64) },
    { name: "tail-reversed", bytes: Buffer.from([...raw.subarray(10)].reverse()) },
  ]).filter((entry) => entry.bytes.length === 64);

  const decodedHint = rot47(line2);
  const messages = uniqueByHex([
    { name: "gist-raw-exact", bytes: Buffer.from(gistRaw, "utf8") },
    { name: "gist-raw-plus-newline", bytes: Buffer.from(`${gistRaw}\n`, "utf8") },
    { name: "line1-text", bytes: Buffer.from(line1, "utf8") },
    { name: "line1-bytes", bytes: raw },
    { name: "line2-text", bytes: Buffer.from(line2, "utf8") },
    { name: "line2-text-newline", bytes: Buffer.from(`${line2}\n`, "utf8") },
    { name: "line2-rot47", bytes: Buffer.from(decodedHint, "utf8") },
    { name: "line2-rot47-newline", bytes: Buffer.from(`${decodedHint}\n`, "utf8") },
    { name: "video-url", bytes: Buffer.from("https://www.youtube.com/watch?v=N_0mpxB5iVQ", "utf8") },
    { name: "video-id", bytes: Buffer.from("N_0mpxB5iVQ", "utf8") },
    { name: "quote", bytes: Buffer.from("A drum break might shatter it!", "utf8") },
    { name: "openbsd-fix-line", bytes: Buffer.from("if (SEQ_LT(sack.start, tp->snd_una)) continue;", "utf8") },
    { name: "openbsd-fix-line-newline", bytes: Buffer.from("\t\tif (SEQ_LT(sack.start, tp->snd_una))\n\t\t\tcontinue;\n", "utf8") },
    { name: "openbsd-patch-sig-file", bytes: Buffer.from(openbsd78Patch, "utf8") },
    { name: "openbsd-commit", bytes: Buffer.from("0e8206e596add74fef1653b4472de6b3723c435f", "utf8") },
    { name: "gist-id", bytes: Buffer.from("6c2771dbf31033a506b632a067cfaf33", "utf8") },
    { name: "gist-commit", bytes: Buffer.from("b1be8de53dd389f010884f7931601a20364443e6", "utf8") },
    { name: "gist-blob", bytes: Buffer.from("d4349ec12052ca672cd6c4f2d0937f12525897a2", "utf8") },
    { name: "gist-tree", bytes: Buffer.from("cf66aa398e1e3fe085c9e4c3d7fea258532762f6", "utf8") },
    { name: "filename", bytes: Buffer.from("theo-puzzle-v2.txt", "utf8") },
  ]);

  let attempts = 0;
  let hits = 0;
  for (const publicKey of uniqueByHex(publicKeys)) {
    const key = keyObject(publicKey.bytes);
    const fingerprint = crypto.createHash("sha256").update(publicKey.bytes).digest("hex").slice(0, 16);
    for (const signature of signatureCandidates) {
      for (const message of messages) {
        attempts += 1;
        const ok = crypto.verify(null, message.bytes, key, signature.bytes);
        if (ok) {
          hits += 1;
          console.log(
            JSON.stringify({
              hit: true,
              publicKey: publicKey.name,
              fingerprint,
              signature: signature.name,
              message: message.name,
            }),
          );
        }
      }
    }
  }

  console.log(
    JSON.stringify({
      summary: true,
      rawLength: raw.length,
      challengeKeyIdIfSignify: raw.subarray(2, 10).toString("hex"),
      publicKeys: uniqueByHex(publicKeys).map((key) => ({
        name: key.name,
        sha256Prefix: crypto.createHash("sha256").update(key.bytes).digest("hex").slice(0, 16),
      })),
      signatures: signatureCandidates.map((signature) => signature.name),
      messages: messages.map((message) => message.name),
      attempts,
      hits,
    }),
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

import crypto from "node:crypto";
import fs from "node:fs";

const [line1] = fs.readFileSync("challenge2.txt", "utf8").trim().split(/\r?\n/);
const raw = Buffer.from(line1, "base64");
const inverted = Buffer.from(raw.map((byte) => byte ^ 0xff));

if (inverted.length !== 74) {
  throw new Error(`Expected 74 inverted bytes, got ${inverted.length}`);
}

const version = inverted[0];
const salt = inverted.subarray(1, 17);
const iv = inverted.subarray(17, 29);
const tag = inverted.subarray(29, 45);
const ciphertext = inverted.subarray(45);

const seed = "A drum break might shatter it!";
const key = crypto
  .createHash("sha256")
  .update(Buffer.concat([Buffer.from(seed, "utf8"), Buffer.from(":"), salt]))
  .digest();

const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv, {
  authTagLength: 16,
});
decipher.setAuthTag(tag);

const plaintext = Buffer.concat([
  decipher.update(ciphertext),
  decipher.final(),
]).toString("utf8");

console.log(
  JSON.stringify(
    {
      version,
      layout: "v1|salt16|iv12|tag16|ciphertext29",
      seed,
      kdf: "SHA256(seed || ':' || raw_salt)",
      aad: null,
      salt: salt.toString("hex"),
      iv: iv.toString("hex"),
      tag: tag.toString("hex"),
      ciphertext: ciphertext.toString("hex"),
      key: key.toString("hex"),
      plaintext,
    },
    null,
    2,
  ),
);

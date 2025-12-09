import { generateKeyPairSync } from "crypto";
import fs from "fs";
import path from "path";

function generateKeys() {
  const { privateKey, publicKey } = generateKeyPairSync("rsa", {
    modulusLength: 2048, // key size
    publicKeyEncoding: {
      type: "spki",
      format: "pem",
    },
    privateKeyEncoding: {
      type: "pkcs8",
      format: "pem",
    },
  });

  const dir = path.join(process.cwd(), "keys");
  if (!fs.existsSync(dir)) fs.mkdirSync(dir);

  try {
    fs.writeFileSync(path.join(dir, "private.key"), privateKey);
    fs.writeFileSync(path.join(dir, "public.key"), publicKey);
  } catch (error: any) {
    console.error(`[ERROR] [${new Date().toISOString()}] Key generation failed:`, error);
  }

  console.log(`\n[INFO] [${new Date().toISOString()}] RSA key pair generated: ./private.key & ./public.key\n`);
}

generateKeys();

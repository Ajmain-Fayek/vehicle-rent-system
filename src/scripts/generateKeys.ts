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

  try {
    fs.writeFileSync(path.join(process.cwd(), "private.key"), privateKey);
    fs.writeFileSync(path.join(process.cwd(), "public.key"), publicKey);
  } catch (error: any) {
    console.log(error.message);
  }

  console.log("-".repeat(53));
  console.log("\nRSA key pair generated: ./private.key & ./public.key\n");
  console.log("-".repeat(53));
}

generateKeys();

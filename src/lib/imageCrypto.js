import CryptoJS from "crypto-js";

const SECRET = "your-super-secret-key"; // 🔥 move to env later

export const encryptImage = async (file) => {
  const arrayBuffer = await file.arrayBuffer();
  const wordArray = CryptoJS.lib.WordArray.create(arrayBuffer);

  const encrypted = CryptoJS.AES.encrypt(wordArray, SECRET).toString();

  return encrypted; // string
};

export const decryptImage = (encryptedStr) => {
  const bytes = CryptoJS.AES.decrypt(encryptedStr, SECRET);

  const decryptedWords = bytes;
  const uint8Array = new Uint8Array(
    decryptedWords.sigBytes
  );

  for (let i = 0; i < decryptedWords.sigBytes; i++) {
    uint8Array[i] =
      (decryptedWords.words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
  }

  return new Blob([uint8Array]);
};
import * as AES from 'aes-js';

const stringToBytes = AES.utils.utf8.toBytes;
const bytesToString = AES.utils.utf8.fromBytes;

const hexToBytes = AES.utils.hex.toBytes;
const bytesToHex = AES.utils.hex.fromBytes;

export function encrypt (data: any, key: string) {
    const binaryKey = stringToBytes(key.substring(0, 16).padStart(16, "0"));

    const counter = new AES.ModeOfOperation.ctr(binaryKey);
    const encrypted = counter.encrypt(stringToBytes(JSON.stringify(data)));

    return bytesToHex(encrypted);
}

export function decrypt (data: any, key: string) {
    const binaryKey = stringToBytes(key.substring(0, 16).padStart(16, "0"));

    const counter = new AES.ModeOfOperation.ctr(binaryKey);
    const binaryData = hexToBytes(data);

    const decrypted = counter.decrypt(binaryData)

    return JSON.parse(bytesToString(decrypted));
}

export function isClass(v: any) {
    return typeof v === 'function' && /^\s*class\s+/.test(v.toString());
}
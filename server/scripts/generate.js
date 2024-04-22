const { secp256k1 } = require("ethereum-cryptography/secp256k1.js")
const { toHex } = require("ethereum-cryptography/utils")
const { keccak256 } = require("ethereum-cryptography/keccak")

const privateKey = secp256k1.utils.randomPrivateKey()
const publicKey = secp256k1.getPublicKey(privateKey)

console.log("private key: ", toHex(privateKey))
console.log("public key: ", toHex(keccak256(publicKey).slice(-20)))
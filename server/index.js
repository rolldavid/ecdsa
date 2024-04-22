const express = require("express");
const app = express();
const cors = require("cors");
const { secp256k1 } = require("ethereum-cryptography/secp256k1");
const { keccak256 } = require("ethereum-cryptography/keccak")
const { toHex } = require("ethereum-cryptography/utils");
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  "c5c4cfaa093ac8c0fc53cd561bd36ce52b9ee5d6": 100,
  "2f3fc69ca52f09a3aad7e768cc2fe3dc6ebd854e": 50,
  "fd99f4f4d407320a399aa1d5bb985684337da25d": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
 
  const { signature, message, bit, sender, recipient, amount } = req.body

  let sig = secp256k1.Signature.fromCompact(signature)
  sig = sig.addRecoveryBit(bit)
  const publicKey = toHex(keccak256(sig.recoverPublicKey(message).toRawBytes()).slice(-20))

  if (publicKey !== sender) {
    res.status(401).send({ message: "Not your account" });
  }

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }

  res.send({status: "ok"})

});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}

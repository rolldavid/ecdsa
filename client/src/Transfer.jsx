import { keccak256 } from "ethereum-cryptography/keccak";
import { secp256k1 } from "ethereum-cryptography/secp256k1"
import { utf8ToBytes, toHex } from "ethereum-cryptography/utils"
import { useState } from "react";

function Transfer({ address, setBalance, privateKey }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [message, setMessage] = useState("")

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();
    const hashedMsg = toHex(keccak256(utf8ToBytes(message)))
    const rawSig = secp256k1.sign(hashedMsg, privateKey)
    const sigHex = rawSig.toCompactHex()

      try {
        const res = await fetch(`http://localhost:3042/send`, {
          method: "POST",
          body: JSON.stringify({
            amount: parseInt(sendAmount),
            recipient,
            sender: address,
            signature: sigHex,
            message: hashedMsg,
            bit: rawSig.recovery
          }),
          headers: {
            "Content-Type": "application/json"
          }
        });
        const data = await res.json()
        setBalance(data.balance);
      } catch (ex) {
        console.log("ran into an error....oops", ex)
      }
  

  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>
      <label>
        Message
        <input
          placeholder="Hey there..."
          value={message}
          onChange={setValue(setMessage)}
        ></input>
      </label>
      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  )
}

export default Transfer;

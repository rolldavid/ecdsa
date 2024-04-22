import { secp256k1 } from "ethereum-cryptography/secp256k1.js"
import { toHex, utf8ToBytes } from "ethereum-cryptography/utils"
import { keccak256 } from "ethereum-cryptography/keccak"

function Wallet({ address, setAddress, balance, setBalance, privateKey, setPrivateKey }) {

  async function onChange(evt) {
    const privateKey = evt.target.value;
    setPrivateKey(privateKey);
    const address = toHex(keccak256(secp256k1.getPublicKey(privateKey)).slice(-20))
    setAddress(address)
    
    if (address) {
      const res = await fetch(`http://localhost:3042/balance/${address}`);
      const data = await res.json()
      
      setBalance(data.balance);
    } else {
      setBalance(0);
    }
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        Private Key
        <input placeholder="Enter private key" value={privateKey} onChange={onChange}></input>
      </label>
      <div>
        <p>Address: {address}</p>
      </div>

      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;

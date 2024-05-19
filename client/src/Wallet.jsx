import server from "./server";

import { secp256k1 } from "ethereum-cryptography/secp256k1"
import { toHex } from "ethereum-cryptography/utils"

function Wallet({ address, setAddress, balance, setBalance, privateKey, setPrivateKey }) {
  async function onChange(evt) {
    const privateKey = evt.target.value;
    setPrivateKey(privateKey);
    const address = toHex(secp256k1.getPublicKey(privateKey));
    setAddress(address);

    if (address) {
      const {
        data: { balance },
      } = await server.get(`balance/${address}`);
      setBalance(balance);
    } else {
      setBalance(0);
    }
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <div>
        <ul>
          <li>PrivateKey_1: 80838e5758ef1d5d57d2c6ea88ff2120d8be53544d87b954272875b1249abd38</li>
          <li>PublicKey_1: 02a0e32affce1cb666017395cfeff736adc107e02f96dce05ed7fd09afc993e69b</li>
          <br></br>
          <li>PrivateKey_2: 5d42e679465a56ae45ece49697d6845d0bd497f446c2586ff81f117cd7833944</li>
          <li>PublicKey_2: 028fca1afeed3f7e17f52dfefdc9054f589148269ead7ee16d2a1058ec7571afb5</li>
          <br></br>
          <li>PrivateKey_3: f142e9d90e80d49be02eb91b1e01504343983a338d84a342454deec31aa1f856</li>
          <li>PublicKey_3: 029cfd1eb1459432aae99cfc9576619f215d2c158eeb76d27759f2021e13821e8c</li>
        </ul>
      </div>

      <label>
        Private Key
        <input placeholder="Type in a Private Key" value={privateKey} onChange={onChange}></input>
      </label>

      <div>
        Address: {address.slice(0, 10)}...
      </div>

      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;

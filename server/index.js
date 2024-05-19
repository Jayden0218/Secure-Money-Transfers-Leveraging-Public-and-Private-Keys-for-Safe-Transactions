const { secp256k1 } = require('ethereum-cryptography/secp256k1');

const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;


function hexStringToUint8Array(hexString){
  if (hexString.length % 2 !== 0){
    throw "Invalid hexString";
  }
  var arrayBuffer = new Uint8Array(hexString.length / 2);

  for (var i = 0; i < hexString.length; i += 2) {
    var byteValue = parseInt(hexString.substr(i, 2), 16);
    if (isNaN(byteValue)){
      throw "Invalid hexString";
    }
    arrayBuffer[i/2] = byteValue;
  }

  return arrayBuffer;
}

app.use(cors());
app.use(express.json());

const balances = {
  "02a0e32affce1cb666017395cfeff736adc107e02f96dce05ed7fd09afc993e69b": 100,
  "028fca1afeed3f7e17f52dfefdc9054f589148269ead7ee16d2a1058ec7571afb5": 50,
  "029cfd1eb1459432aae99cfc9576619f215d2c158eeb76d27759f2021e13821e8c": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {

  // TODO: get a signature from the client-side application
  // recover the public address from the signature

  const { sender, recipient, amount, oldPrivateKey, oldMessageHash } = req.body;

  // let isSigned = true;

  (async () => {
    // Convert private key to Uint8Array
    const privateKey = hexStringToUint8Array(oldPrivateKey);
    
    // Convert message hash to Uint8Array
    const messageHash = hexStringToUint8Array(oldMessageHash);

    // Generate the public key from the private key
    const publicKey = secp256k1.getPublicKey(privateKey);

    // Sign the message hash with the private key
    const signature = secp256k1.sign(messageHash, privateKey);

    // Example of Wrong Public Key:

    // const newpublicKey = new Uint8Array ([
    //     2, 156, 253,  30, 177,  69, 148,  50,
    //   170, 233, 156, 252, 149, 118,  97, 159,
    //   33,  93,  44,  21, 142, 235, 118, 210,
    //   119,  89, 242,   2,  30,  19, 130,  30,
    //   140
    // ])
    // console.log(toHex(publicKey))
    // console.log(toHex(newpublicKey))

    // Verify the signature with the message hash and public key
    isSigned = secp256k1.verify(signature, messageHash, publicKey);
  })();

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else if (isSigned === false) {
      res.status(400).send({ message: "It is not authorized" });
  } else {
      balances[sender] -= amount;
      balances[recipient] += amount;
      res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}

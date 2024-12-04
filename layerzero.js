
const { Web3 } = require("web3");
require("dotenv").config();

const { abi: layerZeroABI } = require("./layerzero.json");

const web3 = new Web3(process.env.BASE_RPC);
web3.eth.accounts.wallet.add(process.env.PRIVATE_KEY);

const layerzeroContract = new web3.eth.Contract(
  layerZeroABI,
  process.env.ARBITRUM_LAYER_ADDRESS
);

const account = web3.eth.accounts.privateKeyToAccount(process.env.PRIVATE_KEY);
// Base Mainnet: 30184
// Arbitrum Mainnet: 30110
async function sendMsg() {
  let byteData = await layerzeroContract.methods
    .send(
      30184,
      "Test Message",
      "0x00030100110100000000000000000000000000030d40"
    )
    .encodeABI();
  console.log("returned data: ", byteData);
  const gasPrice = await web3.eth.getGasPrice();
  const tx = {
    from: account.address,
    to: process.env.ARBITRUM_LAYER_ADDRESS,
    value: 191514376000000,
    data: byteData,
    gasLimit: 400000,
    //   gasPrice: gasPrice * BigInt(2),
    maxFeePerGas: 120000000,
    maxPriorityFeePerGas: 120000000,
    type: BigInt(2),
  };

  console.log("tx=>>>>>>>>>>", tx);
  const signedTransaction = await web3.eth.accounts.signTransaction(
    tx,
    process.env.PRIVATE_KEY
  );
  console.log("signedTransaction=>>>>>>>>>>", signedTransaction);
  const receipt = await web3.eth.sendSignedTransaction(signedTransaction.rawTransaction);
  // const receipt = await web3.eth.sendTransaction(tx);
  console.log("Receipt:", receipt);
  console.log("txHash:", receipt.transactionHash);
}

sendMsg();

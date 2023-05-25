require("dotenv").config();
const API_URL = process.env.API_URL;

const PUBLIC_KEY = process.env.PUBLIC_KEY;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(API_URL);

const contract = require("../artifacts/contracts/NFT.sol/MyNFT.json");

// console.log(JSON.stringify(contract.abi));

const contractAddress = "0xc336b1b49F35878C06F8A336cB320931207801Ea";
const nftContract = new web3.eth.Contract(contract.abi, contractAddress);
//create transaction
async function mintNFT(tokenURI) {
  const nonce = await web3.eth.getTransactionCount(PUBLIC_KEY, "latest"); //get latest nonce

  //the transaction
  const tx = {
    from: PUBLIC_KEY,
    to: contractAddress,
    nonce: nonce,
    gas: 500000,
    data: nftContract.methods.mintNFT(PUBLIC_KEY, tokenURI).encodeABI(),
  };

  const signPromise = web3.eth.accounts.signTransaction(tx, PRIVATE_KEY);
  signPromise
    .then((signedTx) => {
      web3.eth.sendSignedTransaction(
        signedTx.rawTransaction,
        function (err, hash) {
          if (!err) {
            console.log(
              "The hash of your transaction is: ",
              hash,
              "\nCheck Alchemy's Mempool to view the status of your transaction!"
            );
          } else {
            console.log(
              "Something went wrong when submitting your transaction:",
              err
            );
          }
        }
      );
    })
    .catch((err) => {
      console.log(" Promise failed:", err);
    });
}
mintNFT(
  //   "https://gateway.pinata.cloud/ipfs/QmR9cmeToyY7paebR5F2CYyoPKq7CjJN33onExP2KtJTvU"
  // "https://gateway.pinata.cloud/ipfs/Qmbo3P5z7gjt4udZ4apyNoENsXU3tej2RwiGjT1q2XQw7P"
  "https://gateway.pinata.cloud/ipfs/Qmb8RuU4CH5R3hbPpqDvJwfbMREGCQC4xfvR9ZiysCFwsh?_gl=1*14fsrca*rs_ga*OTk0N2UxMGEtZTgyZC00OTE2LTkxMTUtNWU1OGZiMTlhMGY4*rs_ga_5RMPXG14TE*MTY4MzYyNjAyMi4xLjEuMTY4MzYyNjAyNS41Ny4wLjA."
);

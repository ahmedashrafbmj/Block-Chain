const SHA256 = require("crypto-js/sha256");
const prompt = require("prompt-sync")();

function calculateHash({ previousHash, timestamp, data, nonce = 1 }) {
  return SHA256(
    previousHash + timestamp + JSON.stringify(data) + nonce
  ).toString();
}

// The first block of a Blockchain is called “The Genesis Block”
function generateGenesisBlock() {
  const block = {
    timestamp: +new Date(),
    data: "Genesis Block",
    previousHash: "0",
  };
  return {
    ...block,
    hash: calculateHash(block),
  };
}
function checkDifficulty(difficulty, hash) {
  return hash.substr(0, difficulty) === "0".repeat(difficulty);
}
function nextNonce(block) {
  return updateHash({ ...block, nonce: block.nonce + 1 });
}
// Takes the block and returns a new version of it with a new hash
function updateHash(block) {
  return { ...block, hash: calculateHash(block) };
}
// recursive function that calculates the hash of our block until it respects the imposed constraints.
function trampoline(func) {
  let result = func;
  while (result && typeof result === "function") {
    result = result();
  }
  return result;
}
function mineBlock(difficulty, block) {
  function mine(block) {
    const newBlock = nextNonce(block);
    return checkDifficulty(difficulty, newBlock.hash)
      ? newBlock
      : () => mine(nextNonce(block));
  }
  return trampoline(mine(nextNonce(block)));
}
function addBlock(chain, data) {
  const { hash: previousHash } = chain[chain.length - 1];
  const block = { timestamp: +new Date(), data, previousHash, nonce: 0 };
  const newBlock = mineBlock(4, block);
  return chain.concat(newBlock);
}
function validateChain(chain) {
  function tce(chain, index) {
    if (index === 0) return true;
    const { hash, ...currentBlockWithoutHash } = chain[index];
    const currentBlock = chain[index];
    const previousBlock = chain[index - 1];
    const isValidHash = hash === calculateHash(currentBlockWithoutHash);
    const isPreviousHashValid =
      currentBlock.previousHash === previousBlock.hash;
    const isValidChain = isValidHash && isPreviousHashValid;
    if (!isValidChain) return false;
    else return tce(chain, index - 1);
  }
  return tce(chain, chain.length - 1);
}
let chain = [generateGenesisBlock()];
const newBlockData = {
  sender: "ks829fh28192j28d9dk9",
  receiver: "ads8d91w29jsm2822910",
  amount: 0.0023,
  currency: "BTC",
};
const newBlockData1 = {
  sender: "ks829fh28192j28d9dk9",
  receiver: "ads8d91w29jsm2822910",
  amount: 0.0055,
  currency: "ETH",
};

const newChain = addBlock(chain, newBlockData);
const newChain1 = addBlock(newChain, newBlockData1);
// console.log(newChain1);
let addressOfReceiver = prompt("Enter a receiver address = ");
let addressOfSender = prompt("Enter a sender address = ");
let amount = prompt("Enter amount = ");
let currency = prompt("Enter currency = ");
const newBlockData2 = { 
  sender: addressOfSender,
  receiver: addressOfReceiver,
  amount: amount,
  currency: currency,
};
console.log("User 1 data = ");
console.log(newBlockData2);
const receiver = {
  sender: addressOfReceiver,
  receiver: addressOfSender,
  amount: amount,
  currency: currency,
  WalletAmount:amount

};
console.log("User 2 data = ");
console.log(receiver);
// console.log(" ");
console.log(addBlock(newChain1, newBlockData2));
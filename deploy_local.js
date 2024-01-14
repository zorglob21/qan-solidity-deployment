const { ethers, JsonRpcProvider } = require('ethers');
const fs = require("fs-extra");
require("dotenv").config();

async function main() {

  const provider = new ethers.JsonRpcProvider(

  //"http://rpc.qanx.live:8545/"
  "https://sepolia.infura.io/v3/"+process.env.INFURA_API_KEY

  );
  let wallet = new ethers.Wallet(
    process.env.HARDHAT_KEY, // put this in an env variable
    provider
  );

  wallet = await wallet.connect(provider);
  const abi = fs.readFileSync("./bin/_contracts_qandog_sol_Qankey.abi", "utf8");
  const binary = fs.readFileSync("./bin/_contracts_qandog_sol_Qankey.bin", "utf8");

  const contractFactory = new ethers.ContractFactory(abi, binary, wallet);
  console.log("Start deployment!");
  

  const nonce = await provider.getTransactionCount("PASTE ADDRESS");
  console.log(nonce)

  // Set optimization settings
  const overrides = {
      gasPrice: '90000000000', // Adjust the gas price accordingly
      gasLimit: '10000000', // Adjust the gas limit accordingly
      // Enable Solidity optimizer
      nonce: nonce,
      optimizer: {
        enabled: true,
        runs: 200, // Number of runs for the optimizer (adjust as needed)
      },
    };
  
  const contract = await contractFactory.deploy(overrides);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

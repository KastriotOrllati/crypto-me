const connectWalletHandler = () => {
  if (window.ethereum) {
    console.log("hello");
  } else {
    console.log("install metamask");
  }
};

// async function getTotalDonations() {
//   const provider = new ethers.providers.Web3Provider(window.ethereum);
//   const contract = new ethers.Contract(
//     donationContractAddress,
//     Donation.abi,
//     provider
//   );

//   try {
//     const data = await contract.getTotalDonations();
//     console.log("data:", data);
//   } catch (err) {
//     console.log("error:", err);
//   }
// }

// async function initiateConnection() {
//   try {
//     const accounts = await ethereum.request({
//       method: "eth_requestAccounts",
//     });
//     const account = accounts[0];
//     setMetaAccount(account);
//   } catch (err) {
//     console.log(err);
//   }
// }
// async function connect() {
//   if (typeof window.ethereum !== "undefined") {
//     try {
//       await ethereum.request({ method: "eth_requestAccounts" });
//     } catch (error) {
//       console.log(error);
//     }
//     // connectButton.innerHTML = "Connected";
//     const accounts = await ethereum.request({ method: "eth_accounts" });
//     console.log(accounts);
//     // const provider = new ethers.providers.Web3Provider(window.ethereum);
//     // const signer = provider.getSigner();
//     // console.log(signer.getAddress(), "signer");
//   } else {
//     // connectButton.innerHTML = "Please install MetaMask";
//   }
// }

async function connect() {
  const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
  // Prompt user for account connections
  await provider.send("eth_requestAccounts", []);
  const signer = provider.getSigner();
  console.log("Account:", await signer.getAddress());
}

async function transferFunds() {
  try {
    ethereum
      .request({
        method: "eth_sendTransaction",
        params: [
          {
            nonce: "0x00",
            from: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
            to: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
            value: "0x29a2241af62c0000",
          },
        ],
      })
      .then((txHash) => console.log(txHash));
  } catch (err) {
    console.log(err);
  }
}

const ownerAddress = " 0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266 ";
const goal = 2;
async function createFundraiser() {
  console.log(`Creating fundraiser...`);
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    // await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    console.log(signer, "signer");
    const contract = new ethers.Contract(
      donationContractAddress,
      CrowdFunding.abi,
      signer
      // "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266"
    );
    try {
      const transactionResponse = await contract.newCampaign(
        // "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266",
        signer.getAddress(),
        goal
      );
      await transactionResponse.wait();
      await listenForTransactionMine(transactionResponse, provider);
      console.log(transactionResponse, "transactionresponse");
      // const data = await contract.callStatic.getID();
      // console.log(data, "data");
      // console.log(contract, " contract");
      // const data = await contract.getID("5");
    } catch (error) {
      console.log(error);
    }
  } else {
    //  withdrawButton.innerHTML = "Please install MetaMask";
    console.log("installl metamask");
  }
}

function listenForTransactionMine(transactionResponse, provider) {
  console.log(`Mining ${transactionResponse.hash}`);
  return new Promise((resolve, reject) => {
    provider.once(transactionResponse.hash, (transactionReceipt) => {
      console.log(
        `Completed with ${transactionReceipt.confirmations} confirmations. `
      );
      resolve();
    });
  });
}

// async function getStatus() {
//   const check = await contract.checkGoalReached(
//     // "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266",
//     // signer.getAddress(),
//     1
//   );
//   await check.wait();
//   // await listenForTransactionMine(check);
//   console.log(check, "transactionresponse");
// }
// async function getStatus() {
//   if (typeof window.ethereum !== "undefined") {
//     const provider = new ethers.providers.Web3Provider(window.ethereum);
//     // await provider.send("eth_requestAccounts", []);
//     const signer = provider.getSigner();
//     console.log(signer, "signer");
//     const contract = new ethers.Contract(
//       donationContractAddress,
//       CrowdFunding.abi,
//       signer
//       // "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266"
//     );

//     const data = await contract.checkGoalReached(2);
//     console.log("data", data);
//   }
// }
async function getStatus() {
  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    // await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    console.log(signer, "signer");
    const contract = new ethers.Contract(
      donationContractAddress,
      CrowdFunding.abi,
      signer
    );
    console.log(contract, " contract");
    const data = await contract.getID().callStatic();
    // const data = await contract
    await data.wait();
    console.log("data", data);
    // let data = await contract.getID("3");
    // console.log(data, "data");
  } catch (error) {
    console.log(error);
  }
}

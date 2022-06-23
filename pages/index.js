import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import FundraiserCard from "../components/card/fundraisercard";
// import Donation from "./artifacts/contracts/Donation.sol/Donation.json";
// import CrowdFunding from "./artifacts/contracts/Crowdfunding.sol/CrowdFunding.json";
import CrowdFund from "./artifacts/contracts/Crowdfund.sol/Crowdfund.json";
import styles from "../styles/Home.module.css";
import { Grid } from "@nextui-org/react";
import Web3Modal from "web3modal";
import WalletConnect from "@walletconnect/web3-provider";
import CoinbaseWalletSDK from "@coinbase/wallet-sdk";

export default function Home() {
  const [fundraisers, setFundraisers] = useState([]);
  const contractAddress = "0x5fbdb2315678afecb367f032d93f642f64180aa3";
  useEffect(() => {
    getAllCampaigns();
  }, []);

  async function getAllCampaigns() {
    const provider = new ethers.providers.JsonRpcProvider();
    const signer = provider.getSigner();
    const contract = new ethers.Contract(
      contractAddress,
      CrowdFund.abi,
      signer
    );
    const data = await contract.getAllCampaign();
    // console.log(data);
    const items = await Promise.all(
      data.map(async (item) => {
        // let goal = ethers.utils.formatUnits(item.fundingGoal.toString(), 'ether')
        let fundraiser = {
          goal: item.fundingGoal.toNumber(),
          imageURL: item.imageURL.toString(),
          beneficiary: item.beneficiary,
          description: item.description,
          title: item.title,
          funders: item.funders,
          amount: ethers.utils.formatEther(item.amount),
          numFunders: item.numFunders.toNumber(),
        };
        return fundraiser;
      })
    );
    setFundraisers(items);
  }
  console.log(fundraisers, "fundraisers");
  async function createCampaign() {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(
      contractAddress,
      CrowdFund.abi,
      signer
    );
    try {
      const transaction = await contract.newCampaign(
        signer.getAddress(),
        12,
        "Food for all",
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
        "https://images.pexels.com/photos/6646917/pexels-photo-6646917.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
      );
      await transaction.wait();
      getAllCampaigns();
      console.log(transaction, "transaction");
      console.log(contract, "contract");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className={styles.container}>
      <Grid.Container gap={2} justify="center" className={styles.grid}>
        {fundraisers.map((fundraiser, index) => (
          <Grid xs={12} sm={4} key={index}>
            <FundraiserCard
              beneficiary={fundraiser.beneficiary}
              amount={fundraiser.amount}
              goal={fundraiser.goal}
              numFunders={fundraiser.numFunders}
              title={fundraiser.title}
              imageURL={fundraiser.imageURL}
              id={index}
            />
          </Grid>
        ))}
      </Grid.Container>
      <button onClick={() => createCampaign()}>createCampaign</button>
    </div>
  );
}
// <h1>hello</h1>

// hello <h1>ASDHASDHASH</h1>
// <div>{metaAccount}</div>
// <button onClick={() => createFundraiser()}>Create Fundraiser</button>
// <button onClick={() => getStatus()}>Total donations</button>

// <div>
//   <button onClick={() => connect()}>Connect</button>
//   <button onClick={() => createCampaign()}>Create Campaign</button>
//   <button onClick={() => getAll()}>Get all</button>
//   <button onClick={() => donate()}>donate</button>
//   <button onClick={() => getSpecificFunder()}>getSpecificFunder</button>
//   <button onClick={() => getTotalFunders()}>getTotalFunders</button>
//   <button onClick={() => checkGoalReached()}>checkGoalReached</button>
//   <button onClick={() => getCampaign()}>getCampaign</button>
//   <button onClick={() => getAllCampaigns()}>getAllCampaign</button>
// </div>

// const web3Modal = new Web3Modal();
// const connection = await web3Modal.connect();
// const provider = new ethers.providers.Web3Provider(connection);
// const signer = provider.getSigner();
// const address = signer.getAddress();
// // address.wait();
// console.log(
//   address.then((res) => console.log(res, "finally address")),
//   "account from homepage"
// );

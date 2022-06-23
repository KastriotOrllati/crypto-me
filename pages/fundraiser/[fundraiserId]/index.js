import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { contractAddress } from "../../../config";

import { ethers } from "ethers";
import CrowdFund from "../../artifacts/contracts/Crowdfund.sol/Crowdfund.json";
import Web3Modal from "web3modal";

import Image from "next/image";
import styles from "./index.module.css";
import { Progress, Button, Spacer, Input, Table } from "@nextui-org/react";

console.log(contractAddress);

function Fundraiser(props) {
  console.log(props, "props");
  const [donation, setDonation] = useState(0);

  const {
    amount,
    beneficiary,
    description,
    goal,
    imageURL,
    numFunders,
    title,
  } = props.res;

  const router = useRouter();
  const refreshData = () => {
    router.replace(router.asPath);
  };
  const id = router.query.fundraiserId;

  async function donate() {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(
      contractAddress,
      CrowdFund.abi,
      signer
    );
    console.log(signer, "signer");

    try {
      const transaction = await contract.contribute(
        // "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
        // signer.getAddress(),
        id,
        { value: ethers.utils.parseEther(donation) }
      );
      // console.log(t)
      // const deposit = await transaction.deposit({ value: 1 });
      await transaction.wait();
      setDonation(0);
      refreshData();
      // window.location.reload();
      console.log(transaction, "transaction");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div style={{ marginTop: "100px" }} className={styles.mainContainer}>
      <div className={styles.leftContainer}>
        <div className={styles.information}>
          <h1>{title}</h1>
          <div className={styles.imageContainer}>
            <Image
              src={imageURL}
              layout="fill"
              objectFit="cover"
              quality={100}
              alt="BackgroundImage"
              className={styles.background}
              loading="lazy"
            />
          </div>
          <h3>Beneficiary: {beneficiary}</h3>
          <p>{description}</p>
        </div>
      </div>
      <div className={styles.rightContainer}>
        <div className={styles.details}>
          <div>
            {amount} ETH raised of {goal} ETH goal.
          </div>
          <Progress
            color="primary"
            value={(parseFloat(amount) * 100) / goal}
            striped
            status="primary"
          />
          {numFunders} donations
          <Spacer y={1} />
        </div>
        <div className={styles.buttons}>
          <Input
            width="45%"
            labelPlaceholder="Amount"
            labelRight="ETH"
            status="primary"
            onChange={(e) => setDonation(e.target.value)}
          />
          <Spacer y={1} />

          <Button size="lg" onClick={() => donate()}>
            Donate
          </Button>
        </div>
      </div>
      <Table
        aria-label="Example table with static content"
        css={{
          height: "auto",
          minWidth: "100%",
        }}
      >
        <Table.Header>
          <Table.Column>Address</Table.Column>
          <Table.Column>Amount</Table.Column>
        </Table.Header>
        <Table.Body>
          {props.funders.map((funder, index) => (
            <Table.Row key={index}>
              <Table.Cell>{funder.address}</Table.Cell>
              <Table.Cell>{funder.amount} ETH</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </div>
  );
}

export async function getServerSideProps(context) {
  const { fundraiserId } = context.params;

  const provider = new ethers.providers.JsonRpcProvider();
  const signer = provider.getSigner();
  const contract = new ethers.Contract(contractAddress, CrowdFund.abi, signer);

  const data = await contract.campaigns(fundraiserId);
  const formattedData = {
    imageURL: data.imageURL.toString(),
    beneficiary: data.beneficiary,
    description: data.description,
    title: data.title,
    funders: data.funders,
    amount: ethers.utils.formatEther(data.amount),
    numFunders: data.numFunders.toNumber(),
    goal: data.fundingGoal.toNumber(),
  };

  const items = await contract.getAllFunders(fundraiserId);
  const fixedData = await Promise.all(
    items.map(async (item) => {
      let funder = {
        address: item.addr,
        amount: ethers.utils.formatEther(item.amount),
      };
      return funder;
    })
  );
  // console.log(items, "funders");

  // const [res, funders] = await Promise.all
  let res = JSON.parse(JSON.stringify(formattedData));
  let funders = JSON.parse(JSON.stringify(fixedData));

  return {
    props: {
      res: res,
      funders: funders,
    },
  };
  // return { props: { res: JSON.parse(JSON.stringify(res)), funders: funders || null }
}
export default Fundraiser;

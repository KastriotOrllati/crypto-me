import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { contractAddress } from "../../../config";

import { ethers } from "ethers";
import CrowdFund from "../../artifacts/contracts/Crowdfund.sol/Crowdfund.json";

import Image from "next/image";
import styles from "./index.module.css";
console.log(contractAddress);

function Fundraiser(props) {
  // const data = props.data;
  console.log(props.res, "props");
  const {
    amount,
    beneficiary,
    description,
    goal,
    imageURL,
    numFunders,
    title,
  } = props.res;
  const [fundraiser, setFundraisers] = useState({});

  const router = useRouter();
  const id = router.query.fundraiserId;

  return (
    <div style={{ marginTop: "100px" }} className={styles.mainContainer}>
      <div className={styles.leftContainer}>
        <div className={styles.information}>
          <h1>{title}</h1>
          <div className={styles.imageContainer}>
            <Image
              src={props.res.imageURL}
              layout="fill"
              // width={"100%"}
              // height={400}
              objectFit="cover"
              quality={100}
              alt="BackgroundImage"
              className={styles.background}
              loading="lazy"
            />
          </div>
        </div>
      </div>
      <div className={styles.rightContainer}>
        <h1>hello</h1>
      </div>
    </div>
  );
}

// export async function getServerSideProps({ params })
export async function getServerSideProps(context) {
  const { fundraiserId } = context.params;

  const provider = new ethers.providers.JsonRpcProvider();
  const signer = provider.getSigner();
  const contract = new ethers.Contract(contractAddress, CrowdFund.abi, signer);

  const data = await contract.campaigns(fundraiserId);
  const res = {
    imageURL: data.imageURL.toString(),
    beneficiary: data.beneficiary,
    description: data.description,
    title: data.title,
    funders: data.funders,
    amount: data.amount.toNumber(),
    numFunders: data.numFunders.toNumber(),
    goal: data.fundingGoal.toNumber(),
  };

  return { props: { res: JSON.parse(JSON.stringify(res)) || null } };
}

export default Fundraiser;

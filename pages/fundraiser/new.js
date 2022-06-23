import React, { useState } from "react";
import { Input, Grid, Textarea, Button } from "@nextui-org/react";
import { contractAddress } from "../../config";
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import CrowdFund from "../artifacts/contracts/Crowdfund.sol/Crowdfund.json";

function New(props) {
  const [beneficiary, setBeneficiary] = useState("");
  const [title, setTitle] = useState("");
  const [goal, setGoal] = useState(0);
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");

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
        beneficiary,
        goal,
        title,
        description,
        image
      );
      await transaction.wait();
      //   getAllCampaigns();
      console.log(transaction, "transaction");
      console.log(contract, "contract");
    } catch (error) {
      console.log(error);
    }
  }

  //images.pexels.com/photos/6646917/pexels-photo-6646917.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1

  return (
    <div style={{ marginTop: "100px" }}>
      <Grid.Container
        gap={4}
        style={{ display: "flex", flexFlow: "column" }}
        justify="center"
        alignItems="center"
      >
        <Grid>
          <Input
            bordered
            labelPlaceholder="Beneficiary"
            color="primary"
            width={"30vw"}
            onChange={(e) => setBeneficiary(e.target.value)}
          />
        </Grid>
        <Grid>
          <Input
            bordered
            labelPlaceholder="Title"
            color="primary"
            width={"30vw"}
            onChange={(e) => setTitle(e.target.value)}
          />
        </Grid>
        <Grid>
          <Input
            bordered
            labelPlaceholder="Goal"
            color="primary"
            width={"30vw"}
            labelRight="ETH"
            onChange={(e) => setGoal(e.target.value)}
          />
        </Grid>
        <Grid>
          <Textarea
            bordered
            labelPlaceholder="Description"
            color="primary"
            rows={5}
            width={"30vw"}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Grid>
        <Grid>
          <Input
            bordered
            labelPlaceholder="Image Url"
            color="primary"
            width={"30vw"}
            onChange={(e) => setImage(e.target.value)}
          />
        </Grid>
        <Grid>
          <Button size="lg" onClick={() => createCampaign()}>
            Create Fundraiser
          </Button>
        </Grid>
      </Grid.Container>
    </div>
  );
}

export default New;

import React from "react";
import Link from "next/link";
import { Card, Col, Row, Button, Text } from "@nextui-org/react";

function FundraiserCard({
  beneficiary,
  amount,
  goal,
  numFunders,
  title,
  imageURL,
  id,
}) {
  const truncateAddress = (address) => {
    if (!address) return "No Account";
    const match = address.match(
      /^(0x[a-zA-Z0-9]{2})[a-zA-Z0-9]+([a-zA-Z0-9]{2})$/
    );
    if (!match) return address;
    return `${match[1]}…${match[2]}`;
  };

  return (
    <Card css={{ w: "100%", h: "400px" }}>
      <Card.Header
        css={{
          position: "absolute",
          zIndex: 1,

          bgBlur: "rgba(2, 169, 92, 0.8)",
        }}
      >
        <Col>
          <Text size={12} weight="bold" transform="uppercase" color="white">
            Beneficiary: {truncateAddress(beneficiary)}
          </Text>
          <Text h3 color="white">
            {title}
          </Text>
        </Col>
      </Card.Header>
      <Card.Body css={{ p: 0 }}>
        <Card.Image
          src={imageURL}
          objectFit="cover"
          width="100%"
          height="100%"
          alt="Relaxing app background"
        />
      </Card.Body>
      <Card.Footer
        isBlurred
        css={{
          position: "absolute",
          bgBlur: "rgba(2, 169, 92, 1)",
          borderTop: "$borderWeights$light solid $gray800",
          bottom: 0,
          zIndex: 1,
        }}
      >
        <Row>
          <Col>
            <Row>
              <Col>
                <Text color="#d1d1d1" size={16}>
                  Amount: {amount}
                </Text>
                <Text color="#d1d1d1" size={18}>
                  Goal: {goal} eth.
                </Text>
              </Col>
            </Row>
          </Col>
          <Col>
            <Row justify="flex-end">
              <Col>
                <Text color="#d1d1d1" size={16}>
                  Funders: {numFunders}
                </Text>
              </Col>
              <Col>
                <Link href={{ pathname: `/fundraiser/${id}` }} passHref>
                  <Button
                    flat
                    auto
                    rounded
                    // css={{ color: "#94f9f0", bg: "#94f9f026" }}
                  >
                    <Text
                      css={{ color: "inherit" }}
                      size={12}
                      weight="bold"
                      transform="uppercase"
                    >
                      Details
                    </Text>
                  </Button>
                </Link>
              </Col>
            </Row>
          </Col>
        </Row>
      </Card.Footer>
    </Card>
  );
}

export default FundraiserCard;

// <Col span={3}>
//   <Card.Image
//     src="https://nextui.org/images/breathing-app-icon.jpeg"
//     css={{ bg: "black", br: "50%" }}
//     height={40}
//     width={40}
//     alt="Breathing app icon"
//   />
// </Col>

import React from "react";
import { NextPage } from "next";
import { Card, CardHeader, CardBody, Divider, Link } from "@nextui-org/react";
import Blackjack from "@feature/Blackjack";

const Home: NextPage = () => {

  return (
    <div className="flex flex-col items-center justify-center my-3 mt-9">
      <Card className="flex justify-center w-[90%] mb-5">
        <CardHeader>
          <Link href="/">
            <h3 className="text-lg font-bold">Blackjack</h3>
          </Link>
        </CardHeader>

        <Divider />

        <CardBody className="pt-3">
          <Blackjack />
        </CardBody>
      </Card>

    </div>
  );
};

export default Home;

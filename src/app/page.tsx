"use client";

import { useState } from "react";
import CounterContract from "../abi/Counter.json";
import { ethers } from "ethers";

const counterAddress: string = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
const abi = CounterContract.abi;

export default function Home() {
  const [connected, setConnected] = useState<string>("Connect to a wallet");
  const [count, setCount] = useState<string>("");
  const handleConnexion = async () => {
    if (typeof window.ethereum != "undefined") {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      setConnected("You are connected!");
    } else {
      setConnected("You need to install metamask");
    }
  };
  const getCount = async () => {
    if (typeof window.ethereum != "undefined") {
      //connect to BC using ethers provider
      const provider = new ethers.BrowserProvider(window.ethereum);
      // set signer to interact with BC
      const signer = await provider.getSigner();
      // set interaction btw contrat abi and address
      const contract: ethers.Contract = new ethers.Contract(
        counterAddress,
        abi,
        signer
      );
      console.log("contract", contract);

      try {
        const data = await contract.getCount();
        setCount(data.toString());
      } catch (err) {
        console.log("error getting count:", err);
      }
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <h1 className="text-emerald-800 text-xl font-extrabold text-center mb-5">
        Here is a testing app for accessing a solidity contract and its
        functions
      </h1>
      <h2> For testing please connect below</h2>
      <div className="mb-32 grid text-center lg:mb-0 lg:w-full lg:max-w-5xl lg:grid-cols-4 lg:text-left">
        <button
          onClick={handleConnexion}
          className="group rounded-lg border border-emerald-300 m-6 px-5 py-4 bg-gray-100 text-emerald-800 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
        >
          {connected}
        </button>
        <h2>Try getting count below</h2>
        <button
          onClick={getCount}
          className="group rounded-lg border border-emerald-300 m-6 px-5 py-4 bg-gray-100 text-emerald-800 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
        >
          Get count{" "}
        </button>
        {count ? (
          <p>
            Here is the count from our solidity contract : <b>{count}</b>
          </p>
        ) : null}
      </div>
    </main>
  );
}

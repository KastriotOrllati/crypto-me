import React, { useEffect, useState } from "react";
import styles from "./navbar.module.css";
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import WalletConnect from "@walletconnect/web3-provider";
import CoinbaseWalletSDK from "@coinbase/wallet-sdk";
import { Text } from "@nextui-org/react";
import Link from "next/link";
const providerOptions = {
  walletlink: {
    package: CoinbaseWalletSDK, // Required
    options: {
      appName: "Web 3 Modal Demo", // Required
      // infuraId: process.env.INFURA_KEY, // Required unless you provide a JSON RPC url; see `rpc` below
    },
  },
  walletconnect: {
    package: WalletConnect, // required
    options: {
      // infuraId: process.env.INFURA_KEY, // required
      infuraId: "27e484dcd9e3efcfd25a83a78777cdf1",
    },
  },
};

// const web3Modal = new Web3Modal({
//   cacheProvider: true, // optional
//   providerOptions, // required
// });

function Navbar(props) {
  const [provider, setProvider] = useState();
  const [library, setLibrary] = useState();
  const [account, setAccount] = useState();
  const [signature, setSignature] = useState("");
  const [error, setError] = useState("");
  const [chainId, setChainId] = useState();
  const [network, setNetwork] = useState();
  const [message, setMessage] = useState("");
  const [signedMessage, setSignedMessage] = useState("");
  const [verified, setVerified] = useState();
  const [web3Modal, setWeb3Modal] = useState(0);
  // let web3Modal;
  useEffect(() => {
    // web3Modal =
    setWeb3Modal(
      new Web3Modal({
        cacheProvider: true, // optional
        providerOptions, // required
      })
    );
  }, []);

  const connectWallet = async () => {
    try {
      // const provider = new ethers.providers.JsonRpcProvider();
      const provider = await web3Modal.connect();
      const library = new ethers.providers.Web3Provider(provider);
      const accounts = await library.listAccounts();
      const network = await library.getNetwork();
      setProvider(provider);
      setLibrary(library);
      if (accounts) setAccount(accounts[0]);
      setChainId(network.chainId);
    } catch (error) {
      setError(error);
    }
  };
  console.log(account, "account");

  const handleNetwork = (e) => {
    const id = e.target.value;
    setNetwork(Number(id));
  };

  const handleInput = (e) => {
    const msg = e.target.value;
    setMessage(msg);
  };

  const switchNetwork = async () => {
    try {
      await library.provider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: toHex(network) }],
      });
    } catch (switchError) {
      if (switchError.code === 4902) {
        try {
          await library.provider.request({
            method: "wallet_addEthereumChain",
            params: [networkParams[toHex(network)]],
          });
        } catch (error) {
          setError(error);
        }
      }
    }
  };

  const signMessage = async () => {
    if (!library) return;
    try {
      const signature = await library.provider.request({
        method: "personal_sign",
        params: [message, account],
      });
      setSignedMessage(message);
      setSignature(signature);
    } catch (error) {
      setError(error);
    }
  };

  const verifyMessage = async () => {
    if (!library) return;
    try {
      const verify = await library.provider.request({
        method: "personal_ecRecover",
        params: [signedMessage, signature],
      });
      setVerified(verify === account.toLowerCase());
    } catch (error) {
      setError(error);
    }
  };

  const refreshState = () => {
    setAccount();
    setChainId();
    setNetwork("");
    setMessage("");
    setSignature("");
    setVerified(undefined);
  };

  const disconnect = async () => {
    await web3Modal.clearCachedProvider();
    refreshState();
  };

  useEffect(() => {
    if (web3Modal.cachedProvider) {
      connectWallet();
    }
  }, []);

  useEffect(() => {
    if (provider?.on) {
      const handleAccountsChanged = (accounts) => {
        console.log("accountsChanged", accounts);
        if (accounts) setAccount(accounts[0]);
      };

      const handleChainChanged = (_hexChainId) => {
        setChainId(_hexChainId);
      };

      const handleDisconnect = () => {
        console.log("disconnect", error);
        disconnect();
      };

      provider.on("accountsChanged", handleAccountsChanged);
      provider.on("chainChanged", handleChainChanged);
      provider.on("disconnect", handleDisconnect);

      return () => {
        if (provider.removeListener) {
          provider.removeListener("accountsChanged", handleAccountsChanged);
          provider.removeListener("chainChanged", handleChainChanged);
          provider.removeListener("disconnect", handleDisconnect);
        }
      };
    }
  }, [provider]);

  return (
    <div className={styles.navbar}>
      <Link href="/" passHref>
        <div className={styles.logo}>
          <Text
            h1
            size={40}
            css={{
              textGradient: "45deg, $blue600 -10%, $pink600 80%",
            }}
            weight="bold"
          >
            Go
          </Text>
          <Text
            h1
            size={40}
            css={{
              textGradient: "45deg, $purple600 -20%, $pink600 100%",
            }}
            weight="bold"
          >
            Crypto
          </Text>
          <Text
            h1
            size={40}
            css={{
              textGradient: "45deg, $yellow600 -20%, $red600 100%",
            }}
            weight="bold"
          >
            Me
          </Text>
        </div>
      </Link>
      <Link href="/fundraiser" passHref>
        <div className={styles.item}>Fundraisers</div>
      </Link>
      {!account ? (
        <div className={styles.button} onClick={connectWallet}>
          Connect Wallet
        </div>
      ) : (
        <div className={styles.button} onClick={disconnect}>
          Disconnect
        </div>
      )}
    </div>
  );
}

export default Navbar;

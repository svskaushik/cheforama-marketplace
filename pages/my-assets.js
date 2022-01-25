import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Web3Modal from "web3modal"
import Spinner from "./Components/Spinner.js"
import WalletConnectProvider from "@walletconnect/web3-provider"

import {
  nftmarketaddress, nftaddress
} from '../config'

import Market from '../artifacts/contracts/NFTMarket.sol/NFTMarket.json'
import NFT from '../artifacts/contracts/NFT.sol/NFT.json'

export default function MyAssets() {
  const [nfts, setNfts] = useState([])
  const [loadingState, setLoadingState] = useState('not-loaded')
  useEffect(() => {
    loadNFTs()
    if (window.ethereum){
      window.ethereum.on("chainChanged", networkChanged)
    }
  }, [])

  const networkChanged = (chainId) => {
    if (chainId != '0x61'){
    window.alert('Please ensure you are connected to the correct network and refresh')
    }
  };

  const providerOptions = {
    walletconnect: {
      package: WalletConnectProvider, // required
      options: {
        rpc: {
            97: 'https://data-seed-prebsc-2-s2.binance.org:8545/'
        },
        chainId: 97
      }
    }
  }


  async function chainCheck() {
    try {
      if (!window.ethereum) throw new Error("No crypto wallet found")
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
              chainId: `0x${Number(97).toString(16)}`,
              chainName: "Binance Smart Chain Testnet",
              nativeCurrency: {
                name: "Binance Chain Native Token",
                symbol: "BNB",
                decimals: 18
              },
              rpcUrls: [
                "https://data-seed-prebsc-2-s2.binance.org:8545/"
              ],
              blockExplorerUrls: ["https://explorer.binance.org/smart-testnet"]
            }
        ]
      })
    } catch (err) {
      console.log(err.message);
    }
  }

  async function loadNFTs() {
    if (window.ethereum) {
      try{
      const web3Modal = new Web3Modal({
        cacheProvider: true,
        providerOptions
      })
      const connection = await web3Modal.connect()
      const provider = new ethers.providers.Web3Provider(connection)
      const signer = provider.getSigner()
      chainCheck()

      const marketContract = new ethers.Contract(nftmarketaddress, Market.abi, signer)
      const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider)
      const data = await marketContract.fetchMyNFTs()

      const items = await Promise.all(data.map(async i => {
        const tokenUri = await tokenContract.tokenURI(i.tokenId)
        const meta = await axios.get(tokenUri)
        let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
        let item = {
          price,
          tokenId: i.tokenId.toNumber(),
          seller: i.seller,
          owner: i.owner,
          image: meta.data.image,
        }
        return item
      }))
      setNfts(items)
      setLoadingState('loaded')
      }catch(error){
        console.log(error)
      }
    } 
    else {
      window.alert('Account not detected. Please ensure your wallet is connected')
    }
  }

  if (loadingState === 'loaded' && !nfts.length) return (<h1 className="py-10 px-20 text-3xl text-white">No assets owned</h1>)
  if (loadingState != 'loaded') return ( < Spinner/>  )

  return (
    <div className="flex justify-center animate-loadtransition">
      <div className="p-4 pb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 items-start gap-4 pt-4">
          {
            nfts.map((nft, i) => (
              <div key={i} className="shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 rounded-lg overflow-hidden transform transition duration-500 hover:scale-105 animate-loadtransition">
                <img src={nft.image} className="rounded-t" onClick={() => window.open(nft.image)} role="button"/>
                <div className="p-4 bg-black bg-opacity-50">
                  <p className="text-2xl font-bold text-white">Price - {nft.price} CHEF</p>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  )
}
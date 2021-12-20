import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Web3Modal from "web3modal"
import Spinner from "./Components/Spinner.js"



import {
  nftaddress, nftmarketaddress, paymentTokenAddress
} from '../config'

import NFT from '../artifacts/contracts/NFT.sol/NFT.json'
import Market from '../artifacts/contracts/NFTMarket.sol/NFTMarket.json'
import Token from '../artifacts/contracts/NFT.sol/Token.json'

export default function Home() {
  const [nfts, setNfts] = useState([])
  const [loadingState, setLoadingState] = useState('not-loaded')
  useEffect(() => {
    loadNFTs()
  }, [])
  async function loadNFTs() {
    /* create a generic provider and query for unsold market items */
    const provider = new ethers.providers.JsonRpcProvider("https://rpc-mumbai.maticvigil.com/")
    const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider)
    const marketContract = new ethers.Contract(nftmarketaddress, Market.abi, provider)
    const data = await marketContract.fetchMarketItems()

    /*
    *  map over items returned from smart contract and format 
    *  them as well as fetch their token metadata
    */
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
        name: meta.data.name,
        description: meta.data.description,
      }
      return item
    }))
    setNfts(items)
    setLoadingState('loaded') 
  }
  async function buyNft(nft) {
    /* needs the user to sign the transaction, so will use Web3Provider and sign it */
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(nftmarketaddress, Market.abi, signer)
    const paymentToken = new ethers.Contract(paymentTokenAddress, Token.abi, signer)

    /* user will be prompted to pay the asking process to complete the transaction */
    const price = ethers.utils.parseUnits(nft.price.toString(), 'ether') 
    const approval = await paymentToken.approve(nftmarketaddress, price)  
    const transaction = await contract.createMarketSale(nftaddress, nft.tokenId, paymentTokenAddress)
    await approval.wait()
    await transaction.wait()
    loadNFTs()
  }

  if (loadingState === 'loaded' && !nfts.length) return (<h1 className="px-20 py-10 text-3xl text-white">No items in marketplace</h1>)
  if (loadingState != 'loaded') return ( < Spinner/>  )
  return (
    <div className="flex justify-center animate-loadtransition">
      <div className="px-4 pb-6 " style={{ maxWidth: '1600px' }}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 items-start gap-4 pt-4">
          {
            nfts.map((nft, i) => (
              <div key={i} className="group shadow-xl rounded-lg overflow-hidden transform transition duration-500 hover:scale-105">                
                <div className="flex justify-center overflow-hidden">
                <img src={nft.image} className="transform transition duration-500 hover:scale-110 max-h-48" onClick={() => window.open(nft.image)} role="button" />    
                </div>
                <div className="p-4 bg-white bg-opacity-5 group-hover:bg-opacity-10 transition duration-500">
                  <p style={{ height: '64px' }} className="text-2xl font-semibold text-gray-200">{nft.name}</p>
                  <div style={{ height: '70px', overflow: 'hidden' }}>
                    <p className="text-gray-200 font-semibold">{nft.description}</p>
                  </div>
                </div>
                <div className="p-4 bg-black bg-opacity-40 group-hover:bg-opacity-50 transition duration-500  ">
                  <p className="text-2xl mb-4 font-bold text-white">{nft.price} Matic</p>
                  <button className="w-full bg-pink-500 text-white font-bold py-2 px-2 rounded transform transition duration-500 hover:scale-110" onClick={() => buyNft(nft)}>Buy</button>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  )
}
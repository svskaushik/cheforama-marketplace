import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Web3Modal from "web3modal"
import Spinner from "./Components/Spinner.js"

import {
  nftmarketaddress, nftaddress
} from '../config'

import Market from '../artifacts/contracts/NFTMarket.sol/NFTMarket.json'
import NFT from '../artifacts/contracts/NFT.sol/NFT.json'

export default function CreatorDashboard() {
  const [nfts, setNfts] = useState([])
  const [sold, setSold] = useState([])
  const [loadingState, setLoadingState] = useState('not-loaded')
  useEffect(() => {
    loadNFTs()
  }, [])
  async function loadNFTs() {
    const web3Modal = new Web3Modal({
      cacheProvider: true,
    })
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()

    const marketContract = new ethers.Contract(nftmarketaddress, Market.abi, signer)
    const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider)
    const data = await marketContract.fetchItemsCreated()

    const items = await Promise.all(data.map(async i => {
      const tokenUri = await tokenContract.tokenURI(i.tokenId)
      const meta = await axios.get(tokenUri)
      let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
      let item = {
        price,
        tokenId: i.tokenId.toNumber(),
        seller: i.seller,
        owner: i.owner,
        sold: i.sold,
        image: meta.data.image,
      }
      return item
    }))
    /* create a filtered array of items that have been sold */
    const soldItems = items.filter(i => i.sold)
    setSold(soldItems)
    setNfts(items)
    setLoadingState('loaded') 
  }

  if (loadingState === 'loaded' && !nfts.length) return (<h1 className="py-10 px-20 text-3xl text-white">No assets created</h1>)
  if (loadingState != 'loaded') return ( < Spinner/>  )
  return (
    <div className="animate-loadtransition">
      <div className="p-4">
        <h2 className="text-2xl py-2 text-white">Items Created</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 items-start gap-4 pt-4">
          {
            nfts.map((nft, i) => (
              <div key={i} className="pt-2 shadow-lg rounded-lg overflow-hidden transform transition duration-500 hover:scale-105">
                <img src={nft.image} className="rounded-t-lg" onClick={() => window.open(nft.image)} role="button"/>
                <div className="p-4 bg-black bg-opacity-50">
                  <p className="text-2xl font-bold text-white">Price - {nft.price} CHEF</p>
                </div>
              </div>
            ))
          }
        </div>
      </div>
        <div className="px-4 pb-6">
        {
          Boolean(sold.length) && (
            <div>
              <h2 className="text-2xl py-2 text-white">Items sold</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 items-start gap-4 pt-4">
                {
                  sold.map((nft, i) => (
                    <div key={i} className="shadow-lg rounded-lg overflow-hidden transform transition duration-500 hover:scale-105">
                      <img src={nft.image} className="rounded-t-lg" onClick={() => window.open(nft.image)} role="button"/>
                      <div className="p-4 bg-black bg-opacity-50">
                        <p className="text-2xl font-bold text-white">Price - {nft.price} CHEF</p>
                      </div>
                    </div>
                  ))
                }
              </div>
            </div>
          )
        }
        </div>
    </div>
  )
}
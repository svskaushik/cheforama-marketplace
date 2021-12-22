import { useState } from 'react'
import { ethers } from 'ethers'
import { create as ipfsHttpClient } from 'ipfs-http-client'
import { useRouter } from 'next/router'
import Web3Modal from 'web3modal'

const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')

import {
  nftaddress, nftmarketaddress, paymentTokenAddress
} from '../config'

import NFT from '../artifacts/contracts/NFT.sol/NFT.json'
import Market from '../artifacts/contracts/NFTMarket.sol/NFTMarket.json'
import Token from '../artifacts/contracts/Token.sol/Token.json'

export default function CreateItem() {
  const [fileUrl, setFileUrl] = useState(null)
  const [formInput, updateFormInput] = useState({ price: '', name: '', description: '' })
  const router = useRouter()

  async function onChange(e) {
    const file = e.target.files[0]
    try {
      const added = await client.add(
        file,
        {
          progress: (prog) => console.log(`received: ${prog}`)
        }
      )
      const url = `https://ipfs.infura.io/ipfs/${added.path}`
      setFileUrl(url)
    } catch (error) {
      console.log('Error uploading file: ', error)
    }  
  }
  async function createMarket() {
    const { name, description, price } = formInput
    if (!name || !description || !price || !fileUrl) return
    /* first, upload to IPFS */
    const data = JSON.stringify({
      name, description, image: fileUrl
    })
    try {
      const added = await client.add(data)
      const url = `https://ipfs.infura.io/ipfs/${added.path}`
      /* after file is uploaded to IPFS, pass the URL to save it on Polygon */
      createSale(url)
    } catch (error) {
      console.log('Error uploading file: ', error)
    }  
  }

  async function createSale(url) {
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)    
    const signer = provider.getSigner()

    /* next, create the item */
    let contract = new ethers.Contract(nftaddress, NFT.abi, signer)
    let transaction = await contract.createToken(url)
    let tx = await transaction.wait()
    let event = tx.events[0]
    let value = event.args[2]
    let tokenId = value.toNumber()
    const price = ethers.utils.parseUnits(formInput.price, 'ether')
    const paymentToken = new ethers.Contract(paymentTokenAddress, Token.abi, signer)

    /* then list the item for sale on the marketplace */
    contract = new ethers.Contract(nftmarketaddress, Market.abi, signer)
    let listingPrice = await contract.getListingPrice()
    listingPrice = listingPrice.toString()

    const approval = await paymentToken.approve(nftmarketaddress, listingPrice)
    transaction = await contract.createMarketItem(nftaddress, tokenId, price, paymentTokenAddress)
    await approval.wait()
    await transaction.wait()
    router.push('/')
  }

  return (
    <div className="flex justify-center animate-loadtransition">
      <div className="w-3/4 sm:w-1/2 flex flex-col pb-12">
        <input 
          placeholder="Asset Name"
          className="mt-8 rounded p-6 bg-white bg-opacity-20 shadow transition duration-500 hover:shadow-2xl focus:shadow-inner"
          onChange={e => updateFormInput({ ...formInput, name: e.target.value })}
        />
        <textarea
          placeholder="Asset Description"
          className="mt-4 rounded p-6 bg-white bg-opacity-20 shadow transition duration-500 hover:shadow-2xl focus:shadow-inner"
          onChange={e => updateFormInput({ ...formInput, description: e.target.value })}
        />
        <input
          placeholder="Asset Price in CHEF"
          className="mt-4 rounded p-6 bg-white bg-opacity-20 shadow transition duration-500 hover:shadow-2xl focus:shadow-inner"
          onChange={e => updateFormInput({ ...formInput, price: e.target.value })}
        />
        <label className="flex flex-col items-center px-4 py-2 mt-4 bg-pink-500 text-white rounded shadow-md tracking-wide font-semibold cursor-pointer transform transition duration-500 hover:scale-105">
        <span className="mt-2 text-base leading-normal">Select a file</span>
        <input
          type="file"
          name="Asset"
          className="hidden"
          onChange={onChange}
        />
        </label>
        {
          fileUrl && (
            <img className="rounded mt-4 self-center" width="350" src={fileUrl} />
          )
        }
        <button onClick={createMarket} className="bg-pink-500 text-white tracking-wide transform transition duration-500 hover:scale-105 font-bold mt-4 rounded p-4 shadow-lg">
          Create Digital Asset
        </button>
      </div>
    </div>
  )
}
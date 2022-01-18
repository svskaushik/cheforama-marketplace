import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";


function ModalButton() {
	const [btnText, setBtnText] = useState("Connect");
	const [isDisabled, setDisabled] = useState(false)
    const [walletAddress, setWallet] = useState("");

    useEffect( async () => {

       
          // Get current wallet connected (useful after refresh of page and used to display in the button that you are already connected)
          const { address } = await getCurrentWalletConnected(); 
          setWallet(address);

          // Add wallet listener to handle account changes by the user
          addWalletListener();
        
    },[])

    const getCurrentWalletConnected = async () => {
        if (window.ethereum) {
          try {
            const addressArray = await window.ethereum.request({
              method: "eth_accounts",
            });
            if (addressArray.length > 0) {
                setBtnText(addressFormatter(addressArray[0]));
                setDisabled(true);
                return {
                  address: addressArray[0],
                };
            } else {
                return {
                  address: "",
                };
            }
          } catch (error) {
              console.error(error);
              return {
                  address: "",
              };
          }
        } else {
            return {
                address: "",
            };
        }
    }

    function addWalletListener() {
        if (window.ethereum) {
          window.ethereum.on("accountsChanged", (accounts) => {
            if (accounts.length > 0) {
              setWallet(accounts[0]);
              setBtnText(addressFormatter(accounts[0]))
            } else {
              setWallet("");
              setBtnText("Connect");
              setDisabled(false);
            }
          });
        } else {
          setWallet("");
          setBtnText("No wallet found");
        }
      }

      const onClickConnect = async () => {
        try {
            // Disable button when clicked
            setDisabled(true);

            // Note: This part will trigger the MetaMask pop-up if you are either logged out of your wallet or logged in but not connected to any account. 
            // There won't be a pop-up window if you are already connected with an account
    	  	const providerOptions = {
			    walletconnect: {
			      package: WalletConnectProvider, // required
			      options: {
			        rpc: {
                        97: 'https://data-seed-prebsc-1-s1.binance.org:8545/'
                    },
                    chainId: 97
			      }
			    }
			}

		  	const web3Modal = new Web3Modal({
		        cacheProvider: true,
		        providerOptions
      		})
		    const connection = await web3Modal.connect()
	      	const provider = new ethers.providers.Web3Provider(connection)
	      	const signer = provider.getSigner()
            const addressArray = await window.ethereum.request({ method: 'eth_requestAccounts' });
            
            if (addressArray.length > 0) {
                setWallet(addressArray[0])
                setBtnText(addressFormatter(addressArray[0]))
                return {
                  address: addressArray[0],
                };
              } else {
                  setBtnText("No account connected")
                return {
                  address: "",
                };
              };
        } catch (error) { // Wwhen user rejects the request
            setDisabled(false);                       
            console.error(error);
            return {
                address: ""
            };
        }
    };

    const addressFormatter = (account) => {
        return (
            "Connected: " +
            String(account).substring(0, 6) +
            "..." +
            String(account).substring(38)
        )          
    }  

	return (
        <div>
            <button className="rounded-full z-25 font-medium px-4 text-gray-300 bg-blue-400 bg-opacity-20 transition duration-500 hover:bg-opacity-70 transform hover:-translate-y-1" onClick={onClickConnect}>{btnText}</button>       
        </div>
    )

}

export default ModalButton;
import Router from "next/router"
import nProgress from "nprogress"
import "../styles/globals.css"
import "../styles/NProgress.css"
import Link from 'next/link'
import WalletConnectButton from "./Components/ConnectButton.js"


Router.events.on("routeChangeStart", nProgress.start);
Router.events.on("routeChangeError", nProgress.done);
Router.events.on("routeChangeComplete", nProgress.done);



function MyApp({ Component, pageProps }) {

  return (

    <div className="min-h-screen bg-bg sm:bg-svg">
    <title>WeChef</title>
      <nav className="p-4 animate-loadtransition">
      <div className="flex justify-center">
      <img src="cheforama-logo-2edit.png" className="rounded-full w-8 h-8 self-center" />
      </div>  
        <div className="flex mt-4 items-center md:justify-around overflow-x-scroll md:overflow-hidden pt-4 pb-1">
          <div className="hidden lg:flex">
              <p className="font-mono text-lg text-gray-300 self-center text-center ">WeChef</p>
            <p className="font-mono text-xs text-gray-300 self-center text-center pl-1">by</p>
            <a href="https://thecheforama.com/" target="_blank" rel="noopener noreferrer">
              <img src="cheforama-logo-banner.png" className="self-end h-6 pl-1"/>
            </a>
          </div>
          <div className="flex">
            <Link href="/"> 
              <a className="rounded-full px-4 transition duration-500 font-semibold hover:bg-black hover:bg-opacity-40 transform hover:-translate-y-1 mr-6 text-pink-500 focus:text-cyan-400 focus:bg-black focus:bg-opacity-40">
                Home
              </a>
            </Link>
            <Link href="/create-item">
              <a className="rounded-full px-4 transition duration-500 font-semibold hover:bg-black hover:bg-opacity-40 transform hover:-translate-y-1 mr-6 text-pink-500 focus:text-cyan-400 focus:bg-black focus:bg-opacity-40">
                Sell Digital Asset
              </a>
            </Link>
            <Link href="/my-assets">
              <a className="rounded-full px-4 transition duration-500 font-semibold hover:bg-black hover:bg-opacity-40 transform hover:-translate-y-1 mr-6 text-pink-500 focus:text-cyan-400 focus:bg-black focus:bg-opacity-40">
                My Digital Assets
              </a>
            </Link>
            <Link href="/creator-dashboard">
              <a className="rounded-full px-4 transition duration-500 font-semibold hover:bg-black hover:bg-opacity-40 transform hover:-translate-y-1 mr-4 text-pink-500 focus:text-cyan-400 focus:bg-black focus:bg-opacity-40">
                Creator Dashboard
              </a>
            </Link>
          </div>
          <div className="flex">
            <WalletConnectButton/>
          </div>
        </div>  
      </nav>
      <Component {...pageProps} />
    </div>
  )
}

export default MyApp
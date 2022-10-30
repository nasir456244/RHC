import Image from 'next/image'
import React from 'react'
import bidaar from '../../public/bidaar.png'
import { useAddress, useDisconnect, useMetamask } from "@thirdweb-dev/react";

const NFTDropPage = () => {
    const address = useAddress();
    const connectWithMetamask = useMetamask();
    const disconnect = useDisconnect();
    
  return (
    <div className='h-screen flex flex-col lg:grid lg:grid-cols-10'>
        <div className='flex items-center justify-center bg-gradient-to-br 
            from-cyan-800 to-rose-500 lg:h-screen lg:col-span-4 '>
           <div className='flex flex-col items-center justify-center py-2'>
                <div className='bg-gradient-to-br from-yellow-400 
                    to-purple-600 p-2 rounded-xl'>
                    <Image className='w-44 bg-[#FAE6B2] rounded-xl object-cover 
                        lg:h-96 lg:w-72' alt='bidaarLogo' src={bidaar} />
                </div>
                <div className='text-center p-5 space-y-2'>
                    <h1 className='text-xl font-bold text-white'>BIDAAR Nfts</h1>
                    <h2 className='text-xl text-gray-300'>A collection of BIDAAR Nfts who live & breathe BIDAAR!</h2>
                </div>
            </div> 
        </div>


        <div className='flex flex-1 flex-col p-12 lg:col-span-6'>
            <div className='flex items-center justify-between'>
                <h1 className='w-52 cursor-pointer text-xl font-extralight 
                sm:w-80'>The {''}
                    <span className='font-extrabold underline decoration-pink-600/50'>
                        BIDAAR 
                    </span> {''}
                    NFT Market place</h1>

                <button onClick={() => address ? disconnect() : connectWithMetamask()} className='rounded-full bg-rose-400 text-white
                    px-4 py-2 text-xs font-bold lg:px-5 lg:py-3 lg:text-base'>{address ? 'Sign Out' : 'Sign In'}</button>

            </div>
            <hr className='my-2 border' />
            {address && <p className='text-center text-sm text-rose-400'>You&apos;re logged in with {address?.slice(0,5) + '...' + address.slice(38,42)} </p>}



            <div className='mt-10 flex flex-1 flex-col items-center space-y-6
                text-center lg:space-y-0 lg:justify-center'>
                <Image className='w-80 object-cover pb-10 lg:h-40' src={bidaar} alt="bidaarBanner"/>
                <h1 className='text-3xl font-bold lg:text-5xl lg:font-extrabold'>BIDAAR is Life | NFT Drop </h1>
                <p className='pt-2 text-xl text-green-500'> 13 / 21 NFT&apos;s claimed</p>
            </div>

            <button className='mt-10 h-16 bg-red-600 w-full text-white 
            rounded-full font-bold'>Mint NFT (0.01 ETH)</button>
        </div>
    </div>
  )
}

export default NFTDropPage
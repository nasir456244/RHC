import Image from 'next/image'
import React from 'react'
import { useAddress, useDisconnect, useMetamask, useContract } from "@thirdweb-dev/react";
import { sanityClient, urlFor } from '../../sanity';
import Link from 'next/link';
import { useState } from 'react';
import { useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast'


const NFTDropPage = ({ collection }) => {
    const [claimedSupply, setClaimedSupply] = useState(0);
    const [totalSupply, setTotalSupply] = useState(0);
    const [loading, setLoading] = useState({
      loadSupply: true,
      minting: false,
    });
    const [priceInMatic, setPriceInMatic] = useState(true);
    const address = useAddress();
    const connectWithMetamask = useMetamask();
    const disconnect = useDisconnect();
    const nftDrop = useContract(collection?.address, "nft-drop").contract


    useEffect(() => {
      if(!nftDrop) return;
      const fetPrice = async () => {
        const claimConditions = await nftDrop?.claimConditions?.getAll();
        setPriceInMatic(claimConditions?.[0]?.currencyMetadata?.displayValue)
      }
      fetPrice()
    },[nftDrop])

    useEffect(() => {
        if(!nftDrop) return;
        const fetchNFTDropData = async () => {
          setLoading((prev) => ({...prev, loadSupply: true}));
          const claimed = await nftDrop.getAllClaimed();
          const total = await nftDrop.totalSupply();
          setClaimedSupply(claimed?.length);
          setTotalSupply(total);
          setLoading((prev) => ({...prev, loadSupply: false}));
        }
        fetchNFTDropData();
    },[nftDrop])


    const mintNft = () => {
      if(!address || !nftDrop || claimedSupply === totalSupply?.toString()) return;

      setLoading((prev) => ({...prev, minting:true}));
      const notification = toast.loading('Minting', {
        style : {
          background: 'white',
          color: 'green',
          fontWeight: 'bolder',
          fontSize: '17',
          padding: '20px'
        }
      })

      const quantity = 1;
      nftDrop?.claimTo(address, quantity).then((tx) => {
        toast("HOORAY, You Successfully Minted!", {
          style : {
            background: 'white',
            color: 'green',
            fontWeight: 'bolder',
            fontSize: '17',
            padding: '20px'
          }
        })
        setClaimedSupply((prev) => prev + 1);
      })
      .catch((err) => {
        toast("Whoops... Something went wrong!", {
          style : {
            background: 'red',
            color: 'white',
            fontWeight: 'bolder',
            fontSize: '17',
            padding: '20px'
          }
        })
      })
      .finally(() => {
        setLoading((prev) => ({...prev, minting: false}));
        toast.dismiss(notification);
      })
    }
  
  return (
    <div className='h-screen flex flex-col lg:grid lg:grid-cols-10'>
      <Toaster position='bottom-center' />
        <div className='flex items-center justify-center bg-gradient-to-br 
            from-cyan-800 to-rose-500 lg:h-screen lg:col-span-4 '>
           <div className='flex flex-col items-center justify-center py-2'>
                <div className='bg-gradient-to-br from-yellow-400 
                    to-purple-600 p-2 rounded-xl'>
                    <Image width={176} height={545} className='bg-[#FAE6B2] rounded-xl object-cover lg:h-96 lg:w-72' 
                        alt='previewImage' src={urlFor(collection?.previewImage).url()} />
                </div>
                <div className='text-center p-5 space-y-2'>
                    <h1 className='text-xl font-bold text-white'>{collection?.nftCollectionName}</h1>
                    <h2 className='text-xl text-gray-300'>{collection?.description}</h2>
                </div>
            </div> 
        </div>


        <div className='flex flex-1 flex-col p-12 lg:col-span-6'>
            <div className='flex items-center justify-between'>
                <Link href={'/'}>

                    <h1 className='w-52 cursor-pointer text-xl font-extralight 
                    sm:w-80'>The {''}
                        <span className='font-extrabold underline decoration-pink-600/50'>
                            BIDAAR 
                        </span> {''}
                        NFT Market place</h1>
                </Link>

                <button onClick={() => address ? disconnect() : connectWithMetamask()} className='rounded-full bg-rose-400 text-white
                    px-4 py-2 text-xs font-bold lg:px-5 lg:py-3 lg:text-base'>{address ? 'Sign Out' : 'Sign In'}</button>

            </div>
            <hr className='my-2 border' />
            {address && <p className='text-center text-sm text-rose-400'>You&apos;re logged in with {address?.slice(0,5) + '...' + address.slice(38,42)} </p>}



            <div className='mt-10 flex flex-1 flex-col items-center space-y-6
                text-center lg:space-y-0 lg:justify-center'>
                <Image width={320} height={545} className='object-cover pb-10 lg:h-40' src={urlFor(collection?.mainImage).url()} alt="mainImage"/> 
                <h1 className='text-3xl font-bold lg:text-5xl lg:font-extrabold'>{collection?.title}</h1>
                {loading.loadSupply ? (
                    <p className='pt-2 text-xl text-green-500'>Loading Supply Count...</p>
                ) :
                (
                    <p className='pt-2 text-xl text-green-500'> {claimedSupply} / {totalSupply?.toString()} NFT&apos;s claimed</p>
                )}
                {loading?.loadSupply && (
                  <Image alt='loader' height={220} width={220} className='object-contain' src={"https://cdn.dribbble.com/users/765253/screenshots/2540865/loader.gif"} />
                )} 
                {loading?.minting && (
                  <Image alt='loader' height={220} width={220} className='object-contain' src={"https://cdn.dribbble.com/users/765253/screenshots/2540865/loader.gif"} />
                )}
            </div>

            <button onClick={mintNft} 
            disabled={loading.loadSupply || loading.minting || !address || claimedSupply === totalSupply?.toString()} 
            className='disabled:bg-gray-400 disabled:cursor-not-allowed mt-10 h-16 bg-red-600 w-full text-white 
            rounded-full font-bold'>
              {loading.loadSupply ? (
                'Loading...'
              )
              : claimedSupply === totalSupply?.toString() ? (
                'SOLD OUT'
              ) : !address ? (
                'Sign In'
              ): loading.minting ? (
                'Minting...'
              ): (

                <span className='font-bold'>
                  Mint NFT ({priceInMatic} MATIC)
                </span>
              )
              }
              
              </button>
        </div>
    </div>
  )
}

export default NFTDropPage



export const getStaticPaths = async () => {
  const query = `*[_type == "collection"] {
    slug {
      current
    },
    
  }`;

  const res = await sanityClient.fetch(query);

  const paths = res.map((item) => {
    return {
      params: {
        id: item.slug.current
      }
    }
  });

  return {
    paths,
    fallback: false
  }

}



export const getStaticProps = async ({ params }) => {
  const query = `*[_type == "collection" && slug.current == $id][0] {
    _id,
    title,
    address,
    description,
    nftCollectionName,
    mainImage {
      asset
    },
    previewImage {
      asset
    },
    creator-> {
      _id,
      name,
      address,
      slug {
        current
      }
    },
  }`;

    const collection = await sanityClient.fetch(query, {
        id: params?.id
    });

    return {
      props: {
        collection
      },
      revalidate: 10
    }
  }
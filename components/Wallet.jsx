import { useContract, useOwnedNFTs, useAddress } from '@thirdweb-dev/react';
import Image from 'next/image'
import React from 'react'
import header from '../public/header.gif'
import MintModal from './MintModal';
import styles from "../styles/Wallet.module.css"

const Wallet = () => {
    const { contract } = useContract("0xe01DD6A19F537e9f7819889F163fE2a7d52e7891");
    const address = useAddress()
    const { data: ownedNFTs, isLoading } = useOwnedNFTs(contract, address);

  return (
    <div className={styles.container}>
        <div className={styles.ImageContainer}>
            <Image className={styles.imageHeader} src={header} priority alt="gif" />
        </div>

        {isLoading && <p>Loading....</p>}
        {ownedNFTs?.length > 1 &&  <h1 className={styles.h1Text}>You have drawn...</h1>}
        
        <div className={styles.ImageGridContainer}>
          {ownedNFTs?.map((nft) => (
            <div key={nft?.metadata?.id} className={styles.GridImageParent}> 
              <Image alt='owned nft' height={600} width={350} src={nft?.metadata?.image} />
              <Image alt='corresponding image' height={600} width={350} src={`https://thewell.mypinata.cloud/ipfs/Qmdw42xeSBgaSNxNWdcgCV5GvXUqECaN3ms5ciwiwUCPPp/${nft?.metadata?.image?.slice(83, -5) + 'B.png'}`} />
            </div>
          ))}
          
          

          {ownedNFTs?.length === 0 && (
            <div className={styles.emptyNftContainer}>
              <p className={styles.emptyNftText}>It appears you do not yet have a card. mint one now to receive your card and reading</p>
              <MintModal />
            </div>
          )}
          </div>
    </div>
  )
}

export default Wallet
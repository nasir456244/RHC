import Image from 'next/image';
import React, { useEffect, useState } from 'react'
import animaheadpose1 from '../public/animaheadpose1.webp'
import { useAddress, useMetamask, useContract, useClaimConditions } from "@thirdweb-dev/react";
import { useRouter } from 'next/router';
import showgif from '../public/showgif.gif'
import styles from "../styles/MintModal.module.css"

const MintModal = () => {
    const [isOpen, setIsOpen] = useState(false);
    const address = useAddress();
    const connectWithMetamask = useMetamask();
    const [claimedSupply, setClaimedSupply] = useState(0);
    const [totalSupply, setTotalSupply] = useState(0);
    const nftDrop = useContract("0xe01DD6A19F537e9f7819889F163fE2a7d52e7891", "nft-drop").contract
    const router = useRouter()
    const [showGif, setShowGif] = useState(false);
    const [loading, setLoading] = useState({
        loadSupply: true,
        minting: false,
      });
    const [quantity, setQuantity] = useState(1);
    const { data: claimConditions } = useClaimConditions(nftDrop);
 
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

    const handleViewCards = () => {
        setIsOpen(false);
        router.push('/wallet');
    }

    const handleMint = () => {
      if(!address || !nftDrop || claimedSupply === totalSupply?.toNumber()) return;
      setLoading((prev) => ({...prev, minting:true}));
      
      const qty = quantity;
      nftDrop?.claimTo(address, qty).then((tx) => {
        setClaimedSupply((prev) => prev + qty);
        setIsOpen(!isOpen)
        setShowGif(true);
        setTimeout(() => router.push('/wallet'),2500)
      })
      .catch(() => {
        alert("Whoops... Something went wrong!") 
      })
      .finally(() => {
        setQuantity(1)
        setLoading((prev) => ({...prev, minting: false}));
      })
    }

    const addQty = () => {
        const leftQty = totalSupply?.toNumber() - claimedSupply;
        if(totalSupply?.toNumber() === claimedSupply ||quantity === leftQty || Number(claimConditions?.[0]?.quantityLimitPerTransaction) === quantity) return;
        setQuantity((prev) => prev + 1)
    }

    const minQty = () => {
        if(quantity === 1) return;
        setQuantity((prev) => prev - 1)
    }

  return (
    <div>
        <button onClick={() => setIsOpen(!isOpen)} className={styles.mintButton}>Mint</button> 
        {isOpen && (
        <>
          <div
            className={styles.modalContainer}
          >
              <div className={styles.mintParent}>
                  <div className={styles.headerContainer}>
                    <h1 className={styles.headerText}>The Oracle will see you now.</h1>
                  </div>
                  <div>
                    <Image src={animaheadpose1} alt="animaheadpose1" className={styles.ImageHeader} />
                  </div>
                  <div className={styles.bodyContainer}>
                        {!address ? (
                            <button onClick={() => !address && connectWithMetamask()} className={styles.ConnectButton}>Connect Wallet</button>
                        ) :
                        (
                            <div className={styles.bodyParent}>
                                <div className={styles.mintContainer}>                             
                                    <input readOnly value={quantity} className={styles.mintInput} type='text' />
                                    <div className={styles.qtyContainer}>
                                        <button disabled={loading?.minting} onClick={addQty} className={styles.qtyButton1} />
                                        <button disabled={loading?.minting} onClick={minQty} className={styles.qtyButton2} />
                                    </div>
                                </div>
                                <button disabled={loading?.minting || loading.loadSupply} onClick={address && handleMint} className={styles.minButton}>Mint</button>
                            </div>
                        )}
                    {loading?.loadSupply ? <p className={styles.loadingtext}>Loading supplyCount...</p> : <p className={styles.loadingtext}> {claimedSupply}/{totalSupply?.toNumber()} minted</p>}
                    {loading?.minting && <p className={styles.loadingtext}>minting...</p>}
                  </div>
                  

                  <div className={styles.bgContainer}>
                    <p>
                       { address ? address?.slice(0,5) + '...' + address.slice(38,42) : '0x12345...2323'}
                    </p>
                    <button onClick={handleViewCards} className={styles.ViewCards}>
                        View your cards.
                    </button>
                  </div>
                
              
                
              </div>
          </div>
          <div className="opacity-50 fixed inset-0 z-40 bg-black" />
        </>
      )}

      {showGif && (
        <div
        className="justify-center mt-20 flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none m-3"
        >
            <div className='bg-black w-[400px] h-[500px] rounded-[10px]'>
                <Image src={showgif} alt='gif' />    
            </div>
            <div className="opacity-50 fixed inset-0 z-40 bg-black" />

        </div>
      )}
    </div>
  )
}

export default MintModal
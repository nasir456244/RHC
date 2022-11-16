import React from 'react'
import MintModal from '../components/MintModal';


const nfts = () => {
  return (
    <div style={{display: 'flex', overflow: 'hidden', backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', width: '100vw', height: '100vh'}}>
      <div>
        <MintModal />
      </div>
    </div>
  )
}

export default nfts
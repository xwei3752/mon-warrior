import { useState, useEffect } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useBalance } from 'wagmi';
import { parseEther } from 'ethers/lib/utils';
import WeaponCard from '../components/WeaponCard';
import { WEAPON_NFT_ADDRESS, WEAPON_NFT_ABI, L1_WEAPON_SVG,L2_WEAPON_SVG,L3_WEAPON_SVG,L4_WEAPON_SVG,L5_WEAPON_SVG } from '../utils/constants';

export default function Home() {
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const weaponSvgs = [L1_WEAPON_SVG, L2_WEAPON_SVG, L3_WEAPON_SVG, L4_WEAPON_SVG, L5_WEAPON_SVG];
  
  const { address, isConnected } = useAccount();
  const { data: balance, refetch: refetchBalance } = useBalance({
    address,
    watch: true,
  });

  // Contract interaction for minting
  const {
    data: hash,
    writeContract: mint, 
    isPending: isMintLoading,
    isSuccess: isMintStarted,
    error: mintError 
  } = useWriteContract();

  // Wait for transaction to complete
  const { 
    isLoading: isMintTxLoading,
    isSuccess: isMintTxSuccess,
    isError: isMintTxError,
  } = useWaitForTransactionReceipt({
    hash: hash
  });

  // Handle mint button click
  const handleMint = async () => {
    try {
      setStatus('Initiating transaction...');
      setError('');
      const hash = mint({
        address: WEAPON_NFT_ADDRESS,
        abi: WEAPON_NFT_ABI,
        functionName: 'mint',
        value: parseEther('1'), // 1 TMON
      });
    } catch (err) {
      setStatus('');
      setError(`Error: ${err.message}`);
    }
  };

  // Check if user has enough ETH
  const hasEnoughEth = balance && parseFloat(balance.formatted) >= 1;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % weaponSvgs.length);
    }, 500);

    // 组件卸载时清除定时器
    return () => clearInterval(timer);
  }, [weaponSvgs]);
  // Handle mint errors with useEffect
  useEffect(() => {
    if (mintError) {
      setError(`Error: ${mintError.message}`);
      setStatus('');
    }
  }, [mintError]);

  useEffect(() => {
    if (isMintTxError) {
      setError(`Transaction failed: ${isMintTxError.message}`);
      setStatus('');
    }
  }, [isMintTxError]);

  useEffect(() => {
    if (isMintTxSuccess) {
      refetchBalance(); // Refresh balance after successful mint
      setStatus('Weapon minted successfully! 🎉');
      setError('');
    }
  }, [isMintTxSuccess]);

  return (
    <div className="container">
      <main className="main">
        <h1 className="title">Mon Warrior Game</h1>
        
        <p className="description">
          Mint your unique weapon NFT to battle the dragon!
        </p>

        <div style={{ margin: '2rem 0' }}>
          <ConnectButton />
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', margin: '1rem 0' }}>
          <button 
            className="button"
            onClick={() => window.location.href = '/dragon'}
            style={{ 
              padding: '0.75rem 1.5rem', 
              backgroundColor: '#ff6b6b', 
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              fontSize: '1.1rem',
              cursor: 'pointer',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}
          >
            Battle Dragon 🐉
          </button>
        </div>

        <WeaponCard weaponSvg={weaponSvgs[currentIndex]} />

        <div style={{ marginTop: '2rem', width: '100%', maxWidth: '500px' }}>
          <button 
            className="button" 
            onClick={() => handleMint()}
            disabled={!isConnected || isMintLoading || isMintTxLoading || !hasEnoughEth}
            style={{ width: '100%', padding: '1rem' }}
          >
            {!isConnected 
              ? 'Connect Wallet to Mint' 
              : !hasEnoughEth 
                ? 'Insufficient TMON (1 TMON required)' 
                : isMintLoading || isMintTxLoading 
                  ? 'Minting...' 
                  : isMintTxSuccess 
                    ? 'Mint Another Weapon' 
                    : 'Mint Weapon (1 TMON)'}
          </button>

          {status && <p className="statusMessage success">{status}</p>}
          {error && <p className="statusMessage error">{error}</p>}
          
          {isMintStarted && !isMintTxSuccess && (
            <p className="statusMessage">
              Transaction submitted! Waiting for confirmation...
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
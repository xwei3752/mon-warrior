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
  const [showTooltip, setShowTooltip] = useState(false);
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

        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', margin: '1rem 0' }}>
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
          
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <div 
              style={{
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                backgroundColor: '#4CAF50',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: 'bold',
                cursor: 'pointer',
                border: '2px solid #fff',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
              }}
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            >
              ?
            </div>
            
            {showTooltip && (
              <div style={{
                position: 'absolute',
                top: '30px',
                left: '50%',
                transform: 'translateX(-50%)',
                backgroundColor: 'rgba(15, 23, 42, 0.95)',
                color: 'white',
                padding: '1.25rem 1.5rem',
                borderRadius: '12px',
                fontSize: '0.875rem',
                zIndex: 1000,
                boxShadow: '0 10px 40px rgba(0,0,0,0.3), 0 4px 12px rgba(0,0,0,0.2)',
                width: '360px',
                whiteSpace: 'normal',
                lineHeight: '1.5',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)'
              }}>
                <div style={{ 
                  marginBottom: '0.75rem', 
                  fontWeight: '600', 
                  fontSize: '0.95rem',
                  color: '#60A5FA',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                  paddingBottom: '0.5rem'
                }}>
                  🎮 Gameplay Guide
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                    <span style={{ color: '#34D399', fontSize: '0.75rem', marginTop: '0.1rem' }}>⚔️</span>
                    <span>Weapons auto-upgrade every 24 hours</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                    <span style={{ color: '#F59E0B', fontSize: '0.75rem', marginTop: '0.1rem' }}>🕐</span>
                    <span>Attack boss every 12 hours</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                    <span style={{ color: '#EF4444', fontSize: '0.75rem', marginTop: '0.1rem' }}>💥</span>
                    <span>Deal damage and earn small rewards</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                    <span style={{ color: '#A855F7', fontSize: '0.75rem', marginTop: '0.1rem' }}>🏆</span>
                    <span>Defeat boss for generous rewards</span>
                  </div>
                </div>
                <div style={{
                  position: 'absolute',
                  top: '-6px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '0',
                  height: '0',
                  borderLeft: '6px solid transparent',
                  borderRight: '6px solid transparent',
                  borderBottom: '6px solid rgba(15, 23, 42, 0.95)'
                }}></div>
              </div>
            )}
          </div>
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
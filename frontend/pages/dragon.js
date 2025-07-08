import { useState, useEffect } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt,useConfig } from 'wagmi';
import { readContract } from '@wagmi/core'
import { DRAGON_ADDRESS, DRAGON_ABI, WEAPON_NFT_ADDRESS, WEAPON_NFT_ABI } from '../utils/constants';
import Link from 'next/link';
import { createThirdwebClient,getContract } from 'thirdweb';
import WeaponCard from '../components/WeaponCard';
import { monadTestnet } from "thirdweb/chains";
import { config } from 'process';

export default function DragonPage() {
  const WagmiConfig = useConfig()
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [selectedWeapons, setSelectedWeapons] = useState([]);
  const [ownedWeapons, setOwnedWeapons] = useState([]);
  const [weaponSvgs, setWeaponSvgs] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const { address, isConnected } = useAccount();
  const [remain, setRemain] = useState(0);
  const gap12h = 12 * 60 * 60; // 12 hours in milliseconds

  const fetchTokenURIs = async (tokenIds) => {
    const svgs = {};
    
    for (const tokenId of tokenIds) {
      try {
        // 获取tokenURI
        const tokenURI = await readContract(WagmiConfig, {
          address: WEAPON_NFT_ADDRESS,
          abi: WEAPON_NFT_ABI,
          functionName: 'tokenURI',
          args: [tokenId],
        });

        // 处理base64编码的tokenURI
        if (tokenURI.startsWith('data:application/json;base64,')) {
          const base64Data = tokenURI.split(',')[1];
          const decodedString = atob(base64Data);
          const metaData = JSON.parse(decodedString);

          // 处理SVG图像
          if (metaData.image && metaData.image.startsWith('data:image/svg+xml;base64,')) {
            const imageData = metaData.image.split(',')[1];
            svgs[tokenId] = atob(imageData);
          }
        }
      } catch (err) {
        console.error(`Error fetching tokenURI for token ${tokenId}:`, err);
      }
    }
    return svgs;
  };

  // Fetch owned weapons using thirdweb
  useEffect(() => {
    const fetchOwnedWeapons = async () => {
      if (!address) return;
      
      setIsLoading(true);
      try {

        const ownedNfts = async () => {
          try {
            const response = await fetch('https://10143.insight.thirdweb.com/v1/nfts?owner_address=' + address +'&contract_address=' + WEAPON_NFT_ADDRESS,{
              headers: {
                'X-Client-Id': process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID,
              },
            });
            const nftsInfo = await response.json();
            return nftsInfo
          } catch (error) {
            throw error;
          }
        };

        const nfts = await ownedNfts(); // Fetch NFTs from thirdweb API
        
        // Get all NFTs owned by the user
        
        console.log("Owned NFTs:", nfts);
        // Extract token IDs
        const tokenIds = nfts.data.map(nft => Number(nft.token_id));
        setOwnedWeapons(tokenIds);
        
        // Get SVGs for each weapon
        const svgs = await fetchTokenURIs(tokenIds);
        setWeaponSvgs(svgs);
      } catch (err) {
        console.error("Error fetching weapons:", err);
        setError(`Error fetching weapons: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    if (isConnected) {
      fetchOwnedWeapons();
    }
  }, [address, isConnected]);

  // Read dragon's HP and initial HP
  const { data: currentHP, refetch: refetchHp } = useReadContract({
    address: DRAGON_ADDRESS,
    abi: DRAGON_ABI,
    functionName: 'hp',
    watch: true,
  });

  const { data: initialHP } = useReadContract({
    address: DRAGON_ADDRESS,
    abi: DRAGON_ABI,
    functionName: 'INITIAL_HP',
  });

  const { data: isDead } = useReadContract({
    address: DRAGON_ADDRESS,
    abi: DRAGON_ABI,
    functionName: 'isDead',
    watch: true,
  });

  const { data: playInfo } = useReadContract({
    address: DRAGON_ADDRESS,
    abi: DRAGON_ABI,
    functionName: 'players',
    args: [address],
    watch: true,
  });


  // Calculate health percentage
  const healthPercentage = currentHP && initialHP 
    ? Math.max(0, Math.min(100, (Number(currentHP) / Number(initialHP)) * 100)) 
    : 100;

  // Contract interaction for attacking
  const {
    data: hash,
    writeContract: attack,
    isPending: isAttackLoading,
    isSuccess: isAttackStarted,
    error: attackError
  } = useWriteContract();

  // Wait for transaction to complete
  const {
    isLoading: isAttackTxLoading,
    isSuccess: isAttackTxSuccess,
    isError: isAttackTxError,
  } = useWaitForTransactionReceipt({
    hash: hash
  });


  const {
    data: claimHash,
    writeContract: claim,
    isPending: isClaimLoading,
    isSuccess: isClaimkStarted,
    error: claimError
  } = useWriteContract();

  // Wait for transaction to complete
  const {
    isLoading: isClaimTxLoading,
    isSuccess: isClaimTxSuccess,
    isError: isClaimTxError,
  } = useWaitForTransactionReceipt({
    hash: claimHash
  });
  // Toggle weapon selection
  const toggleWeaponSelection = (tokenId) => {
    setSelectedWeapons(prev => {
      if (prev.includes(tokenId)) {
        return prev.filter(id => id !== tokenId);
      } else {
        return [...prev, tokenId];
      }
    });
  };

  // Handle attack button click
  const handleAttack = async () => {
    try {
      setStatus('Initiating attack...');
      setError('');
      
      // Use all owned weapons if none are selected
      const weaponsToUse = selectedWeapons.length > 0 ? selectedWeapons : ownedWeapons;
      
      if (weaponsToUse.length === 0) {
        setError("You don't have any weapons to attack with!");
        setStatus('');
        return;
      }
      
      attack({
        address: DRAGON_ADDRESS,
        abi: DRAGON_ABI,
        functionName: 'attack',
        args: [weaponsToUse], // Using all selected weapons or all owned weapons
      });
    } catch (err) {
      setStatus('');
      setError(`Error: ${err.message}`);
    }
  };

  // Handle claim button click
  const handleClaim = async () => {
    try {
      claim({
        address: DRAGON_ADDRESS,
        abi: DRAGON_ABI,
        functionName: 'claimReward',
      });
    } catch (err) {
      setStatus('');
      setError(`Error: ${err.message}`);
    }
  };

  // Handle attack errors with useEffect
  useEffect(() => {
    if (attackError) {
      setError(`Error: ${attackError.message}`);
      setStatus('');
    }
  }, [attackError]);

  useEffect(() => {
    if (isAttackTxError) {
      setError(`Transaction failed: ${isAttackTxError.message}`);
      setStatus('');
    }
  }, [isAttackTxError]);

  useEffect(() => {
    if (isAttackTxSuccess) {
      refetchHp(); // Refetch HP after successful attack
      setStatus('Attack successful! 🎉');
      setError('');
    }
  }, [isAttackTxSuccess,refetchHp]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (playInfo && Number(playInfo[1]) > 0) {
        const now = Math.floor(Date.now() / 1000);
        const next = Number(playInfo[1]) + gap12h;
        setRemain(Math.max(next - now, 0));
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [playInfo]);

  return (
    <div className="container" style={{ 
      backgroundImage: `url('/dragon-background.jpg')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      position: 'relative',
      padding: 0,
      overflow: 'hidden'
    }}>
      {/* Weapons display on the left side */}
      {isConnected && (
        <div style={{ 
          position: 'absolute', 
          left: '20px', 
          top: '50%',
          transform: 'translateY(-50%)',
          width: '200px',
          maxHeight: '80vh',
          overflowY: 'auto',
          backgroundColor: 'rgba(0,0,0,0.7)',
          borderRadius: '10px',
          padding: '1rem',
          zIndex: 5
        }}>
          <h3 style={{ 
            color: 'white', 
            textAlign: 'center',
            marginBottom: '1rem',
            textShadow: '1px 1px 2px rgba(0,0,0,0.7)'
          }}>
            Your Weapons
          </h3>
          
          {isLoading ? (
            <p style={{ color: 'white', textAlign: 'center' }}>Loading weapons...</p>
          ) : ownedWeapons.length === 0 ? (
            <p style={{ color: 'white', textAlign: 'center' }}>No weapons found</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {ownedWeapons.map(tokenId => (
                <div 
                  key={tokenId}
                  onClick={() => toggleWeaponSelection(tokenId)}
                  style={{ 
                    cursor: 'pointer',
                    border: selectedWeapons.includes(tokenId) ? '2px solid #ff6b6b' : '2px solid transparent',
                    borderRadius: '8px',
                    padding: '0.5rem',
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ color: 'white' }}>Weapon #{tokenId}</span>
                  </div>
                  {weaponSvgs[tokenId] ? (
                    <div 
                      dangerouslySetInnerHTML={{ __html: weaponSvgs[tokenId] }} 
                      style={{ 
                        display: 'flex', 
                        justifyContent: 'center', 
                        alignItems: 'center',
                        margin: '0.5rem 0',
                        maxWidth: '100%',
                        height: '120px'
                      }}
                    />
                  ) : (
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'center', 
                      alignItems: 'center',
                      margin: '0.5rem 0',
                      height: '100px',
                      color: 'white'
                    }}>
                      Loading weapon...
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          
          <div style={{ 
            marginTop: '1rem', 
            textAlign: 'center',
            color: 'white',
            fontSize: '0.8rem'
          }}>
            {selectedWeapons.length > 0 ? (
              <p>Selected: {selectedWeapons.length} weapons</p>
            ) : (
              <p>Click to select weapons or all will be used</p>
            )}
          </div>
        </div>
      )}
      <div style={{ 
        position: 'absolute', 
        top: '10%', 
        left: '50%', 
        transform: 'translateX(-50%)',
        width: '80%',
        maxWidth: '600px',
        textAlign: 'center'
      }}>
        <h1 style={{ 
          color: 'white', 
          textShadow: '2px 2px 4px rgba(0,0,0,0.7)',
          fontSize: '3rem',
          marginBottom: '1rem'
        }}>
          Dragon Battle
        </h1>
        
        {/* Health bar container */}
        <div style={{ 
          width: '100%', 
          height: '30px', 
          backgroundColor: 'rgba(0,0,0,0.5)',
          borderRadius: '15px',
          overflow: 'hidden',
          boxShadow: '0 0 10px rgba(255,0,0,0.7)',
          border: '2px solid #333'
        }}>
          {/* Health bar fill */}
          <div style={{ 
            width: `${healthPercentage}%`, 
            height: '100%', 
            backgroundColor: healthPercentage > 50 ? '#4CAF50' : healthPercentage > 20 ? '#FFC107' : '#F44336',
            transition: 'width 0.5s ease-in-out'
          }} />
        </div>
        
        <p style={{ 
          color: 'white', 
          textShadow: '1px 1px 2px rgba(0,0,0,0.7)',
          fontSize: '1.2rem',
          marginTop: '0.5rem'
        }}>
          HP: {currentHP ? currentHP.toString() : '...'} / {initialHP ? initialHP.toString() : '...'}
        </p>
        
        {isDead && (
          <div style={{
            backgroundColor: 'rgba(0,0,0,0.7)',
            color: 'white',
            padding: '1rem',
            borderRadius: '10px',
            marginTop: '1rem'
          }}>
            <h2>Dragon Defeated!</h2>
            <p>The dragon has been slain. Claim your rewards!</p>
          </div>
        )}
      </div>
      
      {/* Connect wallet button */}
      <div style={{ 
        position: 'absolute', 
        top: '20px', 
        right: '20px',
        zIndex: 10
      }}>
        <ConnectButton />
      </div>
      
      {/* Attack button */}
      <div style={{ 
        position: 'absolute', 
        right: '5%', 
        bottom: '30%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
      {currentHP > 0 && <button 
          className="button"
          onClick={handleAttack}
          disabled={!isConnected || isAttackLoading || isAttackTxLoading || isDead || ownedWeapons.length === 0 || remain > 0}
          style={{ 
            padding: '1rem 2rem', 
            backgroundColor: '#ff6b6b', 
            fontSize: '1.5rem',
            boxShadow: '0 0 20px rgba(255,0,0,0.5)',
            border: '2px solid #fff',
            cursor: isConnected && !isAttackLoading && !isAttackTxLoading && !isDead && ownedWeapons.length > 0 && remain == 0? 'pointer' : 'not-allowed',
            opacity: isConnected && !isAttackLoading && !isAttackTxLoading && !isDead && ownedWeapons.length > 0 && remain == 0? 1 : 0.7
          }}
        >
          {!isConnected 
            ? 'Connect Wallet' 
            : isDead
              ? 'Dragon Defeated'
              : isAttackLoading || isAttackTxLoading 
                ? 'Attacking...' 
                : remain > 0
                  ? `Wait ${Math.ceil(remain / 60)} minutes`
                    : ownedWeapons.length === 0 
                      ? 'No Weapons Available'
                      : 'Attack! 🗡️'}
        </button>
      }
      {currentHP == 0 && 
        <button 
          className="button"
          onClick={handleClaim}
          disabled={!isConnected || currentHP > 0}
          style={{ 
            padding: '1rem 2rem', 
            backgroundColor: '#ff6b6b', 
            fontSize: '1.5rem',
            boxShadow: '0 0 20px rgba(255,0,0,0.5)',
            border: '2px solid #fff',
            cursor: isConnected && currentHP == 0? 'pointer' : 'not-allowed',
            opacity: isConnected && currentHP == 0? 1 : 0.7
          }}
        >
          {!isConnected 
            ? 'Connect Wallet' 
            : isClaimLoading || isClaimTxLoading 
              ? 'Claiming Rewards...'
              : isClaimTxSuccess 
                ? 'Rewards Claimed! 🎉'
                  : 'Claim Rewards'
            }
        </button>
      }
        {status && <p style={{ color: 'white', marginTop: '1rem', textShadow: '1px 1px 2px rgba(0,0,0,0.7)' }}>{status}</p>}
        {error && <p style={{ color: '#ff6b6b', marginTop: '1rem', textShadow: '1px 1px 2px rgba(0,0,0,0.7)', wordWrap: 'break-word' ,maxWidth: "200px"}}>{error.length > 200 ? error.slice(0, 200) + '...' : error}</p>}
      </div>
      
      {/* Hero image at the bottom */}
      <div style={{ 
        position: 'absolute', 
        bottom: '0', 
        left: '50%', 
        transform: 'translateX(-50%)',
        width: '200px',
        height: '200px'
      }}>
        <img 
          src="/hero.png" 
          alt="Hero" 
          style={{ 
            width: '100%', 
            height: '100%',
            objectFit: 'contain',
            filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.7))'
          }} 
        />
      </div>
      
      {/* Back to home link */}
      <div style={{ 
        position: 'absolute', 
        top: '20px', 
        left: '20px',
        zIndex: 10
      }}>
        <Link 
          href="/"
          style={{ 
            color: 'white', 
            textDecoration: 'none',
            padding: '0.5rem 1rem',
            backgroundColor: 'rgba(0,0,0,0.5)',
            borderRadius: '5px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}
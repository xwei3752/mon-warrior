// Contract addresses
// Replace these with actual deployed contract addresses
export const WEAPON_NFT_ADDRESS = "0xbd605dfe16862f00631856a5c1ef5dc658a814a1";
export const DRAGON_ADDRESS = "0x8dC7eD1F4738098765F074880a7f9fc71cBFCCFA";

// Simplified ABI for Dragon contract
export const DRAGON_ABI = [
  // Read functions
  {
    inputs: [],
    name: "hp",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "INITIAL_HP",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "isDead",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "players",
    outputs: [
      { internalType: "uint256", name: "totalDamage", type: "uint256" },
      { internalType: "uint256", name: "lastAttack", type: "uint256" },
      { internalType: "bool", name: "rewardClaimed", type: "bool" }
    ],
    stateMutability: "view",
    type: "function",
  },
  // Write functions
  {
    inputs: [{ internalType: "uint256[]", name: "tokenIds", type: "uint256[]" }],
    name: "attack",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "claimReward",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  // Events
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "player",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "damage",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "hpLeft",
        type: "uint256",
      }
    ],
    name: "Attacked",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [],
    name: "DragonDefeated",
    type: "event",
  }
];

// Simplified ABI for WeaponNFT contract
export const WEAPON_NFT_ABI = [
  // Read functions
  {
    inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
    name: "getWeaponLevel",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
    name: "tokenURI",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  // Write functions
  {
    inputs: [],
    name: "mint",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  // Events
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "WeaponMinted",
    type: "event",
  },
];

// Sample weapon image SVG for display before minting
export const L1_WEAPON_SVG = `
<svg xmlns='http://www.w3.org/2000/svg' width='200.000000pt' height='200.000000pt' viewBox='0 0 200.000000 200.000000' preserveAspectRatio='xMidYMid meet'>
  <g transform='translate(0.000000,200.000000) scale(0.100000,-0.100000)' fill='#a8f318' stroke='none'>
    <path d='M204 1825 c5 -21 2 -33 -15 -51 l-22 -24 31 0 c25 0 33 -5 38 -25 3 -14 10 -25 14 -25 4 0 11 11 14 25 5 20 13 25 38 25 l31 0 -22 24 c-17 18 -20 30 -15 52 l7 28 -27 -17 c-26 -17 -29 -17 -53 -2 l-26 17 7 -27z' fill='#f35718'/>
    <path d='M1470 1460 c-19 -10 -71 -29 -114 -42 l-80 -23 -273 -300 -273 -300 54 -54 55 -55 138 132 c76 72 185 179 243 237 l105 107 -55 -7 -55 -6 -180 -186 c-162 -167 -182 -184 -194 -169 -12 15 1 32 119 154 254 262 223 237 324 252 103 16 136 37 155 99 6 23 25 71 42 107 16 37 28 68 27 70 -2 1 -19 -6 -38 -16z'/>
    <path d='M745 1171 c-11 -5 -31 -20 -44 -35 -25 -27 -26 -38 -4 -239 l6 -58 34 33 35 33 -6 79 c-6 66 -4 82 10 97 21 23 42 24 95 3 l41 -17 30 30 30 30 -54 23 c-57 25 -141 35 -173 21z'/>
    <path d='M1132 907 c-21 -22 -22 -26 -7 -60 36 -87 12 -117 -96 -117 -72 0 -76 -1 -107 -33 -18 -18 -32 -36 -32 -40 0 -4 59 -7 132 -7 l132 0 36 35 36 35 -9 83 c-12 119 -40 153 -85 104z'/>
    <path d='M612 798 l-22 -22 40 -41 40 -41 -66 -72 c-36 -40 -72 -72 -79 -72 -43 0 -63 -89 -26 -110 30 -15 66 -12 84 8 10 10 17 23 17 28 0 5 31 41 70 79 l70 69 40 -39 40 -39 22 22 23 22 -115 115 -115 115 -23 -22z'/>
  </g>
</svg>
`;

export const L2_WEAPON_SVG = `
<svg xmlns='http://www.w3.org/2000/svg' width='200.000000pt' height='200.000000pt' viewBox='0 0 200.000000 200.000000' preserveAspectRatio='xMidYMid meet'>
  <g transform='translate(0.000000,200.000000) scale(0.100000,-0.100000)' fill='#088c16' stroke='none'>
    <path d='M204 1825 c5 -21 2 -33 -15 -51 l-22 -24 31 0 c25 0 33 -5 38 -25 3 -14 10 -25 14 -25 4 0 11 11 14 25 5 20 13 25 38 25 l31 0 -22 24 c-17 18 -20 30 -15 52 l7 28 -27 -17 c-26 -17 -29 -17 -53 -2 l-26 17 7 -27z' fill='#f35718'/>
    <path d='M514 1825 c5 -21 2 -33 -15 -51 l-22 -24 31 0 c25 0 33 -5 38 -25 3 -14 10 -25 14 -25 4 0 11 11 14 25 5 20 13 25 38 25 l31 0 -22 24 c-17 18 -20 30 -15 52 l7 28 -27 -17 c-26 -17 -29 -17 -53 -2 l-26 17 7 -27z' fill='#f35718'/>
    <path d='M1470 1460 c-19 -10 -71 -29 -114 -42 l-80 -23 -273 -300 -273 -300 54 -54 55 -55 138 132 c76 72 185 179 243 237 l105 107 -55 -7 -55 -6 -180 -186 c-162 -167 -182 -184 -194 -169 -12 15 1 32 119 154 254 262 223 237 324 252 103 16 136 37 155 99 6 23 25 71 42 107 16 37 28 68 27 70 -2 1 -19 -6 -38 -16z'/>
    <path d='M745 1171 c-11 -5 -31 -20 -44 -35 -25 -27 -26 -38 -4 -239 l6 -58 34 33 35 33 -6 79 c-6 66 -4 82 10 97 21 23 42 24 95 3 l41 -17 30 30 30 30 -54 23 c-57 25 -141 35 -173 21z'/>
    <path d='M1132 907 c-21 -22 -22 -26 -7 -60 36 -87 12 -117 -96 -117 -72 0 -76 -1 -107 -33 -18 -18 -32 -36 -32 -40 0 -4 59 -7 132 -7 l132 0 36 35 36 35 -9 83 c-12 119 -40 153 -85 104z'/>
    <path d='M612 798 l-22 -22 40 -41 40 -41 -66 -72 c-36 -40 -72 -72 -79 -72 -43 0 -63 -89 -26 -110 30 -15 66 -12 84 8 10 10 17 23 17 28 0 5 31 41 70 79 l70 69 40 -39 40 -39 22 22 23 22 -115 115 -115 115 -23 -22z'/>
  </g>
</svg>
`;

export const L3_WEAPON_SVG = `
<svg xmlns='http://www.w3.org/2000/svg' width='200.000000pt' height='200.000000pt' viewBox='0 0 200.000000 200.000000' preserveAspectRatio='xMidYMid meet'>
  <g transform='translate(0.000000,200.000000) scale(0.100000,-0.100000)' fill='#285ddf' stroke='none'>
    <path d='M204 1825 c5 -21 2 -33 -15 -51 l-22 -24 31 0 c25 0 33 -5 38 -25 3 -14 10 -25 14 -25 4 0 11 11 14 25 5 20 13 25 38 25 l31 0 -22 24 c-17 18 -20 30 -15 52 l7 28 -27 -17 c-26 -17 -29 -17 -53 -2 l-26 17 7 -27z' fill='#f35718'/>
    <path d='M514 1825 c5 -21 2 -33 -15 -51 l-22 -24 31 0 c25 0 33 -5 38 -25 3 -14 10 -25 14 -25 4 0 11 11 14 25 5 20 13 25 38 25 l31 0 -22 24 c-17 18 -20 30 -15 52 l7 28 -27 -17 c-26 -17 -29 -17 -53 -2 l-26 17 7 -27z' fill='#f35718'/>
    <path d='M824 1825 c5 -21 2 -33 -15 -51 l-22 -24 31 0 c25 0 33 -5 38 -25 3 -14 10 -25 14 -25 4 0 11 11 14 25 5 20 13 25 38 25 l31 0 -22 24 c-17 18 -20 30 -15 52 l7 28 -27 -17 c-26 -17 -29 -17 -53 -2 l-26 17 7 -27z' fill='#f35718'/>
    <path d='M1470 1460 c-19 -10 -71 -29 -114 -42 l-80 -23 -273 -300 -273 -300 54 -54 55 -55 138 132 c76 72 185 179 243 237 l105 107 -55 -7 -55 -6 -180 -186 c-162 -167 -182 -184 -194 -169 -12 15 1 32 119 154 254 262 223 237 324 252 103 16 136 37 155 99 6 23 25 71 42 107 16 37 28 68 27 70 -2 1 -19 -6 -38 -16z'/>
    <path d='M745 1171 c-11 -5 -31 -20 -44 -35 -25 -27 -26 -38 -4 -239 l6 -58 34 33 35 33 -6 79 c-6 66 -4 82 10 97 21 23 42 24 95 3 l41 -17 30 30 30 30 -54 23 c-57 25 -141 35 -173 21z'/>
    <path d='M1132 907 c-21 -22 -22 -26 -7 -60 36 -87 12 -117 -96 -117 -72 0 -76 -1 -107 -33 -18 -18 -32 -36 -32 -40 0 -4 59 -7 132 -7 l132 0 36 35 36 35 -9 83 c-12 119 -40 153 -85 104z'/>
    <path d='M612 798 l-22 -22 40 -41 40 -41 -66 -72 c-36 -40 -72 -72 -79 -72 -43 0 -63 -89 -26 -110 30 -15 66 -12 84 8 10 10 17 23 17 28 0 5 31 41 70 79 l70 69 40 -39 40 -39 22 22 23 22 -115 115 -115 115 -23 -22z'/>
  </g>
</svg>
`;

export const L4_WEAPON_SVG = `
<svg xmlns='http://www.w3.org/2000/svg' width='200.000000pt' height='200.000000pt' viewBox='0 0 200.000000 200.000000' preserveAspectRatio='xMidYMid meet'>
  <g transform='translate(0.000000,200.000000) scale(0.100000,-0.100000)' fill='#b417f3' stroke='none'>
    <path d='M204 1825 c5 -21 2 -33 -15 -51 l-22 -24 31 0 c25 0 33 -5 38 -25 3 -14 10 -25 14 -25 4 0 11 11 14 25 5 20 13 25 38 25 l31 0 -22 24 c-17 18 -20 30 -15 52 l7 28 -27 -17 c-26 -17 -29 -17 -53 -2 l-26 17 7 -27z' fill='#f35718'/>
    <path d='M514 1825 c5 -21 2 -33 -15 -51 l-22 -24 31 0 c25 0 33 -5 38 -25 3 -14 10 -25 14 -25 4 0 11 11 14 25 5 20 13 25 38 25 l31 0 -22 24 c-17 18 -20 30 -15 52 l7 28 -27 -17 c-26 -17 -29 -17 -53 -2 l-26 17 7 -27z' fill='#f35718'/>
    <path d='M824 1825 c5 -21 2 -33 -15 -51 l-22 -24 31 0 c25 0 33 -5 38 -25 3 -14 10 -25 14 -25 4 0 11 11 14 25 5 20 13 25 38 25 l31 0 -22 24 c-17 18 -20 30 -15 52 l7 28 -27 -17 c-26 -17 -29 -17 -53 -2 l-26 17 7 -27z' fill='#f35718'/>
    <path d='M1134 1825 c5 -21 2 -33 -15 -51 l-22 -24 31 0 c25 0 33 -5 38 -25 3 -14 10 -25 14 -25 4 0 11 11 14 25 5 20 13 25 38 25 l31 0 -22 24 c-17 18 -20 30 -15 52 l7 28 -27 -17 c-26 -17 -29 -17 -53 -2 l-26 17 7 -27z' fill='#f35718'/>
    <path d='M1470 1460 c-19 -10 -71 -29 -114 -42 l-80 -23 -273 -300 -273 -300 54 -54 55 -55 138 132 c76 72 185 179 243 237 l105 107 -55 -7 -55 -6 -180 -186 c-162 -167 -182 -184 -194 -169 -12 15 1 32 119 154 254 262 223 237 324 252 103 16 136 37 155 99 6 23 25 71 42 107 16 37 28 68 27 70 -2 1 -19 -6 -38 -16z'/>
    <path d='M745 1171 c-11 -5 -31 -20 -44 -35 -25 -27 -26 -38 -4 -239 l6 -58 34 33 35 33 -6 79 c-6 66 -4 82 10 97 21 23 42 24 95 3 l41 -17 30 30 30 30 -54 23 c-57 25 -141 35 -173 21z'/>
    <path d='M1132 907 c-21 -22 -22 -26 -7 -60 36 -87 12 -117 -96 -117 -72 0 -76 -1 -107 -33 -18 -18 -32 -36 -32 -40 0 -4 59 -7 132 -7 l132 0 36 35 36 35 -9 83 c-12 119 -40 153 -85 104z'/>
    <path d='M612 798 l-22 -22 40 -41 40 -41 -66 -72 c-36 -40 -72 -72 -79 -72 -43 0 -63 -89 -26 -110 30 -15 66 -12 84 8 10 10 17 23 17 28 0 5 31 41 70 79 l70 69 40 -39 40 -39 22 22 23 22 -115 115 -115 115 -23 -22z'/>
  </g>
</svg>
`;

export const L5_WEAPON_SVG = `
<svg xmlns='http://www.w3.org/2000/svg' width='200.000000pt' height='200.000000pt' viewBox='0 0 200.000000 200.000000' preserveAspectRatio='xMidYMid meet'>
  <g transform='translate(0.000000,200.000000) scale(0.100000,-0.100000)' fill='#f7e658' stroke='none'>
    <path d='M204 1825 c5 -21 2 -33 -15 -51 l-22 -24 31 0 c25 0 33 -5 38 -25 3 -14 10 -25 14 -25 4 0 11 11 14 25 5 20 13 25 38 25 l31 0 -22 24 c-17 18 -20 30 -15 52 l7 28 -27 -17 c-26 -17 -29 -17 -53 -2 l-26 17 7 -27z' fill='#f35718'/>
    <path d='M514 1825 c5 -21 2 -33 -15 -51 l-22 -24 31 0 c25 0 33 -5 38 -25 3 -14 10 -25 14 -25 4 0 11 11 14 25 5 20 13 25 38 25 l31 0 -22 24 c-17 18 -20 30 -15 52 l7 28 -27 -17 c-26 -17 -29 -17 -53 -2 l-26 17 7 -27z' fill='#f35718'/>
    <path d='M824 1825 c5 -21 2 -33 -15 -51 l-22 -24 31 0 c25 0 33 -5 38 -25 3 -14 10 -25 14 -25 4 0 11 11 14 25 5 20 13 25 38 25 l31 0 -22 24 c-17 18 -20 30 -15 52 l7 28 -27 -17 c-26 -17 -29 -17 -53 -2 l-26 17 7 -27z' fill='#f35718'/>
    <path d='M1134 1825 c5 -21 2 -33 -15 -51 l-22 -24 31 0 c25 0 33 -5 38 -25 3 -14 10 -25 14 -25 4 0 11 11 14 25 5 20 13 25 38 25 l31 0 -22 24 c-17 18 -20 30 -15 52 l7 28 -27 -17 c-26 -17 -29 -17 -53 -2 l-26 17 7 -27z' fill='#f35718'/>
    <path d='M1444 1825 c5 -21 2 -33 -15 -51 l-22 -24 31 0 c25 0 33 -5 38 -25 3 -14 10 -25 14 -25 4 0 11 11 14 25 5 20 13 25 38 25 l31 0 -22 24 c-17 18 -20 30 -15 52 l7 28 -27 -17 c-26 -17 -29 -17 -53 -2 l-26 17 7 -27z' fill='#f35718'/>
    <path d='M1470 1460 c-19 -10 -71 -29 -114 -42 l-80 -23 -273 -300 -273 -300 54 -54 55 -55 138 132 c76 72 185 179 243 237 l105 107 -55 -7 -55 -6 -180 -186 c-162 -167 -182 -184 -194 -169 -12 15 1 32 119 154 254 262 223 237 324 252 103 16 136 37 155 99 6 23 25 71 42 107 16 37 28 68 27 70 -2 1 -19 -6 -38 -16z'/>
    <path d='M745 1171 c-11 -5 -31 -20 -44 -35 -25 -27 -26 -38 -4 -239 l6 -58 34 33 35 33 -6 79 c-6 66 -4 82 10 97 21 23 42 24 95 3 l41 -17 30 30 30 30 -54 23 c-57 25 -141 35 -173 21z'/>
    <path d='M1132 907 c-21 -22 -22 -26 -7 -60 36 -87 12 -117 -96 -117 -72 0 -76 -1 -107 -33 -18 -18 -32 -36 -32 -40 0 -4 59 -7 132 -7 l132 0 36 35 36 35 -9 83 c-12 119 -40 153 -85 104z'/>
    <path d='M612 798 l-22 -22 40 -41 40 -41 -66 -72 c-36 -40 -72 -72 -79 -72 -43 0 -63 -89 -26 -110 30 -15 66 -12 84 8 10 10 17 23 17 28 0 5 31 41 70 79 l70 69 40 -39 40 -39 22 22 23 22 -115 115 -115 115 -23 -22z'/>
  </g>
</svg>
`;
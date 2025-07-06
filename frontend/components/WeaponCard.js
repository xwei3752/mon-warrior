import React from 'react';
import { L1_WEAPON_SVG } from '../utils/constants';

const WeaponCard = ({ weaponSvg = L1_WEAPON_SVG }) => {
  return (
    <div className="card">
      <h2 style={{ color: 'var(--primary-color)', marginBottom: '1rem' }}>Powerful Weapon</h2>
      <div 
        dangerouslySetInnerHTML={{ __html: weaponSvg }} 
        style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          margin: '1rem 0'
        }}
      />
      <p style={{ fontSize: '1rem', marginTop: '1rem' }}>
        A powerful weapon pure on-chain. Mint your own unique weapon to battle the dragon!
      </p>
    </div>
  );
};

export default WeaponCard;
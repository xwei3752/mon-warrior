// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

import "./WeaponNFT.sol";


contract Dragon is Ownable {
    uint256 public constant INITIAL_HP = 10000;
    uint256 public hp = INITIAL_HP;
    uint256 public lastAttackTime;
    uint256 public rewardPool;
    address public weaponNFT;
    bool public isDead;

    struct PlayerInfo {
        uint256 totalDamage;
        uint256 lastAttack;
        bool rewardClaimed;
    }

    mapping(address => PlayerInfo) public players;
    address[] public attackers;

    event Attacked(address indexed player, uint256 damage, uint256 hpLeft);
    event RewardClaimed(address indexed player, uint256 amount);
    event DragonDefeated();

    constructor(address _weaponNFT) Ownable(msg.sender)  {
        weaponNFT = _weaponNFT;
    }

    function attack(uint256[] calldata tokenIds) external {
        require(!isDead, "Dragon is already dead");
        PlayerInfo storage info = players[msg.sender];
        require(block.timestamp - info.lastAttack >= 12 hours, "Attack cooldown: 12h");
        WeaponNFT nft = WeaponNFT(payable(weaponNFT));
        uint256 damage = 0;
        for (uint256 i = 0; i < tokenIds.length; i++) {
            require(nft.ownerOf(tokenIds[i]) == msg.sender, "Not the owner of this WeaponNFT");
            uint256 level = nft.getWeaponLevel(tokenIds[i]);
            damage += level * level; // Damage is level squared
        }
        if (info.totalDamage == 0) {
            attackers.push(msg.sender);
        }
        if (damage >= hp) {
            damage = hp;
            hp = 0;
            isDead = true;
            emit DragonDefeated();
        } else {
            hp -= damage;
        }
        info.totalDamage += damage;
        info.lastAttack = block.timestamp;

        uint256 smallReward = rewardPool * damage / (INITIAL_HP * 10); // 0.1% of the total damage dealt
        if (smallReward > 0 && address(this).balance >= smallReward) {
            payable(msg.sender).transfer(smallReward);
            rewardPool -= smallReward;
        }
        emit Attacked(msg.sender, damage, hp);
    }

    function claimReward() external {
        require(isDead, "Dragon not dead yet");
        PlayerInfo storage info = players[msg.sender];
        require(info.totalDamage > 0, "No damage dealt");
        require(!info.rewardClaimed, "Already claimed");
        uint256 amount = (rewardPool * info.totalDamage) / INITIAL_HP;
        info.rewardClaimed = true;
        require(amount > 0, "No reward");
        payable(msg.sender).transfer(amount);
        emit RewardClaimed(msg.sender, amount);
    }

    function getAttackers() external view returns (address[] memory) {
        return attackers;
    }

    function setWeaponNFT(address _weaponNFT) external onlyOwner {
        require(weaponNFT == address(0), "WeaponNFT already set");
        weaponNFT = _weaponNFT;
    }

    /**
     * @dev Withdraws base tokens from the contract to the owner.
     * @param amount The amount of tokens to withdraw
     */
    function withdraw(uint256 amount) external onlyOwner {
        payable(owner()).transfer(amount);
    }

    receive() external payable {
        rewardPool += msg.value;
    }
}

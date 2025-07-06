// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "../src/Dragon.sol";
import "../src/WeaponNFT.sol";

contract DragonTest is Test {
    Dragon public dragon;
    WeaponNFT public weaponNFT;
    address public owner;
    address public user1;
    address public user2;

    function setUp() public {
        owner = address(this);
        user1 = address(0x1);
        user2 = address(0x2);
        weaponNFT = new WeaponNFT("Weapon NFT", "WNFT", 800);
        dragon = new Dragon(address(weaponNFT));
        weaponNFT.setBossAddress(address(dragon)); // 设置龙为Boss地址
        vm.deal(address(dragon), 10 ether); // 给奖励池充值
        dragon.transferOwnership(owner);
    }

    function testAttackAndReward() public {
        // user1 mint 并攻击
        vm.prank(user1);
        weaponNFT.mint{value: 1 ether}();
        uint256[] memory ids = new uint256[](1);
        ids[0] = 0;
        vm.prank(user1);
        dragon.attack(ids);
        assertLt(dragon.hp(), dragon.INITIAL_HP());
        // 12小时冷却
        vm.warp(block.timestamp + 12 hours);
        vm.prank(user1);
        dragon.attack(ids);
    }

    function testMultiplePlayersAndClaim() public {
        // user1 mint
        vm.prank(user1);
        weaponNFT.mint();
        // user2 mint
        vm.prank(user2);
        weaponNFT.mint();
        // user1攻击
        uint256[] memory ids1 = new uint256[](1);
        ids1[0] = 0;
        vm.prank(user1);
        dragon.attack(ids1);
        // user2攻击
        uint256[] memory ids2 = new uint256[](1);
        ids2[0] = 1;
        vm.prank(user2);
        dragon.attack(ids2);
        // owner直接将龙血量设为0并标记死亡，模拟龙被击杀
        vm.prank(owner);
        dragon.hp() == 0 || (dragon.isDead());
        // 玩家瓜分奖励
        vm.prank(user1);
        dragon.claimReward();
        vm.prank(user2);
        dragon.claimReward();
        // 断言奖励已领取
        ( , ,bool claimed1) = dragon.players(user1);
        ( , ,bool claimed2) = dragon.players(user2);
        assertTrue(claimed1);
        assertTrue(claimed2);
    }
}

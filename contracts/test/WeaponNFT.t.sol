// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "../src/WeaponNFT.sol";
import "../src/Dragon.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";


contract WeaponNFTTest is Test {
    Dragon public dragon;
    WeaponNFT public weaponNFT;
    address public owner;
    address public user1;
    address public user2;

    function setUp() public {
        owner = address(this);
        user1 = address(0x1);
        user2 = address(0x2);


        // Deploy WeaponNFT
        weaponNFT = new WeaponNFT("Weapon NFT", "WNFT", 800);
        dragon = new Dragon(address(weaponNFT));
        weaponNFT.setBossAddress(address(dragon));
        vm.deal(address(user1), 10 ether);
    }

    function testMint() public {
        // User1 mints a weapon
        vm.prank(user1);
        weaponNFT.mint{value: 1 ether}();

        // Check that the weapon was minted
        assertEq(weaponNFT.ownerOf(0), user1);
        assertEq(weaponNFT.getWeaponLevel(0), 1);
    }


}
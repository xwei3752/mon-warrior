// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "forge-std/Script.sol";
import {WeaponNFT} from "../src/WeaponNFT.sol";
import {Dragon} from "../src/Dragon.sol";

contract DeployDragonAndWeaponNFT is Script {
    function run() external {
        vm.startBroadcast();
        WeaponNFT weaponNFT = new WeaponNFT("Weapon NFT", "WNFT", 800);

        Dragon dragon = new Dragon(address(weaponNFT));
        weaponNFT.setBossAddress(address(dragon));
        vm.stopBroadcast();
    }
}

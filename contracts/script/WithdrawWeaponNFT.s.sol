// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "forge-std/Script.sol";
import {WeaponNFT} from "../src/WeaponNFT.sol";

contract WithdrawWeaponNFTScript is Script {
    function run() external {
        // 部署后WeaponNFT合约地址
        
        address weaponNFTAddress = vm.envAddress("WEAPON_NFT_ADDRESS");
        uint256 withdrawAmount = vm.envUint("WITHDRAW_AMOUNT"); // 单位: wei

        vm.startBroadcast();
        WeaponNFT weaponNFT = WeaponNFT(payable(weaponNFTAddress));
        weaponNFT.withdraw(withdrawAmount);
        vm.stopBroadcast();
    }
}
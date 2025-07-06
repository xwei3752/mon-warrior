// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "forge-std/Script.sol";
import {Dragon} from "../src/Dragon.sol";

contract WithdrawDragonScript is Script {
    function run() external {
        // 部署后WeaponNFT合约地址
        
        address dragonAddress = vm.envAddress("DRAGON_ADDRESS");
        uint256 withdrawAmount = vm.envUint("WITHDRAW_AMOUNT"); // 单位: wei

        vm.startBroadcast();
        Dragon dragonContract = Dragon(payable(dragonAddress));
        dragonContract.withdraw(withdrawAmount);
        vm.stopBroadcast();
    }
}
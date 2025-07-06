// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "forge-std/Script.sol";
import {WeaponNFT} from "../src/WeaponNFT.sol";

contract QueryWeaponNFTTokenURI is Script {
    function run() external view returns (string memory) {
        address weaponNFTAddress = vm.envAddress("WEAPON_NFT_ADDRESS");
        uint256 tokenId = 0;
        WeaponNFT weaponNFT = WeaponNFT(payable(weaponNFTAddress));
        string memory uri = weaponNFT.tokenURI(tokenId);
        console.log("TokenURI:", uri);
        return uri;
    }
}

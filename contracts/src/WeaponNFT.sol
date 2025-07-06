// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import {Base64} from "@openzeppelin/contracts/utils/Base64.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/**
 * @title WeaponNFT
 * @dev A weapon NFT contract where users can mint weapons by spending 1 base token.
 * Weapons start at level 1 and can be upgraded every 24 hours up to level 5.
 */
contract WeaponNFT is ERC721Enumerable, Ownable {
    // Token counter for generating unique token IDs
    uint256 private _nextTokenId;

    // Constants
    uint256 public constant MAX_LEVEL = 5;
    uint256 public constant UPGRADE_COOLDOWN = 24 hours;
    uint256 public constant MINT_COST = 1 * 10**18; // 1 token with 18 decimals
    uint256 public constant BOSS_DENOMINATOR = 1000; // 1,000 tokens for boss fight

    // Mappings to track weapon properties
    mapping(uint256 => uint256) public weaponTransferTime;

    address public bossAddress;

    uint256 public bossNumerator; // 1,000 tokens for boss fight
    // Events
    event WeaponMinted(address indexed owner, uint256 indexed tokenId);

    /**
     * @dev Constructor initializes the ERC721 token with name and symbol and sets the base token.
     * @param name_ The name of the NFT collection
     * @param symbol_ The symbol of the NFT collection
     */
    constructor(
        string memory name_,
        string memory symbol_,
        uint256 bossNumerator_
    ) ERC721(name_, symbol_) Ownable(msg.sender) {
        bossNumerator = bossNumerator_;
    }

    function setRewardNumerator(uint256 bossNumerator_) external onlyOwner {
        require(bossNumerator_ > 0, "WeaponNFT: Boss numerator must be greater than zero");
        bossNumerator = bossNumerator_;
    }

    function setBossAddress(address _bossAddress) external onlyOwner {
        require(_bossAddress != address(0), "WeaponNFT: Boss address cannot be zero");
        bossAddress = _bossAddress;
    }
    /**
     * @dev Mints a new weapon NFT by sending 1 ETH.
     * The weapon starts at level 1.
     */
    function mint() external payable {
        require(bossAddress != address(0), "WeaponNFT: Boss address not set");
        require(msg.value == 1 ether, "WeaponNFT: Must send exactly 1 Mon");

        // Get the next token ID
        uint256 tokenId = _nextTokenId;
        _nextTokenId++;

        // Mint the NFT
        _safeMint(msg.sender, tokenId);

        // Set initial properties
        weaponTransferTime[tokenId] = block.timestamp;

        uint256 amountToSend = msg.value * bossNumerator / BOSS_DENOMINATOR;
        (bool success, ) = payable(bossAddress).call{value: amountToSend}("");
        require(success, "WeaponNFT: Failed to send ether to boss");

        emit WeaponMinted(msg.sender, tokenId);
    }

    /**
     * @dev Checks if a token exists.
     * @param tokenId The ID of the token to check
     * @return True if the token exists, false otherwise
     */
    function _tokenExists(uint256 tokenId) internal view returns (bool) {
        return weaponTransferTime[tokenId] > 0;
    }

    /**
     * @dev Returns the current level of a weapon.
     * @param tokenId The ID of the weapon
     * @return The current level of the weapon
     */
    function getWeaponLevel(uint256 tokenId) public view returns (uint256) {
        require(_tokenExists(tokenId), "WeaponNFT: Weapon does not exist");
        uint256 timeSinceTransfer = block.timestamp - weaponTransferTime[tokenId];
        if (timeSinceTransfer > 5 * UPGRADE_COOLDOWN) {
            return MAX_LEVEL;
        }
        return (timeSinceTransfer / UPGRADE_COOLDOWN) + 1; // Level is based on time since transfer
    }

    /**
     * @dev Withdraws base tokens from the contract to the owner.
     * @param amount The amount of tokens to withdraw
     */
    function withdraw(uint256 amount) external onlyOwner {
        payable(owner()).transfer(amount);
    }

    /**
     * @dev Overrides the transferFrom function to update weaponTransferTime on transfer.
     */
    function transferFrom(address from, address to, uint256 tokenId) public override(ERC721, IERC721) {
        super.transferFrom(from, to, tokenId);
        weaponTransferTime[tokenId] = block.timestamp;
    }

    function _baseURI() internal pure override returns (string memory) {
        return "data:application/json;base64,";
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(tokenId < totalSupply());

        string memory number = Strings.toString(tokenId);

        uint256 level = getWeaponLevel(tokenId);

        bytes memory stars_tags = "";
        uint256 start_x = 204;
        for (uint256 i = 0; i < level; i++) {
            uint256 offset_x = start_x + (i * 310);
            bytes memory single_star = abi.encodePacked("<path d='M", Strings.toString(offset_x), " 1825 c5 -21 2 -33 -15 -51 l-22 -24 31 0 c25 0 33 -5 38 -25 3 -14 10 -25 14 -25 4 0 11 11 14 25 5 20 13 25 38 25 l31 0 -22 24 c-17 18 -20 30 -15 52 l7 28 -27 -17 c-26 -17 -29 -17 -53 -2 l-26 17 7 -27z' fill='#f35718'/>");
            stars_tags = abi.encodePacked(stars_tags, single_star);
        }
        string memory json = Base64.encode(
            bytes(
                string(
                    abi.encodePacked(
                        '{"name": "Weapon #',
                        number,
                        '","description": "mon warrior weapon!", ',
                        '"attributes": [{"trait_type": "level", "value": ',
                        Strings.toString(level),
                        '}], "image": "data:image/svg+xml;base64,',
                        Base64.encode(
                            abi.encodePacked(
                                "<svg xmlns='http://www.w3.org/2000/svg' width='200.000000pt' height='200.000000pt' viewBox='0 0 200.000000 200.000000' preserveAspectRatio='xMidYMid meet'>",
                                "<g transform='translate(0.000000,200.000000) scale(0.100000,-0.100000)' fill='#",
                                getWeaponColor(level),
                                "' stroke='none'>",
                                stars_tags,
                                "<path d='M1470 1460 c-19 -10 -71 -29 -114 -42 l-80 -23 -273 -300 -273 -300 54 -54 55 -55 138 132 c76 72 185 179 243 237 l105 107 -55 -7 -55 -6 -180 -186 c-162 -167 -182 -184 -194 -169 -12 15 1 32 119 154 254 262 223 237 324 252 103 16 136 37 155 99 6 23 25 71 42 107 16 37 28 68 27 70 -2 1 -19 -6 -38 -16z'/>",
                                "<path d='M745 1171 c-11 -5 -31 -20 -44 -35 -25 -27 -26 -38 -4 -239 l6 -58 34 33 35 33 -6 79 c-6 66 -4 82 10 97 21 23 42 24 95 3 l41 -17 30 30 30 30 -54 23 c-57 25 -141 35 -173 21z'/>",
                                "<path d='M1132 907 c-21 -22 -22 -26 -7 -60 36 -87 12 -117 -96 -117 -72 0 -76 -1 -107 -33 -18 -18 -32 -36 -32 -40 0 -4 59 -7 132 -7 l132 0 36 35 36 35 -9 83 c-12 119 -40 153 -85 104z'/>",
                                "<path d='M612 798 l-22 -22 40 -41 40 -41 -66 -72 c-36 -40 -72 -72 -79 -72 -43 0 -63 -89 -26 -110 30 -15 66 -12 84 8 10 10 17 23 17 28 0 5 31 41 70 79 l70 69 40 -39 40 -39 22 22 23 22 -115 115 -115 115 -23 -22z'/>",
                                "</g></svg>"
                            )
                        ),
                        '"}'
                    )
                )
            )
        );

        return string(abi.encodePacked(_baseURI(), json));
    }

    function getWeaponColor(uint256 level) public pure returns (string memory) {
        if (level == 1) {
            return "a8f318"; // Light Green
        } else if (level == 2) {
            return "088c16"; // Dark Green
        } else if (level == 3) {
            return "285ddf"; // Blue
        } else if (level == 4) {
            return "b417f3"; // Purple
        } else if (level == 5) {
            return "f7e658"; // Gold
        }
        return "#000000"; // Default to black for invalid levels
    }

    receive() external payable {
        
    }
}
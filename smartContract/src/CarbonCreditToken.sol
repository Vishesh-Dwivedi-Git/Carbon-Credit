// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CarbonCreditToken is ERC20, Ownable {
    mapping(address => bool) public authorizedUsers; // Track authorized users

    constructor(address initialOwner) 
        ERC20("Carbon-Credit-Token", "CCT") 
        Ownable(msg.sender) 
    {
        require(initialOwner != address(0), "Invalid owner address");
        _mint(initialOwner, 500 * 10 ** decimals());
    }

    event Minted(address indexed to, uint256 amount);
    event Burned(address indexed from, uint256 amount);
    event Transferred(address indexed from, address indexed to, uint256 amount);
    event UserAuthorized(address indexed user);

    // Authorize users for transfers (onlyOwner)
    function authorizeUser(address user) external onlyOwner {
        require(user != address(0), "Invalid address");
        authorizedUsers[user] = true;
        emit UserAuthorized(user);
    }

    // Transfer tokens from the owner to the authorized user
    function transferFromOwnerOnLogin(address to, uint256 amount) external onlyOwner {
        require(authorizedUsers[to], "User not authorized");
        require(to != address(0), "Invalid recipient address");
        require(balanceOf(owner()) >= amount, "Insufficient balance");

        _transfer(owner(), to, amount);
        emit Transferred(owner(), to, amount);
    }

    // Burn tokens (onlyOwner)
    function burn(uint256 amount) external onlyOwner {
        _burn(owner(), amount);
        emit Burned(owner(), amount);
    }
}

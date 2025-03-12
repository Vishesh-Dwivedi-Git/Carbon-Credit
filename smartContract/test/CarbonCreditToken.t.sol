// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Test.sol";
import "../src/CarbonCreditToken.sol"; // Adjust path if needed

contract CarbonCreditTokenTest is Test {
    CarbonCreditToken token;
    address owner = address(this);      // Test contract acting as owner
    address user1 = address(0x1);       // Sample authorized user
    address user2 = address(0x2);       // Sample unauthorized user

    function setUp() public {
        token = new CarbonCreditToken(owner);  // Deploy contract
    }

    /// @dev Test initial token supply
    function testInitialSupply() public {
        assertEq(token.balanceOf(owner), 500 * 10 ** token.decimals());
    }

    /// @dev Test authorization of a user
    function testAuthorizeUser() public {
        token.authorizeUser(user1);
        assertTrue(token.authorizedUsers(user1));
    }

 


    /// @dev Test authorized user can receive tokens
    function testTransferFromOwnerOnLogin() public {
        token.authorizeUser(user1);

        uint256 initialOwnerBalance = token.balanceOf(owner);

        // Simulate transaction as owner to transfer tokens
        vm.prank(owner);  
        token.transferFromOwnerOnLogin(user1, 100 * 10 ** token.decimals());

        assertEq(token.balanceOf(user1), 100 * 10 ** token.decimals());
        assertEq(token.balanceOf(owner), initialOwnerBalance - (100 * 10 ** token.decimals()));
    }

    /// @dev Test burn tokens
    function testBurnTokens() public {
        uint256 initialBalance = token.balanceOf(owner);

        token.burn(100 * 10 ** token.decimals());

        assertEq(token.balanceOf(owner), initialBalance - (100 * 10 ** token.decimals()));
    }

    /// @dev Test burn failure with insufficient balance
    function testBurnWithInsufficientBalance() public {
        uint256 excessiveAmount = token.balanceOf(owner) + 1;

        vm.expectRevert();
        token.burn(excessiveAmount);  // Attempt to burn more than available balance
    }
}

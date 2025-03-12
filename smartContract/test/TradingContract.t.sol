// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Test.sol";
import "../src/TradingContract.sol";
import "../src/CarbonCreditToken.sol";

contract TradingContractTest is Test {
    CarbonCreditToken cctToken;
    TradingContract tradingContract;

    address owner = address(this); // Test contract as the owner
    address seller = address(0x1);
    address buyer = address(0x2);

    function setUp() public {
        cctToken = new CarbonCreditToken(owner);
        tradingContract = new TradingContract(address(cctToken));

        // Authorize seller and buyer
        cctToken.authorizeUser(seller);
        cctToken.authorizeUser(buyer);

        // Transfer tokens to seller and buyer within minted supply
        cctToken.transferFromOwnerOnLogin(seller, 400 * 10**18);
        cctToken.transferFromOwnerOnLogin(buyer, 100 * 10**18);

        // Approve the contract for trade execution
        vm.prank(seller);
        cctToken.approve(address(tradingContract), 400 * 10**18);
    }

    /// @dev Successful trade execution
    function testExecuteTradeSuccess() public {
        uint256 initialSellerBalance = cctToken.balanceOf(seller);
        uint256 initialBuyerBalance = cctToken.balanceOf(buyer);

        vm.prank(seller);
        tradingContract.executeTrade(seller, buyer, 100 * 10**18, 1 ether);

        assertEq(cctToken.balanceOf(seller), initialSellerBalance - (100 * 10**18));
        assertEq(cctToken.balanceOf(buyer), initialBuyerBalance + (100 * 10**18));
    }

    /// @dev Trade should fail if seller doesn't have enough tokens
    function testExecuteTradeInsufficientBalance() public {
        vm.prank(seller);
        vm.expectRevert("Seller does not have enough CCT");
        tradingContract.executeTrade(seller, buyer, 1000 * 10**18, 1 ether);
    }

    /// @dev Trade should fail if contract is not approved by seller
    function testExecuteTradeWithoutApproval() public {
        vm.prank(seller);
        cctToken.approve(address(tradingContract), 0);

        vm.prank(seller);
        vm.expectRevert("Seller has not approved the contract");
        tradingContract.executeTrade(seller, buyer, 100 * 10**18, 1 ether);
    }

    /// @dev Check order data after successful trade
    function testOrderDataStoredCorrectly() public {
        vm.prank(seller);
        tradingContract.executeTrade(seller, buyer, 100 * 10**18, 1 ether);

        TradingContract.Order memory order = tradingContract.getUserOrders(seller)[0];
        assertEq(order.seller, seller);
        assertEq(order.buyer, buyer);
        assertEq(order.cctAmount, 100 * 10**18);
        assertEq(order.ethPrice, 1 ether);
        assertTrue(order.executed);
    }
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract TradingContract {
    IERC20 public token;

    struct Order {
        address seller;
        address buyer;
        uint256 cctAmount;
        uint256 ethPrice;
        bool executed;
    }

    mapping(address => Order[]) public userOrders; // Efficient order storage

    event TradeExecuted(address indexed seller, address indexed buyer, uint256 cctAmount, uint256 ethPrice);

    constructor(address _tokenAddress) {
        require(_tokenAddress != address(0), "Invalid token address");
        token = IERC20(_tokenAddress);
    }

    function executeTrade(
        address seller,
        address buyer,
        uint256 cctAmount,
        uint256 ethPrice
    ) external {
        require(msg.sender == seller || msg.sender == buyer, "Only participants can call this function");
        require(seller != address(0) && buyer != address(0), "Invalid addresses");
        require(token.balanceOf(seller) >= cctAmount, "Seller does not have enough CCT");
        require(token.allowance(seller, address(this)) >= cctAmount, "Seller has not approved the contract");

        // Transfer tokens from seller to buyer
        token.transferFrom(seller, buyer, cctAmount);

        // Store order in mapping
        userOrders[seller].push(Order({
            seller: seller,
            buyer: buyer,
            cctAmount: cctAmount,
            ethPrice: ethPrice,
            executed: true
        }));

        emit TradeExecuted(seller, buyer, cctAmount, ethPrice);
    }

    // Retrieve orders for a specific user
    function getUserOrders(address user) external view returns (Order[] memory) {
        return userOrders[user];
    }
}

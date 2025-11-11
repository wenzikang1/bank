// SPDX-License-Identifier: MIT
pragma solidity ^0.5.1;

import "./ERC20.sol";

contract XYZCoin is ERC20 {
    string public name;
    string public symbol;
    uint8 public decimals;
    uint256 public totalSupply;
    
    mapping (address => uint256) public balances;
    mapping (address => mapping (address => uint256)) public allowed;
    
    address public owner;
    
    constructor() public {
        name = "XYZCoin";
        symbol = "XYZ";
        decimals = 0;
        totalSupply = 1000;
        owner = msg.sender;
        balances[msg.sender] = totalSupply;
        emit Transfer(address(0), msg.sender, totalSupply);
    }
    
    function balanceOf(address account) external view returns (uint256) {
        return balances[account];
    }
    
    function transfer(address to, uint256 value) external returns (bool) {
        require(balances[msg.sender] >= value, "Insufficient balance");
        balances[msg.sender] -= value;
        balances[to] += value;
        emit Transfer(msg.sender, to, value);
        return true;
    }
    
    function approve(address spender, uint256 value) external returns (bool) {
        allowed[msg.sender][spender] = value;
        emit Approval(msg.sender, spender, value);
        return true;
    }
    
    function allowance(address owner, address spender) external view returns (uint256) {
        return allowed[owner][spender];
    }
    
    function transferFrom(address from, address to, uint256 value) external returns (bool) {
        require(balances[from] >= value, "Insufficient balance");
        require(allowed[from][msg.sender] >= value, "Allowance exceeded");
        
        balances[from] -= value;
        balances[to] += value;
        allowed[from][msg.sender] -= value;
        
        emit Transfer(from, to, value);
        return true;
    }
}
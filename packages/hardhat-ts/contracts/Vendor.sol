pragma solidity >=0.8.0 <0.9.0;
// SPDX-License-Identifier: MIT

import '@openzeppelin/contracts/access/Ownable.sol';
import './YourToken.sol';
import 'hardhat/console.sol';

contract Vendor is Ownable {
  YourToken public yourToken;
  uint256 public constant tokensPerEth = 100;
  event BuyTokens(address buyer, uint256 amountOfETH, uint256 amountOfTokens);
  event SellTokens(address buyer, uint256 amountOfETH, uint256 amountOfTokens);

  constructor(address tokenAddress) {
    yourToken = YourToken(tokenAddress);
  }

  function buyTokens() external payable {
    require(msg.value > 0, 'Buy amount must be greater than 0');
    uint256 amountToBuy = msg.value * tokensPerEth;

    require(yourToken.balanceOf(address(this)) >= amountToBuy, 'Vendor does not have enough tokens');

    yourToken.transfer(msg.sender, amountToBuy);
    emit BuyTokens(msg.sender, msg.value, amountToBuy);
  }

  function sellTokens(uint256 _tokens) public {
    require(_tokens > 0, 'Need to sell a nonzero amount');
    uint256 ethToTransferToSeller = _tokens / tokensPerEth;

    require(address(this).balance >= ethToTransferToSeller, 'contract does not hold enough eth to buy back tokens');

    bool tokenTransferSuccess = yourToken.transferFrom(msg.sender, address(this), _tokens);
    require(tokenTransferSuccess, 'transfer failed');

    // should use call instead of transfer when sending eth from contract to contract
    bool ethTransferSuccess;
    (ethTransferSuccess, ) = msg.sender.call{value: ethToTransferToSeller}('');
    require(ethTransferSuccess, 'Failed to send ether');

    emit SellTokens(msg.sender, ethToTransferToSeller, _tokens);
  }

  // withdraw() function that lets the owner withdraw ETH
  function withdraw() public payable {
    require(msg.sender == this.owner(), 'You cannot withdraw, since you do not own the contract');
    yourToken.transfer(msg.sender, msg.value);
  }
}

// TODO: can't get ether to send back. transaction "completes" but nothing goes through

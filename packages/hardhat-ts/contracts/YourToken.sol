pragma solidity >=0.8.0 <0.9.0;
// SPDX-License-Identifier: MIT

import '@openzeppelin/contracts/token/ERC20/ERC20.sol';

// learn more: https://docs.openzeppelin.com/contracts/3.x/erc20

contract YourToken is ERC20 {
  // constructor and mint tokens for deployer

  constructor() ERC20('Gold', 'GLD') {
    _mint(msg.sender, 1000 * 10**18);
  }
}

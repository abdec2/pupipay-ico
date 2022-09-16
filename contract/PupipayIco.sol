//SPDX-license-identifier: MIT
pragma solidity ^0.5.0;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v2.5.0/contracts/crowdsale/Crowdsale.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v2.5.0/contracts/crowdsale/emission/AllowanceCrowdsale.sol";

contract PupipayIco is Crowdsale, AllowanceCrowdsale {
    using SafeMath for uint256;

    constructor(
        uint256 rate, // 1516
        address payable wallet,
        IERC20 token,
        address tokenWallet
    )
        AllowanceCrowdsale(tokenWallet)  
        Crowdsale(rate, wallet, token)
        public
    {}

    

}
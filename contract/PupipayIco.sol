//SPDX-license-identifier: MIT
pragma solidity ^0.5.0;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v2.5.0/contracts/crowdsale/Crowdsale.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v2.5.0/contracts/crowdsale/emission/AllowanceCrowdsale.sol";

contract PupipayIco is Crowdsale, AllowanceCrowdsale {
    using SafeMath for uint256;

    IERC20 private usdt;

    uint256 private __weiRaised;

    constructor(
        uint256 rate, // 1,000,000,000,000 
        address payable wallet,
        IERC20 token,
        address tokenWallet, 
        IERC20 _USDT
    )
        AllowanceCrowdsale(tokenWallet)  
        Crowdsale(rate, wallet, token)
        public
    {
        usdt = _USDT;
    }

    function weiRaised() public view returns (uint256) {
        return __weiRaised;
    }

    function buyTokens(address beneficiary) public nonReentrant payable {
        
    } 

    function buyTokens(address beneficiary, uint256 _weiAmount) public nonReentrant {
        uint256 weiAmount = _weiAmount;
        _preValidatePurchase(beneficiary, weiAmount);
        require(usdt.transferFrom(msg.sender, wallet(), weiAmount), "usdt transfer failed");

        // calculate token amount to be created
        uint256 tokens = _getTokenAmount(weiAmount);

        // update state
        __weiRaised = __weiRaised.add(weiAmount);

        _processPurchase(beneficiary, tokens);
        emit TokensPurchased(_msgSender(), beneficiary, weiAmount, tokens);

        _updatePurchasingState(beneficiary, weiAmount);

        _forwardFunds();
        _postValidatePurchase(beneficiary, weiAmount);
    }

    function _preValidatePurchase(address beneficiary, uint256 weiAmount) internal view {
        require(beneficiary != address(0), "Crowdsale: beneficiary is the zero address");
        require(weiAmount != 0, "Crowdsale: weiAmount is 0");
        this; // silence state mutability warning without generating bytecode - see https://github.com/ethereum/solidity/issues/2691
    }

}
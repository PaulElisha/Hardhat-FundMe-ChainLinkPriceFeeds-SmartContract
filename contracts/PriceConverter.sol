// SPDX-License-Identifier: MIT
pragma solidity 0.8.22;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

library PriceConverter {


    // This variable can be declared and initialised out here or within the function call
    
    // AggregatorV3Interface dataFeed = AggregatorV3Interface(0x694AA1769357215DE4FAC081bf1f309aDC325306);

    // dataFeed varible of contract type AggregatorV3Interface passed in as a parameter
    // so we can get the dataFeed of any token pair on any network dynamically

    // Becasue a Library can't use a constructor

    function getPrice(AggregatorV3Interface dataFeed) internal view returns(uint256){
       // AggregatorV3Interface dataFeed = AggregatorV3Interface(0x694AA1769357215DE4FAC081bf1f309aDC325306);
        (, int price,,,) = dataFeed.latestRoundData();
        return uint256(price * 1e10);
    }

    function getConversionRate(uint256 ethAmount, AggregatorV3Interface dataFeed) internal view returns(uint256) {
        uint256 ethPrice = getPrice(dataFeed);
        uint256 ethUsd = (ethPrice * ethAmount) / 1e18;
        return ethUsd;
    }

    function getVersion() internal view returns(uint256) {
        AggregatorV3Interface dataFeed = AggregatorV3Interface(0x694AA1769357215DE4FAC081bf1f309aDC325306);
        return dataFeed.version();
    }

}
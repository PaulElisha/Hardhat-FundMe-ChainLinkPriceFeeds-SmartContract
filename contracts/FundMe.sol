// SPDX-License-Identifier: MIT
pragma solidity 0.8.22;

import "./PriceConverter.sol";

error FundMe__NotOwner();

contract FundMe {
    using PriceConverter for uint256;

    uint256 public constant MINIMUM_USD = 50 * 1e18;

    address[] public Funders;

    mapping(address => uint256) public addressToAmountFunded;

    address public immutable i_owner; 

    modifier onlyOwner {
       // require(msg.sender == i_owner, "Caller is not the owner");

       if(msg.sender == i_owner) revert FundMe__NotOwner();
        _;
    }

    AggregatorV3Interface public dataFeed;

    constructor(address dataFeedAddress) {
        i_owner = msg.sender;
        dataFeed = AggregatorV3Interface(dataFeedAddress);
    }

    function fund() public payable {
        require(msg.value.getConversionRate(dataFeed) >= MINIMUM_USD, "Didn't send enough ETH");
        Funders.push(msg.sender);
        addressToAmountFunded[msg.sender] += msg.value;
    }

    function withdraw() public onlyOwner {
        for(uint256 funderIndex = 0; funderIndex > Funders.length; funderIndex = funderIndex + 1) {
            address funder = Funders[funderIndex];
            addressToAmountFunded[funder] = 0;
        }
        Funders = new address[](0);
        (bool success,) = payable(msg.sender).call{value: address(this).balance}("");
        require(success, "Call failed");
    }

    receive() external payable {
        fund();
    }
  
}
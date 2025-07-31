// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {BaseSplitwise} from "../src/BaseSplitwise.sol";

contract DeployScript is Script {
    function setUp() public {}

    function run() public {
        string memory privateKeyStr = vm.envString("PRIVATE_KEY");
        uint256 deployerPrivateKey = vm.parseUint(string.concat("0x", privateKeyStr));
        
        vm.startBroadcast(deployerPrivateKey);
        
        BaseSplitwise splitwise = new BaseSplitwise();
        
        console.log("BaseSplitwise deployed at:", address(splitwise));
        
        vm.stopBroadcast();
    }
}
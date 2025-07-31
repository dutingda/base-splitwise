// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import {BaseSplitwise} from "../src/BaseSplitwise.sol";

contract BaseSplitwiseTest is Test {
    BaseSplitwise public splitwise;
    address alice = address(0x1);
    address bob = address(0x2);
    address charlie = address(0x3);

    function setUp() public {
        splitwise = new BaseSplitwise();
        vm.deal(alice, 10 ether);
        vm.deal(bob, 10 ether);
        vm.deal(charlie, 10 ether);
    }

    function testCreateGroup() public {
        vm.prank(alice);
        uint256 groupId = splitwise.createGroup("Test Group");
        assertEq(groupId, 1);
        
        address[] memory members = splitwise.getGroupMembers(groupId);
        assertEq(members.length, 1);
        assertEq(members[0], alice);
    }

    function testAddMember() public {
        vm.prank(alice);
        uint256 groupId = splitwise.createGroup("Test Group");
        
        vm.prank(alice);
        splitwise.addMember(groupId, bob);
        
        address[] memory members = splitwise.getGroupMembers(groupId);
        assertEq(members.length, 2);
        assertEq(members[1], bob);
    }

    function testAddExpense() public {
        // Create group and add members
        vm.prank(alice);
        uint256 groupId = splitwise.createGroup("Test Group");
        
        vm.prank(alice);
        splitwise.addMember(groupId, bob);
        
        vm.prank(alice);
        splitwise.addMember(groupId, charlie);
        
        // Alice pays 300 for all three
        address[] memory participants = new address[](3);
        participants[0] = alice;
        participants[1] = bob;
        participants[2] = charlie;
        
        vm.prank(alice);
        splitwise.addExpense(groupId, 300, "Dinner", participants);
        
        // Check balances
        assertEq(splitwise.getGroupBalance(groupId, alice), 200); // Paid 300, owes 100
        assertEq(splitwise.getGroupBalance(groupId, bob), -100);
        assertEq(splitwise.getGroupBalance(groupId, charlie), -100);
    }

    function testCalculateSettlements() public {
        // Setup group with expenses
        vm.prank(alice);
        uint256 groupId = splitwise.createGroup("Test Group");
        
        vm.prank(alice);
        splitwise.addMember(groupId, bob);
        
        vm.prank(alice);
        splitwise.addMember(groupId, charlie);
        
        // Alice pays 300 for all
        address[] memory allParticipants = new address[](3);
        allParticipants[0] = alice;
        allParticipants[1] = bob;
        allParticipants[2] = charlie;
        
        vm.prank(alice);
        splitwise.addExpense(groupId, 300, "Dinner", allParticipants);
        
        // Get settlements
        BaseSplitwise.Settlement[] memory settlements = splitwise.calculateSettlements(groupId);
        
        assertEq(settlements.length, 2);
        assertEq(settlements[0].from, bob);
        assertEq(settlements[0].to, alice);
        assertEq(settlements[0].amount, 100);
        assertEq(settlements[1].from, charlie);
        assertEq(settlements[1].to, alice);
        assertEq(settlements[1].amount, 100);
    }

    function testRecordPayment() public {
        // Setup group with debt
        vm.prank(alice);
        uint256 groupId = splitwise.createGroup("Test Group");
        
        vm.prank(alice);
        splitwise.addMember(groupId, bob);
        
        address[] memory participants = new address[](2);
        participants[0] = alice;
        participants[1] = bob;
        
        vm.prank(alice);
        splitwise.addExpense(groupId, 200, "Lunch", participants);
        
        // Bob owes Alice 100
        assertEq(splitwise.getGroupBalance(groupId, bob), -100);
        
        // Bob pays Alice
        vm.prank(bob);
        splitwise.recordPayment(groupId, alice, 100);
        
        // Check balances are settled
        assertEq(splitwise.getGroupBalance(groupId, alice), 0);
        assertEq(splitwise.getGroupBalance(groupId, bob), 0);
    }
}
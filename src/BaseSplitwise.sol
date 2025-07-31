// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

contract BaseSplitwise {
    struct Expense {
        uint256 id;
        address payer;
        uint256 amount;
        string description;
        address[] participants;
        mapping(address => bool) hasParticipated;
        uint256 timestamp;
        bool isSettled;
    }

    struct Group {
        uint256 id;
        string name;
        address creator;
        address[] members;
        mapping(address => bool) isMember;
        mapping(address => int256) balances;
        uint256[] expenseIds;
        bool isActive;
    }

    struct Settlement {
        address from;
        address to;
        uint256 amount;
    }

    uint256 public nextGroupId = 1;
    uint256 public nextExpenseId = 1;

    mapping(uint256 => Group) public groups;
    mapping(uint256 => Expense) public expenses;
    mapping(address => uint256[]) public userGroups;

    event GroupCreated(uint256 indexed groupId, string name, address indexed creator);
    event MemberAdded(uint256 indexed groupId, address indexed member);
    event ExpenseAdded(uint256 indexed groupId, uint256 indexed expenseId, address indexed payer, uint256 amount);
    event SettlementCalculated(uint256 indexed groupId, Settlement[] settlements);
    event PaymentMade(uint256 indexed groupId, address indexed from, address indexed to, uint256 amount);

    modifier onlyGroupMember(uint256 groupId) {
        require(groups[groupId].isMember[msg.sender], "Not a group member");
        _;
    }

    modifier groupExists(uint256 groupId) {
        require(groups[groupId].isActive, "Group does not exist");
        _;
    }

    function createGroup(string memory name) external returns (uint256) {
        uint256 groupId = nextGroupId++;
        Group storage newGroup = groups[groupId];
        newGroup.id = groupId;
        newGroup.name = name;
        newGroup.creator = msg.sender;
        newGroup.isActive = true;
        
        newGroup.members.push(msg.sender);
        newGroup.isMember[msg.sender] = true;
        
        userGroups[msg.sender].push(groupId);
        
        emit GroupCreated(groupId, name, msg.sender);
        return groupId;
    }

    function addMember(uint256 groupId, address member) external 
        groupExists(groupId) 
        onlyGroupMember(groupId) 
    {
        require(!groups[groupId].isMember[member], "Already a member");
        
        groups[groupId].members.push(member);
        groups[groupId].isMember[member] = true;
        groups[groupId].balances[member] = 0;
        
        userGroups[member].push(groupId);
        
        emit MemberAdded(groupId, member);
    }

    function addExpense(
        uint256 groupId,
        uint256 amount,
        string memory description,
        address[] memory participants
    ) external 
        groupExists(groupId) 
        onlyGroupMember(groupId) 
    {
        require(amount > 0, "Amount must be positive");
        require(participants.length > 0, "Must have participants");
        
        // Verify all participants are group members
        for (uint256 i = 0; i < participants.length; i++) {
            require(groups[groupId].isMember[participants[i]], "Participant not in group");
        }
        
        uint256 expenseId = nextExpenseId++;
        Expense storage newExpense = expenses[expenseId];
        newExpense.id = expenseId;
        newExpense.payer = msg.sender;
        newExpense.amount = amount;
        newExpense.description = description;
        newExpense.participants = participants;
        newExpense.timestamp = block.timestamp;
        
        // Mark participants
        for (uint256 i = 0; i < participants.length; i++) {
            newExpense.hasParticipated[participants[i]] = true;
        }
        
        // Update balances
        uint256 splitAmount = amount / participants.length;
        groups[groupId].balances[msg.sender] += int256(amount);
        
        for (uint256 i = 0; i < participants.length; i++) {
            groups[groupId].balances[participants[i]] -= int256(splitAmount);
        }
        
        groups[groupId].expenseIds.push(expenseId);
        
        emit ExpenseAdded(groupId, expenseId, msg.sender, amount);
    }

    function getGroupBalance(uint256 groupId, address member) external view 
        groupExists(groupId) 
        returns (int256) 
    {
        return groups[groupId].balances[member];
    }

    function getGroupMembers(uint256 groupId) external view 
        groupExists(groupId) 
        returns (address[] memory) 
    {
        return groups[groupId].members;
    }

    function getGroupExpenses(uint256 groupId) external view 
        groupExists(groupId) 
        returns (uint256[] memory) 
    {
        return groups[groupId].expenseIds;
    }

    function getUserGroups(address user) external view returns (uint256[] memory) {
        return userGroups[user];
    }

    function calculateSettlements(uint256 groupId) external view 
        groupExists(groupId) 
        returns (Settlement[] memory) 
    {
        Group storage group = groups[groupId];
        uint256 memberCount = group.members.length;
        
        // Create arrays for debtors and creditors
        address[] memory debtors = new address[](memberCount);
        uint256[] memory debts = new uint256[](memberCount);
        address[] memory creditors = new address[](memberCount);
        uint256[] memory credits = new uint256[](memberCount);
        
        uint256 debtorCount = 0;
        uint256 creditorCount = 0;
        
        // Separate debtors and creditors
        for (uint256 i = 0; i < memberCount; i++) {
            address member = group.members[i];
            int256 balance = group.balances[member];
            
            if (balance < 0) {
                debtors[debtorCount] = member;
                debts[debtorCount] = uint256(-balance);
                debtorCount++;
            } else if (balance > 0) {
                creditors[creditorCount] = member;
                credits[creditorCount] = uint256(balance);
                creditorCount++;
            }
        }
        
        // Calculate settlements
        Settlement[] memory settlements = new Settlement[](memberCount);
        uint256 settlementCount = 0;
        
        uint256 i = 0;
        uint256 j = 0;
        
        while (i < debtorCount && j < creditorCount) {
            uint256 amount = debts[i] < credits[j] ? debts[i] : credits[j];
            
            settlements[settlementCount] = Settlement({
                from: debtors[i],
                to: creditors[j],
                amount: amount
            });
            settlementCount++;
            
            debts[i] -= amount;
            credits[j] -= amount;
            
            if (debts[i] == 0) i++;
            if (credits[j] == 0) j++;
        }
        
        // Return only the actual settlements
        Settlement[] memory finalSettlements = new Settlement[](settlementCount);
        for (uint256 k = 0; k < settlementCount; k++) {
            finalSettlements[k] = settlements[k];
        }
        
        return finalSettlements;
    }

    function recordPayment(uint256 groupId, address to, uint256 amount) external 
        groupExists(groupId) 
        onlyGroupMember(groupId) 
    {
        require(groups[groupId].isMember[to], "Recipient not in group");
        require(amount > 0, "Amount must be positive");
        
        groups[groupId].balances[msg.sender] += int256(amount);
        groups[groupId].balances[to] -= int256(amount);
        
        emit PaymentMade(groupId, msg.sender, to, amount);
    }
}
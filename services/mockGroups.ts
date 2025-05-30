import { nanoid } from 'nanoid';

// Mock data
const groups: Record<string, any> = {
  'group1': {
    id: 'group1',
    name: 'Summer Trip 2025',
    description: 'Our amazing summer adventure!',
    code: 'SUMMER2025',
    members: [
      { id: 'user1', name: 'Demo User', email: 'demo@example.com' },
      { id: 'user2', name: 'John Doe', email: 'john@example.com' },
      { id: 'user3', name: 'Jane Smith', email: 'jane@example.com' },
    ],
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-01'),
  },
};

const expenses: Record<string, any[]> = {
  'group1': [
    {
      id: 'expense1',
      groupId: 'group1',
      title: 'Dinner at Restaurant',
      amount: 120,
      date: new Date('2025-06-15'),
      category: 'Food',
      notes: 'Great Italian place',
      paidBy: 'user1',
      paidByName: 'Demo User',
      splitMethod: 'equal',
      splits: [
        { userId: 'user1', userName: 'Demo User', amount: 40 },
        { userId: 'user2', userName: 'John Doe', amount: 40 },
        { userId: 'user3', userName: 'Jane Smith', amount: 40 },
      ],
      createdAt: new Date('2025-06-15'),
    },
    {
      id: 'expense2',
      groupId: 'group1',
      title: 'Hotel Room',
      amount: 300,
      date: new Date('2025-06-16'),
      category: 'Accommodation',
      paidBy: 'user2',
      paidByName: 'John Doe',
      splitMethod: 'equal',
      splits: [
        { userId: 'user1', userName: 'Demo User', amount: 100 },
        { userId: 'user2', userName: 'John Doe', amount: 100 },
        { userId: 'user3', userName: 'Jane Smith', amount: 100 },
      ],
      createdAt: new Date('2025-06-16'),
    },
  ],
};

const balances: Record<string, any[]> = {
  'group1': [
    {
      fromUserId: 'user1',
      fromUserName: 'Demo User',
      toUserId: 'user2',
      toUserName: 'John Doe',
      amount: 60,
    },
    {
      fromUserId: 'user3',
      fromUserName: 'Jane Smith',
      toUserId: 'user2',
      toUserName: 'John Doe',
      amount: 60,
    },
  ],
};

const userGroups: Record<string, string[]> = {
  'user1': ['group1'],
  'user2': ['group1'],
  'user3': ['group1'],
};

const groupsByCode: Record<string, string> = {
  'SUMMER2025': 'group1',
};

export const mockGroups = {
  getGroups: async (userId: string) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const userGroupIds = userGroups[userId] || [];
    const groupsWithBalance = userGroupIds.map(groupId => {
      const group = { ...groups[groupId] };
      
      // Calculate user's balance in this group
      let balance = 0;
      const groupBalances = balances[groupId] || [];
      
      groupBalances.forEach(b => {
        if (b.toUserId === userId) {
          balance += b.amount;
        } else if (b.fromUserId === userId) {
          balance -= b.amount;
        }
      });
      
      return { ...group, balance };
    });
    
    return groupsWithBalance;
  },
  
  getGroup: async (groupId: string) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    if (!groups[groupId]) {
      throw new Error('Group not found');
    }
    
    return { ...groups[groupId] };
  },
  
  getExpenses: async (groupId: string) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return [...(expenses[groupId] || [])].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  },
  
  getBalances: async (groupId: string, userId: string) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return [...(balances[groupId] || [])];
  },
  
  getRecentActivity: async (userId: string) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Get all expenses from groups the user is a member of
    const userGroupIds = userGroups[userId] || [];
    let activities: any[] = [];
    
    userGroupIds.forEach(groupId => {
      const groupExpenses = expenses[groupId] || [];
      const groupName = groups[groupId]?.name || 'Unknown Group';
      
      groupExpenses.forEach(expense => {
        let relatedUserName;
        
        if (expense.paidBy === userId) {
          // Current user paid
          const nonPayerSplits = expense.splits.filter((s: any) => s.userId !== userId);
          if (nonPayerSplits.length === 1) {
            relatedUserName = nonPayerSplits[0].userName;
          }
        } else if (expense.splits.some((s: any) => s.userId === userId)) {
          // Current user is involved in the split
          relatedUserName = expense.paidByName;
        }
        
        if (expense.paidBy === userId || expense.splits.some((s: any) => s.userId === userId)) {
          activities.push({
            id: expense.id,
            type: 'expense',
            groupId,
            groupName,
            title: expense.title,
            amount: expense.amount,
            date: new Date(expense.date),
            relatedUserName,
          });
        }
      });
    });
    
    // Sort by date, newest first
    activities.sort((a, b) => b.date.getTime() - a.date.getTime());
    
    // Return at most 10 activities
    return activities.slice(0, 10);
  },
  
  createGroup: async (userId: string, data: { name: string; description?: string }) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const groupId = nanoid();
    const code = generateGroupCode();
    
    // Create the group
    const newGroup = {
      id: groupId,
      name: data.name,
      description: data.description || '',
      code,
      members: [
        // Add the creator as the first member
        {
          id: userId,
          name: 'Demo User', // In a real app, you would get this from user data
          email: 'demo@example.com', // In a real app, you would get this from user data
        }
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    // Store the group
    groups[groupId] = newGroup;
    
    // Store the code mapping
    groupsByCode[code] = groupId;
    
    // Add group to user's groups
    if (!userGroups[userId]) {
      userGroups[userId] = [];
    }
    userGroups[userId].push(groupId);
    
    // Initialize empty expenses and balances
    expenses[groupId] = [];
    balances[groupId] = [];
    
    return groupId;
  },
  
  joinGroup: async (userId: string, code: string) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if the code is valid
    const groupId = groupsByCode[code];
    if (!groupId) {
      throw new Error('Invalid group code');
    }
    
    // Check if the group exists
    if (!groups[groupId]) {
      throw new Error('Group not found');
    }
    
    // Check if the user is already a member
    if (groups[groupId].members.some((m: any) => m.id === userId)) {
      throw new Error('You are already a member of this group');
    }
    
    // Add the user to the group
    groups[groupId].members.push({
      id: userId,
      name: 'Demo User', // In a real app, you would get this from user data
      email: 'demo@example.com', // In a real app, you would get this from user data
    });
    
    // Update the group's updatedAt timestamp
    groups[groupId].updatedAt = new Date();
    
    // Add group to user's groups
    if (!userGroups[userId]) {
      userGroups[userId] = [];
    }
    userGroups[userId].push(groupId);
    
    return groupId;
  },
  
  addMemberByEmail: async (groupId: string, email: string) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if the group exists
    if (!groups[groupId]) {
      throw new Error('Group not found');
    }
    
    // Check if a member with this email already exists
    if (groups[groupId].members.some((m: any) => m.email === email)) {
      throw new Error('A member with this email already exists in the group');
    }
    
    // In a real app, you would check if a user with this email exists
    // For now, we'll create a mock user
    const mockUserId = nanoid();
    const mockUser = {
      id: mockUserId,
      name: email.split('@')[0], // Use the part before @ as the name
      email,
    };
    
    // Add the user to the group
    groups[groupId].members.push(mockUser);
    
    // Update the group's updatedAt timestamp
    groups[groupId].updatedAt = new Date();
    
    // Add group to user's groups
    if (!userGroups[mockUserId]) {
      userGroups[mockUserId] = [];
    }
    userGroups[mockUserId].push(groupId);
    
    return mockUserId;
  },
  
  addExpense: async (
    groupId: string,
    userId: string,
    data: {
      title: string;
      amount: number;
      date: Date;
      category: string;
      notes?: string;
      paidBy: string;
      splitMethod: 'equal' | 'exact' | 'percentage' | 'shares';
      splitValues: Record<string, number>;
    }
  ) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if the group exists
    if (!groups[groupId]) {
      throw new Error('Group not found');
    }
    
    // Get the payer's name
    const payer = groups[groupId].members.find((m: any) => m.id === data.paidBy);
    if (!payer) {
      throw new Error('Payer not found in group members');
    }
    
    // Process splits based on the split method
    const members = groups[groupId].members;
    let splits: any[] = [];
    
    if (data.splitMethod === 'equal') {
      // Equal split
      const splitAmount = data.amount / members.length;
      splits = members.map(m => ({
        userId: m.id,
        userName: m.name,
        amount: Number(splitAmount.toFixed(2)),
      }));
    } else {
      // Custom splits (exact, percentage, shares)
      splits = Object.entries(data.splitValues).map(([userId, value]) => {
        const member = members.find(m => m.id === userId);
        if (!member) throw new Error('Member not found');
        
        return {
          userId,
          userName: member.name,
          amount: Number(value.toFixed(2)),
        };
      });
    }
    
    // Create the expense
    const expenseId = nanoid();
    const newExpense = {
      id: expenseId,
      groupId,
      title: data.title,
      amount: data.amount,
      date: data.date,
      category: data.category,
      notes: data.notes || '',
      paidBy: data.paidBy,
      paidByName: payer.name,
      splitMethod: data.splitMethod,
      splits,
      createdAt: new Date(),
    };
    
    // Store the expense
    if (!expenses[groupId]) {
      expenses[groupId] = [];
    }
    expenses[groupId].push(newExpense);
    
    // Update balances
    updateBalances(groupId);
    
    return expenseId;
  },
  
  settleUp: async (
    groupId: string,
    data: {
      fromUserId: string;
      toUserId: string;
      amount: number;
    }
  ) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if the group exists
    if (!groups[groupId]) {
      throw new Error('Group not found');
    }
    
    // Check if the balance exists
    const groupBalances = balances[groupId] || [];
    const existingBalance = groupBalances.find(
      b => b.fromUserId === data.fromUserId && b.toUserId === data.toUserId
    );
    
    if (!existingBalance) {
      throw new Error('Balance not found');
    }
    
    if (data.amount > existingBalance.amount) {
      throw new Error('Settlement amount exceeds the balance');
    }
    
    // Update the balance
    existingBalance.amount -= data.amount;
    
    // If the balance is 0, remove it
    if (existingBalance.amount === 0) {
      balances[groupId] = groupBalances.filter(
        b => !(b.fromUserId === data.fromUserId && b.toUserId === data.toUserId)
      );
    }
    
    // In a real app, you would create a settlement record
    
    return true;
  },
};

// Helper functions

function generateGroupCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

function updateBalances(groupId: string) {
  // Get all expenses for the group
  const groupExpenses = expenses[groupId] || [];
  
  // Reset balances for the group
  balances[groupId] = [];
  
  // Calculate who paid what and who owes what
  const paid: Record<string, number> = {};
  const owes: Record<string, number> = {};
  
  groupExpenses.forEach(expense => {
    // Add what the payer paid
    if (!paid[expense.paidBy]) {
      paid[expense.paidBy] = 0;
    }
    paid[expense.paidBy] += expense.amount;
    
    // Add what each person owes
    expense.splits.forEach((split: any) => {
      if (!owes[split.userId]) {
        owes[split.userId] = 0;
      }
      owes[split.userId] += split.amount;
    });
  });
  
  // Calculate net amounts (positive = owed, negative = owes)
  const netAmounts: Record<string, number> = {};
  
  // Add what each person paid
  Object.entries(paid).forEach(([userId, amount]) => {
    if (!netAmounts[userId]) {
      netAmounts[userId] = 0;
    }
    netAmounts[userId] += amount;
  });
  
  // Subtract what each person owes
  Object.entries(owes).forEach(([userId, amount]) => {
    if (!netAmounts[userId]) {
      netAmounts[userId] = 0;
    }
    netAmounts[userId] -= amount;
  });
  
  // Create balances
  const members = groups[groupId].members;
  const newBalances: any[] = [];
  
  // Find who owes money (negative net amount)
  const debtors = Object.entries(netAmounts)
    .filter(([_, amount]) => amount < 0)
    .map(([userId, amount]) => ({ userId, amount: Math.abs(amount) }))
    .sort((a, b) => b.amount - a.amount);
  
  // Find who is owed money (positive net amount)
  const creditors = Object.entries(netAmounts)
    .filter(([_, amount]) => amount > 0)
    .map(([userId, amount]) => ({ userId, amount }))
    .sort((a, b) => b.amount - a.amount);
  
  // Calculate who pays whom
  debtors.forEach(debtor => {
    let remainingDebt = debtor.amount;
    
    for (let i = 0; i < creditors.length && remainingDebt > 0; i++) {
      const creditor = creditors[i];
      
      if (creditor.amount === 0) continue;
      
      // Calculate how much of the debt can be paid to this creditor
      const paymentAmount = Math.min(remainingDebt, creditor.amount);
      
      // Create a balance entry
      const fromUser = members.find((m: any) => m.id === debtor.userId);
      const toUser = members.find((m: any) => m.id === creditor.userId);
      
      if (fromUser && toUser) {
        newBalances.push({
          fromUserId: fromUser.id,
          fromUserName: fromUser.name,
          toUserId: toUser.id,
          toUserName: toUser.name,
          amount: Number(paymentAmount.toFixed(2)),
        });
      }
      
      // Update remaining amounts
      remainingDebt -= paymentAmount;
      creditor.amount -= paymentAmount;
    }
  });
  
  // Store the new balances
  balances[groupId] = newBalances;
}
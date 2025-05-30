import React, { createContext, useState, useEffect } from 'react';
import { mockGroups } from '@/services/mockGroups';
import { useAuth } from '@/hooks/useAuth';

export type Group = {
  id: string;
  name: string;
  description?: string;
  code: string;
  balance: number;
  members: {
    id: string;
    name: string;
    email: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
};

export type Expense = {
  id: string;
  groupId: string;
  title: string;
  amount: number;
  date: Date;
  category: string;
  notes?: string;
  paidBy: string;
  paidByName: string;
  splitMethod: 'equal' | 'exact' | 'percentage' | 'shares';
  splits: {
    userId: string;
    userName: string;
    amount: number;
  }[];
  createdAt: Date;
};

export type Balance = {
  fromUserId: string;
  fromUserName: string;
  toUserId: string;
  toUserName: string;
  amount: number;
};

export type Activity = {
  id: string;
  type: 'expense' | 'settlement';
  groupId: string;
  groupName: string;
  title: string;
  amount: number;
  date: Date;
  relatedUserName?: string;
};

type GroupsContextType = {
  groups: Group[];
  totalBalance: number;
  totalOwed: number;
  totalOwe: number;
  recentActivity: Activity[];
  isLoading: boolean;
  refreshData: (groupId?: string) => Promise<void>;
  getGroup: (id: string) => Group | undefined;
  getGroupExpenses: (groupId: string) => Expense[];
  getGroupBalances: (groupId: string) => Balance[];
  createGroup: (data: { name: string; description?: string }) => Promise<string>;
  joinGroup: (code: string) => Promise<string>;
  addMemberByEmail: (groupId: string, email: string) => Promise<void>;
  addExpense: (
    groupId: string,
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
  ) => Promise<void>;
  settleUp: (
    groupId: string,
    data: {
      fromUserId: string;
      toUserId: string;
      amount: number;
    }
  ) => Promise<void>;
};

export const GroupsContext = createContext<GroupsContextType>({
  groups: [],
  totalBalance: 0,
  totalOwed: 0,
  totalOwe: 0,
  recentActivity: [],
  isLoading: true,
  refreshData: async () => {},
  getGroup: () => undefined,
  getGroupExpenses: () => [],
  getGroupBalances: () => [],
  createGroup: async () => '',
  joinGroup: async () => '',
  addMemberByEmail: async () => {},
  addExpense: async () => {},
  settleUp: async () => {},
});

export const GroupsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [groups, setGroups] = useState<Group[]>([]);
  const [expenses, setExpenses] = useState<Record<string, Expense[]>>({});
  const [balances, setBalances] = useState<Record<string, Balance[]>>({});
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Calculate total balance, owed, and owe
  const totalBalance = user ? calculateTotalBalance() : 0;
  const totalOwed = user ? calculateTotalOwed() : 0;
  const totalOwe = user ? calculateTotalOwe() : 0;

  function calculateTotalBalance() {
    if (!user) return 0;
    
    let total = 0;
    Object.values(balances).forEach(groupBalances => {
      groupBalances.forEach(balance => {
        if (balance.toUserId === user.id) {
          total += balance.amount;
        } else if (balance.fromUserId === user.id) {
          total -= balance.amount;
        }
      });
    });
    return total;
  }

  function calculateTotalOwed() {
    if (!user) return 0;
    
    let total = 0;
    Object.values(balances).forEach(groupBalances => {
      groupBalances.forEach(balance => {
        if (balance.toUserId === user.id) {
          total += balance.amount;
        }
      });
    });
    return total;
  }

  function calculateTotalOwe() {
    if (!user) return 0;
    
    let total = 0;
    Object.values(balances).forEach(groupBalances => {
      groupBalances.forEach(balance => {
        if (balance.fromUserId === user.id) {
          total += balance.amount;
        }
      });
    });
    return total;
  }

  useEffect(() => {
    if (user) {
      fetchGroups();
    }
  }, [user]);

  const fetchGroups = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const userGroups = await mockGroups.getGroups(user.id);
      setGroups(userGroups);
      
      // Fetch expenses and balances for each group
      const expensesData: Record<string, Expense[]> = {};
      const balancesData: Record<string, Balance[]> = {};
      
      for (const group of userGroups) {
        expensesData[group.id] = await mockGroups.getExpenses(group.id);
        balancesData[group.id] = await mockGroups.getBalances(group.id, user.id);
      }
      
      setExpenses(expensesData);
      setBalances(balancesData);
      
      // Fetch recent activities
      const recentActivities = await mockGroups.getRecentActivity(user.id);
      setActivities(recentActivities);
    } catch (error) {
      console.error('Error fetching groups:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshData = async (groupId?: string) => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      if (groupId) {
        // Refresh specific group data
        const group = await mockGroups.getGroup(groupId);
        setGroups(prev => prev.map(g => g.id === groupId ? group : g));
        
        // Refresh expenses and balances for the group
        const groupExpenses = await mockGroups.getExpenses(groupId);
        setExpenses(prev => ({ ...prev, [groupId]: groupExpenses }));
        
        const groupBalances = await mockGroups.getBalances(groupId, user.id);
        setBalances(prev => ({ ...prev, [groupId]: groupBalances }));
      } else {
        // Refresh all data
        await fetchGroups();
      }
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getGroup = (id: string) => {
    return groups.find(group => group.id === id);
  };

  const getGroupExpenses = (groupId: string) => {
    return expenses[groupId] || [];
  };

  const getGroupBalances = (groupId: string) => {
    return balances[groupId] || [];
  };

  const createGroup = async (data: { name: string; description?: string }) => {
    if (!user) throw new Error('User not authenticated');
    
    setIsLoading(true);
    try {
      const newGroupId = await mockGroups.createGroup(user.id, data);
      await refreshData();
      return newGroupId;
    } catch (error) {
      console.error('Error creating group:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const joinGroup = async (code: string) => {
    if (!user) throw new Error('User not authenticated');
    
    setIsLoading(true);
    try {
      const groupId = await mockGroups.joinGroup(user.id, code);
      await refreshData();
      return groupId;
    } catch (error) {
      console.error('Error joining group:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const addMemberByEmail = async (groupId: string, email: string) => {
    if (!user) throw new Error('User not authenticated');
    
    setIsLoading(true);
    try {
      await mockGroups.addMemberByEmail(groupId, email);
      await refreshData(groupId);
    } catch (error) {
      console.error('Error adding member:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const addExpense = async (
    groupId: string,
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
    if (!user) throw new Error('User not authenticated');
    
    setIsLoading(true);
    try {
      await mockGroups.addExpense(groupId, user.id, data);
      await refreshData(groupId);
    } catch (error) {
      console.error('Error adding expense:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const settleUp = async (
    groupId: string,
    data: {
      fromUserId: string;
      toUserId: string;
      amount: number;
    }
  ) => {
    if (!user) throw new Error('User not authenticated');
    
    setIsLoading(true);
    try {
      await mockGroups.settleUp(groupId, data);
      await refreshData(groupId);
    } catch (error) {
      console.error('Error settling up:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <GroupsContext.Provider
      value={{
        groups,
        totalBalance,
        totalOwed,
        totalOwe,
        recentActivity: activities,
        isLoading,
        refreshData,
        getGroup,
        getGroupExpenses,
        getGroupBalances,
        createGroup,
        joinGroup,
        addMemberByEmail,
        addExpense,
        settleUp,
      }}
    >
      {children}
    </GroupsContext.Provider>
  );
};
import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Share, RefreshControl } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useGroups } from '@/hooks/useGroups';
import { Plus, PlusCircle, UserPlus, Receipt, CreditCard, ArrowRight, Users } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import ExpenseItem from '@/components/expenses/ExpenseItem';
import BalanceSummary from '@/components/groups/BalanceSummary';
import FloatingActionButton from '@/components/ui/FloatingActionButton';
import GroupHeader from '@/components/groups/GroupHeader';

export default function GroupDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { getGroup, getGroupExpenses, getGroupBalances, isLoading, refreshData } = useGroups();
  const [activeTab, setActiveTab] = useState('expenses'); // 'expenses' or 'balances'
  
  const group = getGroup(id);
  const expenses = getGroupExpenses(id);
  const balances = getGroupBalances(id);
  
  if (!group) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Group not found</Text>
        <TouchableOpacity onPress={() => router.replace('/(tabs)/groups/')}>
          <Text style={styles.errorLink}>Go back to Groups</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  const navigateToAddExpense = () => {
    router.push(`/(tabs)/groups/${id}/add-expense`);
  };
  
  const navigateToSettleUp = () => {
    router.push(`/(tabs)/groups/${id}/settle-up`);
  };
  
  const navigateToMembers = () => {
    router.push(`/(tabs)/groups/${id}/members`);
  };
  
  const shareGroupCode = async () => {
    try {
      await Share.share({
        message: `Join my group "${group.name}" in SplitEase with code: ${group.code}`,
      });
    } catch (error) {
      console.error('Error sharing group code:', error);
    }
  };

  return (
    <View style={styles.container}>
      <GroupHeader group={group} />
      
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'expenses' && styles.activeTab
          ]}
          onPress={() => setActiveTab('expenses')}
        >
          <Receipt 
            size={16} 
            color={activeTab === 'expenses' ? colors.primary : colors.textSecondary} 
            style={styles.tabIcon}
          />
          <Text 
            style={[
              styles.tabText,
              activeTab === 'expenses' && styles.activeTabText
            ]}
          >
            Expenses
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'balances' && styles.activeTab
          ]}
          onPress={() => setActiveTab('balances')}
        >
          <CreditCard 
            size={16} 
            color={activeTab === 'balances' ? colors.primary : colors.textSecondary} 
            style={styles.tabIcon}
          />
          <Text 
            style={[
              styles.tabText,
              activeTab === 'balances' && styles.activeTabText
            ]}
          >
            Balances
          </Text>
        </TouchableOpacity>
      </View>
      
      {activeTab === 'expenses' ? (
        <FlatList
          data={expenses}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <ExpenseItem expense={item} />
          )}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Receipt size={64} color={colors.textSecondary} style={styles.emptyStateIcon} />
              <Text style={styles.emptyStateTitle}>No expenses yet</Text>
              <Text style={styles.emptyStateDescription}>
                Add your first expense to start splitting costs
              </Text>
              <TouchableOpacity 
                style={styles.addExpenseButton}
                onPress={navigateToAddExpense}
              >
                <Plus size={20} color={colors.white} />
                <Text style={styles.addExpenseButtonText}>Add an Expense</Text>
              </TouchableOpacity>
            </View>
          }
          contentContainerStyle={
            expenses.length === 0 
              ? styles.fullHeightContentContainer 
              : styles.contentContainer
          }
          refreshControl={
            <RefreshControl refreshing={isLoading} onRefresh={() => refreshData(id)} />
          }
        />
      ) : (
        <BalanceSummary 
          balances={balances} 
          onSettleUp={navigateToSettleUp} 
          isLoading={isLoading}
          onRefresh={() => refreshData(id)}
        />
      )}
      
      <View style={styles.actionsContainer}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={navigateToMembers}
        >
          <Users size={20} color={colors.primary} />
          <Text style={styles.actionButtonText}>Members</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={shareGroupCode}
        >
          <UserPlus size={20} color={colors.primary} />
          <Text style={styles.actionButtonText}>Invite</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={navigateToSettleUp}
        >
          <CreditCard size={20} color={colors.primary} />
          <Text style={styles.actionButtonText}>Settle Up</Text>
        </TouchableOpacity>
      </View>
      
      <FloatingActionButton
        icon={<PlusCircle size={24} color={colors.white} />}
        onPress={navigateToAddExpense}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  errorText: {
    fontFamily: 'InterBold',
    fontSize: 18,
    color: colors.textPrimary,
    marginBottom: 12,
  },
  errorLink: {
    fontFamily: 'InterMedium',
    fontSize: 16,
    color: colors.primary,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    padding: 8,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: colors.primaryLight,
  },
  tabIcon: {
    marginRight: 8,
  },
  tabText: {
    fontFamily: 'InterMedium',
    fontSize: 14,
    color: colors.textSecondary,
  },
  activeTabText: {
    color: colors.primary,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 80, // Extra padding for the actions container
  },
  fullHeightContentContainer: {
    flexGrow: 1,
    padding: 16,
    paddingBottom: 80, // Extra padding for the actions container
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  emptyStateIcon: {
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontFamily: 'InterBold',
    fontSize: 20,
    color: colors.textPrimary,
    marginBottom: 8,
  },
  emptyStateDescription: {
    fontFamily: 'InterRegular',
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  addExpenseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  addExpenseButtonText: {
    fontFamily: 'InterMedium',
    fontSize: 16,
    color: colors.white,
    marginLeft: 8,
  },
  actionsContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonText: {
    fontFamily: 'InterMedium',
    fontSize: 12,
    color: colors.primary,
    marginTop: 4,
  },
});
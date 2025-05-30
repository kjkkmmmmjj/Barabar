import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useAuth } from '@/hooks/useAuth';
import { useGroups } from '@/hooks/useGroups';
import { ArrowRight, TrendingUp, TrendingDown } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { formatCurrency } from '@/utils/formatters';
import ActivityItem from '@/components/dashboard/ActivityItem';
import BalanceCard from '@/components/dashboard/BalanceCard';
import { useRouter } from 'expo-router';

export default function DashboardScreen() {
  const { user } = useAuth();
  const { 
    totalBalance, 
    recentActivity, 
    totalOwed, 
    totalOwe, 
    isLoading, 
    refreshData 
  } = useGroups();
  const router = useRouter();
  
  const navigateToGroups = () => {
    router.push('/(tabs)/groups/');
  };

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      refreshControl={
        <RefreshControl refreshing={isLoading} onRefresh={refreshData} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.greeting}>Hi, {user?.displayName?.split(' ')[0] || 'there'}!</Text>
        <Text style={styles.date}>{new Date().toLocaleDateString('en-US', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })}</Text>
      </View>
      
      <View style={styles.balanceContainer}>
        <BalanceCard 
          title="Total Balance"
          amount={totalBalance}
          color={totalBalance >= 0 ? colors.success : colors.error}
          icon={totalBalance >= 0 ? TrendingUp : TrendingDown}
        />
        
        <View style={styles.smallBalanceCards}>
          <BalanceCard 
            title="You are owed"
            amount={totalOwed}
            color={colors.success}
            icon={TrendingUp}
            small
          />
          <BalanceCard 
            title="You owe"
            amount={totalOwe}
            color={colors.error}
            icon={TrendingDown}
            small
          />
        </View>
      </View>
      
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <TouchableOpacity onPress={navigateToGroups} style={styles.viewAllButton}>
          <Text style={styles.viewAllText}>View All</Text>
          <ArrowRight size={16} color={colors.primary} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.activityContainer}>
        {recentActivity.length > 0 ? (
          recentActivity.map((activity, index) => (
            <ActivityItem key={index} activity={activity} />
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No recent activity</Text>
            <Text style={styles.emptyStateSubtext}>
              Add expenses to your groups to see activity here
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  greeting: {
    fontFamily: 'InterBold',
    fontSize: 24,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  date: {
    fontFamily: 'InterRegular',
    fontSize: 14,
    color: colors.textSecondary,
  },
  balanceContainer: {
    marginBottom: 24,
  },
  smallBalanceCards: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: 'InterBold',
    fontSize: 18,
    color: colors.textPrimary,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllText: {
    fontFamily: 'InterMedium',
    fontSize: 14,
    color: colors.primary,
    marginRight: 4,
  },
  activityContainer: {
    marginBottom: 24,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 24,
    marginBottom: 16,
  },
  emptyStateText: {
    fontFamily: 'InterSemiBold',
    fontSize: 16,
    color: colors.textPrimary,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontFamily: 'InterRegular',
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
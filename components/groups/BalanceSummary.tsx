import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { ArrowRight, CheckCircle } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { formatCurrency } from '@/utils/formatters';
import { Balance } from '@/context/GroupsContext';
import { useAuth } from '@/hooks/useAuth';

interface BalanceSummaryProps {
  balances: Balance[];
  onSettleUp: () => void;
  isLoading: boolean;
  onRefresh: () => void;
}

const BalanceSummary: React.FC<BalanceSummaryProps> = ({
  balances,
  onSettleUp,
  isLoading,
  onRefresh,
}) => {
  const { user } = useAuth();

  return (
    <FlatList
      data={balances}
      keyExtractor={(item, index) => `${item.fromUserId}-${item.toUserId}-${index}`}
      renderItem={({ item }) => {
        const isUserInvolved = item.fromUserId === user?.id || item.toUserId === user?.id;
        
        return (
          <View style={[
            styles.balanceItem,
            isUserInvolved && styles.highlightedBalanceItem
          ]}>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{item.fromUserName}</Text>
              <View style={styles.arrowContainer}>
                <ArrowRight size={16} color={colors.textSecondary} />
              </View>
              <Text style={styles.userName}>{item.toUserName}</Text>
            </View>
            <Text style={styles.balanceAmount}>
              {formatCurrency(item.amount)}
            </Text>
          </View>
        );
      }}
      ListEmptyComponent={
        <View style={styles.emptyState}>
          <CheckCircle size={64} color={colors.success} style={styles.emptyStateIcon} />
          <Text style={styles.emptyStateTitle}>All settled up!</Text>
          <Text style={styles.emptyStateDescription}>
            There are no outstanding balances in this group
          </Text>
        </View>
      }
      contentContainerStyle={styles.contentContainer}
      ListHeaderComponent={
        balances.length > 0 ? (
          <TouchableOpacity 
            style={styles.settleUpButton}
            onPress={onSettleUp}
          >
            <Text style={styles.settleUpButtonText}>Settle Up</Text>
          </TouchableOpacity>
        ) : null
      }
      refreshControl={
        <RefreshControl refreshing={isLoading} onRefresh={onRefresh} />
      }
    />
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    padding: 16,
    paddingBottom: 80, // Extra padding for the actions container
  },
  settleUpButton: {
    backgroundColor: colors.success,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  settleUpButtonText: {
    fontFamily: 'InterMedium',
    fontSize: 16,
    color: colors.white,
  },
  balanceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  highlightedBalanceItem: {
    borderWidth: 1,
    borderColor: colors.primary,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  userName: {
    fontFamily: 'InterMedium',
    fontSize: 16,
    color: colors.textPrimary,
    flex: 1,
  },
  arrowContainer: {
    paddingHorizontal: 8,
  },
  balanceAmount: {
    fontFamily: 'InterSemiBold',
    fontSize: 16,
    color: colors.primary,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 24,
    marginBottom: 16,
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
  },
});

export default BalanceSummary;
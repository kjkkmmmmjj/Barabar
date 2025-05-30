import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Tag, Calendar } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { Expense } from '@/context/GroupsContext';
import { useAuth } from '@/hooks/useAuth';

interface ExpenseItemProps {
  expense: Expense;
  onPress?: () => void;
}

const ExpenseItem: React.FC<ExpenseItemProps> = ({ expense, onPress }) => {
  const { user } = useAuth();
  
  // Calculate what the current user paid or owes
  let userPaid = 0;
  let userOwes = 0;
  
  if (expense.paidBy === user?.id) {
    userPaid = expense.amount;
  }
  
  const userSplit = expense.splits.find(split => split.userId === user?.id);
  if (userSplit) {
    userOwes = userSplit.amount;
  }
  
  // Net amount for the current user (positive = you are owed, negative = you owe)
  const netAmount = userPaid - userOwes;
  
  const getNetAmountText = () => {
    if (netAmount > 0) {
      return `You lent ${formatCurrency(netAmount)}`;
    } else if (netAmount < 0) {
      return `You owe ${formatCurrency(Math.abs(netAmount))}`;
    } else {
      return 'Settled';
    }
  };

  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={onPress}
    >
      <View style={styles.header}>
        <Text style={styles.title} numberOfLines={1}>
          {expense.title}
        </Text>
        <Text 
          style={[
            styles.netAmount,
            netAmount > 0 ? styles.positiveAmount : 
            netAmount < 0 ? styles.negativeAmount : styles.settledAmount
          ]}
        >
          {getNetAmountText()}
        </Text>
      </View>
      
      <View style={styles.details}>
        <View style={styles.payer}>
          <Text style={styles.payerText}>
            {expense.paidBy === user?.id ? 'You paid ' : `${expense.paidByName} paid `}
            <Text style={styles.amount}>{formatCurrency(expense.amount)}</Text>
          </Text>
        </View>
        
        <View style={styles.metaContainer}>
          <View style={styles.metaItem}>
            <Calendar size={14} color={colors.textSecondary} style={styles.metaIcon} />
            <Text style={styles.metaText}>{formatDate(expense.date)}</Text>
          </View>
          
          <View style={styles.metaItem}>
            <Tag size={14} color={colors.textSecondary} style={styles.metaIcon} />
            <Text style={styles.metaText}>{expense.category}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontFamily: 'InterSemiBold',
    fontSize: 16,
    color: colors.textPrimary,
    flex: 1,
    marginRight: 8,
  },
  netAmount: {
    fontFamily: 'InterSemiBold',
    fontSize: 14,
  },
  positiveAmount: {
    color: colors.success,
  },
  negativeAmount: {
    color: colors.error,
  },
  settledAmount: {
    color: colors.textSecondary,
  },
  details: {
    marginTop: 4,
  },
  payer: {
    marginBottom: 8,
  },
  payerText: {
    fontFamily: 'InterRegular',
    fontSize: 14,
    color: colors.textSecondary,
  },
  amount: {
    fontFamily: 'InterMedium',
    color: colors.textPrimary,
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  metaIcon: {
    marginRight: 4,
  },
  metaText: {
    fontFamily: 'InterRegular',
    fontSize: 12,
    color: colors.textSecondary,
  },
});

export default ExpenseItem;
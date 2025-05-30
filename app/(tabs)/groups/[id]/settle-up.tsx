import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useGroups } from '@/hooks/useGroups';
import { AlertCircle, Check, ArrowRight } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { formatCurrency } from '@/utils/formatters';
import AppButton from '@/components/ui/AppButton';
import AmountInput from '@/components/expenses/AmountInput';

export default function SettleUpScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { getGroup, getGroupBalances, settleUp, isLoading } = useGroups();
  
  const group = getGroup(id);
  const balances = getGroupBalances(id);
  
  const [selectedBalance, setSelectedBalance] = useState<any>(null);
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  
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
  
  const positiveBalances = balances.filter(balance => balance.amount > 0);
  
  const handleSelectBalance = (balance: any) => {
    setSelectedBalance(balance);
    setAmount(balance.amount.toString());
  };
  
  const handleSettleUp = async () => {
    if (!selectedBalance) {
      setError('Please select a balance to settle');
      return;
    }
    
    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }
    
    const settlementAmount = parseFloat(amount);
    
    if (settlementAmount > selectedBalance.amount) {
      setError('Settlement amount cannot exceed the owed amount');
      return;
    }
    
    try {
      await settleUp(id, {
        fromUserId: selectedBalance.fromUserId,
        toUserId: selectedBalance.toUserId,
        amount: settlementAmount,
      });
      
      router.back();
    } catch (err: any) {
      setError(err.message || 'Failed to settle up');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.formContainer}>
          <Text style={styles.title}>Settle Up in {group.name}</Text>
          
          {error ? (
            <View style={styles.errorContainer}>
              <AlertCircle size={20} color={colors.error} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}
          
          {positiveBalances.length === 0 ? (
            <View style={styles.emptyState}>
              <Check size={64} color={colors.success} style={styles.emptyStateIcon} />
              <Text style={styles.emptyStateTitle}>All settled up!</Text>
              <Text style={styles.emptyStateDescription}>
                There are no balances to settle in this group
              </Text>
            </View>
          ) : (
            <>
              <Text style={styles.sectionTitle}>Select a balance to settle:</Text>
              
              <FlatList
                data={positiveBalances}
                keyExtractor={(item, index) => `${item.fromUserId}-${item.toUserId}-${index}`}
                renderItem={({ item }) => {
                  const isSelected = selectedBalance && 
                    selectedBalance.fromUserId === item.fromUserId && 
                    selectedBalance.toUserId === item.toUserId;
                  
                  const fromUser = group.members.find(m => m.id === item.fromUserId);
                  const toUser = group.members.find(m => m.id === item.toUserId);
                  
                  return (
                    <TouchableOpacity
                      style={[
                        styles.balanceItem,
                        isSelected && styles.selectedBalanceItem
                      ]}
                      onPress={() => handleSelectBalance(item)}
                    >
                      <View style={styles.userInfo}>
                        <Text style={styles.userName}>{fromUser?.name || 'Unknown'}</Text>
                        <View style={styles.arrowContainer}>
                          <ArrowRight size={16} color={colors.textSecondary} />
                        </View>
                        <Text style={styles.userName}>{toUser?.name || 'Unknown'}</Text>
                      </View>
                      <Text style={styles.balanceAmount}>
                        {formatCurrency(item.amount)}
                      </Text>
                    </TouchableOpacity>
                  );
                }}
                scrollEnabled={false}
                style={styles.balancesList}
              />
              
              {selectedBalance && (
                <>
                  <Text style={styles.sectionTitle}>Settlement Amount:</Text>
                  <AmountInput
                    value={amount}
                    onChangeText={setAmount}
                    style={styles.amountInput}
                  />
                  
                  <Text style={styles.helperText}>
                    {parseFloat(amount) < selectedBalance.amount 
                      ? 'This will partially settle the debt'
                      : 'This will fully settle the debt'}
                  </Text>
                </>
              )}
              
              <AppButton
                title="Mark as Settled"
                onPress={handleSettleUp}
                isLoading={isLoading}
                style={styles.settleButton}
                disabled={!selectedBalance}
              />
            </>
          )}
          
          <AppButton
            title="Cancel"
            onPress={() => router.back()}
            type="secondary"
            style={styles.cancelButton}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 16,
  },
  formContainer: {
    flex: 1,
  },
  title: {
    fontFamily: 'InterBold',
    fontSize: 24,
    color: colors.textPrimary,
    marginBottom: 24,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.errorLight,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    fontFamily: 'InterRegular',
    color: colors.error,
    marginLeft: 8,
    flex: 1,
  },
  errorLink: {
    fontFamily: 'InterMedium',
    fontSize: 16,
    color: colors.primary,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 24,
    marginVertical: 16,
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
  sectionTitle: {
    fontFamily: 'InterSemiBold',
    fontSize: 16,
    color: colors.textPrimary,
    marginBottom: 12,
  },
  balancesList: {
    marginBottom: 24,
  },
  balanceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedBalanceItem: {
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
  amountInput: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 18,
    fontFamily: 'InterMedium',
    marginBottom: 8,
  },
  helperText: {
    fontFamily: 'InterRegular',
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 24,
  },
  settleButton: {
    marginTop: 16,
  },
  cancelButton: {
    marginTop: 12,
  },
});
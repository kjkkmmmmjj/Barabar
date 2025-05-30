import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform, 
  TouchableOpacity,
  Switch
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useGroups } from '@/hooks/useGroups';
import { AlertCircle, Calendar, DollarSign, Tag, Scroll, UsersRound } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import AppButton from '@/components/ui/AppButton';
import DatePicker from '@/components/ui/DatePicker';
import MemberSelector from '@/components/expenses/MemberSelector';
import SplitMethodSelector from '@/components/expenses/SplitMethodSelector';
import AmountInput from '@/components/expenses/AmountInput';
import CategorySelector from '@/components/expenses/CategorySelector';

export default function AddExpenseScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { getGroup, addExpense, isLoading } = useGroups();
  
  const group = getGroup(id);
  
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date());
  const [category, setCategory] = useState('General');
  const [notes, setNotes] = useState('');
  const [paidBy, setPaidBy] = useState<string | null>(null);
  const [splitMethod, setSplitMethod] = useState<'equal' | 'exact' | 'percentage' | 'shares'>('equal');
  const [splitValues, setSplitValues] = useState<Record<string, number>>({});
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showCategorySelector, setShowCategorySelector] = useState(false);
  const [showMemberSelector, setShowMemberSelector] = useState(false);
  const [showSplitMethodSelector, setShowSplitMethodSelector] = useState(false);
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
  
  const handleAddExpense = async () => {
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    
    if (!amount || parseFloat(amount) <= 0) {
      setError('Valid amount is required');
      return;
    }
    
    if (!paidBy) {
      setError('Select who paid');
      return;
    }
    
    const totalAmount = parseFloat(amount);
    
    try {
      await addExpense(id, {
        title: title.trim(),
        amount: totalAmount,
        date,
        category,
        notes: notes.trim(),
        paidBy,
        splitMethod,
        splitValues,
      });
      
      router.back();
    } catch (err: any) {
      setError(err.message || 'Failed to add expense');
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
          <Text style={styles.title}>Add Expense to {group.name}</Text>
          
          {error ? (
            <View style={styles.errorContainer}>
              <AlertCircle size={20} color={colors.error} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Title</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Dinner at Restaurant"
              placeholderTextColor={colors.textSecondary}
              value={title}
              onChangeText={setTitle}
              maxLength={50}
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Amount</Text>
            <AmountInput
              value={amount}
              onChangeText={setAmount}
              style={styles.amountInput}
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Date</Text>
            <TouchableOpacity 
              style={styles.datePickerButton}
              onPress={() => setShowDatePicker(true)}
            >
              <Calendar size={20} color={colors.textSecondary} style={styles.inputIcon} />
              <Text style={styles.dateText}>
                {date.toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </Text>
            </TouchableOpacity>
            
            {showDatePicker && (
              <DatePicker
                date={date}
                onDateChange={setDate}
                onClose={() => setShowDatePicker(false)}
              />
            )}
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Category</Text>
            <TouchableOpacity 
              style={styles.selectorButton}
              onPress={() => setShowCategorySelector(true)}
            >
              <Tag size={20} color={colors.textSecondary} style={styles.inputIcon} />
              <Text style={styles.selectorText}>{category}</Text>
            </TouchableOpacity>
            
            {showCategorySelector && (
              <CategorySelector
                selectedCategory={category}
                onSelectCategory={setCategory}
                onClose={() => setShowCategorySelector(false)}
              />
            )}
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Notes (Optional)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Add details about this expense"
              placeholderTextColor={colors.textSecondary}
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={3}
              maxLength={200}
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Paid By</Text>
            <TouchableOpacity 
              style={styles.selectorButton}
              onPress={() => setShowMemberSelector(true)}
            >
              <UsersRound size={20} color={colors.textSecondary} style={styles.inputIcon} />
              <Text style={styles.selectorText}>
                {paidBy 
                  ? group.members.find(m => m.id === paidBy)?.name || 'Unknown member'
                  : 'Select a member'}
              </Text>
            </TouchableOpacity>
            
            {showMemberSelector && (
              <MemberSelector
                members={group.members}
                selectedMemberId={paidBy}
                onSelectMember={setPaidBy}
                onClose={() => setShowMemberSelector(false)}
              />
            )}
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Split Method</Text>
            <TouchableOpacity 
              style={styles.selectorButton}
              onPress={() => setShowSplitMethodSelector(true)}
            >
              <Scroll size={20} color={colors.textSecondary} style={styles.inputIcon} />
              <Text style={styles.selectorText}>
                {splitMethod === 'equal' ? 'Split Equally' : 
                 splitMethod === 'exact' ? 'Split by Exact Amounts' :
                 splitMethod === 'percentage' ? 'Split by Percentages' :
                 'Split by Shares'}
              </Text>
            </TouchableOpacity>
            
            {showSplitMethodSelector && (
              <SplitMethodSelector
                members={group.members}
                amount={parseFloat(amount) || 0}
                splitMethod={splitMethod}
                splitValues={splitValues}
                onChangeSplitMethod={setSplitMethod}
                onChangeSplitValues={setSplitValues}
                onClose={() => setShowSplitMethodSelector(false)}
              />
            )}
          </View>
          
          <AppButton
            title="Add Expense"
            onPress={handleAddExpense}
            isLoading={isLoading}
            style={styles.addButton}
          />
          
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
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontFamily: 'InterMedium',
    fontSize: 16,
    color: colors.textPrimary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: 'InterRegular',
    color: colors.textPrimary,
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
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  datePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  selectorButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  inputIcon: {
    marginRight: 12,
  },
  dateText: {
    fontSize: 16,
    fontFamily: 'InterRegular',
    color: colors.textPrimary,
  },
  selectorText: {
    fontSize: 16,
    fontFamily: 'InterRegular',
    color: colors.textPrimary,
  },
  addButton: {
    marginTop: 16,
  },
  cancelButton: {
    marginTop: 12,
  },
});
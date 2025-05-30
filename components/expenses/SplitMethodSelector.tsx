import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Modal, TextInput } from 'react-native';
import { X } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { formatCurrency } from '@/utils/formatters';

interface Member {
  id: string;
  name: string;
  email: string;
}

interface SplitMethodSelectorProps {
  members: Member[];
  amount: number;
  splitMethod: 'equal' | 'exact' | 'percentage' | 'shares';
  splitValues: Record<string, number>;
  onChangeSplitMethod: (method: 'equal' | 'exact' | 'percentage' | 'shares') => void;
  onChangeSplitValues: (values: Record<string, number>) => void;
  onClose: () => void;
}

const SplitMethodSelector: React.FC<SplitMethodSelectorProps> = ({
  members,
  amount,
  splitMethod,
  splitValues,
  onChangeSplitMethod,
  onChangeSplitValues,
  onClose,
}) => {
  const [localSplitValues, setLocalSplitValues] = useState<Record<string, number>>(splitValues);
  
  useEffect(() => {
    // Initialize split values based on method
    const initialValues: Record<string, number> = {};
    
    switch (splitMethod) {
      case 'equal':
        const equalAmount = amount / members.length;
        members.forEach(member => {
          initialValues[member.id] = equalAmount;
        });
        break;
      case 'exact':
        members.forEach(member => {
          initialValues[member.id] = splitValues[member.id] || 0;
        });
        break;
      case 'percentage':
        members.forEach(member => {
          initialValues[member.id] = splitValues[member.id] || (100 / members.length);
        });
        break;
      case 'shares':
        members.forEach(member => {
          initialValues[member.id] = splitValues[member.id] || 1;
        });
        break;
    }
    
    setLocalSplitValues(initialValues);
  }, [splitMethod, members]);
  
  const handleChangeSplitMethod = (method: 'equal' | 'exact' | 'percentage' | 'shares') => {
    onChangeSplitMethod(method);
  };
  
  const handleSave = () => {
    onChangeSplitValues(localSplitValues);
    onClose();
  };
  
  const handleChangeValue = (memberId: string, value: string) => {
    const numValue = parseFloat(value) || 0;
    
    const newValues = {
      ...localSplitValues,
      [memberId]: numValue,
    };
    
    setLocalSplitValues(newValues);
  };
  
  const renderSplitMethodOptions = () => (
    <View style={styles.methodOptions}>
      <TouchableOpacity
        style={[
          styles.methodOption,
          splitMethod === 'equal' && styles.selectedMethodOption
        ]}
        onPress={() => handleChangeSplitMethod('equal')}
      >
        <Text
          style={[
            styles.methodOptionText,
            splitMethod === 'equal' && styles.selectedMethodOptionText
          ]}
        >
          Equal
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[
          styles.methodOption,
          splitMethod === 'exact' && styles.selectedMethodOption
        ]}
        onPress={() => handleChangeSplitMethod('exact')}
      >
        <Text
          style={[
            styles.methodOptionText,
            splitMethod === 'exact' && styles.selectedMethodOptionText
          ]}
        >
          Exact
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[
          styles.methodOption,
          splitMethod === 'percentage' && styles.selectedMethodOption
        ]}
        onPress={() => handleChangeSplitMethod('percentage')}
      >
        <Text
          style={[
            styles.methodOptionText,
            splitMethod === 'percentage' && styles.selectedMethodOptionText
          ]}
        >
          Percentage
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[
          styles.methodOption,
          splitMethod === 'shares' && styles.selectedMethodOption
        ]}
        onPress={() => handleChangeSplitMethod('shares')}
      >
        <Text
          style={[
            styles.methodOptionText,
            splitMethod === 'shares' && styles.selectedMethodOptionText
          ]}
        >
          Shares
        </Text>
      </TouchableOpacity>
    </View>
  );
  
  const renderValueInput = (member: Member) => {
    switch (splitMethod) {
      case 'equal':
        return (
          <Text style={styles.equalValue}>
            {formatCurrency(amount / members.length)}
          </Text>
        );
      case 'exact':
        return (
          <View style={styles.inputContainer}>
            <Text style={styles.inputPrefix}>$</Text>
            <TextInput
              style={styles.input}
              value={localSplitValues[member.id]?.toString() || '0'}
              onChangeText={(value) => handleChangeValue(member.id, value)}
              keyboardType="decimal-pad"
            />
          </View>
        );
      case 'percentage':
        return (
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={localSplitValues[member.id]?.toString() || '0'}
              onChangeText={(value) => handleChangeValue(member.id, value)}
              keyboardType="decimal-pad"
            />
            <Text style={styles.inputSuffix}>%</Text>
          </View>
        );
      case 'shares':
        return (
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={localSplitValues[member.id]?.toString() || '0'}
              onChangeText={(value) => handleChangeValue(member.id, value)}
              keyboardType="number-pad"
            />
            <Text style={styles.inputSuffix}>shares</Text>
          </View>
        );
    }
  };
  
  const getTotalInfo = () => {
    switch (splitMethod) {
      case 'exact':
        const totalExact = Object.values(localSplitValues).reduce((sum, val) => sum + val, 0);
        return {
          label: 'Total',
          value: formatCurrency(totalExact),
          isValid: Math.abs(totalExact - amount) < 0.01,
        };
      case 'percentage':
        const totalPercentage = Object.values(localSplitValues).reduce((sum, val) => sum + val, 0);
        return {
          label: 'Total',
          value: `${totalPercentage.toFixed(1)}%`,
          isValid: Math.abs(totalPercentage - 100) < 0.1,
        };
      case 'shares':
        const totalShares = Object.values(localSplitValues).reduce((sum, val) => sum + val, 0);
        return {
          label: 'Total',
          value: `${totalShares} shares`,
          isValid: totalShares > 0,
        };
      default:
        return {
          label: 'Total',
          value: formatCurrency(amount),
          isValid: true,
        };
    }
  };
  
  const totalInfo = getTotalInfo();

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Split {formatCurrency(amount)}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>
          
          {renderSplitMethodOptions()}
          
          <FlatList
            data={members}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <View style={styles.memberItem}>
                <Text style={styles.memberName}>{item.name}</Text>
                {renderValueInput(item)}
              </View>
            )}
            contentContainerStyle={styles.membersList}
            ListFooterComponent={
              <View style={styles.footer}>
                <View style={styles.totalContainer}>
                  <Text style={styles.totalLabel}>{totalInfo.label}</Text>
                  <Text
                    style={[
                      styles.totalValue,
                      !totalInfo.isValid && styles.invalidValue
                    ]}
                  >
                    {totalInfo.value}
                  </Text>
                </View>
                
                {!totalInfo.isValid && (
                  <Text style={styles.errorText}>
                    {splitMethod === 'exact' ? 'Total must equal the expense amount' :
                     splitMethod === 'percentage' ? 'Total must equal 100%' :
                     'Total shares must be greater than 0'}
                  </Text>
                )}
                
                <TouchableOpacity
                  style={[
                    styles.saveButton,
                    !totalInfo.isValid && styles.disabledButton
                  ]}
                  onPress={handleSave}
                  disabled={!totalInfo.isValid}
                >
                  <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
              </View>
            }
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontFamily: 'InterBold',
    fontSize: 18,
    color: colors.textPrimary,
  },
  closeButton: {
    padding: 4,
  },
  methodOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  methodOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  selectedMethodOption: {
    backgroundColor: colors.primaryLight,
  },
  methodOptionText: {
    fontFamily: 'InterMedium',
    fontSize: 14,
    color: colors.textSecondary,
  },
  selectedMethodOptionText: {
    color: colors.primary,
  },
  membersList: {
    padding: 16,
  },
  memberItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  memberName: {
    fontFamily: 'InterMedium',
    fontSize: 16,
    color: colors.textPrimary,
    flex: 1,
  },
  equalValue: {
    fontFamily: 'InterMedium',
    fontSize: 16,
    color: colors.primary,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 8,
    height: 36,
  },
  inputPrefix: {
    fontFamily: 'InterMedium',
    fontSize: 16,
    color: colors.textSecondary,
    marginRight: 4,
  },
  input: {
    fontFamily: 'InterMedium',
    fontSize: 16,
    color: colors.textPrimary,
    minWidth: 60,
    textAlign: 'center',
  },
  inputSuffix: {
    fontFamily: 'InterMedium',
    fontSize: 16,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  footer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  totalLabel: {
    fontFamily: 'InterBold',
    fontSize: 16,
    color: colors.textPrimary,
  },
  totalValue: {
    fontFamily: 'InterBold',
    fontSize: 16,
    color: colors.primary,
  },
  invalidValue: {
    color: colors.error,
  },
  errorText: {
    fontFamily: 'InterRegular',
    fontSize: 14,
    color: colors.error,
    marginBottom: 16,
  },
  saveButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  disabledButton: {
    backgroundColor: colors.disabled,
  },
  saveButtonText: {
    fontFamily: 'InterMedium',
    fontSize: 16,
    color: colors.white,
  },
});

export default SplitMethodSelector;
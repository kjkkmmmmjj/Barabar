import React from 'react';
import { View, TextInput, Text, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { DollarSign } from 'lucide-react-native';
import { colors } from '@/constants/colors';

interface AmountInputProps {
  value: string;
  onChangeText: (text: string) => void;
  style?: StyleProp<ViewStyle>;
}

const AmountInput: React.FC<AmountInputProps> = ({ value, onChangeText, style }) => {
  const handleChangeText = (text: string) => {
    // Allow only numbers and at most one decimal point
    const filtered = text.replace(/[^0-9.]/g, '');
    
    // Ensure at most one decimal point
    const parts = filtered.split('.');
    if (parts.length > 2) {
      return;
    }
    
    // Ensure at most 2 decimal places
    if (parts.length === 2 && parts[1].length > 2) {
      return;
    }
    
    onChangeText(filtered);
  };

  return (
    <View style={[styles.container, style]}>
      <DollarSign size={20} color={colors.textSecondary} style={styles.icon} />
      <TextInput
        style={styles.input}
        placeholder="0.00"
        placeholderTextColor={colors.textSecondary}
        value={value}
        onChangeText={handleChangeText}
        keyboardType="decimal-pad"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 18,
    fontFamily: 'InterMedium',
    color: colors.textPrimary,
  },
});

export default AmountInput;
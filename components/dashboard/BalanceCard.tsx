import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LucideIcon } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { formatCurrency } from '@/utils/formatters';

interface BalanceCardProps {
  title: string;
  amount: number;
  color: string;
  icon: LucideIcon;
  small?: boolean;
}

const BalanceCard: React.FC<BalanceCardProps> = ({
  title,
  amount,
  color,
  icon: Icon,
  small = false,
}) => {
  return (
    <View style={[
      styles.container,
      small ? styles.smallContainer : styles.largeContainer
    ]}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <View style={[styles.iconContainer, { backgroundColor: `${color}20` }]}>
          <Icon size={small ? 16 : 20} color={color} />
        </View>
      </View>
      
      <Text style={[
        styles.amount,
        small ? styles.smallAmount : styles.largeAmount,
        { color }
      ]}>
        {formatCurrency(amount)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  largeContainer: {
    marginBottom: 0,
  },
  smallContainer: {
    flex: 1,
    marginHorizontal: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontFamily: 'InterMedium',
    fontSize: 14,
    color: colors.textSecondary,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  amount: {
    fontFamily: 'InterBold',
  },
  largeAmount: {
    fontSize: 28,
  },
  smallAmount: {
    fontSize: 20,
  },
});

export default BalanceCard;
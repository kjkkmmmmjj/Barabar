import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Users, TrendingUp, TrendingDown } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { formatCurrency } from '@/utils/formatters';
import { Group } from '@/context/GroupsContext';

interface GroupCardProps {
  group: Group;
  onPress: () => void;
}

const GroupCard: React.FC<GroupCardProps> = ({ group, onPress }) => {
  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={onPress}
    >
      <View style={styles.iconContainer}>
        <Users size={24} color={colors.primary} />
      </View>
      
      <View style={styles.contentContainer}>
        <Text style={styles.name} numberOfLines={1}>
          {group.name}
        </Text>
        
        <View style={styles.detailsContainer}>
          <Text style={styles.members} numberOfLines={1}>
            {group.members.length} {group.members.length === 1 ? 'member' : 'members'}
          </Text>
        </View>
      </View>
      
      <View style={styles.balanceContainer}>
        {group.balance !== 0 && (
          <View style={[
            styles.balanceBadge,
            group.balance > 0 ? styles.positiveBadge : styles.negativeBadge
          ]}>
            {group.balance > 0 ? (
              <TrendingUp size={12} color={colors.success} style={styles.balanceIcon} />
            ) : (
              <TrendingDown size={12} color={colors.error} style={styles.balanceIcon} />
            )}
            <Text style={[
              styles.balanceText,
              group.balance > 0 ? styles.positiveText : styles.negativeText
            ]}>
              {formatCurrency(Math.abs(group.balance))}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
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
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontFamily: 'InterSemiBold',
    fontSize: 16,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  detailsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  members: {
    fontFamily: 'InterRegular',
    fontSize: 14,
    color: colors.textSecondary,
  },
  balanceContainer: {
    justifyContent: 'center',
  },
  balanceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  positiveBadge: {
    backgroundColor: colors.successLight,
  },
  negativeBadge: {
    backgroundColor: colors.errorLight,
  },
  balanceIcon: {
    marginRight: 4,
  },
  balanceText: {
    fontFamily: 'InterMedium',
    fontSize: 12,
  },
  positiveText: {
    color: colors.success,
  },
  negativeText: {
    color: colors.error,
  },
});

export default GroupCard;
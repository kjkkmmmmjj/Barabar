import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Users, Info } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { Group } from '@/context/GroupsContext';
import { formatCurrency } from '@/utils/formatters';

interface GroupHeaderProps {
  group: Group;
}

const GroupHeader: React.FC<GroupHeaderProps> = ({ group }) => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Users size={24} color={colors.white} />
        </View>
        
        <View style={styles.groupInfo}>
          <Text style={styles.name}>{group.name}</Text>
          <Text style={styles.members}>
            {group.members.length} {group.members.length === 1 ? 'member' : 'members'}
          </Text>
        </View>
        
        {group.description ? (
          <TouchableOpacity style={styles.infoButton}>
            <Info size={20} color={colors.white} />
          </TouchableOpacity>
        ) : null}
      </View>
      
      {group.balance !== 0 && (
        <View style={styles.balanceInfo}>
          <Text style={styles.balanceLabel}>
            {group.balance > 0 ? 'Total owed to you' : 'Total you owe'}
          </Text>
          <Text style={[
            styles.balanceAmount,
            group.balance > 0 ? styles.positiveBalance : styles.negativeBalance
          ]}>
            {formatCurrency(Math.abs(group.balance))}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primary,
    paddingTop: 16,
    paddingBottom: 24,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  groupInfo: {
    flex: 1,
  },
  name: {
    fontFamily: 'InterBold',
    fontSize: 18,
    color: colors.white,
    marginBottom: 4,
  },
  members: {
    fontFamily: 'InterRegular',
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  infoButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  balanceInfo: {
    marginTop: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 12,
  },
  balanceLabel: {
    fontFamily: 'InterRegular',
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 4,
  },
  balanceAmount: {
    fontFamily: 'InterBold',
    fontSize: 20,
  },
  positiveBalance: {
    color: colors.successLight,
  },
  negativeBalance: {
    color: colors.errorLight,
  },
});

export default GroupHeader;
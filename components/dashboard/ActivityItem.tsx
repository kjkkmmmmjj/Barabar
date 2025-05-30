import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Receipt, ArrowRight } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { Activity } from '@/context/GroupsContext';
import { useAuth } from '@/hooks/useAuth';

interface ActivityItemProps {
  activity: Activity;
}

const ActivityItem: React.FC<ActivityItemProps> = ({ activity }) => {
  const router = useRouter();
  const { user } = useAuth();
  
  const navigateToGroup = () => {
    router.push(`/(tabs)/groups/${activity.groupId}`);
  };
  
  const getActivityDescription = () => {
    if (activity.type === 'expense') {
      if (activity.relatedUserName) {
        if (user?.displayName === activity.relatedUserName) {
          return `You paid for "${activity.title}"`;
        } else {
          return `${activity.relatedUserName} paid for "${activity.title}"`;
        }
      } else {
        return `Expense added: "${activity.title}"`;
      }
    } else if (activity.type === 'settlement') {
      return `Settlement with ${activity.relatedUserName}`;
    }
    return activity.title;
  };

  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={navigateToGroup}
    >
      <View style={styles.iconContainer}>
        <Receipt size={24} color={colors.primary} />
      </View>
      
      <View style={styles.contentContainer}>
        <Text style={styles.title} numberOfLines={1}>
          {getActivityDescription()}
        </Text>
        
        <View style={styles.detailsContainer}>
          <Text style={styles.groupName} numberOfLines={1}>
            {activity.groupName}
          </Text>
          <Text style={styles.date}>
            {formatDate(activity.date)}
          </Text>
        </View>
      </View>
      
      <View style={styles.amountContainer}>
        <Text style={styles.amount}>{formatCurrency(activity.amount)}</Text>
        <ArrowRight size={16} color={colors.textSecondary} />
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
  title: {
    fontFamily: 'InterMedium',
    fontSize: 16,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  detailsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  groupName: {
    fontFamily: 'InterRegular',
    fontSize: 14,
    color: colors.textSecondary,
    marginRight: 8,
    flex: 1,
  },
  date: {
    fontFamily: 'InterRegular',
    fontSize: 12,
    color: colors.textSecondary,
  },
  amountContainer: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginLeft: 12,
  },
  amount: {
    fontFamily: 'InterSemiBold',
    fontSize: 16,
    color: colors.primary,
    marginBottom: 4,
  },
});

export default ActivityItem;
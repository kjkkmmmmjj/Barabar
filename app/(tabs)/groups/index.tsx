import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { useGroups } from '@/hooks/useGroups';
import { Plus, Users, DollarSign } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import GroupCard from '@/components/groups/GroupCard';
import FloatingActionButton from '@/components/ui/FloatingActionButton';

export default function GroupsScreen() {
  const router = useRouter();
  const { groups, isLoading, refreshData } = useGroups();
  const [activeTab, setActiveTab] = useState('all'); // 'all' or 'owes'
  
  const filteredGroups = activeTab === 'all' 
    ? groups 
    : groups.filter(group => group.balance !== 0);
  
  const navigateToCreateGroup = () => {
    router.push('/(tabs)/groups/create');
  };
  
  const navigateToJoinGroup = () => {
    router.push('/(tabs)/groups/join');
  };
  
  const navigateToGroupDetails = (groupId: string) => {
    router.push(`/(tabs)/groups/${groupId}`);
  };

  const renderEmptyState = () => (
    <View style={styles.emptyStateContainer}>
      <Users size={64} color={colors.textSecondary} style={styles.emptyStateIcon} />
      <Text style={styles.emptyStateTitle}>No groups yet</Text>
      <Text style={styles.emptyStateDescription}>
        Create a group to start splitting expenses with friends
      </Text>
      <TouchableOpacity 
        style={styles.createGroupButton}
        onPress={navigateToCreateGroup}
      >
        <Plus size={20} color={colors.white} />
        <Text style={styles.createGroupButtonText}>Create a Group</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.joinGroupButton}
        onPress={navigateToJoinGroup}
      >
        <Text style={styles.joinGroupButtonText}>Join Existing Group</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {groups.length > 0 && (
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === 'all' && styles.activeTab
            ]}
            onPress={() => setActiveTab('all')}
          >
            <Users 
              size={16} 
              color={activeTab === 'all' ? colors.primary : colors.textSecondary} 
              style={styles.tabIcon}
            />
            <Text 
              style={[
                styles.tabText,
                activeTab === 'all' && styles.activeTabText
              ]}
            >
              All Groups
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === 'owes' && styles.activeTab
            ]}
            onPress={() => setActiveTab('owes')}
          >
            <DollarSign 
              size={16} 
              color={activeTab === 'owes' ? colors.primary : colors.textSecondary} 
              style={styles.tabIcon}
            />
            <Text 
              style={[
                styles.tabText,
                activeTab === 'owes' && styles.activeTabText
              ]}
            >
              With Balances
            </Text>
          </TouchableOpacity>
        </View>
      )}
      
      <FlatList
        data={filteredGroups}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <GroupCard 
            group={item} 
            onPress={() => navigateToGroupDetails(item.id)}
          />
        )}
        ListEmptyComponent={renderEmptyState}
        contentContainerStyle={groups.length === 0 ? styles.fullHeight : styles.listContent}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refreshData} />
        }
      />
      
      {groups.length > 0 && (
        <FloatingActionButton
          icon={<Plus size={24} color={colors.white} />}
          onPress={navigateToCreateGroup}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    padding: 8,
    marginHorizontal: 16,
    marginVertical: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: colors.primaryLight,
  },
  tabIcon: {
    marginRight: 8,
  },
  tabText: {
    fontFamily: 'InterMedium',
    fontSize: 14,
    color: colors.textSecondary,
  },
  activeTabText: {
    color: colors.primary,
  },
  listContent: {
    padding: 16,
  },
  fullHeight: {
    flexGrow: 1,
  },
  emptyStateContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
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
    marginBottom: 24,
  },
  createGroupButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginBottom: 16,
  },
  createGroupButtonText: {
    fontFamily: 'InterMedium',
    fontSize: 16,
    color: colors.white,
    marginLeft: 8,
  },
  joinGroupButton: {
    paddingVertical: 12,
  },
  joinGroupButtonText: {
    fontFamily: 'InterMedium',
    fontSize: 16,
    color: colors.primary,
  },
});
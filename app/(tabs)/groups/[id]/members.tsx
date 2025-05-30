import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Share } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useGroups } from '@/hooks/useGroups';
import { Copy, Mail, UserPlus, User, AlertCircle } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import AppButton from '@/components/ui/AppButton';

export default function GroupMembersScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { getGroup, addMemberByEmail, isLoading } = useGroups();
  
  const group = getGroup(id);
  
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [showAddMember, setShowAddMember] = useState(false);
  
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
  
  const handleAddMember = async () => {
    if (!email.trim()) {
      setError('Email is required');
      return;
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError('Please enter a valid email address');
      return;
    }
    
    try {
      await addMemberByEmail(id, email.trim());
      setEmail('');
      setShowAddMember(false);
      setError('');
    } catch (err: any) {
      setError(err.message || 'Failed to add member');
    }
  };
  
  const shareGroupCode = async () => {
    try {
      await Share.share({
        message: `Join my group "${group.name}" in SplitEase with code: ${group.code}`,
      });
    } catch (error) {
      console.error('Error sharing group code:', error);
    }
  };
  
  const copyGroupCode = async () => {
    try {
      await Share.share({
        message: group.code,
      });
    } catch (error) {
      console.error('Error copying group code:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.codeContainer}>
        <View style={styles.codeHeader}>
          <Text style={styles.codeTitle}>Group Code</Text>
          <TouchableOpacity 
            style={styles.copyButton}
            onPress={copyGroupCode}
          >
            <Copy size={16} color={colors.primary} />
            <Text style={styles.copyText}>Copy</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.codeBox}>
          <Text style={styles.codeText}>{group.code}</Text>
        </View>
        <Text style={styles.codeHelper}>
          Share this code with friends to invite them to this group
        </Text>
        <TouchableOpacity
          style={styles.shareCodeButton}
          onPress={shareGroupCode}
        >
          <UserPlus size={20} color={colors.white} />
          <Text style={styles.shareCodeButtonText}>Share Invite Code</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.membersContainer}>
        <View style={styles.membersHeader}>
          <Text style={styles.membersTitle}>Members ({group.members.length})</Text>
          <TouchableOpacity 
            style={styles.addMemberButton}
            onPress={() => setShowAddMember(!showAddMember)}
          >
            <Text style={styles.addMemberText}>{showAddMember ? 'Cancel' : 'Add Member'}</Text>
          </TouchableOpacity>
        </View>
        
        {showAddMember && (
          <View style={styles.addMemberForm}>
            {error ? (
              <View style={styles.errorContainer}>
                <AlertCircle size={20} color={colors.error} />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}
            
            <View style={styles.inputContainer}>
              <Mail size={20} color={colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter email address"
                placeholderTextColor={colors.textSecondary}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>
            
            <AppButton
              title="Add to Group"
              onPress={handleAddMember}
              isLoading={isLoading}
              style={styles.submitButton}
            />
          </View>
        )}
        
        <FlatList
          data={group.members}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={styles.memberItem}>
              <View style={styles.memberAvatar}>
                <User size={24} color={colors.white} />
              </View>
              <View style={styles.memberInfo}>
                <Text style={styles.memberName}>{item.name}</Text>
                <Text style={styles.memberEmail}>{item.email}</Text>
              </View>
            </View>
          )}
          contentContainerStyle={styles.membersList}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 16,
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
  codeContainer: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  codeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  codeTitle: {
    fontFamily: 'InterBold',
    fontSize: 18,
    color: colors.textPrimary,
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  copyText: {
    fontFamily: 'InterMedium',
    fontSize: 14,
    color: colors.primary,
    marginLeft: 4,
  },
  codeBox: {
    backgroundColor: colors.backgroundLight,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  codeText: {
    fontFamily: 'InterBold',
    fontSize: 24,
    color: colors.primary,
    letterSpacing: 2,
  },
  codeHelper: {
    fontFamily: 'InterRegular',
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 16,
  },
  shareCodeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 8,
  },
  shareCodeButtonText: {
    fontFamily: 'InterMedium',
    fontSize: 16,
    color: colors.white,
    marginLeft: 8,
  },
  membersContainer: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  membersHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  membersTitle: {
    fontFamily: 'InterBold',
    fontSize: 18,
    color: colors.textPrimary,
  },
  addMemberButton: {
    paddingVertical: 8,
  },
  addMemberText: {
    fontFamily: 'InterMedium',
    fontSize: 14,
    color: colors.primary,
  },
  addMemberForm: {
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    marginBottom: 12,
    paddingHorizontal: 12,
    height: 50,
    backgroundColor: colors.background,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontFamily: 'InterRegular',
    fontSize: 16,
    color: colors.textPrimary,
  },
  submitButton: {
    marginBottom: 16,
  },
  membersList: {
    paddingBottom: 16,
  },
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  memberAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontFamily: 'InterMedium',
    fontSize: 16,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  memberEmail: {
    fontFamily: 'InterRegular',
    fontSize: 14,
    color: colors.textSecondary,
  },
});
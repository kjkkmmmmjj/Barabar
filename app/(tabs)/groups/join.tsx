import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useGroups } from '@/hooks/useGroups';
import { AlertCircle } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import AppButton from '@/components/ui/AppButton';

export default function JoinGroupScreen() {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const { joinGroup, isLoading } = useGroups();
  const router = useRouter();

  const handleJoinGroup = async () => {
    if (!code.trim()) {
      setError('Group code is required');
      return;
    }
    
    try {
      const groupId = await joinGroup(code.trim());
      
      // Navigate to the joined group
      router.replace(`/(tabs)/groups/${groupId}`);
    } catch (err: any) {
      setError(err.message || 'Failed to join group');
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
          <Text style={styles.title}>Join an Existing Group</Text>
          <Text style={styles.subtitle}>
            Enter the group code shared with you to join
          </Text>
          
          {error ? (
            <View style={styles.errorContainer}>
              <AlertCircle size={20} color={colors.error} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Group Code</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter group code"
              placeholderTextColor={colors.textSecondary}
              value={code}
              onChangeText={setCode}
              autoCapitalize="characters"
            />
          </View>
          
          <AppButton
            title="Join Group"
            onPress={handleJoinGroup}
            isLoading={isLoading}
            style={styles.joinButton}
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
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'InterRegular',
    fontSize: 16,
    color: colors.textSecondary,
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
  joinButton: {
    marginTop: 16,
  },
  cancelButton: {
    marginTop: 12,
  },
});
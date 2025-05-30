import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useGroups } from '@/hooks/useGroups';
import { AlertCircle } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import AppButton from '@/components/ui/AppButton';
import * as SQLite from 'expo-sqlite';

// Open the database using expo-sqlite
const db = SQLite.openDatabase('Usergroup.db');

export default function CreateGroupScreen() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const { createGroup, isLoading } = useGroups();
  const router = useRouter();

  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS groups (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, description TEXT);'
      );
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, email TEXT UNIQUE);'
      );
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS group_members (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            group_id INTEGER,
            user_id INTEGER,
            FOREIGN KEY(group_id) REFERENCES groups(id),
            FOREIGN KEY(user_id) REFERENCES users(id)
        );`
      );
    }, error => {
      console.error('DB Error:', error);
    }, () => {
      console.log('Tables created successfully');
    });
  }, []);

  const handleCreateGroup = async () => {
    if (!name.trim()) {
      setError('Group name is required');
      return;
    }

    try {
      const groupId = await createGroup({
        name: name.trim(),
        description: description.trim(),
      });

      router.replace(`/(tabs)/groups/${groupId}`);
    } catch (err: any) {
      setError(err.message || 'Failed to create group');
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
          <Text style={styles.title}>Create a New Group</Text>
          <Text style={styles.subtitle}>
            Create a group to start splitting expenses with friends
          </Text>

          {error ? (
            <View style={styles.errorContainer}>
              <AlertCircle size={20} color={colors.error} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Group Name</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Summer Trip 2025"
              placeholderTextColor={colors.textSecondary}
              value={name}
              onChangeText={setName}
              maxLength={50}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description (Optional)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="What is this group for?"
              placeholderTextColor={colors.textSecondary}
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              maxLength={200}
            />
          </View>

          <AppButton
            title="Create Group"
            onPress={handleCreateGroup}
            isLoading={isLoading}
            style={styles.createButton}
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
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  createButton: {
    marginTop: 16,
  },
  cancelButton: {
    marginTop: 12,
  },
});

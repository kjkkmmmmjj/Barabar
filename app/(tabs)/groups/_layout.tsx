import React from 'react';
import { Stack } from 'expo-router';
import { colors } from '@/constants/colors';

export default function GroupsLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.white,
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        },
        headerTitleStyle: {
          fontFamily: 'InterBold',
          fontSize: 18,
          color: colors.textPrimary,
        },
        headerBackTitleVisible: false,
      }}
    >
      <Stack.Screen 
        name="index"
        options={{
          title: 'Groups',
        }}
      />
      <Stack.Screen
        name="create"
        options={{
          title: 'Create Group',
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name="join"
        options={{
          title: 'Join Group',
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name="[id]/index"
        options={{
          title: 'Group Details',
        }}
      />
      <Stack.Screen
        name="[id]/add-expense"
        options={{
          title: 'Add Expense',
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name="[id]/settle-up"
        options={{
          title: 'Settle Up',
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name="[id]/members"
        options={{
          title: 'Group Members',
        }}
      />
    </Stack>
  );
}
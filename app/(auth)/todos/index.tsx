import { View, Text, Button } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { logoutUser } from '@/db/auth';

const TodoList = () => {
  const router = useRouter();
  const handleLogout = () => {
    logoutUser()
      .then(() => router.replace('/'))
      .catch((error) => console.error('Error logging out:', error));
  };

  return (
    <SafeAreaView>
      <View>
        {/* TODO: Add dynamic data */}
        <Text> Todo List:</Text>
        <Text> 1. Clean the house</Text>
        <Text> 2. Cook</Text>
        <Button title="Add Todo" onPress={() => router.push('/todos/addTask')} />
        <Button title="Logout" onPress={handleLogout} />
      </View>
    </SafeAreaView>
  );
};

export default TodoList;

import { View, Text } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

const TodoList = () => {
  return (
    <SafeAreaView>
      <View>
        <Text>List of todos</Text>
      </View>
    </SafeAreaView>
  );
};

export default TodoList;

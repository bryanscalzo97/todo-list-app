import { useRouter, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, TextInput, Button, Switch, StyleSheet, Alert, Text } from 'react-native';
import { getTodos, updateTodo } from '@/db/todos';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function EditTask() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [task, setTask] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [title, setTitle] = useState('');
  const [status, setStatus] = useState(false);

  useEffect(() => {
    const fetchTask = async () => {
      setIsLoading(true);
      const tasks = await getTodos();
      const selectedTask = tasks.find((t) => t.id === Number(id));
      if (selectedTask) {
        setTask(selectedTask);
        setTitle(selectedTask.title);
        setStatus(!!selectedTask.status);
      } else {
        Alert.alert('Error', 'Task not found');
        router.replace('/(auth)/todos');
      }
      setIsLoading(false);
    };

    fetchTask();
  }, [id, router]);

  const handleUpdate = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Title cannot be empty');
      return;
    }

    const success = await updateTodo(Number(id), status ? 1 : 0, title);
    if (success) {
      Alert.alert('Success', 'Task updated successfully!', [
        { text: 'OK', onPress: () => router.replace('/(auth)/todos') },
      ]);
    } else {
      Alert.alert('Error', 'Failed to update task. Please try again.');
    }
  };

  if (isLoading || !task) {
    return (
      <View style={styles.loaderContainer}>
        <Text>Loading task...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <TextInput style={styles.input} placeholder="Task Title" value={title} onChangeText={setTitle} />
        <View style={styles.switchContainer}>
          <Text>Completed:</Text>
          <Switch value={status} onValueChange={setStatus} />
        </View>
        <Button title="Update Task" onPress={handleUpdate} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    justifyContent: 'space-between',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

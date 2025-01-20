import { useRouter, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, TextInput, Switch, StyleSheet, Alert, Text, TouchableOpacity } from 'react-native';
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
        <Text style={styles.loaderText}>Loading task...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Edit Task</Text>
      <Text style={styles.subtitle}>Modify the details of your task</Text>

      <TextInput
        style={styles.input}
        placeholder="Task Title"
        placeholderTextColor="#999"
        value={title}
        onChangeText={setTitle}
      />

      <View style={styles.switchContainer}>
        <Text style={styles.switchLabel}>Completed:</Text>
        <Switch value={status} onValueChange={setStatus} />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleUpdate}>
        <Text style={styles.buttonText}>Update Task</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    height: 48,
    backgroundColor: '#f9f9f9',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    marginBottom: 16,
    color: '#333',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  switchLabel: {
    fontSize: 16,
    color: '#333',
  },
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderText: {
    fontSize: 16,
    color: '#666',
  },
});

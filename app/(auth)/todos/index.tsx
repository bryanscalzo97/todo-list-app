import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, Text, View, Button, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { deleteTodo, getTodos } from '@/db/todos';
import { logoutUser } from '@/db/auth';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TodoList() {
  const router = useRouter();
  const [todos, setTodos] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchTodos = async () => {
      setIsLoading(true);
      const tasks = await getTodos();
      setTodos(tasks);
      setIsLoading(false);
    };

    fetchTodos();
  }, []);

  const handleDelete = async (id: number) => {
    Alert.alert('Delete Task', 'Are you sure you want to delete this task?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          const success = await deleteTodo(id);
          if (success) {
            setTodos((prev) => prev.filter((task) => task.id !== id));
            Alert.alert('Success', 'Task deleted successfully');
          } else {
            Alert.alert('Error', 'Failed to delete task. Please try again.');
          }
        },
      },
    ]);
  };

  const handleLogout = async () => {
    Alert.alert('Logout', 'Are you sure you want to log out?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await logoutUser();
          router.replace('/'); // Redirige al login
        },
      },
    ]);
  };

  const renderTodoItem = ({ item }: { item: any }) => (
    <TouchableOpacity onPress={() => router.push(`/todos/editTask?id=${item.id}`)} style={styles.todoItem}>
      <View>
        <Text style={styles.todoTitle}>{item.title}</Text>
        <Text style={[styles.todoStatus, { color: item.status ? 'green' : 'red' }]}>
          {item.status ? 'Completed' : 'Pending'}
        </Text>
      </View>
      <Button title="Delete" onPress={() => handleDelete(item.id)} color="red" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 }}>
        <Text style={styles.header}>Todo List</Text>
        <Button title="Logout" onPress={handleLogout} color="red" />
      </View>

      <View style={{ flex: 1, padding: 16 }}>
        <Button title="Add Task" onPress={() => router.push('/todos/addTask')} />

        {isLoading ? (
          <Text style={{ marginTop: 16 }}>Loading tasks...</Text>
        ) : todos.length > 0 ? (
          <FlatList data={todos} keyExtractor={(item) => item.id.toString()} renderItem={renderTodoItem} />
        ) : (
          <Text style={{ marginTop: 16 }}>No tasks available</Text>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  todoItem: {
    padding: 16,
    marginVertical: 8,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    borderColor: '#ddd',
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  todoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  todoStatus: {
    fontSize: 14,
  },
});

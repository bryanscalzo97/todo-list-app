import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, Text, View, Alert, StyleSheet } from 'react-native';
import { deleteTodo, getTodos } from '@/db/todos';
import { logoutUser } from '@/db/auth';
import { SafeAreaView } from 'react-native-safe-area-context';
import BottomMenu from '@/components/BottomMenu';
import { Swipeable, TouchableOpacity } from 'react-native-gesture-handler';
import Animated, { Layout } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

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
          router.replace('/');
        },
      },
    ]);
  };

  const menuOptions = [
    {
      label: 'Logout',
      onPress: handleLogout,
    },
  ];

  const renderTodoItem = ({ item }: { item: any }) => (
    <Animated.View layout={Layout.springify().mass(0.8)}>
      <Swipeable
        renderRightActions={() => (
          <TouchableOpacity
            onPress={() => handleDelete(item.id)}
            style={{
              backgroundColor: 'red',
              justifyContent: 'center',
              alignItems: 'center',
              marginVertical: 8,
              marginBottom: 8,
              height: 70,
              padding: 16,
              gap: 4,
            }}
          >
            <Ionicons name="trash" size={22} color={'white'} />
            <Text style={{ color: 'white', fontWeight: '600' }}>Delete</Text>
          </TouchableOpacity>
        )}
      >
        <TouchableOpacity onPress={() => router.push(`/todos/editTask?id=${item.id}`)} style={styles.todoItem}>
          <View>
            <Text style={styles.todoTitle} numberOfLines={1}>
              {item.title}
            </Text>
            <Text style={[styles.todoStatus, { color: item.status ? 'green' : 'red' }]}>
              {item.status ? 'Completed' : 'Pending'}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
            <Ionicons name={'chevron-forward-sharp'} color={'black'} size={18} />
          </View>
        </TouchableOpacity>
      </Swipeable>
    </Animated.View>
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 }}>
        <Text style={styles.header}>My List</Text>
        <BottomMenu options={menuOptions} />
      </View>

      <View style={{ flex: 1, padding: 16 }}>
        {isLoading ? (
          <Text style={{ marginTop: 16 }}>Loading tasks...</Text>
        ) : todos.length > 0 ? (
          <FlatList data={todos} keyExtractor={(item) => item.id.toString()} renderItem={renderTodoItem} />
        ) : (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ marginTop: 16 }}>No tasks available</Text>
          </View>
        )}

        <TouchableOpacity style={styles.button} onPress={() => router.push('/todos/addTask')}>
          <Text style={styles.buttonText}>Add Task</Text>
        </TouchableOpacity>
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
    height: 70,
  },
  todoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  todoStatus: {
    fontSize: 14,
  },
  button: {
    backgroundColor: '#007BFF',
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 35,
    alignSelf: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

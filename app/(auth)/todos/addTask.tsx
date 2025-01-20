import { useForm, Controller } from 'react-hook-form';
import { useRouter } from 'expo-router';
import { View, TextInput, StyleSheet, Alert, Text, TouchableOpacity } from 'react-native';
import { addTodo } from '@/db/todos';

export default function AddTask() {
  const { control, handleSubmit, reset } = useForm<{ title: string }>();
  const router = useRouter();

  const onSubmit = async (data: { title: string }) => {
    const success = await addTodo(data.title);
    if (success) {
      Alert.alert('Success', 'Task added successfully!', [{ text: 'OK', onPress: () => router.push('/(auth)/todos') }]);
      reset();
    } else {
      Alert.alert('Error', 'Failed to add task. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add New Task</Text>
      <Text style={styles.subtitle}>Enter a title for your task</Text>

      <Controller
        name="title"
        control={control}
        defaultValue=""
        rules={{ required: 'Task title is required' }}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <>
            <TextInput
              style={[styles.input, error && styles.inputError]}
              placeholder="Task Title"
              placeholderTextColor="#999"
              onChangeText={onChange}
              value={value}
            />
            {error && <Text style={styles.errorText}>{error.message}</Text>}
          </>
        )}
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit(onSubmit)}>
        <Text style={styles.buttonText}>Add Task</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
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
  inputError: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    marginBottom: 16,
    fontSize: 14,
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
});

import { useForm, Controller } from 'react-hook-form';
import { useRouter } from 'expo-router';
import { View, TextInput, Button, StyleSheet, Alert, Text } from 'react-native';
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
              onChangeText={onChange}
              value={value}
            />
            {error && <Text style={styles.errorText}>{error.message}</Text>}
          </>
        )}
      />
      <Button title="Add Task" onPress={handleSubmit(onSubmit)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  inputError: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    marginBottom: 16,
  },
});

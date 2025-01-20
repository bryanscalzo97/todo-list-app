import { View, SafeAreaView, TextInput, Button, Alert, Text } from 'react-native';
import React from 'react';
import { useRouter } from 'expo-router';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { registerUser } from '@/db/auth';

const SignUp = () => {
  const router = useRouter();
  const { control, handleSubmit } = useForm<FormData>();

  type FormData = {
    email: string;
    password: string;
  };

  const onSubmit: SubmitHandler<FormData> = (data) => {
    registerUser(data.email, data.password).then((success: boolean) => {
      if (success) router.push('/todos');
      else Alert.alert('Error', 'Invalid email or password');
    });
  };

  return (
    <SafeAreaView>
      <View>
        <Text>SignUp</Text>
        <Controller
          name="email"
          control={control}
          render={({ field: { onChange, value } }) => (
            <TextInput placeholder="Email" onChangeText={onChange} value={value} />
          )}
        />
        <Controller
          name="password"
          control={control}
          render={({ field: { onChange, value } }) => (
            <TextInput placeholder="Password" secureTextEntry onChangeText={onChange} value={value} />
          )}
        />
        <Button title="Signup" onPress={handleSubmit(onSubmit)} />
        <Button title="Have an account? go to login" onPress={() => router.push('/')} />
      </View>
    </SafeAreaView>
  );
};

export default SignUp;

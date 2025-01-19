import { View, SafeAreaView, TextInput, Button } from 'react-native';
import React from 'react';
import { useRouter } from 'expo-router';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';

const Login = () => {
  const router = useRouter();
  const { control, handleSubmit } = useForm<FormData>();

  type FormData = {
    email: string;
    password: string;
  };

  const onSubmit: SubmitHandler<FormData> = (data) => {
    console.log(data);
    // Handle form submission
  };

  return (
    <SafeAreaView>
      <View>
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
        <Button title="Login" onPress={handleSubmit(onSubmit)} />
        <Button title="Go to Signup" onPress={() => router.push('/signup')} />
      </View>
    </SafeAreaView>
  );
};

export default Login;

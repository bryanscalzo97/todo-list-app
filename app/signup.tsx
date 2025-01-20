import React from 'react';
import { View, SafeAreaView, TextInput, Alert, Text, StyleSheet, TouchableOpacity } from 'react-native';
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
      if (success) {
        Alert.alert('Success', 'Account created successfully!', [{ text: 'OK', onPress: () => router.push('/') }]);
      } else {
        Alert.alert('Error', 'Failed to create account. Try again.');
      }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.title}>Create an Account</Text>
        <Text style={styles.subtitle}>Sign up to get started</Text>

        {/* Email Input */}
        <Controller
          name="email"
          control={control}
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#999"
              onChangeText={onChange}
              value={value}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          )}
        />

        {/* Password Input */}
        <Controller
          name="password"
          control={control}
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#999"
              onChangeText={onChange}
              value={value}
              secureTextEntry
            />
          )}
        />

        {/* Signup Button */}
        <TouchableOpacity style={styles.button} onPress={handleSubmit(onSubmit)}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>

        {/* Link to Login */}
        <TouchableOpacity onPress={() => router.push('/')}>
          <Text style={styles.loginLink}>
            Already have an account? <Text style={styles.loginText}>Log in</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  form: {
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
  },
  input: {
    width: '100%',
    height: 48,
    backgroundColor: '#fff',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    fontSize: 16,
    color: '#333',
  },
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginLink: {
    fontSize: 14,
    color: '#666',
  },
  loginText: {
    color: '#007BFF',
    fontWeight: 'bold',
  },
});

export default SignUp;

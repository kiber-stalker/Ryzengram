import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { supabase } from '../constants/supabase';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);

  const handleAuth = async () => {
    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) Alert.alert('Ошибка', error.message);
    } else {
      const { error } = await supabase.auth.signUp({ email, password });
      if (!error) {
        Alert.alert('Успех', 'Аккаунт создан!');
        const { data: { user } } = await supabase.auth.getUser();
        if (user) await supabase.from('profiles').insert({ id: user.id, username: email.split('@')[0] });
      } else Alert.alert('Ошибка', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ryzengram</Text>
      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" />
      <TextInput style={styles.input} placeholder="Пароль" value={password} onChangeText={setPassword} secureTextEntry />
      <TouchableOpacity style={styles.button} onPress={handleAuth}><Text style={styles.buttonText}>{isLogin ? 'Войти' : 'Регистрация'}</Text></TouchableOpacity>
      <TouchableOpacity onPress={() => setIsLogin(!isLogin)}><Text style={styles.switch}>{isLogin ? 'Нет аккаунта? Создать' : 'Уже есть аккаунт? Войти'}</Text></TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 32, fontWeight: 'bold', textAlign: 'center', marginBottom: 50 },
  input: { borderWidth: 1, borderRadius: 10, padding: 15, marginBottom: 15 },
  button: { backgroundColor: '#0084ff', padding: 15, borderRadius: 10, alignItems: 'center' },
  buttonText: { color: 'white', fontWeight: 'bold' },
  switch: { textAlign: 'center', marginTop: 20, color: '#0084ff' }
});
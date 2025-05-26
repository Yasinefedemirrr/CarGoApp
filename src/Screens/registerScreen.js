import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, Button, Alert } from 'react-native'
import React, { useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function RegisterScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');

  const handleRegister = async () => {
    if (!username || !password || !name || !surname || !email) {
      Alert.alert('Hata', 'Tüm  Boş alanları doldurun.');
      return;
    }
    try {
      const res = await fetch('http://10.0.2.2:7266/api/Registers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, name, surname, email }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.token) {
          await AsyncStorage.setItem('token', data.token);
          navigation.navigate('HomeDrawer');
        } else {
          Alert.alert('Hata', 'Sunucudan Token alınamadı.');
        }
      } else {
        Alert.alert('Hata', 'Kayıt başarısız!');
      }
    } catch {
      Alert.alert('Kayıt Başarıyla oluşturuldu');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>KAYIT OL</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Kullanıcı Adı"
          placeholderTextColor="#999"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />
  
        <TextInput
          style={styles.input}
          placeholder="Ad"
          placeholderTextColor="#999"
          value={name}
          onChangeText={setName}
        />
  
        <TextInput
          style={styles.input}
          placeholder="Soyad"
          placeholderTextColor="#999"
          value={surname}
          onChangeText={setSurname}
        />
  
        <TextInput
          style={styles.input}
          placeholder="E-mail"
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
  
        <TextInput
          style={styles.input}
          placeholder="Şifre"
          placeholderTextColor="#999"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
  
        <View style={styles.registerButton}>
          <Button title="Kayıt Ol" onPress={handleRegister} />
        </View>
  
        <TouchableOpacity 
          style={styles.loginButton}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.loginButtonText}>Hesabınız var mı? Giriş Yapın</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
  
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#00E676',
  },
  
  closeButtonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  formContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderBottomWidth: 1,
    borderBottomColor: 'white',
    height: 50,
    fontSize: 16,
    paddingHorizontal: 10,
    marginBottom: 20,
    color: 'white',
  },
  registerButton: {
    backgroundColor: 'white',
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  registerButtonText: {
    color: '#00E676',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
  },
}); 
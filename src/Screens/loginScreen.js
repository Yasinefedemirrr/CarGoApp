import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, Image, Button, Alert } from 'react-native';
import React, { useState } from 'react';

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    navigation.navigate('HomeDrawer');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.formContainer}>

        {/* "RENT A CAR" Başlığı */}
        <Text style={styles.headerTitle}>CarGO RENT A CAR</Text>

        {/* Üstte resimli container */}
        <View style={styles.headerContainer}>
          {/* Opsiyonel resim eklemek istersen */}
          {/* <Image source={require('../assets/car.png')} style={styles.headerImage} /> */}
        </View>

        <TextInput
          style={styles.input}
          placeholder="Kullanıcı Adı"
          placeholderTextColor="#999"
          value={username}
          onChangeText={setUsername}
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

        <View style={styles.loginButton}>
          <Button title="Giriş Yap" onPress={handleLogin} />
        </View>
        <View style={styles.bottomButtonsContainer}>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.registerText}>Üye Ol</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
            <Text style={styles.forgotText}>Şifremi Unuttum</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#00E676',
  },
  formContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 10,
  },
  headerContainer: {
    height: 200,
    marginBottom: 20,
    borderRadius: 10,
    overflow: 'hidden',
  },
  headerImage: {
    width: '100%',
    height: '100%',
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
  loginButton: {
    backgroundColor: 'white',
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  loginButtonText: {
    color: '#00E676',
    fontSize: 18,
    fontWeight: 'bold',
  },
  bottomButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingHorizontal: 10,
  },
  registerText: {
    color: 'white',
    fontSize: 16,
  },
  forgotText: {
    color: 'white',
    fontSize: 16,
  },
});

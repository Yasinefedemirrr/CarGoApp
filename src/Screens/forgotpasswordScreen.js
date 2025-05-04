import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView } from 'react-native'
import React, { useState } from 'react' 

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState('');

  const handleSend = () => {
    alert('E-posta gönderildi: ' + email);
  };

  return (
    <SafeAreaView style={styles.container}>
      
      <View style={styles.content}>
        <Text style={styles.title}>Şifremi Unuttum</Text>

        <TextInput
          style={styles.input}
          placeholder="E-mail adresinizi girin"
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Text style={styles.sendButtonText}>Gönder</Text>
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
  
  closeText: {
    fontSize: 24,
    color: 'white',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 30,
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
  sendButton: {
    backgroundColor: 'white',
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  sendButtonText: {
    color: '#00E676',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

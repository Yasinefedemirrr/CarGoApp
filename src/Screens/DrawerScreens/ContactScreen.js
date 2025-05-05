import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ScrollView, Dimensions, Image } from 'react-native';
import { WebView } from 'react-native-webview';

export default function ContactScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name || !email || !subject || !message) {
      Alert.alert('Uyarı', 'Lütfen tüm alanları doldurun.');
      return;
    }
    setLoading(true);
    const now = new Date();
    const sendDate = now.toISOString();
    try {
      const response = await fetch('http://10.0.2.2:7266/api/Contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, subject, message, sendDate }),
      });
      if (response.ok) {
        setName(''); setEmail(''); setSubject(''); setMessage('');
        Alert.alert('Başarılı', 'Mesajınız başarıyla gönderildi!');
      } else {
        Alert.alert('Hata', 'Mesaj gönderilemedi.');
      }
    } catch (error) {
      Alert.alert('Hata', 'Bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  // HTML formatında Google Maps iframe kodu
  const iframeHtml = `
    <html>
      <body>
        <iframe 
          src="https://www.google.com/maps/embed?pb=!4v1746340744574!6m8!1m7!1sNZnx_Nn-L6wfmUVPW5vv6Q!2m2!1d41.0004585050075!2d28.83353586583677!3f10.875338562499971!4f-16.3855503508954!5f0.7820865974627469" 
          width="100%" 
          height="100%" 
          style="border:0;" 
          allowfullscreen="" 
          loading="lazy" 
          referrerpolicy="no-referrer-when-downgrade">
        </iframe>
      </body>
    </html>`;

  const windowHeight = Dimensions.get('window').height;

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        
        {/* Resmi üst tarafa ekledik */}
        <Image 
          source={require('../../Assets/image.png')}  // Dosya yolunu buraya ekleyin
          style={styles.headerImage}
        />
        
        <View style={styles.formColumn}>
          <TextInput
            style={styles.input}
            placeholder="Adınız Soyadınız"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />
          <TextInput
            style={styles.input}
            placeholder="E-posta"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Konu"
            value={subject}
            onChangeText={setSubject}
          />
          <TextInput
            style={[styles.input, styles.textarea]}
            placeholder="Mesajınız"
            value={message}
            onChangeText={setMessage}
            multiline
            numberOfLines={5}
          />
          <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
            <Text style={styles.buttonText}>{loading ? 'Gönderiliyor...' : 'Mesajı Gönder'}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.mapContainer}>
          <Text style={styles.mapLabel}>Adresimiz:</Text>
          <WebView
            originWhitelist={['*']}
            source={{ html: iframeHtml }}
            style={styles.map}
            javaScriptEnabled={true}
            domStorageEnabled={true}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fafbfc',
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formColumn: {
    width: '100%',
    maxWidth: 500,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 18,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
    marginBottom: 24,
  },
  input: {
    borderWidth: 1,
    borderColor: '#eaeaea',
    borderRadius: 6,
    padding: 12,
    fontSize: 15,
    marginBottom: 14,
    backgroundColor: '#fafbfc',
  },
  textarea: {
    height: 100,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#2196f3',
    paddingVertical: 14,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  mapContainer: {
    width: '100%',
    maxWidth: 500,
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 30,
    height: 220,
  },
  mapLabel: {
    fontSize: 15,
    color: '#222',
    fontWeight: 'bold',
    marginBottom: 8,
    marginLeft: 2,
  },
  map: {
    width: '100%',
    height: 220,
    borderRadius: 10,
    overflow: 'hidden',
  },
  // Yeni stil: Resmin boyutunu ayarlayın
  headerImage: {
    width: '100%',
    height: 200,  // İhtiyaca göre boyutlandırılabilir
    resizeMode: 'cover',
    marginBottom: 20,  // Resim ile içerik arasındaki mesafeyi ayarlayın
  },
});

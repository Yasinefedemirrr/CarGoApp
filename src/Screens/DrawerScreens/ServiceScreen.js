import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, ActivityIndicator, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Ionicons kullanabilmek için: npm install react-native-vector-icons

export default function ServiceScreen() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://10.0.2.2:7266/api/Services')
      .then((response) => response.json())
      .then((data) => {
        setServices(data);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
      });
  }, []);

  const renderIcon = (item) => {
    // Eğer apiden ikon url gelirse onu kullan, yoksa Ionicons göster
    if (item.İconUrl && item.İconUrl !== 'string') {
      return <Image source={{ uri: item.İconUrl }} style={styles.iconImage} />;
    }
    // Farklı başlıklara göre ikon seçilebilir
    let iconName = 'car-sport-outline';
    if (item.title.toLowerCase().includes('transfer')) iconName = 'swap-horizontal-outline';
    if (item.title.toLowerCase().includes('havaalanı')) iconName = 'airplane-outline';
    return <Ionicons name={iconName} size={38} color="#2196f3" style={styles.icon} />;
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.iconCircle}>{renderIcon(item)}</View>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.desc}>{item.description}</Text>
    </View>
  );

  if (loading) {
    return <ActivityIndicator size="large" color="#2196f3" style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.servicesLabel}>HİZMETLERİMİZ</Text>
      <Text style={styles.servicesTitle}>En Son Hizmetlerimiz</Text>
      <FlatList
        data={services}
        renderItem={renderItem}
        keyExtractor={item => item.serviceId.toString()}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafbfc',
    paddingTop: 24,
    alignItems: 'center',
  },
  servicesLabel: {
    color: '#2196f3',
    fontSize: 13,
    letterSpacing: 1,
    marginBottom: 4,
    fontWeight: 'bold',
  },
  servicesTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 18,
  },
  listContent: {
    paddingHorizontal: 12,
    paddingBottom: 30,
    width: '100%',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    alignItems: 'center',
    padding: 22,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    width: '100%',
  },
  iconCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#2196f3',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  icon: {
    color: '#fff',
  },
  iconImage: {
    width: 38,
    height: 38,
    resizeMode: 'contain',
    tintColor: '#fff',
  },
  title: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 8,
    textAlign: 'center',
  },
  desc: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
  },
});
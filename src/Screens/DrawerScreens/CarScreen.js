import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, FlatList, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';

const numColumns = 2;
const cardWidth = (Dimensions.get('window').width - 36) / 2;

export default function CarScreen() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://10.0.2.2:7266/api/Cars')  // API URL'nizi buraya yazın
      .then((response) => response.json())
      .then((data) => {
        // API'den gelen veriyi doğru şekilde set ediyoruz
        setCars(data);
        setLoading(false);  // Veriler yüklendikten sonra loading false yapılır
      })
      .catch((error) => {
        console.error('Veri çekme hatası:', error);
        setLoading(false);  // Hata durumunda da loading false yapılır
      });
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.carCard}>
      {/* API'den gelen coverImageUrl ile resim gösterme */}
      <Image source={{ uri: `http://10.0.2.2:7266${item.coverImageUrl}` }} style={styles.carImage} />
      <Text style={styles.carName}>{item.model}</Text>
      <Text style={styles.carBrand}>{item.brandName}</Text>
      <Text style={styles.carPrice}>₺{item.km} km</Text>
      <View style={styles.cardButtons}>
        <TouchableOpacity style={styles.bookButton}><Text style={styles.bookButtonText}>Hemen Kirala</Text></TouchableOpacity>
        <TouchableOpacity style={styles.detailButton}><Text style={styles.detailButtonText}>Detaylar</Text></TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Araç Seçimini Yap</Text>
      <FlatList
        data={cars}
        renderItem={renderItem}
        keyExtractor={item => item.carID.toString()}
        numColumns={numColumns}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
    paddingTop: 18,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#222',
    marginLeft: 16,
    marginBottom: 12,
  },
  listContent: {
    paddingHorizontal: 8,
    paddingBottom: 20,
  },
  carCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 10,
    width: cardWidth,
    alignItems: 'center',
    marginBottom: 14,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 2,
  },
  carImage: {
    width: '100%',
    height: 100,
    borderRadius: 10,
    marginBottom: 8,
  },
  carName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 2,
    textAlign: 'center',
  },
  carBrand: {
    fontSize: 13,
    color: '#888',
    marginBottom: 2,
  },
  carPrice: {
    fontSize: 15,
    color: '#00E676',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  cardButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  bookButton: {
    flex: 1,
    backgroundColor: '#00E676',
    paddingVertical: 7,
    borderRadius: 8,
    marginRight: 4,
  },
  bookButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 13,
  },
  detailButton: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#00E676',
    paddingVertical: 7,
    borderRadius: 8,
    marginLeft: 4,
  },
  detailButtonText: {
    color: '#00E676',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 13,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

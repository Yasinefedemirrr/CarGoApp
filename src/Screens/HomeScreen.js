import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export default function HomeScreen({ navigation }) {
  return (
    <ScrollView style={styles.container}>
      {/* Drawer Menü ve Başlık */}
      <View style={styles.drawerHeader}>
        <TouchableOpacity onPress={() => navigation.openDrawer()} style={styles.menuButton}>
          <Icon name="menu" size={30} color="#00E676" />
        </TouchableOpacity>
        <Text style={styles.headerLogo}>CarGo</Text>
      </View>
      {/* Üst görsel ve başlık */}
      <View style={styles.topSection}>
        <Image source={require('../Assets/Image/girisEkran.jpg')} style={styles.headerImage} resizeMode="cover" />
        <View style={styles.overlay} />
        <View style={styles.headerContent}>
          <Text style={styles.title}>Hızlı ve Kolay Araç Kiralama</Text>
          <Text style={styles.subtitle}>İhtiyacınıza en uygun aracı kolayca bulun, hemen kiralayın!</Text>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Cars')}>
            <Text style={styles.buttonText}>Araç Kirala</Text>
          </TouchableOpacity>
        </View>
      </View>
      {/* Hakkımızda Bölümü */}
      <View style={styles.aboutSection}>
        <Text style={styles.aboutTitle}>Hakkımızda</Text>
        <Text style={styles.aboutText}>
          CarGo olarak, araç kiralama deneyiminizi en hızlı ve güvenli şekilde yaşamanız için buradayız. Geniş araç filomuz ve uygun fiyatlarımız ile dilediğiniz aracı kolayca bulabilir, anında kiralayabilirsiniz. Müşteri memnuniyeti ve güvenli sürüş önceliğimizdir.
        </Text>
        <TouchableOpacity style={styles.aboutButton} onPress={() => navigation.navigate('About')}>
          <Text style={styles.aboutButtonText}>Daha Fazla Bilgi</Text>
        </TouchableOpacity>
      </View>

      {/* Popüler Araçlar Bölümü */}
      <View style={styles.popularSection}>
        <Text style={styles.popularTitle}>Popüler Araçlar</Text>
        <View style={styles.carsRow}>
          <View style={styles.carCard}>
            <Image source={{ uri: 'https://images.pexels.com/photos/170782/pexels-photo-170782.jpeg?auto=compress&w=400' }} style={styles.carImage} />
            <Text style={styles.carName}>Mercedes Grand Sedan</Text>
            <Text style={styles.carBrand}>Mercedes</Text>
            <Text style={styles.carPrice}>₺2.500/gün</Text>
            <View style={styles.cardButtons}>
              <TouchableOpacity style={styles.bookButton}><Text style={styles.bookButtonText}>Hemen Kirala</Text></TouchableOpacity>
              <TouchableOpacity style={styles.detailButton}><Text style={styles.detailButtonText}>Detaylar</Text></TouchableOpacity>
            </View>
          </View>
          <View style={styles.carCard}>
            <Image source={{ uri: 'https://images.pexels.com/photos/358070/pexels-photo-358070.jpeg?auto=compress&w=400' }} style={styles.carImage} />
            <Text style={styles.carName}>Range Rover Evoque</Text>
            <Text style={styles.carBrand}>Land Rover</Text>
            <Text style={styles.carPrice}>₺3.000/gün</Text>
            <View style={styles.cardButtons}>
              <TouchableOpacity style={styles.bookButton}><Text style={styles.bookButtonText}>Hemen Kirala</Text></TouchableOpacity>
              <TouchableOpacity style={styles.detailButton}><Text style={styles.detailButtonText}>Detaylar</Text></TouchableOpacity>
            </View>
          </View>
          <View style={styles.carCard}>
            <Image source={{ uri: 'https://images.pexels.com/photos/1149137/pexels-photo-1149137.jpeg?auto=compress&w=400' }} style={styles.carImage} />
            <Text style={styles.carName}>McLaren 720S</Text>
            <Text style={styles.carBrand}>McLaren</Text>
            <Text style={styles.carPrice}>₺8.000/gün</Text>
            <View style={styles.cardButtons}>
              <TouchableOpacity style={styles.bookButton}><Text style={styles.bookButtonText}>Hemen Kirala</Text></TouchableOpacity>
              <TouchableOpacity style={styles.detailButton}><Text style={styles.detailButtonText}>Detaylar</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  drawerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 40,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    zIndex: 2,
  },
  menuButton: {
    padding: 4,
    marginRight: 10,
  },
  headerLogo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#00E676',
    letterSpacing: 2,
  },
  topSection: {
    position: 'relative',
    height: 320,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerImage: {
    width: '100%',
    height: 320,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: 320,
    backgroundColor: 'rgba(0,0,0,0.35)',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 18,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#00E676',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 25,
    marginTop: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  aboutSection: {
    backgroundColor: '#f6f6f6',
    margin: 20,
    borderRadius: 18,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  aboutTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#00E676',
    marginBottom: 10,
  },
  aboutText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 18,
    textAlign: 'left',
  },
  aboutButton: {
    backgroundColor: '#00E676',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  aboutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  popularSection: {
    marginHorizontal: 10,
    marginBottom: 30,
  },
  popularTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 16,
    marginLeft: 10,
  },
  carsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  carCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 10,
    width: '31%',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 2,
  },
  carImage: {
    width: '100%',
    height: 80,
    borderRadius: 10,
    marginBottom: 8,
  },
  carName: {
    fontSize: 15,
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
    fontSize: 14,
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
    paddingVertical: 6,
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
    paddingVertical: 6,
    borderRadius: 8,
    marginLeft: 4,
  },
  detailButtonText: {
    color: '#00E676',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 13,
  },
});

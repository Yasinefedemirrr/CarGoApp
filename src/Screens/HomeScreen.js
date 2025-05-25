import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView, Modal, TextInput, Alert, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Picker } from '@react-native-picker/picker';

export default function HomeScreen({ navigation }) {
  const [popularCars, setPopularCars] = useState([]);
  const [loadingPopular, setLoadingPopular] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);
  const [features, setFeatures] = useState([]);
  const [featuresLoading, setFeaturesLoading] = useState(false);
  const [reserveModalVisible, setReserveModalVisible] = useState(false);
  const [locations, setLocations] = useState([]);
  const [reservationLoading, setReservationLoading] = useState(false);
  const [reservationForm, setReservationForm] = useState({
    Name: '', Surname: '', Email: '', Phone: '',
    PickUpLocationID: '', DropOffLocationID: '',
    Age: '', DriverLicenseYear: '', Description: '',
  });

  useEffect(() => {
    fetch('http://10.0.2.2:7266/api/Cars/GetLast5CarWithBrandQueryHandler')
      .then((response) => response.json())
      .then((data) => {
        setPopularCars(data);
        setLoadingPopular(false);
      })
      .catch(() => setLoadingPopular(false));
  }, []);

  useEffect(() => {
    fetch('http://10.0.2.2:7266/api/Locations')
      .then((response) => response.json())
      .then((data) => setLocations(data))
      .catch(() => setLocations([]));
  }, []);

  const openDetailModal = (car) => {
    setSelectedCar(car);
    setModalVisible(true);
    setFeatures([]);
    setFeaturesLoading(true);
    fetch(`http://10.0.2.2:7266/api/CarFeatures?id=${car.carID}`)
      .then((response) => response.json())
      .then((data) => {
        setFeatures(data);
        setFeaturesLoading(false);
      })
      .catch(() => {
        setFeatures([]);
        setFeaturesLoading(false);
      });
  };
  const closeDetailModal = () => {
    setModalVisible(false);
    setSelectedCar(null);
    setFeatures([]);
  };
  const openReserveModal = (car) => {
    setSelectedCar(car);
    setReserveModalVisible(true);
    setReservationForm({
      Name: '', Surname: '', Email: '', Phone: '',
      PickUpLocationID: '', DropOffLocationID: '',
      Age: '', DriverLicenseYear: '', Description: '',
    });
  };
  const closeReserveModal = () => {
    setReserveModalVisible(false);
    setSelectedCar(null);
  };
  const handleReservationChange = (key, value) => {
    setReservationForm((prev) => ({ ...prev, [key]: value }));
  };
  const submitReservation = async () => {
    if (!reservationForm.Name || !reservationForm.Surname || !reservationForm.Email || !reservationForm.Phone || !reservationForm.PickUpLocationID || !reservationForm.DropOffLocationID || !reservationForm.Age || !reservationForm.DriverLicenseYear) {
      Alert.alert('Hata', 'Lütfen tüm zorunlu alanları doldurun.');
      return;
    }
    setReservationLoading(true);
    try {
      const res = await fetch('http://10.0.2.2:7266/api/Reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...reservationForm,
          PickUpLocationID: Number(reservationForm.PickUpLocationID),
          DropOffLocationID: Number(reservationForm.DropOffLocationID),
          CarID: selectedCar.carID,
          Age: Number(reservationForm.Age),
          DriverLicenseYear: Number(reservationForm.DriverLicenseYear),
        }),
      });
      if (res.ok) {
        Alert.alert('Başarılı', 'Rezervasyonunuz alındı!');
        closeReserveModal();
      } else {
        Alert.alert('Hata', 'Rezervasyon kaydedilemedi.');
      }
    } catch {
      Alert.alert('Hata', 'Bir hata oluştu.');
    }
    setReservationLoading(false);
  };

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
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Car')}>
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
          {loadingPopular ? (
            <Text>Yükleniyor...</Text>
          ) : (
            popularCars.map((car) => (
              <View style={styles.carCard} key={car.carID}>
                <Image source={{ uri: car.coverImageUrl }} style={styles.carImage} />
                <Text style={styles.carName}>{car.model}</Text>
                <Text style={styles.carBrand}>{car.brandName}</Text>
                <Text style={styles.carPrice}>{car.km}/km</Text>
                <View style={styles.cardButtons}>
                  <TouchableOpacity style={styles.bookButton} onPress={() => openReserveModal(car)}><Text style={styles.bookButtonText}>Hemen Kirala</Text></TouchableOpacity>
                  <TouchableOpacity style={styles.detailButton} onPress={() => openDetailModal(car)}><Text style={styles.detailButtonText}>Detaylar</Text></TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </View>
      </View>
      {/* Detay Modalı */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={closeDetailModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView showsVerticalScrollIndicator={false}>
              {selectedCar && (
                <>
                  <Image source={{ uri: selectedCar.coverImageUrl }} style={styles.detailImage} />
                  <Text style={styles.detailTitle}>{selectedCar.model}</Text>
                  <View style={styles.detailInfoBox}>
                    <View style={styles.detailInfoRow}><Text style={styles.detailLabel}>Km:</Text><Text style={styles.detailValue}>{selectedCar.km}</Text></View>
                    <View style={styles.detailInfoRow}><Text style={styles.detailLabel}>Vites:</Text><Text style={styles.detailValue}>{selectedCar.transmission}</Text></View>
                    <View style={styles.detailInfoRow}><Text style={styles.detailLabel}>Koltuk:</Text><Text style={styles.detailValue}>{selectedCar.seat}</Text></View>
                    <View style={styles.detailInfoRow}><Text style={styles.detailLabel}>Bagaj:</Text><Text style={styles.detailValue}>{selectedCar.luggage}</Text></View>
                    <View style={styles.detailInfoRow}><Text style={styles.detailLabel}>Yakıt:</Text><Text style={styles.detailValue}>{selectedCar.fuel}</Text></View>
                  </View>
                  <Text style={styles.sectionTitle}>Araç Özellikleri</Text>
                  {featuresLoading ? (
                    <ActivityIndicator size="small" color="#00C853" style={{ marginVertical: 10 }} />
                  ) : (
                    <View style={styles.featuresList}>
                      {features && features.length > 0 ? features.map((f, idx) => (
                        <View key={idx} style={styles.featureItem}>
                          <Text style={styles.featureText}>• {f.featureName}</Text>
                        </View>
                      )) : <Text style={styles.noFeatureText}>Özellik bulunamadı.</Text>}
                    </View>
                  )}
                </>
              )}
              <TouchableOpacity style={styles.closeButton} onPress={closeDetailModal}>
                <Text style={styles.closeButtonText}>Kapat</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
      {/* Rezervasyon Modalı */}
      <Modal
        visible={reserveModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={closeReserveModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.reserveModalContent}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.reserveTitle}>Araç Rezervasyon Formu</Text>
              <TextInput style={styles.reserveInput} placeholder="Adınız" value={reservationForm.Name} onChangeText={t => handleReservationChange('Name', t)} />
              <TextInput style={styles.reserveInput} placeholder="Soyadınız" value={reservationForm.Surname} onChangeText={t => handleReservationChange('Surname', t)} />
              <TextInput style={styles.reserveInput} placeholder="Mail Adresiniz" value={reservationForm.Email} onChangeText={t => handleReservationChange('Email', t)} keyboardType="email-address" />
              <TextInput style={styles.reserveInput} placeholder="Telefon Numaranız" value={reservationForm.Phone} onChangeText={t => handleReservationChange('Phone', t)} keyboardType="phone-pad" />
              <View style={styles.reservePickerWrapper}>
                <Picker
                  selectedValue={reservationForm.PickUpLocationID}
                  onValueChange={v => handleReservationChange('PickUpLocationID', v)}
                  style={styles.reservePicker}
                >
                  <Picker.Item label="Alış Lokasyonu" value="" />
                  {locations.map(loc => <Picker.Item key={loc.locationID} label={loc.name} value={loc.locationID.toString()} />)}
                </Picker>
              </View>
              <View style={styles.reservePickerWrapper}>
                <Picker
                  selectedValue={reservationForm.DropOffLocationID}
                  onValueChange={v => handleReservationChange('DropOffLocationID', v)}
                  style={styles.reservePicker}
                >
                  <Picker.Item label="Bırakış Lokasyonu" value="" />
                  {locations.map(loc => <Picker.Item key={loc.locationID} label={loc.name} value={loc.locationID.toString()} />)}
                </Picker>
              </View>
              <TextInput style={styles.reserveInput} placeholder="Yaşınız" value={reservationForm.Age} onChangeText={t => handleReservationChange('Age', t)} keyboardType="numeric" />
              <TextInput style={styles.reserveInput} placeholder="Ehliyet Yılınız" value={reservationForm.DriverLicenseYear} onChangeText={t => handleReservationChange('DriverLicenseYear', t)} keyboardType="numeric" />
              <TextInput style={styles.reserveTextarea} placeholder="Varsa Eklemek İstedikleriniz" value={reservationForm.Description} onChangeText={t => handleReservationChange('Description', t)} multiline numberOfLines={3} />
              <TouchableOpacity style={styles.reserveButton} onPress={submitReservation} disabled={reservationLoading}>
                <Text style={styles.reserveButtonText}>{reservationLoading ? 'Gönderiliyor...' : 'Rezervasyonu Tamamla'}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.reserveCloseButton} onPress={closeReserveModal}>
                <Text style={styles.reserveCloseButtonText}>Kapat</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
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
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 28,
    borderRadius: 20,
    width: '90%',
    maxHeight: '90%',
  },
  detailImage: {
    width: '100%',
    height: 220,
    borderRadius: 14,
    marginBottom: 16,
  },
  detailTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#00E676',
    marginBottom: 16,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  detailInfoBox: {
    marginBottom: 18,
  },
  detailInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 7,
  },
  detailLabel: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#222',
    width: 110,
  },
  detailValue: {
    fontSize: 17,
    color: '#444',
    flex: 1,
    textAlign: 'right',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00E676',
    marginBottom: 10,
  },
  featuresList: {
    marginBottom: 10,
  },
  featureItem: {
    marginBottom: 5,
  },
  featureText: {
    fontSize: 14,
    color: '#333',
  },
  noFeatureText: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
  },
  closeButton: {
    backgroundColor: '#00E676',
    padding: 10,
    borderRadius: 5,
    alignSelf: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  reserveModalContent: {
    backgroundColor: '#fff',
    padding: 28,
    borderRadius: 22,
    width: '92%',
    maxHeight: '92%',
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  reserveTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00E676',
    marginBottom: 18,
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  reserveInput: {
    backgroundColor: '#f7f7f7',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  reserveTextarea: {
    backgroundColor: '#f7f7f7',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    minHeight: 70,
    textAlignVertical: 'top',
  },
  reservePickerWrapper: {
    backgroundColor: '#f7f7f7',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 14,
    overflow: 'hidden',
  },
  reservePicker: {
    width: '100%',
    color: '#222',
    fontSize: 16,
    height: 48,
  },
  reserveButton: {
    backgroundColor: '#00E676',
    borderRadius: 10,
    paddingVertical: 15,
    marginTop: 10,
    marginBottom: 10,
    width: '100%',
    alignSelf: 'center',
  },
  reserveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 18,
    letterSpacing: 0.2,
  },
  reserveCloseButton: {
    backgroundColor: '#00C853',
    borderRadius: 10,
    paddingVertical: 13,
    width: '100%',
    alignSelf: 'center',
  },
  reserveCloseButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 17,
    letterSpacing: 0.2,
  },
});

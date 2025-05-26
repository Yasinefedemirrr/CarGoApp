import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, FlatList, TouchableOpacity, Dimensions, ActivityIndicator, Modal, ScrollView, TextInput, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const numColumns = 2;
const cardWidth = (Dimensions.get('window').width - 32 - 12) / 2;

export default function CarScreen() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);
  const [features, setFeatures] = useState([]);
  const [featuresLoading, setFeaturesLoading] = useState(false);
  const [reserveModalVisible, setReserveModalVisible] = useState(false);
  const [locations, setLocations] = useState([]);
  const [reservationLoading, setReservationLoading] = useState(false);
  const [reservationForm, setReservationForm] = useState({
    Name: '',
    Surname: '',
    Email: '',
    Phone: '',
    PickUpLocationID: '',
    DropOffLocationID: '',
    Age: '',
    DriverLicenseYear: '',
    Description: '',
  });

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
      .catch((error) => {
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

  const renderItem = ({ item }) => (
    <View style={styles.carCard}>
      <Image source={{ uri: item.coverImageUrl }} style={styles.carImage} />
      <View style={styles.carInfoBox}>
        <Text style={styles.carName}>{item.brandName ? item.brandName : ''} {item.model}</Text>
        <Text style={styles.carKm}>{item.km} km</Text>
      </View>
      <View style={styles.cardButtonsRow}>
        <TouchableOpacity style={styles.bookButton} onPress={() => openReserveModal(item)}>
          <Text style={styles.bookButtonText}>Hemen Kirala</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.detailButton} onPress={() => openDetailModal(item)}>
          <Text style={styles.detailButtonText}>Detaylar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return <ActivityIndicator size="large" color="#00E676" style={styles.loader} />;
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 30 }}>
      <Text style={styles.title}>Araç Seçimini Yap</Text>
      <FlatList
        data={cars}
        renderItem={renderItem}
        keyExtractor={item => item.carID.toString()}
        numColumns={1}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
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
                  <View style={styles.detailRow}>
                    <View style={styles.detailItem}><Text style={styles.detailLabel}>Km</Text><Text style={styles.detailValue}>{selectedCar.km}</Text></View>
                    <View style={styles.detailItem}><Text style={styles.detailLabel}>Vites</Text><Text style={styles.detailValue}>{selectedCar.transmission}</Text></View>
                    <View style={styles.detailItem}><Text style={styles.detailLabel}>Koltuk</Text><Text style={styles.detailValue}>{selectedCar.seat}</Text></View>
                    <View style={styles.detailItem}><Text style={styles.detailLabel}>Bagaj</Text><Text style={styles.detailValue}>{selectedCar.luggage}</Text></View>
                    <View style={styles.detailItem}><Text style={styles.detailLabel}>Yakıt</Text><Text style={styles.detailValue}>{selectedCar.fuel}</Text></View>
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
      <Modal
        visible={reserveModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={closeReserveModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.reserveTitle}>Araç Rezervasyon Formu</Text>
              <TextInput style={styles.input} placeholder="Adınız" value={reservationForm.Name} onChangeText={t => handleReservationChange('Name', t)} />
              <TextInput style={styles.input} placeholder="Soyadınız" value={reservationForm.Surname} onChangeText={t => handleReservationChange('Surname', t)} />
              <TextInput style={styles.input} placeholder="Mail Adresiniz" value={reservationForm.Email} onChangeText={t => handleReservationChange('Email', t)} keyboardType="email-address" />
              <TextInput style={styles.input} placeholder="Telefon Numaranız" value={reservationForm.Phone} onChangeText={t => handleReservationChange('Phone', t)} keyboardType="phone-pad" />
              <View style={styles.pickerWrapper}>
                <Picker
                  selectedValue={reservationForm.PickUpLocationID}
                  onValueChange={v => handleReservationChange('PickUpLocationID', v)}
                  style={styles.picker}
                >
                  <Picker.Item label="Alış Lokasyonu" value="" />
                  {locations.map(loc => <Picker.Item key={loc.locationID} label={loc.name} value={loc.locationID.toString()} />)}
                </Picker>
              </View>
              <View style={styles.pickerWrapper}>
                <Picker
                  selectedValue={reservationForm.DropOffLocationID}
                  onValueChange={v => handleReservationChange('DropOffLocationID', v)}
                  style={styles.picker}
                >
                  <Picker.Item label="Bırakış Lokasyonu" value="" />
                  {locations.map(loc => <Picker.Item key={loc.locationID} label={loc.name} value={loc.locationID.toString()} />)}
                </Picker>
              </View>
              <TextInput style={styles.input} placeholder="Yaşınız" value={reservationForm.Age} onChangeText={t => handleReservationChange('Age', t)} keyboardType="numeric" />
              <TextInput style={styles.input} placeholder="Ehliyet Yılınız" value={reservationForm.DriverLicenseYear} onChangeText={t => handleReservationChange('DriverLicenseYear', t)} keyboardType="numeric" />
              <TextInput style={styles.textarea} placeholder="Varsa Eklemek İstedikleriniz" value={reservationForm.Description} onChangeText={t => handleReservationChange('Description', t)} multiline numberOfLines={3} />
              <TouchableOpacity style={styles.reserveButton} onPress={submitReservation} disabled={reservationLoading}>
                <Text style={styles.reserveButtonText}>{reservationLoading ? 'Gönderiliyor...' : 'Rezervasyonu Tamamla'}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.closeButton} onPress={closeReserveModal}>
                <Text style={styles.closeButtonText}>Kapat</Text>
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
    backgroundColor: '#f4f6fa',
    paddingTop: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#444',
    marginLeft: 18,
    marginBottom: 10,
    marginTop: 8,
    letterSpacing: 0.2,
  },
  listContent: {
    paddingHorizontal: 10,
    paddingBottom: 24,
    paddingTop: 2,
  },
  carCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 18,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOpacity: 0.10,
    shadowRadius: 12,
    elevation: 4,
    flexDirection: 'column',
    alignItems: 'center',
  },
  carImage: {
    width: '100%',
    height: 120,
    borderRadius: 14,
    marginBottom: 14,
    resizeMode: 'cover',
    backgroundColor: '#f0f0f0',
  },
  carInfoBox: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },
  carName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
    textAlign: 'center',
    marginBottom: 2,
    letterSpacing: 0.1,
  },
  carKm: {
    fontSize: 15,
    color: '#00C853',
    fontWeight: 'bold',
    marginBottom: 6,
    textAlign: 'center',
  },
  cardButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 8,
  },
  bookButton: {
    flex: 1,
    backgroundColor: '#00C853',
    paddingVertical: 10,
    borderRadius: 10,
    marginRight: 8,
    alignItems: 'center',
    shadowColor: '#00C853',
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 1,
  },
  bookButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 15,
  },
  detailButton: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 1.2,
    borderColor: '#00C853',
    paddingVertical: 10,
    borderRadius: 10,
    marginLeft: 8,
    alignItems: 'center',
  },
  detailButtonText: {
    color: '#00C853',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 15,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '92%',
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 18,
    maxHeight: '90%',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  detailImage: {
    width: '100%',
    height: 170,
    borderRadius: 12,
    marginBottom: 12,
    resizeMode: 'contain',
    backgroundColor: '#f0f0f0',
  },
  detailTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#222',
    textAlign: 'center',
    marginBottom: 10,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    marginTop: 2,
  },
  detailItem: {
    alignItems: 'center',
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: '#888',
  },
  detailValue: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#00C853',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 8,
    marginTop: 8,
  },
  featuresList: {
    flexDirection: 'column',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  featureItem: {
    marginBottom: 4,
  },
  featureText: {
    fontSize: 14,
    color: '#444',
  },
  noFeatureText: {
    fontSize: 14,
    color: '#888',
    fontStyle: 'italic',
    marginBottom: 8,
  },
  closeButton: {
    backgroundColor: '#00C853',
    borderRadius: 10,
    paddingVertical: 10,
    marginTop: 10,
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
  reserveTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 14,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#f7f7f7',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  textarea: {
    backgroundColor: '#f7f7f7',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    minHeight: 60,
    textAlignVertical: 'top',
  },
  pickerWrapper: {
    backgroundColor: '#f7f7f7',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 10,
    overflow: 'hidden',
  },
  picker: {
    width: '100%',
    color: '#222',
  },
  reserveButton: {
    backgroundColor: '#1976D2',
    borderRadius: 8,
    paddingVertical: 13,
    marginTop: 8,
    marginBottom: 6,
  },
  reserveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
});

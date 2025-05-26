import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, ActivityIndicator, TextInput, Modal, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';

export default function PricingScreen() {
  const [pricingList, setPricingList] = useState([]);
  const [cars, setCars] = useState([]); // Arabalar tablosu
  const [brands, setBrands] = useState([]); // Brands tablosu
  const [brandNameToId, setBrandNameToId] = useState({});
  const [loading, setLoading] = useState(true);
  const [reserveModalVisible, setReserveModalVisible] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);
  const [locations, setLocations] = useState([]);
  const [reservationLoading, setReservationLoading] = useState(false);
  const [reservationForm, setReservationForm] = useState({
    Name: '', Surname: '', Email: '', Phone: '',
    PickUpLocationID: '', DropOffLocationID: '',
    Age: '', DriverLicenseYear: '', Description: '',
  });
  const [selectedPeriod, setSelectedPeriod] = useState('');

  // Fiyat listesi
  useEffect(() => {
    fetch('http://10.0.2.2:7266/api/CarPricings/GetCarPricingWithTimePeriodList')
      .then(res => res.json())
      .then(data => setPricingList(data))
      .catch(() => setPricingList([]));
  }, []);

  // Arabalar tablosu (carID bulmak için)
  useEffect(() => {
    fetch('http://10.0.2.2:7266/api/Cars')
      .then(res => res.json())
      .then(data => setCars(data))
      .catch(() => setCars([]));
  }, []);

  // Brands tablosu (brandName -> brandID map)
  useEffect(() => {
    fetch('http://10.0.2.2:7266/api/Brands')
      .then(res => res.json())
      .then(data => {
        setBrands(data);
        const map = {};
        data.forEach(b => {
          map[b.name.trim().toLowerCase()] = b.brandID;
        });
        setBrandNameToId(map);
      })
      .catch(() => setBrands([]));
  }, []);

  // Lokasyonlar
  useEffect(() => {
    fetch('http://10.0.2.2:7266/api/Locations')
      .then(res => res.json())
      .then(data => setLocations(data))
      .catch(() => setLocations([]));
  }, []);

  const openReserveModal = (car, period) => {
    // Fiyat kartındaki marka adını brandID'ye çevir
    const brandID = brandNameToId[car.brand.trim().toLowerCase()];
    if (!brandID) {
      Alert.alert('Hata', 'Marka bulunamadı.');
      return;
    }
    // Arabalar tablosunda model ve brandID ile carID bul
    const carObj = cars.find(
      c => c.model && car.model &&
           c.model.trim().toLowerCase() === car.model.trim().toLowerCase() &&
           c.brandID === brandID
    );
    if (!carObj) {
      Alert.alert('Hata', 'Bu araç için carID bulunamadı.');
      return;
    }
    setSelectedCar({ ...car, carID: carObj.carID });
    setSelectedPeriod(period);
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
    if (!selectedCar || !selectedCar.carID) {
      Alert.alert('Hata', 'Araç bilgisi hatalı.');
      return;
    }
    setReservationLoading(true);
    try {
      const res = await fetch('http://10.0.2.2:7266/api/Reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: reservationForm.Name,
          surname: reservationForm.Surname,
          email: reservationForm.Email,
          phone: reservationForm.Phone,
          pickUpLocationID: Number(reservationForm.PickUpLocationID),
          dropOffLocationID: Number(reservationForm.DropOffLocationID),
          carID: selectedCar.carID,
          age: Number(reservationForm.Age),
          driverLicenseYear: Number(reservationForm.DriverLicenseYear),
          description: `[${selectedPeriod}] ${reservationForm.Description}`,
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
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 30 }}>
      <Text style={styles.pageTitle}>Araç Fiyat Paketleri</Text>
      {pricingList.length === 0 ? (
        <ActivityIndicator size="large" color="#00E676" style={{ marginTop: 40 }} />
      ) : (
        <View style={styles.cardList}>
          {pricingList.map((item, idx) => (
            <View style={styles.carCard} key={item.model + idx}>
              <Image source={{ uri: item.coverImageUrl }} style={styles.carImage} />
              <View style={styles.carInfoBox}>
                <Text style={styles.carName}>{item.brand} {item.model}</Text>
              </View>
              <View style={styles.priceRow}>
                <View style={styles.priceBox}>
                  <Text style={styles.priceLabel}>Günlük</Text>
                  <Text style={styles.priceValue}><Text style={styles.currency}>₺</Text>{item.dailyAmount}</Text>
                  <TouchableOpacity style={styles.priceBtn} onPress={() => openReserveModal(item, 'Günlük')}>
                    <Text style={styles.priceBtnText}>Kirala</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.priceBox}>
                  <Text style={styles.priceLabel}>Haftalık</Text>
                  <Text style={styles.priceValue}><Text style={styles.currency}>₺</Text>{item.weeklyAmount}</Text>
                  <TouchableOpacity style={styles.priceBtn} onPress={() => openReserveModal(item, 'Haftalık')}>
                    <Text style={styles.priceBtnText}>Kirala</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.priceBox}>
                  <Text style={styles.priceLabel}>Aylık</Text>
                  <Text style={styles.priceValue}><Text style={styles.currency}>₺</Text>{item.monthlyAmount}</Text>
                  <TouchableOpacity style={styles.priceBtn} onPress={() => openReserveModal(item, 'Aylık')}>
                    <Text style={styles.priceBtnText}>Kirala</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </View>
      )}
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
              {selectedPeriod ? (
                <Text style={{ fontSize: 16, color: '#1976D2', fontWeight: 'bold', textAlign: 'center', marginBottom: 10 }}>
                  Seçilen Paket: {selectedPeriod}
                </Text>
              ) : null}
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
    backgroundColor: '#f7f9fc',
    paddingTop: 18,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#222',
    marginLeft: 18,
    marginBottom: 18,
    marginTop: 8,
    letterSpacing: 0.2,
  },
  cardList: {
    paddingHorizontal: 10,
    paddingBottom: 20,
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
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 8,
  },
  priceBox: {
    flex: 1,
    backgroundColor: '#f7f9fc',
    borderRadius: 14,
    marginHorizontal: 4,
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 6,
    shadowColor: '#00E676',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  priceLabel: {
    fontSize: 13,
    color: '#888',
    marginBottom: 2,
    fontWeight: 'bold',
  },
  priceValue: {
    fontSize: 20,
    color: '#1976D2',
    fontWeight: 'bold',
    marginBottom: 6,
  },
  currency: {
    fontSize: 17,
    color: '#1976D2',
    fontWeight: 'bold',
  },
  priceBtn: {
    backgroundColor: '#00E676',
    borderRadius: 8,
    paddingVertical: 7,
    paddingHorizontal: 18,
    marginTop: 12,
    minWidth: 100,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#00E676',
    shadowOpacity: 0.10,
    shadowRadius: 4,
    elevation: 2,
  },
  priceBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 17,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  reserveModalContent: {
    backgroundColor: '#fff',
    padding: 28,
    borderRadius: 18,
    width: '90%',
    maxHeight: '90%',
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  reserveTitle: {
    fontSize: 22,
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
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, ActivityIndicator, TextInput, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Picker } from '@react-native-picker/picker';

export default function PricingScreen() {
  const [carPricings, setCarPricings] = useState([]);
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

  useEffect(() => {
    fetch('http://10.0.2.2:7266/api/CarPricings/GetCarPricingWithTimePeriodList')
      .then((response) => response.json())
      .then((data) => {
        setCarPricings(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetch('http://10.0.2.2:7266/api/Locations')
      .then((response) => response.json())
      .then((data) => setLocations(data))
      .catch(() => setLocations([]));
  }, []);

  const openReserveModal = (car) => {
    setSelectedCar(car);
    setReserveModalVisible(true);
    setReservationForm({
      Name: '', Surname: '', Email: '', Phone: '',
      PickUpLocationID: '', DropOffLocationID: '',
      Age: '', DriverLicenseYear: '', Description: '',
    });
    console.log('Seçilen araç:', car);
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
          name: reservationForm.Name,
          surname: reservationForm.Surname,
          email: reservationForm.Email,
          phone: reservationForm.Phone,
          pickUpLocationID: Number(reservationForm.PickUpLocationID),
          dropOffLocationID: Number(reservationForm.DropOffLocationID),
          carID: selectedCar && (selectedCar.carID || selectedCar.id || selectedCar.model),
          age: Number(reservationForm.Age),
          driverLicenseYear: Number(reservationForm.DriverLicenseYear),
          description: reservationForm.Description,
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

  const renderStars = (count = 4) => (
    <View style={{ flexDirection: 'row', marginLeft: 4 }}>
      {[...Array(5)].map((_, i) => (
        <Icon
          key={i}
          name={i < count ? 'star' : 'star-outline'}
          size={16}
          color={i < count ? '#00E676' : '#ccc'}
          style={{ marginRight: 1 }}
        />
      ))}
    </View>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 30 }}>
      <Text style={styles.pageTitle}>Araç Fiyat Paketleri</Text>
      <View style={styles.table}>
        <View style={styles.tableHeaderRow}>
          <View style={styles.carInfoHeaderCell} />
          <View style={styles.priceHeaderCell}><Text style={styles.headerTextBlue}>Günlük Kiralama Ücreti</Text></View>
          <View style={styles.priceHeaderCell}><Text style={styles.headerTextGray}>Haftalık Kiralama Ücreti</Text></View>
          <View style={styles.priceHeaderCell}><Text style={styles.headerTextBlack}>Aylık Kiralama Ücreti</Text></View>
        </View>
        {loading ? (
          <ActivityIndicator size="large" color="#00E676" style={{ marginTop: 40 }} />
        ) : (
          carPricings.map((item, idx) => (
            <View style={[styles.tableRow, idx % 2 === 1 && { backgroundColor: '#fafbfc' }]} key={item.model + idx}>
              <View style={styles.carInfoCell}>
                <Image source={{ uri: item.coverImageUrl }} style={styles.carImage} />
                <View style={{ marginLeft: 12, flex: 1, justifyContent: 'center' }}>
                  <Text style={styles.carName}>{item.brand} {item.model}</Text>
                </View>
              </View>
              <View style={styles.priceCell}>
                <TouchableOpacity style={styles.priceBtnSmall} onPress={() => openReserveModal(item)}><Text style={styles.priceBtnTextSmall}>Kirala</Text></TouchableOpacity>
                <View style={styles.priceValueBox}>
                  <Text style={styles.priceText}><Text style={styles.currency}>₺</Text>{item.dailyAmount}</Text>
                </View>
              </View>
              <View style={styles.priceCell}>
                <TouchableOpacity style={styles.priceBtnSmall}><Text style={styles.priceBtnTextSmall}>Kirala</Text></TouchableOpacity>
                <View style={styles.priceValueBox}>
                  <Text style={styles.priceText}><Text style={styles.currency}>₺</Text>{item.weeklyAmount}</Text>
                </View>
              </View>
              <View style={styles.priceCell}>
                <TouchableOpacity style={styles.priceBtnSmall}><Text style={styles.priceBtnTextSmall}>Kirala</Text></TouchableOpacity>
                <View style={styles.priceValueBox}>
                  <Text style={styles.priceText}><Text style={styles.currency}>₺</Text>{item.monthlyAmount}</Text>
                </View>
              </View>
            </View>
          ))
        )}
      </View>
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
    paddingTop: 18,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#222',
    marginLeft: 16,
    marginBottom: 18,
    marginTop: 8,
  },
  table: {
    borderRadius: 16,
    overflow: 'hidden',
    marginHorizontal: 8,
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
  tableHeaderRow: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1.5,
    borderBottomColor: '#e6e6e6',
    alignItems: 'center',
    minHeight: 48,
  },
  carInfoHeaderCell: {
    flex: 1.5,
  },
  priceHeaderCell: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  headerTextBlue: {
    color: '#fff',
    backgroundColor: '#00E676',
    fontWeight: 'bold',
    fontSize: 15,
    paddingVertical: 7,
    paddingHorizontal: 6,
    borderRadius: 8,
    overflow: 'hidden',
    textAlign: 'center',
  },
  headerTextGray: {
    color: '#fff',
    backgroundColor: '#FF9800',
    fontWeight: 'bold',
    fontSize: 15,
    paddingVertical: 7,
    paddingHorizontal: 6,
    borderRadius: 8,
    overflow: 'hidden',
    textAlign: 'center',
  },
  headerTextBlack: {
    color: '#fff',
    backgroundColor: '#304FFE',
    fontWeight: 'bold',
    fontSize: 15,
    paddingVertical: 7,
    paddingHorizontal: 6,
    borderRadius: 8,
    overflow: 'hidden',
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 110,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#fff',
  },
  carInfoCell: {
    flex: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    minHeight: 90,
  },
  carImage: {
    width: 64,
    height: 48,
    borderRadius: 10,
    backgroundColor: '#eee',
  },
  carName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 2,
    letterSpacing: 0.1,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  ratingLabel: {
    fontSize: 13,
    color: '#888',
    marginRight: 2,
  },
  priceCell: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 4,
  },
  priceBtnSmall: {
    backgroundColor: '#00E676',
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 14,
    marginBottom: 8,
    minWidth: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  priceBtnTextSmall: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13,
    textAlign: 'center',
  },
  priceValueBox: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  priceText: {
    fontSize: 20,
    color: '#2196f3',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 2,
  },
  currency: {
    fontSize: 17,
    color: '#2196f3',
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  reserveModalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    maxHeight: '80%',
  },
  reserveTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 10,
  },
  reserveInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
  },
  reservePickerWrapper: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
  },
  reservePicker: {
    width: '100%',
    height: 50,
  },
  reserveTextarea: {
    height: 100,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
  },
  reserveButton: {
    backgroundColor: '#00E676',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  reserveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  reserveCloseButton: {
    backgroundColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  reserveCloseButtonText: {
    color: '#222',
    fontWeight: 'bold',
    fontSize: 15,
  },
});
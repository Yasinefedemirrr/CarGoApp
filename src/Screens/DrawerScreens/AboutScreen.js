import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';

export default function AboutScreen({ navigation }) {
  const [aboutData, setAboutData] = useState(null);
  const [testimonialData, setTestimonialData] = useState([]); // testimonialData state ekledim
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://10.0.2.2:7266/api/Abouts')  // About verilerini API'den çekiyoruz
      .then((response) => response.json())
      .then((data) => {
        console.log('About verisi:', data);
        setAboutData(data[0]); // Alınan ilk veriyi set ediyoruz
      })
      .catch((error) => {
        console.error('Fetch hatası:', error);
      });

    // Testimonial verilerini çekme
    fetch('http://10.0.2.2:7266/api/Testimonials')
      .then((response) => response.json())
      .then((data) => {
        console.log('Testimonial verisi:', data);
        setTestimonialData(data); // Testimonial verilerini set ediyoruz
        setLoading(false); // Veriler yüklendiğinde loading durumunu false yapıyoruz
      })
      .catch((error) => {
        console.error('Testimonial fetch hatası:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (!aboutData) {
    return <Text>Veri alınamadı.</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      {/* Üst büyük görsel */}
      <Image source={require('../../Assets/image.png')} style={styles.topImage} resizeMode="cover" />

      {/* Hakkımızda kutusu */}
      <View style={styles.aboutBox}>
        <View style={styles.aboutContent}>
          <Text style={styles.aboutTitle}>{aboutData.title}</Text>
          <Text style={styles.aboutDesc}>{aboutData.description}</Text>
          <TouchableOpacity style={styles.aboutButton} onPress={() => navigation.navigate('Car')}>
            <Text style={styles.aboutButtonText}>Araçları İncele</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Müşteri Yorumları */}
      <Text style={styles.testimonialLabel}>MÜŞTERİ YORUMLARI</Text>
      <Text style={styles.testimonialTitle}>Mutlu Müşteriler</Text>
      <View style={styles.testimonialRow}>
        {testimonialData.map((testimonial) => (
          <View style={styles.testimonialCard} key={testimonial.testimonialID}>
            <Image source={{ uri: testimonial.ımageUrl }} style={styles.avatar} />
            <Text style={styles.testimonialText}>"{testimonial.comment}"</Text>
            <Text style={styles.testimonialName}>{testimonial.name}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  topImage: {
    width: '100%',
    height: 180,
  },
  aboutBox: {
    flexDirection: 'row',
    backgroundColor: '#00E676',
    borderRadius: 20,
    margin: 20,
    padding: 18,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  aboutContent: {
    flex: 1,
  },
  aboutTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  aboutDesc: {
    color: '#fff',
    fontSize: 15,
    marginBottom: 14,
  },
  aboutButton: {
    backgroundColor: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  aboutButtonText: {
    color: '#00E676',
    fontWeight: 'bold',
    fontSize: 15,
  },
  testimonialLabel: {
    color: '#00E676',
    fontSize: 13,
    marginLeft: 20,
    marginTop: 10,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  testimonialTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#222',
    marginLeft: 20,
    marginBottom: 12,
  },
  testimonialRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 10,
    marginBottom: 30,
  },
  testimonialCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    width: '31%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 2,
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    marginBottom: 10,
  },
  testimonialText: {
    fontSize: 14,
    color: '#444',
    marginBottom: 10,
    textAlign: 'center',
  },
  testimonialName: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#222',
    marginBottom: 2,
  },
});

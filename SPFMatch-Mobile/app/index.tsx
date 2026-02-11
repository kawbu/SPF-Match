import { StyleSheet, Text, View, Image} from 'react-native'
import React from 'react'
import Logo from '../assets/spfmatch-logo.png'

export default function Index() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>SPFMatch Mobile</Text>
      <Text style={styles.description}>Get personalized sunscreen recommendations based on your unique skin characteristics, Fitzpatrick skin type, and skin care needs. Our dermatologist-backed quiz analyzes your features to find the perfect SPF protection for you.</Text>
      <Image source={Logo} style={styles.logo}></Image>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  }
  ,
  description: {
    textAlign: 'center',
    paddingHorizontal: 24,
    maxWidth: 420,
    marginTop: 12,
  },
  logo: {
    width: 200,
    height: 200,
    marginTop: 24,
  }
})
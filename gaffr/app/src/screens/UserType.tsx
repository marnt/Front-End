import React, { Component } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { NavigationScreenProp } from 'react-navigation';

interface Props {
  navigation: NavigationScreenProp<any, any>;
}

export default class UserTypeScreen extends Component<Props> {
  static navigationOptions = {
    title: 'Select Account Type'
  };

  render() {
    return (
      <View style={styles.buttonContainer}>
        <Text style={{ ...styles.text, color: 'black' }}>I am a...</Text>
        <TouchableOpacity
          style={styles.tenantButton}
          onPress={() =>
            this.props.navigation.navigate('signUp', { userType: 'tenants' })
          }
        >
          <Text style={styles.text}>tenant</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.landlordButton}
          onPress={() =>
            this.props.navigation.navigate('signUp', { userType: 'landlords' })
          }
        >
          <Text style={styles.text}>landlord</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  buttonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    margin: 0,
    color: '#0B4F6C',
    backgroundColor: '#dcd1e8'
  },
  tenantButton: {
    backgroundColor: '#502F4C',
    margin: 10,
    width: '55%',
    padding: 20,
    borderRadius: 10
  },
  landlordButton: {
    backgroundColor: '#502F4C',
    margin: 10,
    width: '55%',
    padding: 20,
    borderRadius: 10
  },
  text: {
    fontWeight: '700',
    fontSize: 20,
    alignSelf: 'center',
    color: '#ffffff'
  }
});

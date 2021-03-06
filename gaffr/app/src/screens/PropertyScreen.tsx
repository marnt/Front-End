import React, { Component } from 'react';
import {
  View,
  Text,
  Button,
  TextInput,
  Alert,
  StyleSheet,
  StatusBar,
  Image,
  ScrollView,
  AsyncStorage,
  TouchableOpacity
} from 'react-native';
import { Permissions } from 'expo';
import { getUserById } from '../utils';
import { NavigationScreenProp } from 'react-navigation';
import { updateProperty } from '../utils';
import { User, Property, UserWithProperty } from '../utils/interfaces';
import ImageUploader from '../components/ImageUploader';
import { ButtonGroup } from 'react-native-elements';
import { FontAwesome } from '@expo/vector-icons';

interface Props {
  navigation: NavigationScreenProp<any, any>;
}

interface States {
  uploading?: boolean;
  user: User | undefined;
  bedrooms: number;
  city: string;
  images: string[];
  description: string;
  price: number;
  propertyType: string;
  petsAllowed: boolean;
  smokingAllowed: boolean;
}

export default class PropertyScreen extends Component<Props, States> {
  public state = {
    user: undefined,
    bedrooms: 1,
    city: 'the moon',
    images: [],
    price: 350,
    description: '',
    propertyType: 'House',
    petsAllowed: false,
    smokingAllowed: false
  };

  static navigationOptions = {
    // title: 'Spaghetti',
    tabBarLabel: () => <FontAwesome name="home" size={40} color={'white'} />,
    showIcon: true
  };
  async handleHouse(user: UserWithProperty): Promise<void> {
    const {
      bedrooms,
      city,
      images,
      price,
      propertyType,
      petsAllowed,
      smokingAllowed,
      description
    } = this.state;
    const array = Object.entries({
      city,
      images,
      price
    });
    array.forEach(
      property => !property[1] && Alert.alert(`Invalid ${property[0]}`)
    );
    const property: Property = {
      bedrooms,
      city,
      images,
      price,
      propertyType,
      petsAllowed,
      smokingAllowed,
      description
    };
    const uid = await AsyncStorage.getItem('uid');
    if (uid) {
      updateProperty(uid, property);
      this.setState({ user: { ...user, property } });
    }
  }
  async componentDidMount() {
    const uid = await AsyncStorage.getItem('uid');
    if (uid) {
      const user: User | undefined = await getUserById(uid, 'landlords');
      if (user && !user.property) {
        await Permissions.askAsync(Permissions.CAMERA_ROLL);
        await Permissions.askAsync(Permissions.CAMERA);
      }
      this.setState({ user });
    }
  }

  addImage = (image: string): void => {
    const { images } = this.state;
    this.setState({ images: [...images, image] });
  };

  updateSmoking = (selectedIndex: number) => {
    this.setState({ smokingAllowed: selectedIndex ? true : false });
  };
  updatePets = (selectedIndex: number) => {
    this.setState({ petsAllowed: selectedIndex ? true : false });
  };

  render() {
    const user = this.state.user;
    if (!user) return <Text>Loading...</Text>;
    const {
      images,
      bedrooms,
      city,
      smokingAllowed,
      petsAllowed,
      price,
      propertyType,
      description
    } = this.state;
    const propertyTypes = ['House', 'Apartment', 'Bungalow', 'Flat'];
    const userWithProperty: UserWithProperty = user;
    if (userWithProperty.property)
      return (
        // property profile
        <View style={styles.propertyContainer}>
          <ScrollView contentContainerStyle={styles.landlordProperty}>
            <Text style={{ fontWeight: 'bold' }}>Your Gaff </Text>
            <Text>City: {userWithProperty.property.city} </Text>
            <Text>
              Price: {`£${userWithProperty.property.price} per month`}{' '}
            </Text>
            <Text>Bedrooms: {userWithProperty.property.bedrooms} </Text>
            <Text>Description: {userWithProperty.property.description} </Text>
            <Text>Property type: {userWithProperty.property.propertyType}</Text>

            <Text style={{ fontStyle: 'italic' }}>
              {userWithProperty.property.petsAllowed
                ? 'Pets allowed'
                : 'Pets not allowed'}
            </Text>
            <Text style={{ fontStyle: 'italic' }}>
              {userWithProperty.property.smokingAllowed
                ? 'Smoking allowed'
                : 'Smoking not allowed'}
            </Text>
            <View style={styles.imageContainer}>
              {userWithProperty.property.images.map(img => (
                <Image
                  source={{ uri: img }}
                  key={img}
                  style={styles.propertyImages}
                />
              ))}
            </View>
          </ScrollView>
        </View>
      );
    else
      return (
        // property form
        <View style={styles.propertyFormContainer}>
          <ScrollView>
            <View style={styles.propertyForm}>
              <Text style={styles.inputLabel}>Price per Month (£): </Text>
              <TextInput
                placeholder="price..."
                style={styles.input}
                value={String(price)}
                onChangeText={(text: string) =>
                  this.setState({ price: parseInt(text) ? parseInt(text) : 0 })
                }
              />
              <Text style={styles.inputLabel}>Number of bedrooms: </Text>
              <TextInput
                placeholder="bedrooms..."
                style={styles.input}
                value={String(bedrooms)}
                onChangeText={(text: string) =>
                  this.setState({
                    bedrooms: parseInt(text) ? parseInt(text) : 0
                  })
                }
              />
              <TextInput
                placeholder="description..."
                style={styles.input}
                value={String(description)}
                onChangeText={(text: string) =>
                  this.setState({ description: text })
                }
              />
              <Text style={styles.inputLabel}>City: </Text>
              <TextInput
                placeholder="city"
                style={styles.input}
                value={city}
                onChangeText={(text: string) => this.setState({ city: text })}
              />
              <Text style={styles.inputLabel}>Property Type: </Text>
              <ButtonGroup
                onPress={(index: number) =>
                  this.setState({ propertyType: propertyTypes[index] })
                }
                buttons={propertyTypes}
                selectedIndex={propertyTypes.indexOf(propertyType)}
                containerBorderRadius={10}
                containerStyle={{
                  height: 50,
                  backgroundColor: 'transparent',
                  borderWidth: 0
                }}
                selectedButtonStyle={{ backgroundColor: '#502f4c' }}
                innerBorderStyle={{ width: 0 }}
                buttonStyle={{
                  borderRadius: 10,
                  margin: 5,
                  backgroundColor: '#f9f4f6'
                }}
                textStyle={{ color: '#d1d1d1' }}
              />
              <ButtonGroup
                onPress={this.updateSmoking}
                selectedIndex={smokingAllowed ? 1 : 0}
                buttons={['No Smoking', 'Smoking']}
                containerBorderRadius={10}
                containerStyle={{
                  height: 50,
                  backgroundColor: 'transparent',
                  borderWidth: 0
                }}
                selectedButtonStyle={{ backgroundColor: '#502f4c' }}
                innerBorderStyle={{ width: 0 }}
                buttonStyle={{
                  borderRadius: 10,
                  margin: 3,
                  backgroundColor: '#f9f4f5'
                }}
                textStyle={{ color: '#d1d1d1' }}
              />
              <ButtonGroup
                onPress={this.updatePets}
                selectedIndex={petsAllowed ? 1 : 0}
                buttons={['No Pets', 'Pets']}
                containerBorderRadius={10}
                containerStyle={{
                  height: 50,
                  backgroundColor: 'transparent',
                  borderWidth: 0
                }}
                selectedButtonStyle={{ backgroundColor: '#502f4c' }}
                innerBorderStyle={{ width: 0 }}
                buttonStyle={{
                  borderRadius: 10,
                  margin: 3,
                  backgroundColor: '#f9f4f5'
                }}
                textStyle={{ color: '#d1d1d1' }}
              />
              {images && images.length < 6 && (
                <ImageUploader addImage={this.addImage} />
              )}
              {images && (
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyItems: 'center',
                    flexWrap: 'wrap'
                  }}
                >
                  {images.map((img: string) => (
                    <Image
                      key={img}
                      source={{ uri: img }}
                      style={{
                        height: 100,
                        width: 100,
                        margin: 5,
                        borderWidth: 3,
                        borderRadius: 10,
                        borderColor: '#f9f4f5'
                      }}
                    />
                  ))}
                </View>
              )}
              <TouchableOpacity
                onPress={() => this.handleHouse(userWithProperty)}
                style={{
                  backgroundColor: '#502F4C',
                  margin: 5,
                  width: 200,
                  padding: 15,
                  borderRadius: 10
                }}
              >
                <Text
                  style={{
                    color: 'white',
                    fontWeight: 'bold',
                    alignSelf: 'center',
                    fontSize: 20
                  }}
                >
                  Submit me Gaff
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      );
  }
}
const styles = StyleSheet.create({
  propertyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    margin: 0,
    color: '#0B4F6C',
    backgroundColor: '#dcd1e8'
  },
  propertyFormContainer: {
    flex: 1,
    backgroundColor: '#dcd1e8'
  },
  propertyForm: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    padding: 5,
    margin: 0
  },
  input: {
    margin: 5,
    width: '90%',
    padding: 5,
    backgroundColor: '#f9f4f5',
    borderRadius: 10
  },
  landlordProperty: {
    alignItems: 'center',
    margin: 25,
    width: '90%',
    padding: 5,
    backgroundColor: '#f9f4f5',
    borderRadius: 10
  },

  imageContainer: {
    margin: 10,
    padding: 10
  },
  propertyImages: {
    height: 275,
    width: 275,
    borderRadius: 10,
    padding: 0,
    margin: 5
  },
  inputLabel: {
    alignSelf: 'center'
  }
});

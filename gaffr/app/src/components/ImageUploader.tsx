import React, { Component } from 'react';
import uuid from 'uuid';
import { ImagePicker } from 'expo';
import { Alert, View, Button, TouchableOpacity, Text } from 'react-native';
import * as firebase from 'firebase';

interface Props {
  addImage: Function;
}

class ImageUploader extends Component<Props> {
  state = {};

  _takePhoto = async () => {
    const pickerResult = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3]
    });
    this._handleImagePicked(pickerResult);
  };

  _pickImage = async () => {
    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3]
    });
    this._handleImagePicked(pickerResult);
  };

  _handleImagePicked = async (pickerResult: ImagePicker.ImageResult) => {
    try {
      this.setState({ uploading: true });
      if (!pickerResult.cancelled) {
        const uploadUrl = await this.uploadImageAsync(pickerResult.uri);
        this.setState({ image: uploadUrl });
      }
    } catch (e) {
      Alert.alert('Upload failed, sorry :(');
    } finally {
      this.setState({ uploading: false });
    }
  };

  uploadImageAsync = async (uri: string) => {
    const blob: any = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function() {
        resolve(xhr.response);
      };
      xhr.onerror = function(e) {
        reject(new TypeError('Network request failed'));
      };
      xhr.responseType = 'blob';
      xhr.open('GET', uri, true);
      xhr.send(null);
    });

    const ref = firebase
      .storage()
      .ref()
      .child(uuid.v4());
    const snapshot = await ref.put(blob);

    // We're done with the blob, close and release it
    blob.close();

    const url = await snapshot.ref.getDownloadURL();
    const { addImage } = this.props;
    addImage(url);
    return url;
  };

  render() {
    return (
      <View>
        <Text style={{ alignSelf: 'center', fontWeight: '900' }}>
          Upload pictures:{' '}
        </Text>
        <TouchableOpacity
          style={{
            backgroundColor: '#502F4C',
            margin: 5,
            width: 200,
            padding: 5,
            borderRadius: 10
          }}
          onPress={this._pickImage}
        >
          <Text style={{ alignSelf: 'center', color: '#ffffff' }}>
            Pick from gallery
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            backgroundColor: '#502F4C',
            margin: 5,
            width: 200,
            padding: 5,
            borderRadius: 10
          }}
          onPress={this._takePhoto}
        >
          <Text style={{ alignSelf: 'center', color: '#ffffff' }}>
            Take a photo
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}

export default ImageUploader;

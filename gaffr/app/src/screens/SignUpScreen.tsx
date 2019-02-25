import React, { Component } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  AsyncStorage
} from "react-native";
import { NavigationScreenProp } from "react-navigation";
import firebase from "firebase";
import { UserCredential } from "@firebase/auth-types";
import { FirebaseError } from "@firebase/util";
import { addUser } from "../utils";
interface States {
  email: String;
  password: String;
  confirmPassword: String;
  name: String;
  phoneNo: String;
}
interface Props {
  navigation: NavigationScreenProp<any, any>;
}

export default class SignUpScreen extends Component<Props, States> {
  state = {
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    phoneNo: ""
  };

  static navigationOptions = {
    title: "Sign Up"
  };

  render() {
    return (
      <View style={styles.signupContainer}>
        <Text>Please fill in your details to sign up.</Text>
        <View style={styles.signupForm}>
          <TextInput
            style={styles.input}
            placeholder="Email Address"
            value={this.state.email}
            onChangeText={(text: String) => this.setState({ email: text })}
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={this.state.password}
            onChangeText={(text: String) => this.setState({ password: text })}
            autoCapitalize="none"
            secureTextEntry
          />
          <TextInput
            style={styles.input}
            placeholder="Retype Password"
            value={this.state.confirmPassword}
            onChangeText={(text: String) =>
              this.setState({ confirmPassword: text })
            }
            autoCapitalize="none"
            secureTextEntry
          />
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            value={this.state.name}
            onChangeText={(text: String) => this.setState({ name: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            value={this.state.phoneNo}
            onChangeText={(text: String) => this.setState({ phoneNo: text })}
          />
          <Text>{this.props.navigation.getParam("userType", "ERROR")}</Text>
          <TouchableOpacity
            style={styles.submitButton}
            onPress={() => this.handleSignUpPress()}
          >
            <Text>SUBMIT</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  handleSignUpPress = () => {
    const { email, password, confirmPassword, name, phoneNo } = this.state;
    if (password !== confirmPassword) {
      Alert.alert("Passwords do not match");
    } else if (!name) {
      Alert.alert("Please enter your name");
    } else if (!phoneNo) {
      Alert.alert("Please enter your telephone number");
    } else {
      firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then(async (user: UserCredential) => {
          const uid: string | null = user.user ? user.user.uid : "ERRROR";
          const userType: string = this.props.navigation.getParam(
            "userType",
            "ERROR"
          );
          addUser(uid, { name, email, phone: phoneNo }, userType);
          await AsyncStorage.setItem("uid", uid);
          await AsyncStorage.setItem("userType", userType);
          this.props.navigation.navigate(
            userType === "tenants" ? "TenantApp" : "Properties",
            { uid }
          );
        })
        .catch((err: FirebaseError) => {
          if (err.code === "auth/weak-password") {
            Alert.alert("Password must be at least 6 characters");
          } else if (err.code === "auth/email-already-in-use") {
            Alert.alert("Email already in use");
          } else {
            Alert.alert("Invalid email/password");
          }
        });
    }
  };
}

const styles = StyleSheet.create({
  signupContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    margin: 0,
    color: "#0B4F6C",
    backgroundColor: "#dcd1e8"
  },
  signupForm: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    padding: 0,
    margin: 0
  },
  input: {
    margin: 5,
    width: "90%",
    padding: 5,
    backgroundColor: "#f9f4f5",
    borderRadius: 10
  },
  submitButton: {
    backgroundColor: "#502F4C",
    color: "#ffffff",
    margin: 5,
    width: "90%",
    padding: 5,
    borderRadius: 10
  }
});

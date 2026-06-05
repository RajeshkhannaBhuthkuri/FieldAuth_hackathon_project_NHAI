import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  Image,
  PermissionsAndroid,
  Platform,
} from 'react-native';

import {launchCamera} from 'react-native-image-picker';

import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {RootStackParamList} from '../navigation/AppNavigator';

import {
  initDatabase,
  saveEmployee,
} from '../services/database';

type Props = NativeStackScreenProps<
  RootStackParamList,
  'Register'
>;

export default function RegisterScreen(
  _props: Props,
) {
  const [employeeId, setEmployeeId] =
    useState('');

  const [employeeName, setEmployeeName] =
    useState('');

  const [department, setDepartment] =
    useState('');

  const [photoUri, setPhotoUri] =
    useState('');

  useEffect(() => {
    initDatabase().catch(error => {
      console.error(
        'Database initialization error:',
        error,
      );
    });
  }, []);
  
  const requestCameraPermission = async () => {
    if (Platform.OS !== 'android') {
      return true;
    }
  
    try {
      const granted =
        await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message:
              'FieldAuth needs camera access to capture employee photos.',
            buttonPositive: 'Allow',
            buttonNegative: 'Deny',
          },
        );
  
      return (
        granted ===
        PermissionsAndroid.RESULTS.GRANTED
      );
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  const capturePhoto = async () => {
    const hasPermission =
      await requestCameraPermission();
  
    if (!hasPermission) {
      Alert.alert(
        'Permission Denied',
        'Camera permission is required.',
      );
      return;
    }
  
    try {
      const result = await launchCamera({
        mediaType: 'photo',
        cameraType: 'front',
        saveToPhotos: true,
        quality: 0.8,
      });
  
      if (result.didCancel) {
        return;
      }
  
      if (result.errorCode) {
        Alert.alert(
          'Camera Error',
          result.errorMessage ||
            'Unknown camera error',
        );
        return;
      }
  
      if (
        result.assets &&
        result.assets.length > 0
      ) {
        const uri =
          result.assets[0].uri || '';
  
        setPhotoUri(uri);
  
        Alert.alert(
          'Success',
          'Photo Captured Successfully',
        );
      }
    } catch (error) {
      console.error(error);
  
      Alert.alert(
        'Camera Error',
        'Unable to open camera',
      );
    }
  };

  const handleSaveEmployee = async () => {
    try {
      if (
        !employeeId.trim() ||
        !employeeName.trim() ||
        !department.trim()
      ) {
        Alert.alert(
          'Validation Error',
          'Please fill all fields',
        );
        return;
      }

      if (!photoUri) {
        Alert.alert(
          'Validation Error',
          'Please capture employee photo',
        );
        return;
      }

      await saveEmployee(
        employeeId.trim(),
        employeeName.trim(),
        department.trim(),
        photoUri,
      );

      Alert.alert(
        'Success',
        'Employee Saved Successfully',
      );

      setEmployeeId('');
      setEmployeeName('');
      setDepartment('');
      setPhotoUri('');
    } catch (error) {
      console.error(error);

      Alert.alert(
        'Error',
        'Failed to save employee',
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={
          styles.scrollContent
        }>
        <View style={styles.content}>
          <Text style={styles.title}>
            Register Employee
          </Text>

          <Text style={styles.description}>
            Capture employee details and
            face data for offline
            authentication.
          </Text>

          <View style={styles.form}>
            <View style={styles.field}>
              <Text style={styles.label}>
                Employee ID
              </Text>

              <TextInput
                style={styles.input}
                value={employeeId}
                onChangeText={setEmployeeId}
                placeholder="Enter employee ID"
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>
                Employee Name
              </Text>

              <TextInput
                style={styles.input}
                value={employeeName}
                onChangeText={setEmployeeName}
                placeholder="Enter full name"
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>
                Department
              </Text>

              <TextInput
                style={styles.input}
                value={department}
                onChangeText={setDepartment}
                placeholder="Enter department"
              />
            </View>

            <TouchableOpacity
              style={styles.photoButton}
              onPress={capturePhoto}>
              <Text
                style={
                  styles.photoButtonText
                }>
                Capture Employee Photo
              </Text>
            </TouchableOpacity>

            {photoUri ? (
              <Image
                source={{uri: photoUri}}
                style={styles.image}
              />
            ) : null}

            <TouchableOpacity
              style={styles.button}
              onPress={
                handleSaveEmployee
              }>
              <Text style={styles.buttonText}>
                Save Employee
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
  },
  form: {
    gap: 16,
  },
  field: {
    gap: 8,
  },
  label: {
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 14,
  },
  photoButton: {
    backgroundColor: '#16a34a',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  photoButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 12,
    alignSelf: 'center',
  },
  button: {
    backgroundColor: '#2563eb',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
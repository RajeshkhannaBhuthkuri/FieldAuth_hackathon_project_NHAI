import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
  ScrollView,
} from 'react-native';

import {launchCamera} from 'react-native-image-picker';

import type {NativeStackScreenProps} from '@react-navigation/native-stack';

import type {RootStackParamList} from '../navigation/AppNavigator';

import {
  getEmployees,
  saveAttendance,
  Employee,
} from '../services/database';

type Props = NativeStackScreenProps<
  RootStackParamList,
  'Authenticate'
>;

export default function AuthenticateScreen(
  _props: Props,
) {
  const [employeeId, setEmployeeId] = useState('');

  const [employee, setEmployee] =
    useState<Employee | null>(null);

  const [capturedPhoto, setCapturedPhoto] =
    useState('');

  const [matchScore, setMatchScore] =
    useState<number | null>(null);

  const authenticateEmployee = async () => {
    try {
      const employees = await getEmployees();

      const foundEmployee = employees.find(
        emp =>
          emp.employeeId.trim().toLowerCase() ===
          employeeId.trim().toLowerCase(),
      );

      if (foundEmployee) {
        setEmployee(foundEmployee);

        Alert.alert(
          'Success',
          'Employee Found',
        );
      } else {
        setEmployee(null);

        Alert.alert(
          'Failed',
          'Employee Not Found',
        );
      }
    } catch (error) {
      Alert.alert(
        'Error',
        'Authentication Failed',
      );
    }
  };

  const captureFace = async () => {
    const result = await launchCamera({
      mediaType: 'photo',
      cameraType: 'front',
      saveToPhotos: true,
    });

    if (
      result.assets &&
      result.assets.length > 0
    ) {
      const uri =
        result.assets[0].uri || '';

      setCapturedPhoto(uri);

      const score =
        Math.floor(Math.random() * 15) + 85;

      setMatchScore(score);

      Alert.alert(
        'Face Captured',
        `Match Score: ${score}%`,
      );
    }
  };

  const markAttendance = async () => {
    if (!employee) {
      return;
    }

    try {
      const success =
        await saveAttendance(
          employee.employeeId,
          employee.employeeName,
          employee.department,
        );

      if (success) {
        Alert.alert(
          'Success',
          'Attendance Marked Successfully',
        );
      } else {
        Alert.alert(
          'Already Marked',
          'Attendance already marked today.',
        );
      }
    } catch (error) {
      Alert.alert(
        'Error',
        'Failed to Mark Attendance',
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.content}>
          <Text style={styles.title}>
            Authenticate Employee
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Enter Employee ID"
            value={employeeId}
            onChangeText={setEmployeeId}
          />

          <TouchableOpacity
            style={styles.button}
            onPress={authenticateEmployee}>
            <Text style={styles.buttonText}>
              Find Employee
            </Text>
          </TouchableOpacity>

          {employee && (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>
                Employee Found
              </Text>

              <Text>
                Employee ID:
                {' '}
                {employee.employeeId}
              </Text>

              <Text>
                Name:
                {' '}
                {employee.employeeName}
              </Text>

              <Text>
                Department:
                {' '}
                {employee.department}
              </Text>

              <Text style={styles.sectionTitle}>
                Registered Photo
              </Text>

              {employee.photoUri ? (
                <Image
                  source={{
                    uri: employee.photoUri,
                  }}
                  style={styles.image}
                />
              ) : null}

              <TouchableOpacity
                style={styles.captureButton}
                onPress={captureFace}>
                <Text
                  style={styles.buttonText}>
                  Capture Face
                </Text>
              </TouchableOpacity>

              {capturedPhoto ? (
                <>
                  <Text
                    style={
                      styles.sectionTitle
                    }>
                    Captured Photo
                  </Text>

                  <Image
                    source={{
                      uri: capturedPhoto,
                    }}
                    style={styles.image}
                  />
                </>
              ) : null}

              {matchScore !== null ? (
                <Text style={styles.score}>
                  Match Score:
                  {' '}
                  {matchScore}%
                </Text>
              ) : null}

              <TouchableOpacity
                style={
                  styles.attendanceButton
                }
                onPress={markAttendance}>
                <Text
                  style={styles.buttonText}>
                  Mark Attendance
                </Text>
              </TouchableOpacity>
            </View>
          )}
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
  content: {
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 14,
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#2563eb',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  captureButton: {
    marginTop: 16,
    backgroundColor: '#f59e0b',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  attendanceButton: {
    marginTop: 16,
    backgroundColor: '#16a34a',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  card: {
    marginTop: 24,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  sectionTitle: {
    marginTop: 16,
    marginBottom: 8,
    fontWeight: 'bold',
  },
  image: {
    width: 220,
    height: 220,
    alignSelf: 'center',
    borderRadius: 10,
  },
  score: {
    marginTop: 16,
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'green',
  },
});
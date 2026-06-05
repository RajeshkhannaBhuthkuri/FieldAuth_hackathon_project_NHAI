import React, {useEffect, useCallback, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';

import {useFocusEffect} from '@react-navigation/native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';

import type {RootStackParamList} from '../navigation/AppNavigator';

import {
  getEmployeeCount,
  getAttendanceCount,
  getTodayAttendanceCount,
  getLastSyncFormatted,
} from '../services/database';

type Props = NativeStackScreenProps<
  RootStackParamList,
  'Home'
>;

export default function HomeScreen({
  navigation,
}: Props) {
  const [employeeCount, setEmployeeCount] =
    useState(0);

  const [attendanceCount, setAttendanceCount] =
    useState(0);

  const [todayCount, setTodayCount] =
    useState(0);

  const [lastSync, setLastSync] =
    useState('Never');

  const loadDashboard = async () => {
    const employees =
      await getEmployeeCount();

    const attendance =
      await getAttendanceCount();

    const today =
      await getTodayAttendanceCount();

    const sync =
      await getLastSyncFormatted();

    setEmployeeCount(employees);
    setAttendanceCount(attendance);
    setTodayCount(today);
    setLastSync(sync);
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadDashboard();
    }, []),
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>
          FieldAuth
        </Text>

        <Text style={styles.subtitle}>
          Offline Face Authentication
        </Text>

        <View style={styles.statsContainer}>
          <View style={styles.card}>
            <Text style={styles.cardLabel}>
              Employees
            </Text>

            <Text style={styles.cardValue}>
              {employeeCount}
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardLabel}>
              Attendance
            </Text>

            <Text style={styles.cardValue}>
              {attendanceCount}
            </Text>
          </View>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.card}>
            <Text style={styles.cardLabel}>
              Today
            </Text>

            <Text style={styles.cardValue}>
              {todayCount}
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardLabel}>
              Last Sync
            </Text>

            <Text
              style={[
                styles.cardValue,
                {fontSize: 12},
              ]}>
              {lastSync}
            </Text>
          </View>
        </View>

        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={styles.button}
            onPress={() =>
              navigation.navigate('Register')
            }>
            <Text style={styles.buttonText}>
              Register Employee
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() =>
              navigation.navigate(
                'Authenticate',
              )
            }>
            <Text style={styles.buttonText}>
              Authenticate Employee
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() =>
              navigation.navigate('Attendance')
            }>
            <Text style={styles.buttonText}>
              Attendance Logs
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() =>
              navigation.navigate('Sync')
            }>
            <Text style={styles.buttonText}>
              Sync Pending Records
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.directoryButton}
            onPress={() =>
              navigation.navigate(
                'EmployeeDirectory',
              )
            }>
            <Text style={styles.buttonText}>
              Employee Directory
            </Text>
          </TouchableOpacity>
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
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#1a1a1a',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginTop: 8,
    marginBottom: 30,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  card: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  cardLabel: {
    fontSize: 14,
    color: '#666',
  },
  cardValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 8,
  },
  buttonGroup: {
    marginTop: 24,
    gap: 16,
  },
  button: {
    backgroundColor: '#2563eb',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  directoryButton: {
    backgroundColor: '#16a34a',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
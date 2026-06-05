import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';

import type {RootStackParamList} from '../navigation/AppNavigator';

import {
  getAttendance,
  saveLastSync,
  getLastSyncFormatted,
} from '../services/database';

type Props = NativeStackScreenProps<
  RootStackParamList,
  'Sync'
>;

export default function SyncScreen(
  _props: Props,
) {
  const [pendingRecords, setPendingRecords] =
    useState(0);

  const [lastSync, setLastSync] =
    useState('Never');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const attendance = await getAttendance();

    const sync =
      await getLastSyncFormatted();

    setPendingRecords(attendance.length);

    setLastSync(sync);
  };

  const syncRecords = async () => {
    try {
      await saveLastSync();

      const syncTime =
        await getLastSyncFormatted();

      setLastSync(syncTime);

      Alert.alert(
        'Sync Successful',
        `${pendingRecords} records synced successfully.`,
      );
    } catch (error) {
      Alert.alert(
        'Error',
        'Failed to sync records.',
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>
          Sync Pending Records
        </Text>

        <View style={styles.card}>
          <Text style={styles.label}>
            Pending Attendance Records
          </Text>

          <Text style={styles.value}>
            {pendingRecords}
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>
            Last Sync
          </Text>

          <Text style={styles.syncValue}>
            {lastSync}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={syncRecords}>
          <Text style={styles.buttonText}>
            Sync Now
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#666',
  },
  value: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 8,
  },
  syncValue: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
  },
  button: {
    backgroundColor: '#2563eb',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
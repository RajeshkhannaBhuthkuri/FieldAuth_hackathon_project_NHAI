import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';

import type {RootStackParamList} from '../navigation/AppNavigator';
import {
  getAttendance,
  AttendanceRecord,
} from '../services/database';

type Props = NativeStackScreenProps<
  RootStackParamList,
  'Attendance'
>;

export default function AttendanceScreen(
  _props: Props,
) {
  const [records, setRecords] = useState<
    AttendanceRecord[]
  >([]);

  useEffect(() => {
    loadAttendance();
  }, []);

  const loadAttendance = async () => {
    const data = await getAttendance();
    setRecords(data.reverse());
  };

  const renderItem = ({
    item,
  }: {
    item: AttendanceRecord;
  }) => (
    <View style={styles.card}>
      <Text style={styles.name}>
        {item.employeeName}
      </Text>

      <Text>
        Employee ID: {item.employeeId}
      </Text>

      <Text>
        Department: {item.department}
      </Text>

      <Text>
        Time: {new Date(item.timestamp).toLocaleString()}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>
        Attendance Logs
      </Text>

      <FlatList
        data={records}
        keyExtractor={(_, index) =>
          index.toString()
        }
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={styles.empty}>
            No Attendance Records Found
          </Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  empty: {
    textAlign: 'center',
    marginTop: 40,
    color: '#666',
  },
});
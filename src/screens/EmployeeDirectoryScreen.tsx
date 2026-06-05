import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Image,
} from 'react-native';

import {
  getEmployees,
  Employee,
} from '../services/database';

export default function EmployeeDirectoryScreen() {
  const [employees, setEmployees] =
    useState<Employee[]>([]);

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    const data = await getEmployees();
    setEmployees(data);
  };

  const renderItem = ({
    item,
  }: {
    item: Employee;
  }) => (
    <View style={styles.card}>
      {item.photoUri ? (
        <Image
          source={{uri: item.photoUri}}
          style={styles.image}
        />
      ) : null}

      <Text style={styles.name}>
        {item.employeeName}
      </Text>

      <Text>
        Employee ID: {item.employeeId}
      </Text>

      <Text>
        Department: {item.department}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>
        Employee Directory
      </Text>

      <FlatList
        data={employees}
        keyExtractor={item =>
          item.employeeId
        }
        renderItem={renderItem}
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
    borderRadius: 10,
    marginBottom: 12,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 10,
    alignSelf: 'center',
    marginBottom: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
});
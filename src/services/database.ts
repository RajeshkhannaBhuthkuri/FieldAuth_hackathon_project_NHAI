import AsyncStorage from '@react-native-async-storage/async-storage';

const EMPLOYEE_KEY = 'employees';
const ATTENDANCE_KEY = 'attendance';
const LAST_SYNC_KEY = 'lastSync';

export interface Employee {
  employeeId: string;
  employeeName: string;
  department: string;
  photoUri: string;
  createdAt: string;
}

export interface AttendanceRecord {
  employeeId: string;
  employeeName: string;
  department: string;
  timestamp: string;
}

export const initDatabase = async (): Promise<void> => {
  return;
};

export const saveEmployee = async (
  employeeId: string,
  employeeName: string,
  department: string,
  photoUri: string,
): Promise<void> => {
  const employees = await getEmployees();

  employees.push({
    employeeId,
    employeeName,
    department,
    photoUri,
    createdAt: new Date().toISOString(),
  });

  await AsyncStorage.setItem(
    EMPLOYEE_KEY,
    JSON.stringify(employees),
  );
};

export const getEmployees = async (): Promise<Employee[]> => {
  const data = await AsyncStorage.getItem(
    EMPLOYEE_KEY,
  );

  if (!data) {
    return [];
  }

  return JSON.parse(data);
};

export const saveAttendance = async (
  employeeId: string,
  employeeName: string,
  department: string,
): Promise<boolean> => {
  const data = await AsyncStorage.getItem(
    ATTENDANCE_KEY,
  );

  const attendance: AttendanceRecord[] = data
    ? JSON.parse(data)
    : [];

  const today = new Date()
    .toISOString()
    .split('T')[0];

  const alreadyMarked = attendance.some(
    record =>
      record.employeeId === employeeId &&
      record.timestamp.startsWith(today),
  );

  if (alreadyMarked) {
    return false;
  }

  attendance.push({
    employeeId,
    employeeName,
    department,
    timestamp: new Date().toISOString(),
  });

  await AsyncStorage.setItem(
    ATTENDANCE_KEY,
    JSON.stringify(attendance),
  );

  return true;
};

export const getAttendance = async (): Promise<
  AttendanceRecord[]
> => {
  const data = await AsyncStorage.getItem(
    ATTENDANCE_KEY,
  );

  if (!data) {
    return [];
  }

  return JSON.parse(data);
};

export const getEmployeeCount = async (): Promise<number> => {
  const employees = await getEmployees();
  return employees.length;
};

export const getAttendanceCount = async (): Promise<number> => {
  const attendance = await getAttendance();
  return attendance.length;
};

export const getTodayAttendanceCount =
  async (): Promise<number> => {
    const attendance =
      await getAttendance();

    const today = new Date()
      .toISOString()
      .split('T')[0];

    return attendance.filter(record =>
      record.timestamp.startsWith(today),
    ).length;
  };

export const saveLastSync = async (): Promise<void> => {
  await AsyncStorage.setItem(
    LAST_SYNC_KEY,
    new Date().toISOString(),
  );
};

export const getLastSync = async (): Promise<string> => {
  const lastSync = await AsyncStorage.getItem(
    LAST_SYNC_KEY,
  );

  return lastSync ?? 'Never';
};

export const getLastSyncFormatted =
  async (): Promise<string> => {
    const lastSync =
      await AsyncStorage.getItem(
        LAST_SYNC_KEY,
      );

    if (!lastSync) {
      return 'Never';
    }

    return new Date(
      lastSync,
    ).toLocaleString();
  };
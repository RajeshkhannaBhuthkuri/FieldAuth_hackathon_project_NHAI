declare module 'react-native-sqlite-storage' {
  export interface ResultSet {
    rows: {
      length: number;
      item: (index: number) => Record<string, unknown>;
      raw: () => Record<string, unknown>[];
    };
    rowsAffected: number;
    insertId: number;
  }

  export interface Transaction {
    executeSql(
      sql: string,
      params?: unknown[],
    ): Promise<[Transaction, ResultSet]>;
  }

  export interface SQLiteDatabase {
    executeSql(
      sql: string,
      params?: unknown[],
    ): Promise<[Transaction, ResultSet]>;
    close(): Promise<void>;
  }

  interface SQLiteStatic {
    enablePromise(enable: boolean): void;
    openDatabase(options: {
      name: string;
      location?: string;
    }): Promise<SQLiteDatabase>;
  }

  const SQLite: SQLiteStatic;
  export default SQLite;
}

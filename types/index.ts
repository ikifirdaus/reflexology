export interface TableColumn<T> {
  key: keyof T;
  header: string;
}

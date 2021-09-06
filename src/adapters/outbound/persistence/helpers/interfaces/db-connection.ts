export default interface DBConnection {
  connect(): Promise<void>;
}

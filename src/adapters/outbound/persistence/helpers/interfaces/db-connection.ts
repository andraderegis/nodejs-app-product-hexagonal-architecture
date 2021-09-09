export default interface DBConnection {
  connect(name?: string): Promise<void>;
  disconnect(): Promise<void>;
}

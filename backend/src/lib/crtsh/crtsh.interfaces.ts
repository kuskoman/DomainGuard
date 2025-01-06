export interface CRTSHResultItem {
  issuer_ca_id: string;
  issuer_name: string;
  common_name: string;
  name_value: string; // newline-separated names
  id: number;
  entry_timestamp: Date;
  not_before: Date;
  not_after: Date;
  serial_number: string;
  result_count: number;
}

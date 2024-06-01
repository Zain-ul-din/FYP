import { FieldValue } from "firebase/firestore";

export type AppointmentStatus = 'pending' | 'rejected' | 'approved';

export default interface AppointmentDoc {
  appointment_date: string;
  created_at: FieldValue;
  updated_at: FieldValue;
  doctor_avatar: string;
  doctor_display_name: string;
  doctor_id: string;
  health_provider_id: string;
  health_provider_location: string;
  health_provider_name: string;
  health_provider_avatar: string;
  patient_phone_no: string;
  patient_id: string;
  patient_name: string;
  slot: string;
  patient_age: number;
  status: AppointmentStatus;
  week_day: string;
  acc_display_name: string;
  uid?: string;
}

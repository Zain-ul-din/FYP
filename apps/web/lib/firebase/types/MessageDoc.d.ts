import { FieldValue } from "firebase/firestore";

export default interface MessageDoc {
  doctor_avatar: string;
  doctor_display_name: string;
  patient_avatar: string;
  patient_id: string;
  patient_name: string;
  timestamp: FieldValue;
  uid: string;
}


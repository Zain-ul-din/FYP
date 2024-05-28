import { FieldValue } from "firebase-admin/firestore";

export default interface MedicationDoc {
  name: string;
  duration: number;
  description: string;

  doctor_id: string;

  created_at: FieldValue;
  updated_at: FieldValue;

  variants: {
    [key: string]: {
      [time: string]: Array<{ 
        name: string; qt: number;
      }>
    }
  }

  days: {
    [day: string]
  }

  public?: boolean;
  uid: string;
}


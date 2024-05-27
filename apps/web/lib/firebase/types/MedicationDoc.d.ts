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
        med_name: string; quantity: number;
      }>
    }
  }

  days: {
    [day: string]
  }

  public?: boolean;
  uid: string;
}


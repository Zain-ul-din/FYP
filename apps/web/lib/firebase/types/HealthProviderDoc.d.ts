import { FieldValue } from "firebase/firestore";

export default interface HealthProviderDoc {

  uid: string;
  created_at: FieldValue;
  updated_at: FieldValue;
  
  doctor_id: string;
  city: string;
  name: string;
  wait_time: number;
  start_time: string;
  end_time: string;
  
  monday: string[];
  tuesday: string[];
  wednesday: string[];
  thursday: string[];
  friday: string[];
  saturday: string[];
  sunday: string[];

  location: string;
  helpLine: string;
  about: string;
  googleLocLink: string;

}



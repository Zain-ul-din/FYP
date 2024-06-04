import { FieldValue } from "firebase-admin/firestore";

export default interface DoctorDoc {
  title: string;
  fullName: string;
  yearOfExperience: string;
  displayName: string;
  primarySpecialization: string;
  secondarySpecializations: string;
  conditionsTreated: string[];
  pmdcRegistrationNumber: string;
  userId: string;
  createdAt: FieldValue;
  updatedAt: FieldValue;
  phone_number: string;
  email: string;
  photoURL: string;
  markdown: string;
  // optional fields
  isVerified?: boolean;
  isRejected?: boolean;
  rejectionReason?: string;

  locations: string[];
  specialization: string[];
  rating: 5.0
}












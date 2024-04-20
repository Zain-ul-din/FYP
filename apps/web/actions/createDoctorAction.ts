'use server';

import { initAdminSDK } from "@/lib/firebase/admin-sdk";
import { doctorsCol } from "@/lib/firebase/collections";
import DoctorDoc from "@/lib/firebase/types/DoctorDoc";
import { auth, firestore } from "firebase-admin";
import { cookies, headers } from "next/headers";

export default async function createDoctorAction(
  doctorDetails: Pick<DoctorDoc, 
    "title" | "fullName" | "conditionsTreated"
    | "pmdcRegistrationNumber" | "primarySpecialization"
    | "secondarySpecializations" | "yearOfExperience"
  >
) {
  initAdminSDK();
  const session = cookies().get('session')?.value || '';
  const decodedClaims = await auth().verifySessionCookie(session, true);
  
  const { customClaims } = await auth().getUser(decodedClaims.uid);
  auth().setCustomUserClaims(decodedClaims.uid, { isDoctor: true, ...customClaims })

  if(!customClaims) throw new Error('User not found');
  
  const data: DoctorDoc = {
    ...doctorDetails,
    userId: decodedClaims.uid,
    createdAt: firestore.FieldValue.serverTimestamp(),
    updatedAt: firestore.FieldValue.serverTimestamp(),
    phone_number: customClaims.phoneNumber || '',
    email: decodedClaims.email || '',
    photoURL: decodedClaims.picture || '',
    markdown: '### Write about yourself here'
  }

  // set doc uid
  await firestore().collection(doctorsCol).doc(decodedClaims.uid).set(data, {
    merge: true
  });
}








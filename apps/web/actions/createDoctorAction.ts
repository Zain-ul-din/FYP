'use server';

import { initAdminSDK } from "@/lib/firebase/admin-sdk";
import { doctorsCol } from "@/lib/firebase/collections";
import DoctorDoc from "@/lib/firebase/types/DoctorDoc";
import { auth, firestore } from "firebase-admin";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

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
  console.log(decodedClaims);
  const { customClaims } = await auth().getUser(decodedClaims.uid);

  if (!decodedClaims) throw new Error('User not found');
  auth().setCustomUserClaims(decodedClaims.uid, { isDoctor: true, ...customClaims })

  const data: DoctorDoc = {
    ...doctorDetails,
    userId: decodedClaims.uid,
    createdAt: firestore.FieldValue.serverTimestamp(),
    updatedAt: firestore.FieldValue.serverTimestamp(),
    phone_number: '+923112323230',
    email: decodedClaims.email || '',
    photoURL: decodedClaims.picture || '',
    markdown: '### Write about yourself here',
    specialization: [
      doctorDetails.primarySpecialization,
      doctorDetails.secondarySpecializations
    ],
    locations: []
  }

  // set doc uid
  await firestore().collection(doctorsCol).doc(decodedClaims.uid).set(data, {
    merge: true
  });


}




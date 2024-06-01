"use server";

import { firestore, messaging } from "firebase-admin";
import { initAdminSDK } from "../firebase/admin-sdk";

export default async function sendNotification(
  { patient_id, doctor_display_name, msg }: {
    patient_id: string, doctor_display_name: string,
    msg: string;
  }
) {
  
  
  initAdminSDK();
  const patientRef = firestore().collection('patients').doc(patient_id);
  const patientDoc = await patientRef.get();

  const fcmToken = (patientDoc.data() as any).fcm_token as string;

  const message = {
    notification: {
      title: `New Message from ${doctor_display_name}`,
      body: msg,
    },
    token: fcmToken,
  };

  await messaging().send(message);
}


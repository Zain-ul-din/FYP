'use client';
import { ReactNode, createContext, useContext, useEffect, useState } from 'react';
import useLoggedInUser from './useLoggedInUser';
import { useCollection } from 'react-firebase-hooks/firestore';
import { collection, limit, query, where } from 'firebase/firestore';
import { firestore } from '../firebase';
import { doctorsCol } from '../firebase/collections';
import DoctorDoc from '../firebase/types/DoctorDoc';

const DoctorDocContext = createContext<DoctorDoc | null>(null);

export const DoctorDocProvider = ({ children }: { children: ReactNode }) => {
  const [doctor, setDoctor] = useState<DoctorDoc | null>(null);
  const userId = useLoggedInUser();
  const [snapShot] = useCollection(query(collection(firestore, doctorsCol), where('userId', '==', userId), limit(1)));

  useEffect(() => {
    if (!snapShot || !userId) return;
    const doctorDocs = snapShot.docs.map((d) => d.data());
    setDoctor(doctorDocs.length === 0 ? null : (doctorDocs[0] as DoctorDoc));
  }, [snapShot]);

  return <DoctorDocContext.Provider value={doctor}>{children}</DoctorDocContext.Provider>;
};

const useDoctorDoc = () => {
  const doctor = useContext(DoctorDocContext);
  return doctor;
};

export default useDoctorDoc;

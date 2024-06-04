'use client';

import {
  Avatar,
  Button,
  Checkbox,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spinner,
  Tag,
  Tbody,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import PaginationTable from '../shared/PaginationTable';
import { FieldValue, collection, doc, orderBy, query, serverTimestamp, updateDoc, where } from 'firebase/firestore';
import useLoggedInUser from '@/lib/hooks/useLoggedInUser';
import { useCollection } from 'react-firebase-hooks/firestore';
import { firestore } from '@/lib/firebase';
import { appointmentsCol } from '@/lib/firebase/collections';
import { useCallback } from 'react';
import timeStampToDate from '@/lib/util/timeStampToDate';
import AppointmentDoc, { AppointmentStatus } from '@/lib/firebase/types/AppointmentDoc';
import Loader from '../shared/Loader';
import { ExternalLinkIcon } from '@chakra-ui/icons';
import Link from 'next/link';
import sendNotification from '@/lib/util/sendNotification';
import useDoctorDoc from '@/lib/hooks/useDoctorDoc';

export default function Appointments() {
  const loggedInUser = useLoggedInUser();

  const [snapShot] = useCollection(
    query(collection(firestore, appointmentsCol), where('doctor_id', '==', loggedInUser), orderBy('created_at', 'desc'))
  );

  const doctor = useDoctorDoc();

  const updateStatus = useCallback(
    (doc_id: string, status: AppointmentStatus, appointment: AppointmentDoc) => {
      if (!doctor) return;
      updateDoc(doc(collection(firestore, appointmentsCol), doc_id), {
        status,
        updated_at: serverTimestamp(),
      } as Pick<AppointmentDoc, 'status'>);
      sendNotification({
        doctor_display_name: doctor.displayName,
        msg: `${status} your appointment at ${timeStampToDate(appointment.appointment_date as any).toDateString()} ${appointment.slot} `,
        patient_id: appointment.patient_id,
      });
    },
    [doctor]
  );

  if (!snapShot) return <Loader />;

  const appointments = snapShot.docs.map((d) => ({ uid: d.id, ...d.data() })) as Array<AppointmentDoc>;

  return (
    <PaginationTable mt={4}>
      <Thead>
        <Tr>
          <Th>View</Th>
          <Th>Hospital Avatar</Th>
          <Th>Hospital</Th>
          <Th>Patient Name</Th>
          <Th>Age</Th>
          <Th>Contact Number</Th>
          <Th>Slot</Th>
          <Th>Appointment Date</Th>
          <Th>Status</Th>
          <Th>Action</Th>
        </Tr>
      </Thead>
      <Tbody>
        {appointments.map((appointment, idx) => {
          console.log(appointment.appointment_date);
          return (
            <Tr key={idx}>
              <Th>
                <Link href={`/dashboard/appointments/${appointment.uid}`}>
                  <Button size={'sm'} variant={'solid'}>
                    <ExternalLinkIcon />
                  </Button>
                </Link>
              </Th>
              <Th>
                <Avatar src={appointment.health_provider_avatar} size={'md'} />
              </Th>
              <Th maxW={'48'} textOverflow={'ellipsis'} overflow={'hidden'}>
                {appointment.health_provider_name}
              </Th>
              <Th>{appointment.patient_name}</Th>
              <Th>{appointment.patient_age}</Th>
              <Th>{appointment.patient_phone_no}</Th>
              <Th>{appointment.slot}</Th>
              <Th>{timeStampToDate(appointment.appointment_date as any).toDateString()}</Th>
              <Th>
                <Tag
                  colorScheme={(() => {
                    switch (appointment.status.toLocaleLowerCase()) {
                      case 'pending':
                        return 'yellow';
                      case 'approved':
                        return 'green';
                      case 'rejected':
                        return 'red';
                    }
                  })()}
                  size={'sm'}
                >
                  {appointment.status}
                </Tag>
              </Th>
              <Th>
                <Menu>
                  <MenuButton>
                    <Button variant={'ghost'}>...</Button>
                  </MenuButton>
                  <MenuList maxW={'sm'}>
                    <MenuItem
                      fontSize={'sm'}
                      py={3}
                      onClick={() => {
                        updateStatus(appointment.uid as string, 'approved', appointment);
                      }}
                    >
                      ✔ Approve
                    </MenuItem>
                    <MenuItem
                      fontSize={'sm'}
                      py={3}
                      onClick={() => {
                        updateStatus(appointment.uid as string, 'pending', appointment);
                      }}
                    >
                      🕑 Pending
                    </MenuItem>
                    <MenuItem
                      fontSize={'sm'}
                      py={3}
                      onClick={() => {
                        updateStatus(appointment.uid as string, 'rejected', appointment);
                      }}
                    >
                      ❌ Reject
                    </MenuItem>
                  </MenuList>
                </Menu>
              </Th>
            </Tr>
          );
        })}
      </Tbody>
    </PaginationTable>
  );
}

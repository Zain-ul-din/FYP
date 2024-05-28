'use client';

import {
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
import { FieldValue, collection, doc, orderBy, query, updateDoc, where } from 'firebase/firestore';
import useLoggedInUser from '@/lib/hooks/useLoggedInUser';
import { useCollection } from 'react-firebase-hooks/firestore';
import { firestore } from '@/lib/firebase';
import { appointmentsCol } from '@/lib/firebase/collections';
import { useCallback } from 'react';
import timeStampToDate from '@/lib/util/timeStampToDate';

type AppointmentStatus = 'pending' | 'rejected' | 'approved';

interface AppointmentDoc {
  appointment_date: string;
  created_at: FieldValue;
  doctor_avatar: string;
  doctor_display_name: string;
  doctor_id: string;
  health_provider_id: string;
  health_provider_location: string;
  health_provider_name: string;
  patient_id: string;
  patient_name: string;
  slot: string;
  status: AppointmentStatus;
  week_day: string;
  uid?: string;
}

export default function Appointments() {
  const loggedInUser = useLoggedInUser();

  const [snapShot] = useCollection(
    query(collection(firestore, appointmentsCol), where('doctor_id', '==', loggedInUser), orderBy('created_at', 'desc'))
  );

  const updateStatus = useCallback((doc_id: string, status: AppointmentStatus) => {
    updateDoc(doc(collection(firestore, appointmentsCol), doc_id), {
      status,
    } as Pick<AppointmentDoc, 'status'>);
  }, []);

  if (!snapShot) return <Spinner />;

  const appointments = snapShot.docs.map((d) => ({ uid: d.id, ...d.data() })) as Array<AppointmentDoc>;

  return (
    <PaginationTable mt={4}>
      <Thead>
        <Tr>
          <Th>
            <Checkbox />
          </Th>
          <Th>Hospital Avatar</Th>
          <Th>Hospital</Th>
          <Th>Patient Name</Th>
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
                <Checkbox />
              </Th>
              <Th>{appointment.health_provider_id}</Th>
              <Th>{appointment.health_provider_name}</Th>
              <Th>{appointment.patient_name}</Th>
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
                        updateStatus(appointment.uid as string, 'approved');
                      }}
                    >
                      ✔ Approve
                    </MenuItem>
                    <MenuItem
                      fontSize={'sm'}
                      py={3}
                      onClick={() => {
                        updateStatus(appointment.uid as string, 'pending');
                      }}
                    >
                      🕑 Pending
                    </MenuItem>
                    <MenuItem
                      fontSize={'sm'}
                      py={3}
                      onClick={() => {
                        updateStatus(appointment.uid as string, 'rejected');
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

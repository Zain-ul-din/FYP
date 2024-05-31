'use client';
import {
  Avatar,
  Button,
  Flex,
  Grid,
  GridItem,
  Heading,
  Stack,
  Tag,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useMediaQuery,
} from '@chakra-ui/react';
import DashboardHeader from './shared/DashboardHeader';
import { ReactElement, useEffect, useState } from 'react';
import PeopleSavedIcon from './icons/dashboard/PeopleSavedIcon';
import UsersIcon from './icons/dashboard/UsersIcon';
import OrderIcon from './icons/dashboard/OrderIcon';
import EarnedCommissionIcon from './icons/dashboard/EarnedCommissionIcon';
import { collection, getCountFromServer, limit, onSnapshot, query, where } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';
import { appointmentsCol, healthProvidersCol, medicationsCol } from '@/lib/firebase/collections';
import useLoggedInUser from '@/lib/hooks/useLoggedInUser';
import HealthProviderDoc from '@/lib/firebase/types/HealthProviderDoc';
import MedicationDoc from '@/lib/firebase/types/MedicationDoc';
import DataTable from './shared/DataTable';
import AppointmentDoc from '@/lib/firebase/types/AppointmentDoc';
import timeStampToDate from '@/lib/util/timeStampToDate';
import { ExternalLinkIcon } from '@chakra-ui/icons';
import Link from 'next/link';

export default function Dashboard() {
  const [appointments, setAppointments] = useState<AppointmentDoc[]>([]);
  const [healthProviders, setHealthProviders] = useState<HealthProviderDoc[]>([]);

  const userId = useLoggedInUser();

  useEffect(() => {
    const appointmentsQuery = query(collection(firestore, appointmentsCol), where('doctor_id', '==', userId), limit(5));
    const healthProviderQuery = query(
      collection(firestore, healthProvidersCol),
      where('doctor_id', '==', userId),
      limit(10)
    );

    onSnapshot(appointmentsQuery, (snapShot) => {
      const res = snapShot.docs.map((d) => d.data()) as AppointmentDoc[];
      setAppointments(res);
    });

    onSnapshot(healthProviderQuery, (snapShot) => {
      const res = snapShot.docs.map((d) => d.data()) as HealthProviderDoc[];
      setHealthProviders(res);
    });
  }, [userId]);

  return (
    <>
      <DashboardHeader description="Welcome to the dashboard!">Dashboard</DashboardHeader>
      <Flex w={'100%'} h={'100%'} p={3} flexDir={'column'} gap={'0.5rem'} pb={5}>
        <StatCards />

        <DataTable
          heading="Recent Appointments Booking"
          variant="simple-center"
          viewMoreLink={'/dashboard/appointments'}
        >
          <Thead>
            <Tr>
              <Th>Hospital</Th>
              <Th>Patient Name</Th>
              <Th>Age</Th>
              <Th>Contact Number</Th>
              <Th>Slot</Th>
              <Th>Appointment Date</Th>
              <Th>Status</Th>
            </Tr>
          </Thead>
          <Tbody>
            {appointments.length == 0 && (
              <Tr>
                <Td colSpan={9} py={12}>
                  <Text>No Appointments so far</Text>
                </Td>
              </Tr>
            )}
            {appointments.map((appointment, idx) => {
              return (
                <Tr key={idx}>
                  <Td>
                    <Avatar src={appointment.health_provider_avatar} />
                  </Td>
                  <Td>{appointment.patient_name}</Td>
                  <Td>{appointment.patient_age}</Td>
                  <Td>{appointment.patient_phone_no}</Td>
                  <Td>{appointment.slot}</Td>
                  <Td>{timeStampToDate(appointment.appointment_date as any).toDateString()}</Td>
                  <Td>
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
                  </Td>
                </Tr>
              );
            })}
            {/* {new Array(6).fill(' ').map((_, i) => {
              return (
                <Tr key={i}>
                  <Td>Doyle Inc</Td>
                  <Td>Basic Life Support</Td>
                  <Td>3:30 PM, th Sep 23</Td>
                  <Td>742 Horace Haven</Td>
                  <Td>66771 Doyle Light</Td>
                  <Td>
                    <StatusTag status="pending">In Pending</StatusTag>
                  </Td>
                </Tr>
              );
            })} */}
          </Tbody>
        </DataTable>

        <DataTable heading="Health Providers" variant="simple-center" viewMoreLink={'/dashboard/hospitals'}>
          <Thead>
            <Tr>
              <Th>Hospital Avatar</Th>
              <Th>Hospital</Th>
              <Th>City</Th>
              <Th>Location</Th>
              <Th>View</Th>
            </Tr>
          </Thead>
          <Tbody>
            {healthProviders.length == 0 && (
              <Tr>
                <Td colSpan={9} py={12}>
                  <Stack>
                    <Flex justifyContent={'center'}>
                      <Button fontSize={'sm'} fontWeight={'thin'} size={'sm'} colorScheme="blackAlpha">
                        Click to Join Health Provider
                      </Button>
                    </Flex>
                  </Stack>
                </Td>
              </Tr>
            )}
            {healthProviders.map((healthProvider, idx) => {
              return (
                <Tr key={idx}>
                  <Td>
                    <Avatar size={'sm'} src={healthProvider.avatar} />
                  </Td>
                  <Td>{healthProvider.name}</Td>
                  <Td>{healthProvider.city}</Td>
                  <Td
                    _hover={{
                      textDecoration: 'underline',
                    }}
                  >
                    <Link href={healthProvider.googleLocLink} target="_blank">
                      {healthProvider.location}
                    </Link>
                  </Td>
                  <Td>
                    <Button size={'sm'} variant={'ghost'}>
                      <ExternalLinkIcon />
                    </Button>
                  </Td>
                </Tr>
              );
            })}
          </Tbody>
        </DataTable>
      </Flex>
    </>
  );
}

export interface StatCardData {
  items?: string;
  for?: string;
  icon?: ReactElement;
  type: 'health_provider' | 'patients' | 'served_patients' | 'medication_plans';
}

export interface StatCardProps {
  data: StatCardData;
}

const dummy: StatCardData[] = [
  {
    items: '70'.padStart(3, '0'),
    for: 'Health Providers',
    icon: <OrderIcon />,
    type: 'health_provider',
  },
  {
    items: '120'.padStart(3, '0'),
    for: 'Patients',
    icon: <UsersIcon />,
    type: 'patients',
  },
  {
    items: '550'.padStart(3, '0'),
    for: 'Patient Served',
    icon: <PeopleSavedIcon />,
    type: 'served_patients',
  },
  {
    items: '0'.padStart(2, '0'),
    for: 'Medication Plans',
    icon: <EarnedCommissionIcon />,
    type: 'medication_plans',
  },
];

const StatCards = () => {
  const [healthProviders, setHealthProviders] = useState<number>(0);
  const [medication, setMedication] = useState<number>(0);
  const [appointments, setAppointments] = useState<number>(0);
  const [servedAppointment, setServedAppointments] = useState<number>(0);

  const userId = useLoggedInUser();

  useEffect(() => {
    getCountFromServer(
      query(collection(firestore, healthProvidersCol), where('doctor_id' as keyof HealthProviderDoc, '==', userId))
    ).then((res) => {
      setHealthProviders(res.data().count);
    });

    getCountFromServer(
      query(collection(firestore, medicationsCol), where('doctor_id' as keyof MedicationDoc, '==', userId))
    ).then((res) => {
      setMedication(res.data().count);
    });

    getCountFromServer(query(collection(firestore, appointmentsCol), where('doctor_id', '==', userId))).then((res) => {
      setAppointments(res.data().count);
    });

    getCountFromServer(
      query(collection(firestore, appointmentsCol), where('doctor_id', '==', userId), where('expire', '==', true))
    ).then((res) => {
      setServedAppointments(res.data().count);
    });
  }, []);

  return (
    <Grid templateColumns={'repeat(4, 1fr)'} py={2} w={'100%'} gap={4}>
      {dummy?.map((data, i) => {
        const item = (() => {
          switch (data.type) {
            case 'health_provider':
              return (healthProviders + '').padStart(3, '0');
            case 'medication_plans':
              return (medication + '').padStart(2, '0');
            case 'patients':
              return (appointments + '').padStart(3, '0');
            case 'served_patients':
              return (servedAppointment + '').padStart(3, '0');
          }
          return '000';
        })();
        return <StatCard key={i} data={{ ...data, items: item }} />;
      })}
    </Grid>
  );
};

const StatCard: React.FC<StatCardProps> = ({ data }) => {
  const [isSmallScreen] = useMediaQuery('(max-width: 700px)');

  return (
    <GridItem
      colSpan={isSmallScreen ? 2 : 1}
      display={'flex'}
      justifyContent={'center'}
      alignItems={'center'}
      shadow={'sm'}
      rounded={'md'}
      p={4}
      gap={3}
      bg={'white'}
      flexWrap={'wrap'}
    >
      {data?.icon}
      {/* <OrderIcon /> */}
      <Stack spacing={0} textAlign={'center'}>
        <Heading fontSize={'2xl'} color={'var(--dark-text-color)'}>
          {data?.items}
        </Heading>
        <Text fontSize={'sm'} color={'var(--dark-text-color)'} fontWeight={'light'}>
          {/* Owners */}
          {data?.for}
        </Text>
      </Stack>
    </GridItem>
  );
};

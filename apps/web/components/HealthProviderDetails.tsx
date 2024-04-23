'use client';

import { firestore } from '@/lib/firebase';
import { healthProvidersCol } from '@/lib/firebase/collections';
import HealthProviderDoc from '@/lib/firebase/types/HealthProviderDoc';
import { Button, Divider, Flex, Heading, Spinner, Stack, Text } from '@chakra-ui/react';

import { collection, doc, updateDoc } from 'firebase/firestore';
import { useDocument } from 'react-firebase-hooks/firestore';
import AppointmentTimetable from './AppointmentTimetable';
import { Fragment, useCallback, useState } from 'react';
import createModal from './design/createModal';
import CreateNewHealthProviderForm from './forms/CreateNewHealthProviderForm';

interface HealthProviderDetailsProps {
  uid: string;
}

const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

const CreateHealthProviderModal = createModal();

export default function HealthProviderDetails({ uid }: HealthProviderDetailsProps) {
  const [snapShot, loading, err] = useDocument(doc(firestore, healthProvidersCol, uid));
  const [isChangesAvailable, setIsChangesAvailable] = useState(false);
  const [slots, setSlots] = useState(
    days
      .map((day) => {
        return { day, slots: [] };
      })
      .reduce(
        (acc, curr) => {
          acc[curr.day] = curr.slots;
          return acc;
        },
        {} as Record<string, { time: string }[]>
      )
  );

  const data = snapShot?.data() as HealthProviderDoc;
  const updateDocument = useCallback(() => {
    if (!isChangesAvailable) return;
    // Update the document
    const docRef = doc(collection(firestore, healthProvidersCol), data.uid);
    updateDoc(docRef, {
      ...slots,
    }).finally(() => {
      setIsChangesAvailable(false);
    });
  }, [data, isChangesAvailable]);

  if (loading || !snapShot) return <Spinner />;
  if (err) return <Text color={'red.300'}>Error: {err.message}</Text>;

  return (
    <CreateHealthProviderModal.Provider>
      <Flex p={4}>
        <Stack w={'full'} spacing={6}>
          <Heading>{data.name}</Heading>
          <Flex>
            <EditBtn doc={data} />
            <Button variant={'red'} size={'sm'} ml={2} onClick={updateDocument}>
              {isChangesAvailable ? 'Save Changes' : 'Saved'}
            </Button>
          </Flex>
          <Divider />
          <Flex flexDir={'column'} gap={4}>
            <Heading>Timetable</Heading>
            {days.map((day, i) => (
              <Fragment key={i}>
                <Text>
                  {'> '}
                  {day.toUpperCase()}
                </Text>
                <AppointmentTimetable
                  initialSlots={data[day as keyof HealthProviderDoc] as any}
                  start_time={data.start_time}
                  end_time={data.end_time}
                  waitTime={data.wait_time}
                  day={day}
                  onChange={(timeSlots) => {
                    setIsChangesAvailable(true);
                    setSlots((prev) => {
                      return { ...prev, [day]: timeSlots };
                    });
                  }}
                />
              </Fragment>
            ))}
          </Flex>
        </Stack>
      </Flex>
    </CreateHealthProviderModal.Provider>
  );
}

const EditBtn = ({ doc }: { doc: HealthProviderDoc }) => {
  const { onClose, onOpen } = CreateHealthProviderModal.useModalState();

  return (
    <>
      <Button variant={'red'} size={'sm'} onClick={onOpen}>
        Edit
      </Button>
      <CreateHealthProviderModal.Layout title="Edit Health Provider">
        <CreateNewHealthProviderForm onClose={onClose} initialState={doc} update />
      </CreateHealthProviderModal.Layout>
    </>
  );
};

'use client';

import { firestore } from '@/lib/firebase';
import { healthProvidersCol } from '@/lib/firebase/collections';
import HealthProviderDoc from '@/lib/firebase/types/HealthProviderDoc';
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Avatar,
  Box,
  Button,
  Divider,
  Flex,
  HStack,
  Heading,
  Spinner,
  Stack,
  Text,
} from '@chakra-ui/react';

import { collection, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { useDocument } from 'react-firebase-hooks/firestore';
import AppointmentTimetable from './AppointmentTimetable';
import { useCallback, useState } from 'react';
import createModal from './design/createModal';
import CreateNewHealthProviderForm from './forms/CreateNewHealthProviderForm';
import MapIcon from './icons/MapIcon';
import { DeleteIcon, EditIcon, TimeIcon } from '@chakra-ui/icons';
import { useRouter } from 'next/navigation';

interface HealthProviderDetailsProps {
  uid: string;
}

const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

const CreateHealthProviderModal = createModal();

export default function HealthProviderDetails({ uid }: HealthProviderDetailsProps) {
  const [snapShot, loading, err] = useDocument(doc(firestore, healthProvidersCol, uid));
  const [isChangesAvailable, setIsChangesAvailable] = useState(false);
  const router = useRouter();
  const [isLoading, setLoading] = useState<boolean>(false);

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

  const deleteProvider = useCallback(() => {
    setLoading(true);
    deleteDoc(doc(collection(firestore, healthProvidersCol), uid)).then(() => {
      setLoading(false);
      router.push('/dashboard/hospitals');
    });
  }, []);

  const data = snapShot?.data() as HealthProviderDoc;
  const updateDocument = useCallback(() => {
    if (!isChangesAvailable) return;
    // Update the document
    const docRef = doc(collection(firestore, healthProvidersCol), data.uid);
    const slotsToFlatArr = Object.entries(slots)
      .map(([key, slots]) => {
        return [key, slots.map((s) => s.time)];
      })
      .reduce((acc, curr) => {
        return { ...acc, [curr[0] as string]: curr[1] };
      }, {});
    updateDoc(docRef, {
      ...slotsToFlatArr,
    }).finally(() => {
      setIsChangesAvailable(false);
    });
  }, [data, isChangesAvailable]);

  if (loading || !snapShot) return <Spinner />;
  if (err) return <Text color={'red.300'}>Error: {err.message}</Text>;

  if (!data) return <Spinner />;

  return (
    <CreateHealthProviderModal.Provider>
      <Flex p={4}>
        <Stack w={'full'} spacing={6}>
          <HStack spacing={4}>
            <Avatar src={data.avatar} size={'lg'} />
            <Stack spacing={0}>
              <Heading fontSize={'2xl'}>{data.name}</Heading>
              <Text color={'gray.600'} fontSize={'sm'}>
                {data.location}
              </Text>
            </Stack>
          </HStack>
          <Flex flexWrap={'wrap'} gap={2}>
            <EditBtn doc={data} />
            <Button
              colorScheme="whatsapp"
              size={'sm'}
              leftIcon={<MapIcon color="white" />}
              as={'a'}
              href={data.googleLocLink}
              target="_blank"
            >
              View Locations
            </Button>
            <Button variant={'red'} size={'sm'} onClick={updateDocument}>
              {isChangesAvailable ? 'Save Changes' : 'Saved'}
            </Button>
            <Button
              colorScheme="red"
              size={'sm'}
              leftIcon={<DeleteIcon />}
              onClick={deleteProvider}
              isLoading={isLoading}
            >
              Delete
            </Button>
          </Flex>
          <Divider />
          <Flex flexDir={'column'} gap={4}>
            <Heading size={'md'} verticalAlign={'center'}>
              Timetable
            </Heading>
            <Accordion allowMultiple>
              {days.map((day, i) => (
                <AccordionItem key={i}>
                  <h2>
                    <AccordionButton _expanded={{ bg: 'var(--blue-grad)', color: 'white' }}>
                      <Box as="span" flex="1" textAlign="left">
                        <HStack>
                          <TimeIcon />
                          <Text>{day.toLocaleUpperCase()}</Text>
                        </HStack>
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                  </h2>
                  <AccordionPanel pb={4} bg={'white'}>
                    <AppointmentTimetable
                      initialSlots={
                        (data[day as keyof HealthProviderDoc] as any).map((slot: any) => ({
                          time: slot,
                        })) as any
                      }
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
                  </AccordionPanel>
                </AccordionItem>
              ))}
            </Accordion>
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
      <Button variant={'red'} size={'sm'} onClick={onOpen} leftIcon={<EditIcon />}>
        Edit
      </Button>
      <CreateHealthProviderModal.Layout title="Edit Health Provider">
        <CreateNewHealthProviderForm onClose={onClose} initialState={doc} update />
      </CreateHealthProviderModal.Layout>
    </>
  );
};

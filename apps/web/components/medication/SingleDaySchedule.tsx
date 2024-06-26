import { AddIcon, DeleteIcon } from '@chakra-ui/icons';
import {
  Button,
  Card,
  Center,
  Divider,
  Flex,
  Text,
  HStack,
  Input,
  NumberInputField,
  NumberInput,
  NumberIncrementStepper,
  NumberInputStepper,
  NumberDecrementStepper,
  ListItem,
  List,
  Box,
} from '@chakra-ui/react';
import TimeInput from '../design/TimeInput';
import createModal from '../design/createModal';
import { useCallback, useEffect, useState } from 'react';
import timeToStr from '@/lib/util/timeToStr';
import { Select } from 'chakra-react-select';
import debounce from '@/lib/util/debounce';
import { collection, doc, updateDoc, deleteField } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';
import { medicationsCol } from '@/lib/firebase/collections';
import SaveBtn from '../forms/shared/SaveBtn';

const AddNewTimetableModal = createModal();

type MedicineMeta = {
  name: string;
  qt: number;
};

interface SingleDayScheduleProps {
  initialState: {
    [key: string]: MedicineMeta[];
  };
  doc_id: string;
  variant_id: string;
  onDelete: () => void;
}

export default function SingleDaySchedule({ initialState, doc_id, variant_id, onDelete }: SingleDayScheduleProps) {
  const [schedule, setSchedule] = useState<{ [key: string]: MedicineMeta[] }>(initialState);
  const [loading, setLoading] = useState<boolean>(false);

  const saveSchedule = useCallback(async () => {
    setLoading(true);
    await updateDoc(doc(collection(firestore, medicationsCol), doc_id), {
      [`variants.${variant_id}`]: schedule,
    });
    setLoading(false);
  }, [schedule, doc_id, variant_id]);

  const deleteSchedule = useCallback(async () => {
    setLoading(true);
    await updateDoc(doc(collection(firestore, medicationsCol), doc_id), {
      [`variants.${variant_id}`]: deleteField(),
    });
    setLoading(false);
    onDelete();
  }, [schedule, doc_id, variant_id]);

  return (
    <AddNewTimetableModal.Provider>
      <HStack>
        <SaveBtn size={'sm'} onClick={saveSchedule} isLoading={loading} />
        <Button colorScheme="red" leftIcon={<DeleteIcon />} size={'sm'} onClick={deleteSchedule} isLoading={loading}>
          Delete
        </Button>
      </HStack>
      <Flex overflowX={'scroll'} height={'100%'} gap={4} maxH={'80vh'}>
        {Object.keys(schedule).map((title, idx) => (
          <ScheduleCard
            key={idx}
            title={title}
            medicines={schedule[title]}
            onDelete={() => {
              const newState = JSON.parse(JSON.stringify(schedule));
              delete newState[title];
              setSchedule(() => newState);
            }}
            onAddMedication={(name) => {
              setSchedule((prev) => ({
                ...prev,
                [title]: [...prev[title], { name, qt: 1 }].filter(
                  (ele, idx, self) => idx === self.findIndex((v) => v.name === ele.name)
                ),
              }));
            }}
            onMedicationQtChange={(name, qt) => {
              setSchedule((prev) => ({
                ...prev,
                [title]: prev[title].map((med) => (med.name === name ? { name, qt } : med)),
              }));
            }}
            onDeleteMedicine={(name) => {
              setSchedule((prev) => ({
                ...prev,
                [title]: prev[title].filter((med) => med.name !== name),
              }));
            }}
          />
        ))}
        <AddScheduleCard
          onAdd={(t) => {
            const key = timeToStr(t.hour, t.min);
            setSchedule((prev) => (prev[key] !== undefined ? prev : { ...prev, [key]: [] }));
          }}
        />
      </Flex>
    </AddNewTimetableModal.Provider>
  );
}

interface AddScheduleCardProps {
  onAdd: ({ hour, min }: { hour: number; min: number }) => void;
}

interface ScheduleCardProps {
  title: string;
  medicines: MedicineMeta[];
  onAddMedication: (med: string) => void;
  onMedicationQtChange: (med: string, newQt: number) => void;
  onDeleteMedicine: (med: string) => void;
  onDelete: () => void;
}

const ScheduleCard = ({
  title,
  medicines,
  onAddMedication,
  onDeleteMedicine,
  onMedicationQtChange,
  onDelete,
}: ScheduleCardProps) => {
  const [med, setMed] = useState<string>('');
  const [medicineList, setMedicineList] = useState<string[]>([]);

  const fetchMedicines = useCallback(
    debounce((query: string) => {
      fetch(`/api/medicines?q=${query}`)
        .then((res) => res.json())
        .then(({ medicines }) => {
          setMedicineList((medicines as { name: string }[]).map(({ name }) => name));
        });
    }, 500),
    []
  );

  useEffect(() => {
    if (med.trim() !== '') {
      fetchMedicines(med);
    } else {
      setMedicineList([]);
    }
  }, [med, fetchMedicines]);

  return (
    <Card
      px={3}
      py={3}
      minW={'72'}
      _hover={{
        shadow: 'lg',
        bg: 'gray.50',
      }}
      bg={'white'}
      border={'0.1px solid'}
      borderColor={'gray.500'}
      alignItems={'center'}
      flexDir={'column'}
      position="relative"
    >
      <Flex w={'100%'}>
        <Text>Timing - {title}</Text>
        <Button size={'xs'} colorScheme="red" ml={'auto'} onClick={onDelete}>
          <DeleteIcon />
        </Button>
      </Flex>
      <Divider my={3} />

      <Flex flexDir={'column'} w={'100%'} overflowY={'auto'} gap={1} my={2}>
        {medicines.map((medicine, idx) => (
          <MedicineCard
            medicine={medicine}
            key={idx}
            onQtChange={(newQt: number) => {
              onMedicationQtChange(medicine.name, newQt);
            }}
            onDelete={() => onDeleteMedicine(medicine.name)}
          />
        ))}
      </Flex>
      <HStack mt={'auto'} position="relative" w="100%">
        <Input placeholder="add" variant={'solid'} onChange={(e) => setMed(e.target.value)} value={med} />
        <Button
          size={'sm'}
          variant={'red'}
          onClick={() => {
            if (med.trim() === '') return;
            onAddMedication(med);
            setMed('');
          }}
        >
          <AddIcon />
        </Button>
        {medicineList.length > 0 && (
          <Box
            position="absolute"
            bottom="100%"
            left={-2}
            right={0}
            bg="white"
            border="1px solid"
            borderColor="gray.300"
            mt={1}
            zIndex={10}
            boxShadow="md"
            borderRadius="md"
            maxHeight="200px"
            overflowY="auto"
            width="100%"
          >
            <List>
              {medicineList.map((medicine, idx) => (
                <ListItem
                  key={idx}
                  p={2}
                  _hover={{ bg: 'gray.100', cursor: 'pointer' }}
                  onClick={() => {
                    onAddMedication(medicine);
                    setMed('');
                    setMedicineList([]);
                  }}
                >
                  {medicine}
                </ListItem>
              ))}
            </List>
          </Box>
        )}
      </HStack>
    </Card>
  );
};

interface MedicineCardProps {
  medicine: MedicineMeta;
  onQtChange: (newQt: number) => void;
  onDelete: () => void;
}

const MedicineCard = ({ medicine, onQtChange, onDelete }: MedicineCardProps) => {
  const [qt, setQt] = useState<number>(medicine.qt);
  useEffect(() => onQtChange(isNaN(qt) ? 1 : qt), [qt]);

  return (
    <Flex
      px={2}
      gap={2}
      border={'1px solid'}
      borderColor={'gray.100'}
      py={2}
      alignItems={'center'}
      w={'100%'}
      bg={'white'}
      rounded={'md'}
    >
      <Text fontSize={'sm'}>{medicine.name}</Text>
      <NumberInput
        size="xs"
        maxW={16}
        defaultValue={qt}
        min={1}
        ml={'auto'}
        colorScheme="blue"
        onChange={(_, v) => setQt(v)}
      >
        <NumberInputField />
        <NumberInputStepper>
          <NumberIncrementStepper />
          <NumberDecrementStepper />
        </NumberInputStepper>
      </NumberInput>
      <Button size={'xs'} colorScheme="red" onClick={onDelete}>
        <DeleteIcon />
      </Button>
    </Flex>
  );
};

const AddScheduleCard = ({ onAdd }: AddScheduleCardProps) => {
  const { onClose, onOpen } = AddNewTimetableModal.useModalState();
  const [time, setTime] = useState<{ hour: number; min: number }>({
    hour: 10,
    min: 10,
  });

  return (
    <>
      <Card
        px={3}
        py={3}
        minW={'52'}
        _hover={{
          cursor: 'pointer',
          shadow: 'lg',
          bg: 'gray.50',
        }}
        bg={'white'}
        border={'0.1px solid'}
        borderColor={'gray.500'}
        justifyContent={'center'}
        alignItems={'center'}
        flexDir={'column'}
        onClick={onOpen}
      >
        <AddIcon />
      </Card>
      <AddNewTimetableModal.Layout title="Add New Schedule">
        <Center>
          <HStack>
            <TimeInput
              label=""
              onChange={(hour, min) => {
                setTime({ hour, min });
              }}
              value="00:00"
            />
            <Button
              variant="red"
              onClick={() => {
                onAdd(time);
                onClose();
              }}
            >
              Add
            </Button>
          </HStack>
        </Center>
      </AddNewTimetableModal.Layout>
    </>
  );
};

import { healthCareProviders } from '@/lib/constants/healthCareProviders';
import {
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  HStack,
  Input,
} from '@chakra-ui/react';
import { Select } from 'chakra-react-select';
import { useCallback, useEffect, useReducer, useState } from 'react';
import TimeInput from '../design/TimeInput';
import InputState from '@/types/InputState';
import HealthProviderDoc from '@/lib/firebase/types/HealthProviderDoc';
import {
  collection,
  doc,
  getCountFromServer,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import { firebaseAuth, firestore } from '@/lib/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import invariant from 'invariant';
import { healthProvidersCol } from '@/lib/firebase/collections';
import timeToStr from '@/lib/util/timeToStr';
import HospitalResType from '@/types/HospitalResType';

interface FormState
  extends Record<
    keyof Pick<HealthProviderDoc, 'city' | 'name' | 'wait_time' | 'start_time' | 'end_time' | 'fee'>,
    InputState
  > {}

interface CreateNewHealthProviderFormProps {
  onClose: () => void;
  initialState?: HealthProviderDoc;
  update?: boolean;
}

const initialFormState: FormState = {
  city: { value: '', error: '' },
  name: { value: '', error: '' },
  wait_time: { value: '15', error: '' },
  start_time: { value: '08:00', error: '' },
  end_time: { value: '00:00', error: '' },
  fee: { value: '0', error: '' },
};

const formReducer = (state: FormState, action: { type: keyof FormState; payload: string }): FormState => {
  switch (action.type) {
    case 'city':
      return {
        ...state,
        city: {
          value: action.payload,
          error: action.payload ? '' : `${action.type} is required`,
        },
        name: {
          value: '',
          error: '',
        },
      };
    case 'name':
      return {
        ...state,
        [action.type]: {
          value: action.payload,
          error: action.payload ? '' : `${action.type} is required`,
        },
      };
    case 'wait_time': {
      const waitTimeValue = parseInt(action.payload);
      const waitTimeError = waitTimeValue >= 5 ? '' : 'Wait time must be up to 5';
      return {
        ...state,
        wait_time: {
          value: action.payload,
          error: waitTimeError,
        },
      };
    }
    case 'fee': {
      const fee = parseInt(action.payload);
      const waitTimeError = fee >= 0 ? '' : 'Invalid Fee missing';
      return {
        ...state,
        fee: {
          value: action.payload,
          error: waitTimeError,
        },
      };
    }
    case 'start_time':
      return {
        ...state,
        start_time: {
          value: action.payload,
          error: action.payload ? '' : 'Start time is required',
        },
      };
    case 'end_time': {
      // print diff of hours
      // if (endTime < startTime) {
      //   endTime.setDate(endTime.getDate() + 1); // Increment the end time to the next day
      // }

      return {
        ...state,
        end_time: {
          value: action.payload,
          error: action.payload ? '' : 'Start time is required',
        },
      };
    }
    default:
      return initialFormState;
  }
};

export default function CreateNewHealthProviderForm({
  update,
  onClose,
  initialState,
}: CreateNewHealthProviderFormProps) {
  const [formState, dispatch] = useReducer(formReducer, initialFormState);
  const [user] = useAuthState(firebaseAuth);
  const [loading, setLoading] = useState(false);

  const [loadingHospitals, setLoadingHospitals] = useState<boolean>(false);
  const [hospitals, setHospitals] = useState<HospitalResType[]>([]);

  useEffect(() => {
    const url = `/api/hospitals?city=${formState.city.value}`;
    setLoadingHospitals(true);
    fetch(url)
      .then((res) => res.json())
      .then(({ hospitals }) => {
        setLoadingHospitals(false);
        setHospitals(hospitals as HospitalResType[]);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [formState]);

  useEffect(() => {
    if (!initialState) return;
    dispatch({ type: 'city', payload: initialState.city });
    dispatch({ type: 'name', payload: initialState.name });
    dispatch({ type: 'wait_time', payload: initialState.wait_time.toString() });
    dispatch({ type: 'start_time', payload: initialState.start_time });
    dispatch({ type: 'end_time', payload: initialState.end_time });
    dispatch({ type: 'fee', payload: initialState.fee + '' });
  }, [initialState]);

  const isValid = useCallback(() => {
    Object.keys(formState).forEach((field) => {
      dispatch({ type: field as keyof FormState, payload: formState[field as keyof typeof formState].value });
    });

    // Check if any form field has an error
    const immediateUpdatedState = Object.keys(formState).map((field) => {
      return formReducer(formState, {
        type: field as keyof FormState,
        payload: formState[field as keyof typeof formState].value,
      });
    });

    const hasError = immediateUpdatedState
      .map((ele) => Object.values(ele).some((field: any) => field.error !== ''))
      .some((ele) => ele);

    return !hasError;
  }, [formState]);

  const handleUpdate = useCallback(() => {
    if (!isValid()) return;

    // construct form data only from pick fields
    const docData: Partial<HealthProviderDoc> = {
      city: formState.city.value,
      name: formState.name.value,
      wait_time: parseInt(formState.wait_time.value),
      start_time: formState.start_time.value,
      end_time: formState.end_time.value,
    };

    async function updateHealthProvider() {
      invariant(user, 'User must be logged in to update a health provider');

      setLoading(true);
      const docRef = doc(collection(firestore, healthProvidersCol), initialState?.uid);
      await updateDoc(docRef, docData);
      setLoading(false);
      onClose();
    }

    updateHealthProvider();
  }, [formState]);

  const handleSubmit = useCallback(() => {
    if (!isValid()) return;

    const docRef = doc(collection(firestore, healthProvidersCol));

    invariant(user, 'User must be logged in to create a health provider');

    const hospital = hospitals.reduce((acc, curr) => {
      if (formState.name.value === curr.name) return curr;
      return acc;
    });

    // construct form data
    const docData: HealthProviderDoc = {
      city: formState.city.value,
      name: formState.name.value,
      wait_time: parseInt(formState.wait_time.value),
      start_time: formState.start_time.value,
      end_time: formState.end_time.value,
      about: hospital.about || 'This hospital is a great place to get treated.',
      created_at: serverTimestamp(),
      updated_at: serverTimestamp(),
      doctor_id: user.uid,
      googleLocLink: hospital.googleLocLink,
      helpLine: hospital.helpLine,
      location: hospital.location,
      monday: [],
      tuesday: [],
      wednesday: [],
      thursday: [],
      friday: [],
      saturday: [],
      sunday: [],
      uid: docRef.id,
      fee: parseInt(formState.fee.value),
      avatar: hospital.avatar,
    };

    async function createHealthProvider() {
      invariant(user, 'User must be logged in to create a health provider');

      setLoading(true);
      const count = (
        await getCountFromServer(
          query(
            collection(firestore, healthProvidersCol),
            where('city', '==', formState.city.value),
            where('name', '==', formState.name.value),
            where('doctor_id', '==', user.uid)
          )
        )
      ).data().count;
      if (count == 0) await setDoc(docRef, docData);
      setLoading(false);
      dispatch({ type: '', payload: '' } as any);
    }

    createHealthProvider();
  }, [formState, isValid]);

  return (
    <Flex
      as={'form'}
      w={'full'}
      flexDir={'column'}
      gap={4}
      onSubmit={(e) => {
        e.preventDefault();
        update ? handleUpdate() : handleSubmit();
      }}
    >
      <FormControl isInvalid={formState.city.error !== ''}>
        <FormLabel>City</FormLabel>
        <Select
          variant={'filled'}
          value={{ label: formState.city.value, value: formState.city.value }}
          onChange={(val) => dispatch({ type: 'city', payload: val?.value || '' })}
          options={Object.keys(healthCareProviders).map((city) => ({ label: city, value: city }))}
          isDisabled={update}
        />
        <FormErrorMessage>{formState.city.error}</FormErrorMessage>
      </FormControl>
      <FormControl isInvalid={formState.name.error !== ''}>
        <FormLabel>Health Provider</FormLabel>
        <Select
          isLoading={loadingHospitals}
          variant={'filled'}
          value={{ label: formState.name.value, value: formState.name.value }}
          options={hospitals.map((provider) => ({
            label: provider.name,
            value: provider.name,
          }))}
          onChange={(val) => dispatch({ type: 'name', payload: val?.value || '' })}
          isDisabled={!formState.city.value || update}
        />
        <FormErrorMessage>{formState.name.error}</FormErrorMessage>
      </FormControl>
      <FormControl isInvalid={formState.fee.error !== ''}>
        <FormLabel>Appointment Fee</FormLabel>
        <Input
          placeholder="Enter Appointment Fee"
          defaultValue={0}
          variant={'filled'}
          type="number"
          onChange={(e) => dispatch({ type: 'fee', payload: e.target.value })}
          value={formState.fee.value}
        />
        <FormErrorMessage>{formState.fee.error}</FormErrorMessage>
      </FormControl>
      <FormControl isInvalid={formState.wait_time.error !== ''}>
        <FormLabel>Wait time</FormLabel>
        <Input
          placeholder="Enter Wait Time"
          defaultValue={15}
          value={formState.wait_time.value}
          variant={'filled'}
          type="number"
          onChange={(e) => dispatch({ type: 'wait_time', payload: e.target.value })}
        />
        <FormHelperText>Wait time in minutes for each patient</FormHelperText>
        <FormErrorMessage>{formState.wait_time.error}</FormErrorMessage>
      </FormControl>
      <HStack>
        <FormControl isInvalid={formState.start_time.error !== ''}>
          <TimeInput
            label="Start Time"
            value={formState.start_time.value}
            onChange={(hour, minute) =>
              dispatch({
                type: 'start_time',
                payload: timeToStr(hour, minute),
              })
            }
          />
          <FormErrorMessage>{formState.start_time.error}</FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={formState.end_time.error !== ''}>
          <TimeInput
            label="End Time"
            value={formState.end_time.value}
            onChange={(hour, minute) =>
              dispatch({
                type: 'end_time',
                payload: timeToStr(hour, minute),
              })
            }
          />
          <FormErrorMessage>{formState.end_time.error}</FormErrorMessage>
        </FormControl>
      </HStack>
      <HStack ml={'auto'} mt={4}>
        <Button variant={'gray'} onClick={onClose}>
          Cancel
        </Button>
        <Button colorScheme="blue" type="submit" isLoading={loading}>
          {update ? 'Update' : 'Create'}
        </Button>
      </HStack>
    </Flex>
  );
}

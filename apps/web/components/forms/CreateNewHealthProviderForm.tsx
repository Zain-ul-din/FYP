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

interface FormState
  extends Record<
    keyof Pick<HealthProviderDoc, 'city' | 'name' | 'wait_time' | 'start_time' | 'end_time'>,
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

  useEffect(() => {
    if (!initialState) return;
    dispatch({ type: 'city', payload: initialState.city });
    dispatch({ type: 'name', payload: initialState.name });
    dispatch({ type: 'wait_time', payload: initialState.wait_time.toString() });
    dispatch({ type: 'start_time', payload: initialState.start_time });
    dispatch({ type: 'end_time', payload: initialState.end_time });
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

    console.log('update');
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

    // construct form data
    const docData: HealthProviderDoc = {
      city: formState.city.value,
      name: formState.name.value,
      wait_time: parseInt(formState.wait_time.value),
      start_time: formState.start_time.value,
      end_time: formState.end_time.value,
      about: 'This hospital is a great place to get treated.',
      created_at: serverTimestamp(),
      updated_at: serverTimestamp(),
      doctor_id: user.uid,
      googleLocLink: 'https://google.com',
      helpLine: '042-1234567',
      location: 'Lahore Gurberg',
      monday: [],
      tuesday: [],
      wednesday: [],
      thursday: [],
      friday: [],
      saturday: [],
      sunday: [],
      uid: docRef.id,
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
          variant={'filled'}
          value={{ label: formState.name.value, value: formState.name.value }}
          options={(healthCareProviders[formState.city.value as keyof typeof healthCareProviders] || []).map(
            (provider) => ({
              label: provider.name,
              value: provider.name,
            })
          )}
          onChange={(val) => dispatch({ type: 'name', payload: val?.value || '' })}
          isDisabled={!formState.city.value || update}
        />
        <FormErrorMessage>{formState.name.error}</FormErrorMessage>
      </FormControl>
      <FormControl isInvalid={formState.wait_time.error !== ''}>
        <FormLabel>Wait time</FormLabel>
        <Input
          placeholder="Enter Wait Time"
          defaultValue={15}
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
                payload: `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`,
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
                payload: `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`,
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

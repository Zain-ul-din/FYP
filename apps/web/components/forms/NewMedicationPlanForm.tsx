import { firebaseAuth, firestore } from '@/lib/firebase';
import { medicationsCol } from '@/lib/firebase/collections';
import MedicationDoc from '@/lib/firebase/types/MedicationDoc';
import InputState from '@/types/InputState';
import {
  Button,
  Flex,
  FlexProps,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  HStack,
  Input,
  Textarea,
} from '@chakra-ui/react';
import { collection, doc, getCountFromServer, query, serverTimestamp, setDoc, where } from 'firebase/firestore';
import { useCallback, useReducer, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';

interface FormState extends Record<keyof Pick<MedicationDoc, 'name' | 'duration' | 'description'>, InputState> {}

interface NewMedicationPlanFormProps extends FlexProps {
  onClose: () => void;
  update?: boolean;
}

const initialFormState: FormState = {
  duration: {
    value: '1',
    error: '',
  },
  description: {
    value: '',
    error: '',
  },
  name: {
    value: '',
    error: '',
  },
};

function formReducer(state: FormState, action: { type: keyof FormState; payload: string }): FormState {
  switch (action.type) {
    case 'name': {
      return {
        ...state,
        name: {
          value: action.payload,
          error: action.payload.trim().length < 2 ? 'Name is too short' : '',
        },
      };
    }
    case 'description': {
      return {
        ...state,
        description: {
          value: action.payload,
          error: action.payload.trim().length < 2 ? 'Description is too short' : '',
        },
      };
    }
    case 'duration': {
      let duration = parseInt(action.payload);
      return {
        ...state,
        duration: {
          value: action.payload,
          error: isNaN(duration)
            ? 'Invalid Duration'
            : duration <= 0
              ? 'Duration is too short'
              : duration > 365
                ? 'Duration is too long'
                : '',
        },
      };
    }
  }

  return initialFormState;
}

export default function NewMedicationPlanForm({ onClose, update }: NewMedicationPlanFormProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [formState, dispatch] = useReducer(formReducer, initialFormState);
  const [user] = useAuthState(firebaseAuth);

  const handleSubmit = useCallback(async () => {
    let hasErr = Object.entries(formState).some((entry) => {
      const [key, val] = entry as [keyof FormState, { value: string }];
      return formReducer(formState, { type: key, payload: val.value })[key].error !== '';
    });

    Object.entries(formState).forEach((entry) => {
      const [key, val] = entry as [keyof FormState, { value: string }];
      dispatch({ type: key, payload: val.value });
    });

    if (hasErr || user == null) return;
    const docId = `${formState.name.value}_${user.uid}`;

    // lets upload to firestore
    const docData: MedicationDoc = {
      uid: docId,
      name: formState.name.value,
      description: formState.description.value,
      duration: parseInt(formState.duration.value),
      created_at: serverTimestamp(),
      updated_at: serverTimestamp(),
      days: {},
      variants: {},
      doctor_id: user.uid,
      subscribers: [],
    };

    const colRef = collection(firestore, medicationsCol);
    const docRef = doc(colRef, docId);

    const count = (await getCountFromServer(query(colRef, where('uid', '==', docId)))).data().count;

    if (count == 0) {
      setLoading(true);
      await setDoc(docRef, docData);
      setLoading(false);
    }

    dispatch({ type: '' as keyof FormState, payload: '' });
  }, [formState]);

  return (
    <Flex
      as={'form'}
      w={'full'}
      flexDir={'column'}
      gap={4}
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
    >
      <FormControl isInvalid={formState.name.error !== ''}>
        <FormLabel>Medication Plan Name</FormLabel>
        <Input
          value={formState.name.value}
          variant={'filled'}
          placeholder="Enter medication plan name"
          onChange={(e) => {
            dispatch({ type: 'name', payload: e.target.value });
          }}
        />
        <FormErrorMessage>{formState.name.error}</FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={formState.duration.error !== ''}>
        <FormLabel>Medication Plan Duration</FormLabel>
        <Input
          variant={'filled'}
          value={formState.duration.value}
          type="number"
          placeholder="Enter medication duration"
          onChange={(e) => {
            dispatch({ type: 'duration', payload: e.target.value });
          }}
        />
        <FormHelperText>Medication Plan Duration in days</FormHelperText>
        <FormErrorMessage>{formState.duration.error}</FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={formState.description.error !== ''}>
        <FormLabel>Description</FormLabel>
        <Textarea
          value={formState.description.value}
          placeholder="Enter short description"
          onChange={(e) => {
            dispatch({ type: 'description', payload: e.target.value });
          }}
        />
        <FormErrorMessage>{formState.description.error}</FormErrorMessage>
      </FormControl>

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

'use client';

import createDoctorAction from '@/actions/createDoctorAction';
import conditions from '@/lib/constants/conditions';
import doctor_titles from '@/lib/constants/doctor_titles';
import specializations from '@/lib/constants/specializations';
import InputState from '@/types/InputState';
import {
  Button,
  Center,
  Flex,
  FlexProps,
  FormControl,
  FormErrorMessage,
  Heading,
  FormLabel,
  HStack,
  Input,
  Avatar,
} from '@chakra-ui/react';
import { Select } from 'chakra-react-select';
import { FormEvent, useReducer, useCallback, useState, useRef, useTransition } from 'react';
import Logo from './icons/Logo';
import UploadIcon from './icons/UploadIcon';
import { firebaseAuth, uploadBlobToFirestore } from '@/lib/firebase';
import useLoggedInUser from '@/lib/hooks/useLoggedInUser';
import { useAuthState } from 'react-firebase-hooks/auth';

interface JoinAsDoctorFormProps extends FlexProps {}

interface FormState {
  title: InputState;
  fullName: InputState;
  yearOfExperience: InputState;
  primarySpecialization: InputState;
  secondarySpecializations: InputState;
  conditionsTreated: InputState<string[]>;
  pmdcRegistrationNumber: InputState;
  photoURL: InputState;
}

const initialFormState: FormState = {
  title: { value: '', error: '' },
  fullName: { value: '', error: '' },
  yearOfExperience: { value: '', error: '' },
  primarySpecialization: { value: '', error: '' },
  secondarySpecializations: { value: '', error: '' },
  conditionsTreated: { value: [], error: '' },
  pmdcRegistrationNumber: { value: '', error: '' },
  photoURL: { value: '', error: '' },
};

const formReducer = (
  state: FormState,
  action: {
    type: keyof FormState;
    payload: string | string[];
  }
) => {
  switch (action.type) {
    case 'photoURL': {
      return {
        ...state,
        photoURL: {
          value: action.payload as string,
          error: action.payload.length !== 0 ? '' : 'Upload your profile picture',
        },
      };
    }
    case 'title':
      return {
        ...state,
        title: {
          value: action.payload as string,
          error: action.payload ? '' : 'Title is required',
        },
      };
    case 'fullName':
      return {
        ...state,
        fullName: {
          value: action.payload as string,
          error: action.payload
            ? action.payload.length >= 3
              ? ''
              : `Add ${3 - action.payload.length} more characters to full name`
            : 'Full name is required',
        },
      };
    case 'yearOfExperience':
      return {
        ...state,
        yearOfExperience: {
          value: action.payload as string,
          error: !isNaN(parseInt(action.payload as string))
            ? parseInt(action.payload as string) >= 0
              ? ''
              : 'Invalid Year of experience'
            : 'Year of experience is required',
        },
      };
    case 'primarySpecialization':
      return {
        ...state,
        conditionsTreated: {
          value: [],
          error: '',
        },
        primarySpecialization: {
          value: action.payload as string,
          error: action.payload ? '' : 'Primary specialization is required',
        },
      };
    case 'secondarySpecializations':
      return {
        ...state,
        conditionsTreated: {
          value: [],
          error: '',
        },
        secondarySpecializations: {
          value: action.payload as string,
          error: action.payload ? '' : 'Secondary specialization is required',
        },
      };
    case 'conditionsTreated':
      console.log('ct: ', action.payload);
      return {
        ...state,
        conditionsTreated: {
          value: action.payload as string[],
          error: action.payload.length > 0 ? '' : 'Conditions treated is required',
        },
      };
    case 'pmdcRegistrationNumber':
      const pmdcRegistrationNumber = action.payload as string;
      let error = '';

      if (!pmdcRegistrationNumber) {
        error = 'PMDC registration number is required';
      } else {
        console.log('pmdcRegistrationNumber: ', pmdcRegistrationNumber.length);
        if (pmdcRegistrationNumber.length < 10) {
          error = `PMDC registration number should be 10 characters long. add more ${10 - pmdcRegistrationNumber.length} more characters to go`;
        } else if (!/^\d+$/.test(pmdcRegistrationNumber)) {
          error = 'PMDC registration number should contain only digits';
        }
      }

      return {
        ...state,
        pmdcRegistrationNumber: {
          value: pmdcRegistrationNumber.length > 10 ? state.pmdcRegistrationNumber.value : (action.payload as string),
          error,
        },
      };
  }
};

export default function JoinAsDoctor({ ...rest }: JoinAsDoctorFormProps) {
  const [formState, dispatch] = useReducer(formReducer, initialFormState);
  const [loading, setLoading] = useState<boolean>(false);

  const submitForm = useCallback(
    async (e: FormEvent<HTMLDivElement>) => {
      e.preventDefault();
      let hasError = false;
      Object.entries(formState).forEach(([key, value]) => {
        const _key = key as keyof FormState;
        const updatedState = formReducer(formState, { type: _key, payload: value.value });
        if (updatedState[_key].error) hasError = true;
        dispatch({ type: _key, payload: value.value });
      });

      if (hasError) return;

      setLoading(true);
      await createDoctorAction({
        title: formState.title.value,
        fullName: formState.fullName.value,
        yearOfExperience: formState.yearOfExperience.value,
        primarySpecialization: formState.primarySpecialization.value,
        secondarySpecializations: formState.secondarySpecializations.value,
        conditionsTreated: formState.conditionsTreated.value,
        pmdcRegistrationNumber: formState.pmdcRegistrationNumber.value,
        photoURL: formState.photoURL.value,
      });
      setLoading(false);
    },
    [formState]
  );

  const hiddenInputRef = useRef<HTMLInputElement>(null);
  const handleUpload = useCallback(() => {
    if (!hiddenInputRef.current) return;
    hiddenInputRef.current.click();
  }, []);

  const [loggedInUser] = useAuthState(firebaseAuth);
  const [uploadingFile, startUploading] = useTransition();

  return (
    <>
      <Center pt={6}>
        <HStack>
          <Logo width={50} height={50} />
          <Heading fontSize={'3xl'}>Join Dokto</Heading>
        </HStack>
      </Center>
      <Flex
        flexWrap={'wrap'}
        px={2}
        py={8}
        mx={'auto'}
        maxW={'800px'}
        gap={4}
        {...rest}
        as={'form'}
        onSubmit={submitForm}
      >
        <FormControl isInvalid={formState.photoURL.error !== ''}>
          <FormLabel>Upload Photo</FormLabel>

          <Flex justifyContent={'center'} gap={6} alignItems={'center'}>
            <Avatar src={formState.photoURL.value} my={2} size={'xl'} />
            <Input placeholder="" value={formState.photoURL.value} variant={'outline'} readOnly display={'none'} />
            <Button variant={'red'} size={'md'} isLoading={uploadingFile} fontSize={'sm'} onClick={handleUpload}>
              <UploadIcon fontSize={'1rem'} /> Upload
            </Button>
            <input
              type="file"
              ref={hiddenInputRef}
              accept="image/*"
              onChange={(event) => {
                if (!event.target.files || !loggedInUser) return;
                const file = event.target.files[0];
                const blob = new Blob([file], { type: file.type });
                startUploading(async () => {
                  const photoURL = await uploadBlobToFirestore(blob, loggedInUser.uid);
                  dispatch({
                    payload: photoURL,
                    type: 'photoURL',
                  });
                });
              }}
              style={{
                display: 'none',
              }}
            />
          </Flex>
          <FormErrorMessage>{formState.photoURL.error}</FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={formState.title.error !== ''}>
          <FormLabel>Title</FormLabel>
          <Select
            variant={'filled'}
            options={doctor_titles.map((title) => ({ label: title, value: title }))}
            onChange={(value) => dispatch({ type: 'title', payload: value?.value || '' })}
            value={{ value: formState.title.value, label: formState.title.value }}
          />
          <FormErrorMessage>{formState.title.error}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={formState.fullName.error !== ''}>
          <FormLabel>Full Name</FormLabel>
          <Input
            variant={'filled'}
            placeholder="Enter full name"
            onChange={(e) => {
              dispatch({ type: 'fullName', payload: e.target.value });
            }}
            value={formState.fullName.value}
          />
          <FormErrorMessage>{formState.fullName.error}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={formState.yearOfExperience.error !== ''}>
          <FormLabel>Year of Experience</FormLabel>
          <Input
            variant={'filled'}
            placeholder="Enter year of experience"
            type="number"
            onChange={(e) => {
              dispatch({ type: 'yearOfExperience', payload: e.target.value });
            }}
            value={formState.yearOfExperience.value}
          />

          <FormErrorMessage>{formState.yearOfExperience.error}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={formState.primarySpecialization.error !== ''}>
          <FormLabel>Primary Specialization</FormLabel>
          <Select
            variant={'filled'}
            onChange={(value) => dispatch({ type: 'primarySpecialization', payload: value?.value || '' })}
            options={specializations.map((specialization) => ({ label: specialization, value: specialization }))}
            value={{ value: formState.primarySpecialization.value, label: formState.primarySpecialization.value }}
          />
          <FormErrorMessage>{formState.primarySpecialization.error}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={formState.secondarySpecializations.error !== ''}>
          <FormLabel>Secondary Specialization</FormLabel>
          <Select
            variant={'filled'}
            options={specializations
              .map((specialization) => ({ label: specialization, value: specialization }))
              .filter((specialization) => specialization.value !== formState.primarySpecialization.value)}
            onChange={(value) => dispatch({ type: 'secondarySpecializations', payload: value?.value || '' })}
            value={{ value: formState.secondarySpecializations.value, label: formState.secondarySpecializations.value }}
          />
          <FormErrorMessage>{formState.secondarySpecializations.error}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={formState.conditionsTreated.error !== ''}>
          <FormLabel>Conditions Treated</FormLabel>
          <Select
            variant={'filled'}
            options={[formState.primarySpecialization, formState.secondarySpecializations]
              .map((a) => a.value)
              .map((specialization) =>
                (conditions[specialization as keyof typeof conditions] || []).map((condition) => ({
                  label: condition,
                  value: condition,
                }))
              )
              .flat()}
            isMulti
            isDisabled={!formState.primarySpecialization.value && !formState.secondarySpecializations.value}
            onChange={(value) => dispatch({ type: 'conditionsTreated', payload: value?.map((v) => v.value) || [] })}
            value={formState.conditionsTreated.value.map((condition) => ({ label: condition, value: condition }))}
          />
          <FormErrorMessage>{formState.conditionsTreated.error}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={formState.pmdcRegistrationNumber.error !== ''}>
          <FormLabel>PMDC registration number</FormLabel>
          <Input
            variant={'filled'}
            placeholder="Enter PMDC registration number"
            type="number"
            onChange={(e) => {
              dispatch({ type: 'pmdcRegistrationNumber', payload: e.target.value });
            }}
            minLength={10}
            maxLength={10}
            value={formState.pmdcRegistrationNumber.value}
          />
          <FormErrorMessage>{formState.pmdcRegistrationNumber.error}</FormErrorMessage>
        </FormControl>

        <Button type="submit" my={5} variant={'red'} colorScheme="blue" mx={'auto'} isLoading={loading}>
          Submit
        </Button>
      </Flex>
    </>
  );
}

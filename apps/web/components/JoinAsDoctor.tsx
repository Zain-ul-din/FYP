'use client';

import createDoctorAction from '@/actions/createDoctorAction';
import conditions from '@/lib/constants/conditions';
import doctor_titles from '@/lib/constants/doctor_titles';
import specializations from '@/lib/constants/specializations';
import { Button, Flex, FlexProps, FormControl, FormErrorMessage, FormLabel, Input } from '@chakra-ui/react';
import { Select } from 'chakra-react-select';
import { FormEvent, useReducer, useCallback } from 'react';

interface JoinAsDoctorFormProps extends FlexProps {}

type InputState<T = string> = {
  value: T;
  error: string;
};

interface FormState {
  title: InputState;
  fullName: InputState;
  yearOfExperience: InputState;
  primarySpecialization: InputState;
  secondarySpecializations: InputState;
  conditionsTreated: InputState<string[]>;
  pmdcRegistrationNumber: InputState;
}

const initialFormState: FormState = {
  title: { value: '', error: '' },
  fullName: { value: '', error: '' },
  yearOfExperience: { value: '', error: '' },
  primarySpecialization: { value: '', error: '' },
  secondarySpecializations: { value: '', error: '' },
  conditionsTreated: { value: [], error: '' },
  pmdcRegistrationNumber: { value: '', error: '' },
};

const formReducer = (
  state: FormState,
  action: {
    type: keyof FormState;
    payload: string | string[];
  }
) => {
  switch (action.type) {
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

  const submitForm = useCallback(
    (e: FormEvent<HTMLDivElement>) => {
      e.preventDefault();
      Object.entries(formState).forEach(([key, value]) => {
        dispatch({ type: key as keyof FormState, payload: value.value });
      });

      createDoctorAction({
        title: formState.title.value,
        fullName: formState.fullName.value,
        yearOfExperience: formState.yearOfExperience.value,
        primarySpecialization: formState.primarySpecialization.value,
        secondarySpecializations: formState.secondarySpecializations.value,
        conditionsTreated: formState.conditionsTreated.value,
        pmdcRegistrationNumber: formState.pmdcRegistrationNumber.value,
      });
    },
    [formState]
  );

  return (
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
      <FormControl isInvalid={formState.title.error !== ''}>
        <FormLabel>Title</FormLabel>
        <Select
          options={doctor_titles.map((title) => ({ label: title, value: title }))}
          onChange={(value) => dispatch({ type: 'title', payload: value?.value || '' })}
          value={{ value: formState.title.value, label: formState.title.value }}
        />
        <FormErrorMessage>{formState.title.error}</FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={formState.fullName.error !== ''}>
        <FormLabel>Full Name</FormLabel>
        <Input
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
          onChange={(value) => dispatch({ type: 'primarySpecialization', payload: value?.value || '' })}
          options={specializations.map((specialization) => ({ label: specialization, value: specialization }))}
          value={{ value: formState.primarySpecialization.value, label: formState.primarySpecialization.value }}
        />
        <FormErrorMessage>{formState.primarySpecialization.error}</FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={formState.secondarySpecializations.error !== ''}>
        <FormLabel>Secondary Specialization</FormLabel>
        <Select
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

      <Button type="submit" colorScheme="blue" mx={'auto'}>
        Submit
      </Button>
    </Flex>
  );
}

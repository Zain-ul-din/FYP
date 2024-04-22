import { healthCareProviders } from '@/lib/constants/healthCareProviders';
import { Button, Flex, FormControl, FormHelperText, FormLabel, HStack, Input } from '@chakra-ui/react';
import { Select } from 'chakra-react-select';
import { useState } from 'react';

interface CreateNewHealthProviderFormProps {
  onClose: () => void;
}

export default function CreateNewHealthProviderForm({ onClose }: CreateNewHealthProviderFormProps) {
  const [city, setCity] = useState('');

  return (
    <Flex w={'full'} flexDir={'column'} gap={4}>
      <FormControl>
        <FormLabel>City</FormLabel>
        <Select
          variant={'filled'}
          onChange={(val) => setCity(val?.value || '')}
          options={Object.keys(healthCareProviders).map((city) => ({ label: city, value: city }))}
        />
      </FormControl>
      <FormControl>
        <FormLabel>Health Provider</FormLabel>
        <Select
          variant={'filled'}
          options={(healthCareProviders[city as keyof typeof healthCareProviders] || []).map((provider) => ({
            label: provider.name,
            value: provider.name,
          }))}
          isDisabled={!city}
        />
      </FormControl>
      <FormControl>
        <FormLabel>Wait time</FormLabel>
        <Input placeholder="Enter Wait Time" defaultValue={15} variant={'filled'} type="number" />
        <FormHelperText>Wait time in minutes for each patient</FormHelperText>
      </FormControl>

      <HStack ml={'auto'} mt={4}>
        <Button variant={'gray'} onClick={onClose}>
          Cancel
        </Button>
        <Button colorScheme="blue">Create</Button>
      </HStack>
    </Flex>
  );
}

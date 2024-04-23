import { firestore } from '@/lib/firebase';
import { healthProvidersCol } from '@/lib/firebase/collections';
import HealthProviderDoc from '@/lib/firebase/types/HealthProviderDoc';
import useLoggedInUser from '@/lib/hooks/useLoggedInUser';
import { SearchIcon } from '@chakra-ui/icons';
import {
  Avatar,
  Box,
  Flex,
  FlexProps,
  HStack,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  Stack,
  Text,
} from '@chakra-ui/react';
import { collection, query, where } from 'firebase/firestore';
import Link from 'next/link';
import { useCollection } from 'react-firebase-hooks/firestore';

export default function HealthProviderList() {
  const loggedInUser = useLoggedInUser();

  const [healthProviders] = useCollection(
    query(collection(firestore, healthProvidersCol), where('doctor_id', '==', loggedInUser))
  );

  return (
    <Flex flexDir={'column'} gap={4}>
      <Box ml={'auto'}>
        <InputGroup color={'gray.500'}>
          <InputLeftElement top={'-4px'}>
            <SearchIcon fontSize={'sm'} />
          </InputLeftElement>
          <Input variant={'search'} placeholder="Search..." size={'sm'} rounded={'full'} />
        </InputGroup>
      </Box>
      {healthProviders?.docs.map((doc) => (
        <HealthProviderCard key={doc.id} healthProvider={doc.data() as HealthProviderDoc} />
      ))}
    </Flex>
  );
}

interface HealthProviderListProps extends FlexProps {
  healthProvider: HealthProviderDoc;
}

const HealthProviderCard = ({ healthProvider, ...rest }: HealthProviderListProps) => {
  return (
    <Link href={`/dashboard/hospitals/${healthProvider.uid}`}>
      <Flex
        bg={'white'}
        rounded={'md'}
        shadow={'sm'}
        p={4}
        cursor={'pointer'}
        _hover={{
          bg: 'gay.300',
          shadow: 'md',
        }}
        {...rest}
      >
        <HStack spacing={4}>
          <Avatar />
          <Stack spacing={0}>
            <Heading size={'md'}>{healthProvider.name}</Heading>
            <Text>{healthProvider.about}</Text>
          </Stack>
        </HStack>
      </Flex>
    </Link>
  );
};

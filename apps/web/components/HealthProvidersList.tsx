import { firestore } from '@/lib/firebase';
import { healthProvidersCol } from '@/lib/firebase/collections';
import HealthProviderDoc from '@/lib/firebase/types/HealthProviderDoc';
import useLoggedInUser from '@/lib/hooks/useLoggedInUser';
import { SearchIcon } from '@chakra-ui/icons';
import {
  Avatar,
  Box,
  Center,
  Flex,
  FlexProps,
  HStack,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  Spinner,
  Stack,
  Tag,
  Text,
} from '@chakra-ui/react';
import { collection, query, where } from 'firebase/firestore';
import Link from 'next/link';
import { useState } from 'react';
import { useCollection } from 'react-firebase-hooks/firestore';
import Loader from './shared/Loader';

export default function HealthProviderList() {
  const loggedInUser = useLoggedInUser();

  const [healthProviders, loading] = useCollection(
    query(collection(firestore, healthProvidersCol), where('doctor_id', '==', loggedInUser))
  );

  const [search, setSearch] = useState<string>('');

  if (loading) return <Loader />;

  return (
    <Flex flexDir={'column'} gap={2}>
      <Box ml={'auto'} py={4}>
        <InputGroup color={'gray.500'}>
          <InputLeftElement top={'-4px'}>
            <SearchIcon fontSize={'sm'} />
          </InputLeftElement>
          <Input
            variant={'search'}
            onChange={(e) => {
              setSearch(e.target.value.toLowerCase());
            }}
            placeholder="Search..."
            size={'sm'}
            value={search}
            rounded={'full'}
          />
        </InputGroup>
      </Box>
      {(healthProviders?.docs.map((d) => d.data()) as HealthProviderDoc[]).filter((d) =>
        d.name.toLowerCase().includes(search)
      ).length == 0 && (
        <>
          <Center py={12}>
            <Text>No Hospital Found!</Text>
          </Center>
        </>
      )}

      {(healthProviders?.docs.map((d) => d.data()) as HealthProviderDoc[])
        .filter((d) => d.name.toLowerCase().includes(search))
        .map((doc) => (
          <HealthProviderCard key={doc.uid} healthProvider={doc} />
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
        bg={'#ffff'}
        rounded={'md'}
        shadow={'xs'}
        p={4}
        cursor={'pointer'}
        border={'1px solid'}
        borderColor={'gray.200'}
        _hover={{
          bg: 'gay.300',
          shadow: 'sm',
        }}
        {...rest}
      >
        <HStack spacing={6}>
          <Avatar src={healthProvider.avatar} size={'lg'} />
          <Stack spacing={0}>
            <Heading size={'md'}>{healthProvider.name}</Heading>
            <Text color={'gray.600'} fontSize={'sm'}>
              {healthProvider.location}
            </Text>
            <Flex cursor={'text'}>
              <Tag textAlign={'center'} justifyContent={'center'} maxW={'sm'}>
                {healthProvider.helpLine.split('tel:')[1]}
              </Tag>
            </Flex>
          </Stack>
        </HStack>
      </Flex>
    </Link>
  );
};

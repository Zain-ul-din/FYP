import { firestore } from '@/lib/firebase';
import { healthProvidersCol } from '@/lib/firebase/collections';
import HealthProviderDoc from '@/lib/firebase/types/HealthProviderDoc';
import useLoggedInUser from '@/lib/hooks/useLoggedInUser';
import { Avatar, Flex, FlexProps, HStack, Heading, Stack, Text } from '@chakra-ui/react';
import { collection, query, where } from 'firebase/firestore';
import { useCollection } from 'react-firebase-hooks/firestore';

export default function HealthProviderList() {
  const loggedInUser = useLoggedInUser();

  const [healthProviders] = useCollection(
    query(collection(firestore, healthProvidersCol), where('doctor_id', '==', loggedInUser))
  );

  return (
    <Flex flexDir={'column'}>
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
    <Flex
      bg={'gray.50'}
      border={'1px solid'}
      borderColor={'gray.200'}
      rounded={'md'}
      p={4}
      cursor={'pointer'}
      _hover={{
        bg: 'gay.300',
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
  );
};

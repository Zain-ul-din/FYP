import { firestore } from '@/lib/firebase';
import { medicationsCol } from '@/lib/firebase/collections';
import MedicationDoc from '@/lib/firebase/types/MedicationDoc';
import useLoggedInUser from '@/lib/hooks/useLoggedInUser';
import { DeleteIcon, EditIcon, ExternalLinkIcon } from '@chakra-ui/icons';
import { Grid, Text, GridItem, Stack, Heading, Spinner, HStack, Button, Flex } from '@chakra-ui/react';
import { collection, query, where } from 'firebase/firestore';
import Link from 'next/link';
import { useCollection } from 'react-firebase-hooks/firestore';
import { FcClock } from 'react-icons/fc';
import Loader from '../shared/Loader';

export default function Medications() {
  const loggedInUser = useLoggedInUser();

  const [snapShot, loading] = useCollection(
    query(collection(firestore, medicationsCol), where('doctor_id', '==', loggedInUser))
  );

  if (!snapShot)
    return (
      <>
        <Loader />
      </>
    );

  const data = snapShot.docs.map((doc) => doc.data()) as Array<MedicationDoc>;

  return (
    <>
      <Heading>Medications</Heading>
      <Grid mt={4} gap={4} templateColumns={'repeat(4, 1fr)'}>
        {data.map((med, i) => (
          <MedicationCard key={i} model={med} />
        ))}
      </Grid>
    </>
  );
}

const MedicationCard = ({ model }: { model: MedicationDoc }) => {
  return (
    <GridItem p={4} py={6} rounded={'md'} border={'1px solid'} borderColor={'gray.300'} bg={'white'}>
      <Stack spacing={2}>
        <Heading noOfLines={2} fontSize={'lg'}>
          {model.name}
        </Heading>
        <Text fontSize={'sm'} color={'gray.800'} noOfLines={3}>
          {model.description}
        </Text>
        <HStack>
          <FcClock />
          <Text color={'gray.600'} fontSize={'xs'}>
            Duration:
            <b style={{ marginLeft: '0.3rem' }}>{model.duration} days</b>
          </Text>
        </HStack>
        <Flex w={'100%'} mt={4}>
          <HStack ml={'auto'}>
            <Button size={'sm'} colorScheme="red">
              <DeleteIcon />
            </Button>
            <Button size={'sm'} variant={'outline'}>
              <EditIcon />
            </Button>
            <Link href={`/dashboard/medication/${model.uid}`}>
              <Button variant={'red'} size={'sm'}>
                <ExternalLinkIcon />
              </Button>
            </Link>
          </HStack>
        </Flex>
      </Stack>
    </GridItem>
  );
};

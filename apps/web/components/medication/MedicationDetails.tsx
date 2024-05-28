'use client';
import { firestore } from '@/lib/firebase';
import { medicationsCol } from '@/lib/firebase/collections';
import MedicationDoc from '@/lib/firebase/types/MedicationDoc';
import { Card, Flex, Grid, GridItem, Heading, Spinner } from '@chakra-ui/react';
import { collection, query, where } from 'firebase/firestore';
import { useCollection } from 'react-firebase-hooks/firestore';

interface MedicationDetailsProps {
  uid: string;
}

export default function MedicationDetails({ uid }: MedicationDetailsProps) {
  const [snapShot, loading] = useCollection(query(collection(firestore, medicationsCol), where('uid', '==', uid)));

  if (!snapShot) return <Spinner />;

  const medication = snapShot.docs.map((d) => d.data())[0] as MedicationDoc;

  return (
    <Flex flexDir={'column'}>
      <Heading>
        {medication.name} Duration: {medication.duration}
      </Heading>

      <Grid gridTemplateColumns={'repeat(5, 1fr)'} gap={4}>
        {new Array(medication.duration).fill('💊').map((day, idx) => {
          return (
            <GridItem key={idx}>
              <Card p={8}>{idx + 1}</Card>
            </GridItem>
          );
        })}
      </Grid>
    </Flex>
  );
}

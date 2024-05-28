'use client';
import MedicationDoc from '@/lib/firebase/types/MedicationDoc';
import { Card, Flex, Grid, GridItem } from '@chakra-ui/react';

interface MedicationDetailsProps {
  medication: MedicationDoc;
}

export default function MedicationDetails({ medication }: MedicationDetailsProps) {
  return (
    <Flex flexDir={'column'}>
      <Grid gridTemplateColumns={'repeat(5, 1fr)'} gap={4}>
        {new Array(medication.duration).fill('💊').map((day, idx) => {
          return (
            <GridItem key={idx}>
              <Card p={6}>{idx + 1}</Card>
            </GridItem>
          );
        })}
      </Grid>
    </Flex>
  );
}

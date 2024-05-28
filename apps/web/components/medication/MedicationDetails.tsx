'use client';
import { firestore } from '@/lib/firebase';
import { medicationsCol } from '@/lib/firebase/collections';
import MedicationDoc from '@/lib/firebase/types/MedicationDoc';
import { AddIcon } from '@chakra-ui/icons';
import {
  Card,
  CardBody,
  Text,
  Flex,
  Grid,
  GridItem,
  Heading,
  Stack,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react';
import { collection, doc, updateDoc } from 'firebase/firestore';
import { useCallback, useEffect, useMemo, useState } from 'react';

interface MedicationDetailsProps {
  medication: MedicationDoc;
}

export default function MedicationDetails({ medication }: MedicationDetailsProps) {
  const [days, setDays] = useState<typeof medication.days>(medication.days);
  const variants = useMemo(() => Object.keys(medication.variants), [medication]);

  useEffect(() => {}, [medication]);

  const saveProgress = useCallback(
    async (updatedState: typeof days) => {
      const filteredDays = Object.fromEntries(
        Object.entries(updatedState).filter(([_, v]) => v in medication.variants)
      );
      setDays(filteredDays);
      await updateDoc(doc(collection(firestore, medicationsCol), medication.uid), {
        days: filteredDays,
      });
    },
    [medication]
  );

  useEffect(() => {
    saveProgress(medication.days);
  }, []);

  return (
    <Flex flexDir={'column'}>
      <Grid gridTemplateColumns={'repeat(5, 1fr)'} gap={2}>
        {new Array(medication.duration).fill('🌞').map((_, idx) => {
          const day = idx + 1 + '';
          const isMissing = !(day in days);
          return (
            <GridItem key={idx}>
              <Card border={'1px solid'} borderColor={'gray.300'}>
                <CardBody>
                  <Stack spacing={3}>
                    <Flex w={'full'} alignItems={'center'}>
                      <Heading size={'md'}>Day - {day}</Heading>
                      <Menu>
                        <MenuButton ml={'auto'}>
                          <Button variant={'ghost'} ml={'auto'} size={'sm'}>
                            <AddIcon />
                          </Button>
                        </MenuButton>
                        <MenuList>
                          {variants.map((variant, idx) => {
                            return (
                              <MenuItem
                                key={idx}
                                fontSize={'sm'}
                                onClick={() => {
                                  setDays((days) => ({
                                    ...days,
                                    [day]: variant,
                                  }));
                                  saveProgress({
                                    ...days,
                                    [day]: variant,
                                  });
                                }}
                              >
                                {variant}
                              </MenuItem>
                            );
                          })}
                        </MenuList>
                      </Menu>
                    </Flex>
                    <Text fontSize={'sm'} color={isMissing ? 'red.500' : 'gray.700'}>
                      <b>Variant: </b>
                      {isMissing ? <>Missing</> : <>{days[day]}</>}
                    </Text>
                  </Stack>
                </CardBody>
              </Card>
            </GridItem>
          );
        })}
      </Grid>
    </Flex>
  );
}

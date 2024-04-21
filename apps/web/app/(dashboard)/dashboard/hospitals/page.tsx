'use client';
import DashboardHeader from '@/components/shared/DashboardHeader';
import { Flex } from '@chakra-ui/react';

export default function Hospitals() {
  return (
    <>
      <DashboardHeader description="Manage Hospitals and Clinics">Hospitals & Clinics</DashboardHeader>
      <Flex w={'100%'} h={'100%'} p={3} flexDir={'column'} gap={'0.5rem'} pb={5}>
        Hello World
      </Flex>
    </>
  );
}

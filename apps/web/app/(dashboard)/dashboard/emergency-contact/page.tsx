'use client';
import EmergencyContactForm from '@/components/forms/EmergencyContactForm';
import FluentSupportIcon from '@/components/icons/FluentSupportIcon';
import DashboardHeader from '@/components/shared/DashboardHeader';
import RoutesBreadcrumb from '@/components/shared/RoutesBreadcrumb';
import { Flex, Heading, Stack, Text } from '@chakra-ui/react';

export default function Emergency() {
  return (
    <>
      <DashboardHeader>Customer Support</DashboardHeader>
      <RoutesBreadcrumb path="Customer Support" icon={(props) => <FluentSupportIcon {...props} />}></RoutesBreadcrumb>
      <Flex w={'full'} px={2} flexDir={'column'} m={2} gap={3}>
        <Flex w={'full'} p={4} bg={'white'} flexDir={'column'} gap={6} rounded={'md'}>
          <Stack>
            <Heading fontSize={'2xl'}>Emergency Contact Number</Heading>
            <Text color={'gray.200'} fontWeight={'light'} maxW={'80%'} fontSize={'xs'}>
              If any user has an emergency to contact the team he will contact on this number
            </Text>
          </Stack>
          <EmergencyContactForm
            maxW={'min(100%, 25rem)'}
            onSubmit={(e) => {
              e.preventDefault();
            }}
          />
        </Flex>
      </Flex>
    </>
  );
}

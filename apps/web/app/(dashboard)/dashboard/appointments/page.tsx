'use client';

import Appointments from '@/components/appointments/Appointments';
import UserIcon from '@/components/icons/UserIcon';
import DashboardHeader from '@/components/shared/DashboardHeader';
import PaginationTable from '@/components/shared/PaginationTable';
import RoutesBreadcrumb from '@/components/shared/RoutesBreadcrumb';
import { Checkbox, Flex, Th, Thead, Tr } from '@chakra-ui/react';

export default function AppointmentsPage() {
  return (
    <>
      <DashboardHeader description="Manage Pending Appointments">Appointments</DashboardHeader>
      <RoutesBreadcrumb
        path="Appointments/"
        icon={(props) => (
          <UserIcon
            style={{
              transform: 'translateY(-2px)',
            }}
            {...props}
          />
        )}
      ></RoutesBreadcrumb>
      <Flex w={'full'} flexDir={'column'} p={2} py={0}>
        <Appointments />
      </Flex>
    </>
  );
}

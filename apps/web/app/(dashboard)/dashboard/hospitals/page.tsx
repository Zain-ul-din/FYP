'use client';
import createModal from '@/components/design/createModal';
import CreateNewHealthProviderForm from '@/components/forms/CreateNewHealthProviderForm';
import OrganizationIcon from '@/components/icons/OrganizationIcon';
import DashboardHeader from '@/components/shared/DashboardHeader';
import RoutesBreadcrumb from '@/components/shared/RoutesBreadcrumb';
import { ROUTES } from '@/lib/constants/dashboard_routes';
import { Button, Flex } from '@chakra-ui/react';
import Link from 'next/link';

const CreateHealthProviderModal = createModal();

export default function Hospitals() {
  return (
    <CreateHealthProviderModal.Provider>
      <DashboardHeader description="Manage Hospitals and Clinics">Hospitals & Clinics</DashboardHeader>
      <RoutesBreadcrumb
        path="Hospitals & Clinic"
        icon={(props) => (
          <OrganizationIcon
            color="#0070f3"
            style={{
              transform: 'translateY(-2px)',
            }}
            {...props}
          />
        )}
      >
        <AddNewHealthProviderButton />
      </RoutesBreadcrumb>
      <Flex w={'100%'} h={'100%'} p={3} flexDir={'column'} gap={'0.5rem'} pb={5}>
        Hello World
      </Flex>
    </CreateHealthProviderModal.Provider>
  );
}

const AddNewHealthProviderButton = () => {
  const { onClose, onOpen } = CreateHealthProviderModal.useModalState();
  return (
    <>
      <Button colorScheme="blue" fontWeight={'normal'} size={'sm'} ml={'auto'} onClick={onOpen}>
        + Add New
      </Button>
      <CreateHealthProviderModal.Layout title="Add New Health Provider">
        <CreateNewHealthProviderForm onClose={onClose} />
      </CreateHealthProviderModal.Layout>
    </>
  );
};

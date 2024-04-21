'use client';
import OrganizationIcon from '@/components/icons/OrganizationIcon';
import DashboardHeader from '@/components/shared/DashboardHeader';
import RoutesBreadcrumb from '@/components/shared/RoutesBreadcrumb';
import { ROUTES } from '@/lib/constants/dashboard_routes';
import { Button, Flex } from '@chakra-ui/react';
import Link from 'next/link';

export default function Hospitals() {
  return (
    <>
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
        <Link
          href={ROUTES['Hospitals']}
          style={{
            marginLeft: 'auto',
          }}
        >
          <Button colorScheme="blue" fontWeight={'normal'} size={'sm'}>
            + Add New
          </Button>
        </Link>
      </RoutesBreadcrumb>
      <Flex w={'100%'} h={'100%'} p={3} flexDir={'column'} gap={'0.5rem'} pb={5}>
        Hello World
      </Flex>
    </>
  );
}

/*
  <button className="shadow-[0_4px_14px_0_rgb(0,118,255,39%)] hover:shadow-[0_6px_20px_rgba(0,118,255,23%)] hover:bg-[rgba(0,118,255,0.9)] px-8 py-2 bg-[#0070f3] rounded-md text-white font-light transition duration-200 ease-linear">
  Next.js Blue
</button>
*/

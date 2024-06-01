'use client';

import UserIcon from "@/components/icons/UserIcon";
import DashboardHeader from "@/components/shared/DashboardHeader";
import Loader from "@/components/shared/Loader";
import RoutesBreadcrumb from "@/components/shared/RoutesBreadcrumb";
import { firestore } from "@/lib/firebase";
import { appointmentsCol, healthProvidersCol } from "@/lib/firebase/collections";
import AppointmentDoc, { AppointmentStatus } from "@/lib/firebase/types/AppointmentDoc";
import HealthProviderDoc from "@/lib/firebase/types/HealthProviderDoc";
import timeStampToDate from "@/lib/util/timeStampToDate";
import { Flex, Grid, GridItem, GridItemProps, HStack, Heading, Stack, useMediaQuery, Text, Avatar, Button, Tag, Menu, MenuList, MenuItem, MenuButton } from "@chakra-ui/react";
import { collection, doc, documentId, query, serverTimestamp, updateDoc, where } from "firebase/firestore";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { useCollection } from "react-firebase-hooks/firestore";

const defaultGridProps = {
  colSpan: 5,
  leftColSpan: 3,
  rightColSpan: 2,
};

export default function SlugUrl({ params: { slug } }: { params: { slug: string } }) {

  const [snapShot] = useCollection(query(collection(firestore, appointmentsCol), where(
    documentId(), '==',
    slug
  )))
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isMdScreen] = useMediaQuery('(max-width: 750px)');
  const [gridProps, setGridProps] = useState(defaultGridProps);
    
  const onWindowResize = useCallback(() => {
    if (!containerRef.current) return;
    const containerWidth = containerRef.current.clientWidth;
    if (containerWidth <= 750) setGridProps({ colSpan: 1, leftColSpan: 1, rightColSpan: 1 });
    else if (containerWidth <= 1000) setGridProps({ colSpan: 4, leftColSpan: 2, rightColSpan: 2 });
    else setGridProps(defaultGridProps);
  }, [containerRef]);

  if(!snapShot) return <Loader />;
  
  const appointmentDetails = snapShot.docs.map(d => ({ uid: d.id, ...(d.data()) }) )[0] as AppointmentDoc

  return <>
    <DashboardHeader>Appointment Details</DashboardHeader>
    <RoutesBreadcrumb
          icon={(props) => (
            <UserIcon
              {...props}
              style={{
                minWidth: '20px',
                minHeight: '20px',
                transform: 'translateY(-2px)',
                marginLeft: '0.3rem',
              }}
              color="red"
            />
          )}
          path={`Bookings > ${appointmentDetails.uid}`}
          whiteSpace={'nowrap'}
          overflowX={'auto'}
          gap={4}

        >
        </RoutesBreadcrumb>
        <Flex flexDir={'column'} gap={2} p={isMdScreen ? 1 : 4} pt={0} maxW={'1200px'}ref={containerRef}>
        <Grid
            mt={2}
            gridTemplateColumns={`repeat(${gridProps.colSpan}, 1fr)`}
            gridTemplateRows={'repeat(1, 1fr)'}
            p={3}
            pb={0}
            gap={2}
          >
            <OrganizationDetails 
              bg={'white'} p={3} rounded={'md'} colSpan={gridProps.leftColSpan} 
              model={appointmentDetails}
            />

            <GridItem colSpan={gridProps.rightColSpan}>
              <Grid templateRows={'repeat(1, 1fr)'} h={'full'} w={'full'} gap={2}>
                <AppointmentDetails bg={'white'} p={3} rounded={'md'} model={appointmentDetails} />
                <PatientDetails bg={'white'} p={3} rounded={'md'} model={appointmentDetails}/>
              </Grid>
            </GridItem>
          </Grid>
        </Flex>
  </>
}

interface PatientDetailsProps extends GridItemProps {
  model: AppointmentDoc;
} 


const AppointmentDetails = ({ model, ...rest }: PatientDetailsProps) => {

  const updateStatus = useCallback((doc_id: string, status: AppointmentStatus) => {
    updateDoc(doc(collection(firestore, appointmentsCol), doc_id), {
      status,
      updated_at: serverTimestamp(),
    } as Pick<AppointmentDoc, 'status'>);
  }, []);

  return (
    <GridItem {...rest}>
      <Stack spacing={6}>
        <Flex alignItems={'center'}>
          <Heading fontSize={'xl'}>Appointment Details</Heading>
          <Menu size={'sm'}>
                  <MenuButton ml={'auto'}>
                    <Button variant={'outline'}>...</Button>
                  </MenuButton>
                  <MenuList maxW={'sm'}>
                    <MenuItem
                      fontSize={'sm'}
                      py={3}
                      onClick={() => {
                        updateStatus(model.uid as string, 'approved');
                      }}
                    >
                      ✔ Approve
                    </MenuItem>
                    <MenuItem
                      fontSize={'sm'}
                      py={3}
                      onClick={() => {
                        updateStatus(model.uid as string, 'pending');
                      }}
                    >
                      🕑 Pending
                    </MenuItem>
                    <MenuItem
                      fontSize={'sm'}
                      py={3}
                      onClick={() => {
                        updateStatus(model.uid as string, 'rejected');
                      }}
                    >
                      ❌ Reject
                    </MenuItem>
                  </MenuList>
                </Menu>
        </Flex>
        <Stack spacing={4}>
          <HStack spacing={8}>
            <HStack spacing={4}>
              <Text fontSize={'sm'} color={'gray.500'}>
                Date
              </Text>
              <Text fontSize={'sm'}>{timeStampToDate(model.appointment_date as any).toDateString()}</Text>
            </HStack>
            <HStack spacing={4}>
              <Text fontSize={'sm'} color={'gray.500'}>
                Slot
              </Text>
              <Text fontSize={'sm'}>{model.slot}</Text>
            </HStack>
          </HStack>
          <HStack spacing={8}>
            <HStack spacing={4}>
              <Text fontSize={'sm'} color={'gray.500'}>
                WeekDay
              </Text>
              <Text fontSize={'sm'}>{model.week_day}</Text>
            </HStack>
            <HStack spacing={4}>
              <Text fontSize={'sm'} color={'gray.500'}>
                Status
              </Text>
              <Tag
                  colorScheme={(() => {
                    switch (model.status.toLocaleLowerCase()) {
                      case 'pending':
                        return 'yellow';
                      case 'approved':
                        return 'green';
                      case 'rejected':
                        return 'red';
                    }
                  })()}
                  size={'sm'}
                >
                  {model.status}
                </Tag>
              {/* <Text fontSize={'sm'}>{model.status}</Text> */}
            </HStack>
          </HStack>
        </Stack>
      </Stack>
    </GridItem>
  );
};

const PatientDetails = ({ model, ...rest }: PatientDetailsProps) => {
  return (
    <GridItem {...rest}>
      <Stack spacing={6}>
        <Heading fontSize={'xl'}>Patient</Heading>
        <Stack spacing={4}>
          <HStack spacing={8}>
            <HStack spacing={4}>
              <Text fontSize={'sm'} color={'gray.500'}>
                Patient Name
              </Text>
              <Text fontSize={'sm'}>{model.patient_name}</Text>
            </HStack>
            <HStack spacing={4}>
              <Text fontSize={'sm'} color={'gray.500'}>
                Acc Owner
              </Text>
              <Text fontSize={'sm'}>{model.acc_display_name}</Text>
            </HStack>
          </HStack>
          <HStack spacing={8}>
            <HStack spacing={4}>
              <Text fontSize={'sm'} color={'gray.500'}>
                Contact No
              </Text>
              <Text fontSize={'sm'}>{model.patient_phone_no}</Text>
            </HStack>
            <HStack spacing={4}>
              <Text fontSize={'sm'} color={'gray.500'}>
                Age
              </Text>
              <Text fontSize={'sm'}>{model.patient_age}</Text>
            </HStack>
          </HStack>
          <Stack >
            <Button fontSize={'sm'} variant={'red'}>Start Chat</Button>
          </Stack>
        </Stack>
      </Stack>
    </GridItem>
  );
};

interface OrgProps extends GridItemProps {
  model: AppointmentDoc
}

const OrganizationDetails = ({ model, ...rest }: OrgProps) => {

  const [snapShot] = useCollection(query(collection(firestore, healthProvidersCol), where('uid', '==', model.health_provider_id)));
  
  const [healthProvider, setHealthProvider] = useState<HealthProviderDoc | null>(null);

  useEffect(()=> {
    if(snapShot == null) return;
    setHealthProvider(snapShot.docs.map(doc => doc.data())[0] as HealthProviderDoc);
  }, [snapShot]);

  return (
    <GridItem {...rest}>
      <Stack spacing={4}>
        <Heading fontSize={'xl'}>Health Provider</Heading>
        <Stack spacing={4}>
          <HStack spacing={6}>
            <Text fontSize={'sm'}><Avatar 
                src={model.health_provider_avatar}
                size={'xl'}
              /></Text>
          </HStack>
          <HStack spacing={6}>
            <Text fontSize={'sm'} color={'gray.500'}>
              Health Provider Name
            </Text>
            <Text fontSize={'sm'}>{model.health_provider_name}</Text>
          </HStack>
          <HStack spacing={6}>
            <Text fontSize={'sm'} color={'gray.500'}>
              Location
            </Text>
            <Text fontSize={'sm'}>{model.health_provider_location}</Text>
          </HStack>
          <HStack spacing={6}>
            <Text fontSize={'sm'} color={'gray.500'}>
              City
            </Text>
            <Text fontSize={'sm'}>{healthProvider?.city}</Text>
          </HStack>
          <HStack spacing={6}>
            <Text fontSize={'sm'} color={'gray.500'}>
              Help Line
            </Text>
            <Text fontSize={'sm'}>{healthProvider?.helpLine}</Text>
          </HStack>
          <HStack spacing={6}>
            <Text fontSize={'sm'} color={'gray.500'}>
              Details
            </Text>
            <Text fontSize={'sm'}>
              <Link href={`/dashboard/hospitals/${model.health_provider_id}`}>
                <Button size={'sm'} variant={'red'} fontWeight={'light'}>View All Details</Button>
              </Link>
            </Text>
          </HStack>
        </Stack>
      </Stack>
    </GridItem>
  );
};
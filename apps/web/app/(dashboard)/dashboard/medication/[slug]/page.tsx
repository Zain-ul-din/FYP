'use client';
import MedicineIcon from '@/components/icons/MedicineIcon';
import { SingleDaySchedule } from '@/components/medication';
import MedicationDetails from '@/components/medication/MedicationDetails';
import DashboardHeader from '@/components/shared/DashboardHeader';
import FilterBtn from '@/components/shared/FilterBtn';
import LabelButton from '@/components/shared/LabelButton';
import Loader from '@/components/shared/Loader';
import RoutesBreadcrumb from '@/components/shared/RoutesBreadcrumb';
import { firestore } from '@/lib/firebase';
import { medicationsCol } from '@/lib/firebase/collections';
import MedicationDoc from '@/lib/firebase/types/MedicationDoc';
import { Flex, Heading, Spinner } from '@chakra-ui/react';
import { collection, doc, query, updateDoc, where } from 'firebase/firestore';
import { useState } from 'react';
import { useCollection } from 'react-firebase-hooks/firestore';

export default function Page({ params: { slug } }: { params: { slug: string } }) {
  const [activeState, setActiveState] = useState<'days' | 'variants'>('days');

  const decodedSlug = decodeURI(slug);
  const [snapShot, loading] = useCollection(
    query(collection(firestore, medicationsCol), where('uid', '==', decodedSlug))
  );

  const [selectedVariant, setSelectedVariant] = useState<string>('');

  if (!snapShot || loading) return <Loader />;

  const medication = snapShot.docs.map((d) => d.data())[0] as MedicationDoc;

  return (
    <>
      <DashboardHeader description="Manage medication reminders For your patients">
        Medication Reminders
      </DashboardHeader>
      <RoutesBreadcrumb
        path="Medication"
        icon={(props) => (
          <MedicineIcon
            fill="#0070f3"
            fontSize={'1.2rem'}
            style={{
              transform: 'translateY(-2px)',
            }}
            {...props}
          />
        )}
      >
        <FilterBtn
          ml={'auto'}
          createNewOpt={async (opt) => {
            updateDoc(doc(collection(firestore, medicationsCol), decodedSlug), {
              [`variants.${opt}`]: {},
            });
          }}
          onFilterChange={(opt) => {
            setSelectedVariant(opt);
            setActiveState('variants');
          }}
        >
          {Object.keys(medication.variants)}
        </FilterBtn>
      </RoutesBreadcrumb>
      <Flex w={'full'} h={'full'} flexDir={'column'} py={0} px={3} gap={3}>
        <Flex py={2} gap={2}>
          <LabelButton
            count={medication.duration}
            active={activeState == 'days'}
            onClick={() => setActiveState('days')}
          >
            Days Schedule
          </LabelButton>
          <LabelButton count={Object.keys(medication.variants).length} active={activeState == 'variants'}>
            Variants
          </LabelButton>
        </Flex>
        <Flex alignItems={'center'}>
          <Heading fontSize={'xl'}>
            {(() => {
              switch (activeState) {
                case 'days':
                  return `Days Schedule (${medication.duration})`;
                case 'variants':
                  return `${selectedVariant.toUpperCase()} - (${Object.keys(medication.variants).length})`;
              }
              return '';
            })()}
          </Heading>
        </Flex>
        <>
          {(() => {
            switch (activeState) {
              case 'days':
                return <MedicationDetails medication={medication} />;
              case 'variants':
                return (
                  <SingleDaySchedule
                    onDelete={() => {
                      setActiveState('days');
                    }}
                    initialState={medication.variants[selectedVariant] || {}}
                    doc_id={decodedSlug}
                    variant_id={selectedVariant}
                  />
                );
              default:
                return '🙀';
            }
          })()}
        </>
      </Flex>
    </>
  );
}

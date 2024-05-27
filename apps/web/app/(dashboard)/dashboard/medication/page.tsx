'use client';
import createModal from '@/components/design/createModal';
import NewMedicationPlanForm from '@/components/forms/NewMedicationPlanForm';
import OrganizationIcon from '@/components/icons/OrganizationIcon';
import { SingleDaySchedule } from '@/components/medication';
import DashboardHeader from '@/components/shared/DashboardHeader';
import RoutesBreadcrumb from '@/components/shared/RoutesBreadcrumb';
import { Button, Flex } from '@chakra-ui/react';

const NewMedicationPlanProviderModal = createModal();

export default function Page() {
  return (
    <NewMedicationPlanProviderModal.Provider>
      <DashboardHeader description="Manage medication reminders For your patients">
        Medication Reminders
      </DashboardHeader>
      <RoutesBreadcrumb
        path="Medication"
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
        <AddNewMedicationPanButton />
      </RoutesBreadcrumb>
      <Flex w={'100%'} h={'100%'} p={3} flexDir={'column'} gap={'0.5rem'} pb={5}>
        <SingleDaySchedule />
        {/* <DaysTimeLine days={30} /> */}
      </Flex>
    </NewMedicationPlanProviderModal.Provider>
  );
}

const AddNewMedicationPanButton = () => {
  const { onClose, onOpen } = NewMedicationPlanProviderModal.useModalState();
  return (
    <>
      <Button colorScheme="blue" fontWeight={'normal'} size={'sm'} ml={'auto'} onClick={onOpen}>
        + Add New
      </Button>
      <NewMedicationPlanProviderModal.Layout title="Add New Health Provider">
        <NewMedicationPlanForm onClose={onClose} />
      </NewMedicationPlanProviderModal.Layout>
    </>
  );
};

// export default function Page() {
//   const [prompt, setPrompt] = useState<string>('');
//   const [loading, setLoading] = useState<boolean>(false);
//   const [aiResponse, setAIResponse] = useState<string>('');

//   const generateMedicineList = useCallback(async () => {
//     console.log(prompt);
//     if (prompt.trim() == '') return;
//     setLoading(true);
//     const response = await askGemini(`${GENERATE_MEDICINE_LIST_PROMPT}`);
//     setAIResponse(response);
//     setLoading(false);
//   }, []);

//   return (
//     <>
//       <DashboardHeader description="Manage medication reminders For your patients">
//         Medication Reminders
//       </DashboardHeader>
//       <Flex w={'100%'} h={'100%'} p={3} flexDir={'column'} gap={'0.5rem'} pb={5}>
//         <Text>Give instruction to our AI Model to Generate Medicines</Text>
//         <Textarea placeholder="Enter your prompt here" value={prompt} onChange={(e) => setPrompt(e.target.value)} />
//         <Box ml={'auto'}>
//           <Button variant={'red'} isLoading={loading} onClick={generateMedicineList}>
//             Generate
//           </Button>
//         </Box>
//         <Text>Ai Response: {aiResponse}</Text>
//       </Flex>
//     </>
//   );
// }

/*
  TODO:
    - ask gemini for medications
    - construct json out of it
    - display AI generated medication on UI
    - Allow doctor to create single day variant
    - Allow doctor to apply to each day 
    - polish UI
*/

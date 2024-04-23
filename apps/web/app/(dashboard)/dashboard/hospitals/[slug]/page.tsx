'use client';
import AppointmentTimetable from '@/components/AppointmentTimetable';
import SaveBtn from '@/components/forms/shared/SaveBtn';
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Flex,
} from '@chakra-ui/react';

export default function Page() {
  // days of week
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <Flex flexDir={'column'}>
      <h1>Health Providers</h1>
      <Accordion allowMultiple>
        {days.map((day, i) => (
          <AccordionItem key={i}>
            <h2>
              <AccordionButton _expanded={{ bg: 'var(--red-grad)', color: 'white' }}>
                <Box as="span" flex="1" textAlign="left">
                  {day} timetable
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4} bg={'white'}>
              <AppointmentTimetable start_time="8:00" end_time="15:00" waitTime={15} day={day} />
              <Flex>
                <SaveBtn size={'sm'} ml={'auto'}>
                  Save
                </SaveBtn>
              </Flex>
            </AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>
    </Flex>
  );
}

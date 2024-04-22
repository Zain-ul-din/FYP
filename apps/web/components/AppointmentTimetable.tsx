import { useState } from 'react';
import { Flex, Card } from '@chakra-ui/react';

interface TimeSlot {
  time: string;
}

export default function AppointmentTimetable() {
  const waitTime: number = 15; // Wait time in minutes
  const startTime: number = 8 * 60; // Start time in minutes (e.g., 8:00 AM)
  const endTime: number = 17 * 60; // End time in minutes (e.g., 5:00 PM)
  const [selectedSlots, setSelectedSlots] = useState<TimeSlot[]>([]);
  const slots: TimeSlot[] = [];

  const [selecting, setSelecting] = useState(false);

  // Generate time slots at regular intervals
  for (let time = startTime; time < endTime; time += waitTime) {
    const hours: number = Math.floor(time / 60);
    const minutes: number = time % 60;

    const formattedTime: string = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    slots.push({ time: formattedTime });
  }

  const handleSlotMouseDown = (slot: TimeSlot) => {
    setSelecting(true);
    if (selectedSlots.some((s) => s.time === slot.time)) {
      setSelectedSlots(selectedSlots.filter((s) => s.time !== slot.time));
    } else {
      setSelectedSlots([...selectedSlots, slot]);
    }
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleSlotMouseEnter = (slot: TimeSlot) => {
    if (!selecting) return;
    if (selectedSlots.some((s) => s.time === slot.time)) {
      setSelectedSlots(selectedSlots.filter((s) => s.time !== slot.time));
    } else {
      setSelectedSlots([...selectedSlots, slot]);
    }
  };

  const handleMouseUp = (e: Event) => {
    setSelecting(false);
    e.preventDefault();
    document.removeEventListener('mouseup', handleMouseUp);
  };

  return (
    <Flex flexWrap={'wrap'} gap={2} justifyContent={'space-around'}>
      {slots.map((slot) => (
        <Card
          p={2}
          key={slot.time}
          style={{
            backgroundColor: selectedSlots.some((s) => s.time === slot.time) ? 'lightblue' : 'transparent',
            cursor: 'pointer',
          }}
          onMouseDown={(e) => {
            e.preventDefault();
            handleSlotMouseDown(slot);
          }}
          onMouseEnter={(e) => {
            e.preventDefault();
            handleSlotMouseEnter(slot);
          }}
        >
          {slot.time}
        </Card>
      ))}
    </Flex>
  );
}

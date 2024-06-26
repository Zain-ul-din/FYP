'use client';
import { useState, useEffect } from 'react';
import { Flex, Card, Heading, Divider } from '@chakra-ui/react';
import timeToStr from '@/lib/util/timeToStr';

interface TimeSlot {
  time: string;
}

interface AppointmentTimetableProps {
  waitTime: number;
  start_time: string; // Updated to use start_time from props
  end_time: string; // Updated to use end_time from props
  day: string;
  onChange: (timeSlots: TimeSlot[]) => void;
  initialSlots: TimeSlot[];
}

export default function AppointmentTimetable({
  initialSlots,
  start_time,
  end_time,
  waitTime,
  onChange,
}: AppointmentTimetableProps) {
  const [selectedSlots, setSelectedSlots] = useState<TimeSlot[]>(initialSlots);
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [selecting, setSelecting] = useState(false);

  useEffect(() => {
    setSlots([]);
    // Convert start_time and end_time to minutes
    const startTimeInMinutes: number = convertTimeToMinutes(start_time);
    let endTimeInMinutes: number = convertTimeToMinutes(end_time);

    // If end_time is less than start_time, add 1 day
    if (endTimeInMinutes <= startTimeInMinutes) {
      endTimeInMinutes += 24 * 60; // Add 1 day (24 hours) in minutes
    }

    // Generate time slots at regular intervals
    for (let time = startTimeInMinutes; time < endTimeInMinutes; time += waitTime) {
      const hours: number = Math.floor(time / 60) % 24; // Handle overflow for multiple days
      const minutes: number = time % 60;
      const formattedTime: string = timeToStr(hours, minutes);
      setSlots((slot) => [...slot, { time: formattedTime }]);
    }
  }, [start_time, end_time, waitTime]);

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

  const convertTimeToMinutes = (time: string): number => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };

  useEffect(() => {
    onChange(selectedSlots);
  }, [selectedSlots]);

  return (
    <Flex flexWrap={'wrap'} gap={2} p={2}>
      {slots.map((slot) => (
        <Card
          p={2}
          key={slot.time}
          style={{
            background: selectedSlots.some((s) => s.time === slot.time) ? 'var(--blue-grad)' : 'transparent',
            color: selectedSlots.some((s) => s.time === slot.time) ? 'white' : 'black',
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

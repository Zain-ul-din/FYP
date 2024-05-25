import { useState } from 'react';
import { Flex } from '@chakra-ui/react';
import { Select } from 'chakra-react-select';

interface TimeInputProps {
  label: string;
  value: string;
  onChange: (hour: number, minute: number) => void;
}

const TimeInput: React.FC<TimeInputProps> = ({ label, value, onChange }) => {
  const [selectedTime, setSelectedTime] = useState<string>(value);

  // Generate time options
  const timeOptions: string[] = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const formattedHour: string = String(hour).padStart(2, '0');
      const formattedMinute: string = String(minute).padStart(2, '0');
      const formattedTime: string = `${formattedHour}:${formattedMinute}`;
      timeOptions.push(formattedTime);
    }
  }

  const handleTimeChange = (selectedTime: string) => {
    const [hour, minute] = selectedTime.split(':').map(Number);
    setSelectedTime(selectedTime);
    onChange(hour, minute);
  };

  return (
    <Flex direction="column" m={2}>
      <label>{label}</label>
      <Select
        value={{ label: selectedTime, value: selectedTime }}
        variant={'filled'}
        options={timeOptions.map((option) => ({ label: option, value: option }))}
        onChange={(val) => handleTimeChange(val?.value || '')}
      />
    </Flex>
  );
};

export default TimeInput;

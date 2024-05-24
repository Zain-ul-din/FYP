import { Card, CardProps, Flex, FlexProps } from '@chakra-ui/react';
import { useState } from 'react';

interface DaysTimeLineProps extends FlexProps {
  days: number;
}

export default function DaysTimeLine({ days, ...rest }: DaysTimeLineProps) {
  const [activeIdx, setActiveIdx] = useState<number>(-1);

  return (
    <Flex overflow={'scroll'} p={2} gap={3} {...rest}>
      {new Array(days).fill('').map((_, idx) => {
        return <DayCard key={idx} day={idx + 1 + ''} isActive={idx === activeIdx} onClick={() => setActiveIdx(idx)} />;
      })}
    </Flex>
  );
}

interface DayCardProps extends CardProps {
  day: string;
  isActive?: boolean;
}

const DayCard = ({ day, isActive, ...rest }: DayCardProps) => {
  return (
    <Card
      justifyContent={'center'}
      alignItems={'center'}
      minW={'16'}
      p={4}
      _hover={{
        cursor: 'pointer',
        shadow: 'lg',
      }}
      color={isActive ? 'white' : 'initial'}
      background={isActive ? 'var(--blue-grad)' : 'white'}
      {...rest}
    >
      {day}
    </Card>
  );
};

import { Button, ButtonProps, Flex } from '@chakra-ui/react';

interface LabelButtonProps extends ButtonProps {
  active?: boolean;
  count?: number;
}

export default function LabelButton({ active, count, children, ...rest }: LabelButtonProps) {
  return (
    <Button variant={active ? 'red' : 'white'} alignItems={'center'} color={active ? 'white' : 'black'} {...rest}>
      {children}
      {count && (
        <Flex
          minW={5}
          minH={5}
          maxH={5}
          maxW={5}
          boxSizing="border-box"
          rounded={'full'}
          bg={active ? 'white' : 'gray.900'}
          ml={1}
          style={{
            transform: 'translateY(-1px)',
          }}
          color={active ? 'black' : 'white'}
          justifyContent={'center'}
          alignItems={'center'}
          fontSize={'xx-small'}
          overflow={'hidden'}
          fontWeight={'semibold'}
        >
          {Math.abs(count) > 100 ? '1k+' : count}
        </Flex>
      )}
    </Button>
  );
}

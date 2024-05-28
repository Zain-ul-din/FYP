import {
  Button,
  Flex,
  FlexProps,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Table,
  TableContainer,
  Text,
} from '@chakra-ui/react';

interface PaginationTableProps extends FlexProps {}

export default function PaginationTable({ children, ...rest }: PaginationTableProps) {
  return (
    <Flex w={'full'} bg={'white'} rounded={'md'} flexDir={'column'} gap={4} {...rest}>
      <TableContainer shadow={'sm'}>
        <Table variant={'pagination'} size={'sm'} w={'100%'} overflow="auto" maxW="100%">
          {children}
        </Table>

        {/*<Flex py={3} px={2} borderTop={'1px solid'} borderColor={'gray.100'} alignItems={'center'} gap={4} w={'full'}>
          <Text fontSize={'sm'}>Showing 1 to 6 of 6 entries</Text>
          <Flex alignItems={'center'} ml={'auto'} gap={2}>
            <Flex alignItems={'center'} gap={2}>
              <Text color={'gray.500'}>Display</Text>
              <NumberInput size="sm" maxW={20} minW={20} defaultValue={10} min={1} rounded={'md'}>
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </Flex>
            <Flex gap={1}>
              <Button
                size={'sm'}
                colorScheme="gray"
                _hover={{
                  bg: 'gray.50',
                }}
              >
                {'<'}
              </Button>
              <Button size={'sm'} variant={'red'}>
                {'1'}
              </Button>
              <Button size={'sm'} variant={'red'}>
                {'2'}
              </Button>
              <Button
                size={'sm'}
                colorScheme="gray"
                _hover={{
                  bg: 'gray.50',
                }}
              >
                {'>'}
              </Button>
            </Flex>
          </Flex>
        </Flex> */}
      </TableContainer>
    </Flex>
  );
}

import { Button, Flex, FlexProps, Heading, Link, Table, TableContainer } from '@chakra-ui/react';

interface DataTableProps extends FlexProps {
  heading: string;
  variant?: 'simple' | 'simple-center';
  viewMoreLink: string;
}

export default function DataTable({ heading, viewMoreLink, variant, children, ...rest }: DataTableProps) {
  return (
    <Flex w={'100%'} bg={'white'} p={2} rounded={'md'} flexDir={'column'} gap={4} shadow={'sm'} {...rest}>
      <Flex w={'100%'} alignItems={'center'} p={2}>
        <Heading fontSize={'xl'}>{heading}</Heading>
        <Link href={viewMoreLink} style={{ marginLeft: 'auto' }}>
          <Button size={'sm'} ml={'auto'} colorScheme="blackAlpha" px={3} fontWeight={'light'} height={'1.7rem'}>
            View All
          </Button>
        </Link>
      </Flex>
      <TableContainer overflow={'auto'} w={'100%'}>
        <Table variant={variant || 'simple'} size={'sm'} w={'100%'} overflow="auto" maxW="100%">
          {children}
        </Table>
      </TableContainer>
    </Flex>
  );
}

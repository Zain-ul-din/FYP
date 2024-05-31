'use client';

import { Flex, Spinner } from '@chakra-ui/react';

export default function Loader() {
  return (
    <Flex
      w={'100%'}
      h={'100%'}
      justifyContent={'center'}
      alignItems={'center'}
      bg={'rgba(255,255,255,0.1)'}
      position={'absolute'}
      top={0}
      left={0}
      right={0}
      bottom={0}
    >
      <Spinner textAlign={'center'} alignSelf={'center'} />
    </Flex>
  );
}

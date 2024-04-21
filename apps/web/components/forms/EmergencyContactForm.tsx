'use client';
import { Box, Flex, FlexProps, FormControl, FormLabel, Input } from '@chakra-ui/react';
import SaveBtn from './shared/SaveBtn';

export default function EmergencyContactForm({ ...rest }: FlexProps) {
  return (
    <Flex as={'form'} flexDir={'column'} gap={4} {...rest}>
      <FormControl>
        <FormLabel>Contact Number</FormLabel>
        <Input placeholder="Contact Number" variant={'filled'} />
      </FormControl>

      <Box>
        <SaveBtn />
      </Box>
    </Flex>
  );
}

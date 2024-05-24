/* eslint-disable @next/next/no-img-element */
'use client';

import Logo from '@/components/icons/Logo';
import SignInWithGoogleProvider from '@/providers/SigninWithGoogleProvider';
import { Button, Flex, HStack, Heading, Stack, Text } from '@chakra-ui/react';
import { FcGoogle } from 'react-icons/fc';

export default function SignInPage() {
  return (
    <Flex background={'var(--blue-grad)'} width={'100%'} height={'100%'}>
      <Flex flexDir={'column'} h={'100%'} justifyContent={'center'} minW={'max(40%, 30rem)'}>
        <Flex p={'5rem'} py={2}>
          <HStack spacing={5}>
            <Logo width={80} height={80} color="white" />
            <Heading color={'white'}>Dokto</Heading>
          </HStack>
        </Flex>
        <Flex p={'5rem'} py={6} maxW={'35rem'} flexDir={'column'} gap={'8rem'}>
          <Stack spacing={1}>
            <Heading color={'white'} fontSize={'2xl'}>
              Join as Doctor
            </Heading>
            <Text color={'white'}>
              Join thousands of other doctors who are using our platform to take their practice to the next level.
            </Text>
            <Flex w={'full'} py={3}>
              <SignInWithGoogleProvider>
                {(login, [_, loading]) => (
                  <>
                    <Button variant="white" onClick={login} isLoading={loading} leftIcon={<FcGoogle />}>
                      Continue with Google
                    </Button>
                  </>
                )}
              </SignInWithGoogleProvider>
            </Flex>
          </Stack>
        </Flex>
      </Flex>
      <Flex bg={'white'} flex={1}>
        <img
          src="/images/hand-drawn-medical-seamless-pattern.avif"
          alt="pattern"
          width={'100%'}
          height={'100%'}
          style={{
            objectFit: 'fill',
          }}
        />
      </Flex>
    </Flex>
  );
}

/* eslint-disable @next/next/no-img-element */
'use client';

import Logo from '@/components/icons/Logo';
import SignInWithGoogleProvider from '@/providers/SigninWithGoogleProvider';
import { Button, Flex, HStack, Heading, Stack, Text, useMediaQuery } from '@chakra-ui/react';
import { FcGoogle } from 'react-icons/fc';
import { motion } from 'framer-motion';

export default function SignInPage() {
  const [isUnder600] = useMediaQuery('(max-width: 600px)');

  return (
    <Flex h={'100%'} w={'100%'} background={'var(--blue-grad)'}>
      <Flex width={'100%'} height={'100%'} maxW={'800px'} m={'0 auto'} position={'relative'}>
        <Flex background={'rgba(255,255,255,0)'} justifyContent={'center'} width={'100%'} height={'100%'}>
          <Flex flexDir={'column'} h={'100%'} justifyContent={'center'} minW={'max(40%, 30rem)'}>
            <Flex
              border={'1px solid white'}
              justifyContent={'center'}
              flexWrap={isUnder600 ? 'wrap' : 'initial'}
              alignItems={'center'}
              rounded={'md'}
            >
              <Flex p={'5rem'} py={2}>
                <HStack spacing={5}>
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 2, ease: 'easeInOut', repeat: Infinity, type: 'spring' }}
                  >
                    <Logo width={100} height={100} color="white" />
                  </motion.div>
                  <Heading color={'white'}>Dokto </Heading>
                </HStack>
              </Flex>
              <Flex p={'5rem'} py={6} maxW={'35rem'} flexDir={'column'} gap={'8rem'}>
                <Stack spacing={1}>
                  <Heading color={'white'} fontSize={'3xl'}>
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
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
}

'use client';

import {
  Avatar,
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Stack,
  Tag,
  Text,
  useDisclosure,
  useTimeout,
} from '@chakra-ui/react';
import { ChatIcon, HamburgerIcon, SearchIcon } from '@chakra-ui/icons';
import { useEffect, useRef, useState } from 'react';
import SendMsgIcon from './icons/SendMsgIcon';
import ChatMessage from './shared/ChatMessage';
import useWindowResize from '@/lib/hooks/useWindowResize';
import DashboardHeader from './shared/DashboardHeader';
import { useCollection } from 'react-firebase-hooks/firestore';
import { addDoc, collection, orderBy, query, serverTimestamp, where } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';
import { messagesCol } from '@/lib/firebase/collections';
import Loader from './shared/Loader';
import MessageDoc from '@/lib/firebase/types/MessageDoc';
import ChatMessageDoc from '@/lib/firebase/types/ChatMessageDoc';
import useLoggedInUser from '@/lib/hooks/useLoggedInUser';

export default function ChatMessages() {
  const containerRef = useRef<HTMLDivElement>(null);

  const [maxSideBarHeight, setMaxSideBarHeight] = useState<string>('100%');
  const [isMdContainer, setIsMdContainer] = useState<boolean>(false);

  const [mounted, setMount] = useState<boolean>(false);
  useTimeout(() => setMount(true), 1000);

  const { isOpen, onToggle } = useDisclosure();

  useWindowResize(() => {
    if (!containerRef.current) return;
    setIsMdContainer(containerRef.current.clientWidth < 800);
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;
    setMaxSideBarHeight(`${containerRef.current.clientHeight}px`);
  }, [containerRef]);

  const [snapShot] = useCollection(query(collection(firestore, messagesCol)));

  const [selectedUSer, setSelectedUser] = useState<MessageDoc | null>(null);

  if (!snapShot) return <Loader />;

  const messages = snapShot.docs.map((d) => d.data()) as MessageDoc[];

  return (
    <>
      <DashboardHeader
        alignItems={'center'}
        stackProps={{
          w: 'full',
        }}
      >
        <Flex alignItems={'center'} w={'full'}>
          <Text>Support Chat</Text>
          {isMdContainer && (
            <Button size={'sm'} ml={'auto'} variant={'outline'} colorScheme="whiteAlpha" onClick={onToggle}>
              <HamburgerIcon />
              <Flex position={'absolute'} top={-0.5} w={3} h={3} right={-0.5} bg={'green.200'} rounded={'full'}>
                {''}
              </Flex>
            </Button>
          )}
        </Flex>
      </DashboardHeader>
      <Flex w={'full'} h={'full'} ref={containerRef} maxH={'100%'} overflow={'hidden'} bg={'white'}>
        {/* side bar */}
        <Flex
          minW={isMdContainer ? '100%' : '35%'}
          flexDir={'column'}
          gap={3}
          px={3}
          h={'100%'}
          maxH={maxSideBarHeight}
          overflow={'auto'}
          pt={3}
          bg={'white'}
          position={isMdContainer ? 'fixed' : 'initial'}
          zIndex={990}
          className={`${isOpen || !isMdContainer ? 'sticky-sidebar-open' : 'sticky-sidebar-close'} ${mounted && 'ease-in-out'}`}
        >
          <Box>
            <InputGroup>
              <InputLeftElement>
                <SearchIcon color={'gray.500'} fontSize={'xs'} />
              </InputLeftElement>
              <Input placeholder="Search..." variant={'search'} fontSize={'xs'} />
            </InputGroup>
          </Box>
          {/* <Flex gap={4}>
            <Tag colorScheme="orange" rounded={'lg'}>
              New Messages
            </Tag>
            <Tag variant={'outline'} colorScheme="blackAlpha" rounded={'lg'}>
              All Messages
            </Tag>
          </Flex> */}

          <Flex flexDir={'column'} gap={2}>
            {messages.map((msg, idx) => {
              return (
                <Profile
                  active={selectedUSer != null && selectedUSer.patient_id === msg.patient_id}
                  onClick={() => {
                    setSelectedUser(msg);
                  }}
                  name={msg.patient_name}
                  avatar={msg.patient_avatar}
                  key={idx}
                />
              );
            })}
          </Flex>
        </Flex>

        {/* Chat Screen */}
        <Flex flex={1} borderLeft={'1px solid var(--black-color)'}>
          {selectedUSer == null ? (
            <Flex w={'100%'} h={'100%'} justifyContent={'center'} alignItems={'center'}>
              <HStack>
                <ChatIcon />
                <Text>Chat With Your Patients</Text>
              </HStack>
            </Flex>
          ) : (
            <Chat model={selectedUSer} />
          )}
        </Flex>
      </Flex>
    </>
  );
}

const DUMMY_MESSAGES = [
  { msg: 'Hello! Where are you brother? ', time: '15:42', sender: 'Driver' },
  { msg: 'I’m just few blocks away from your Position.Please hurry', time: '16:42', sender: 'Admin' },
  { msg: 'Ok I’m coming', time: '16:45', sender: 'Driver' },
  { msg: 'Thanks, We are waiting . It’s an emergency.', time: '16:46', sender: 'Admin' },
];

const Chat = ({ model }: { model: MessageDoc }) => {
  // TODO: filter by doctor id later

  const colRef = collection(firestore, `${messagesCol}/${model.uid}/conversations`);
  const [snapShot] = useCollection(query(colRef, orderBy('timestamp', 'asc')));
  const [chatMessages, setChatMessages] = useState<ChatMessageDoc[]>([]);
  const [messageInput, setMessageInput] = useState('');

  useEffect(() => {
    if (!snapShot) return;

    setChatMessages(snapShot.docs.map((d) => d.data()) as ChatMessageDoc[]);
  }, [snapShot]);

  const loggedInUserId = useLoggedInUser();

  const handleSendMessage = async () => {
    if (messageInput.trim() === '') return;

    try {
      await addDoc(colRef, {
        message: messageInput,
        sender_id: loggedInUserId,
        sender_name: model.doctor_display_name,
        timestamp: serverTimestamp(),
        type: 'conversation',
        sender: 'doctor',
      });
      setMessageInput(''); // Clear the input field after sending the message
    } catch (error) {
      console.error('Error sending message: ', error);
    }
  };

  return (
    <Grid w={'full'} h={'full'} gridTemplateRows={'repeat(8, 1fr)'}>
      <GridItem rowSpan={1} display={'flex'} alignItems={'center'} p={2} px={3}>
        <HStack>
          <Avatar src={model.patient_avatar} size={'sm'} />
          <Stack spacing={-1}>
            <Text fontSize={'md'} fontWeight={'bold'}>
              {model.doctor_display_name}
            </Text>
            <Text color={'gray.500'} fontSize={'sm'}>
              Patient
            </Text>
          </Stack>
        </HStack>
      </GridItem>
      <GridItem rowSpan={6} display={'flex'} w={'100%'} px={4} flexDir={'column'} gap={2} overflowY={'auto'}>
        {chatMessages.map((chat, i) => (
          <ChatMessage key={i} sender={chat.sender} time={''} isActiveUser={chat.sender == 'doctor'}>
            {chat.message}
          </ChatMessage>
        ))}
      </GridItem>
      <GridItem rowSpan={1} display={'flex'}>
        <InputGroup mt={'auto'}>
          <InputRightElement top={'20%'}>
            <Button variant={'unstyled'} onClick={handleSendMessage}>
              <SendMsgIcon />
            </Button>
          </InputRightElement>
          <Input
            w={'full'}
            variant={'chat'}
            placeholder="Type any message here"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSendMessage();
              }
            }}
          />
        </InputGroup>
      </GridItem>
    </Grid>
  );
};

const Profile = ({
  name,
  avatar,
  onClick,
  active,
}: {
  active?: boolean;
  onClick: () => void;
  name: string;
  avatar: string;
}) => {
  return (
    <Flex
      w={'full'}
      bg={active ? 'gray.50' : 'white'}
      _hover={{
        bg: 'gray.50',
        cursor: 'pointer',
        rounded: 'md',
      }}
      gap={3}
      p={2}
      alignItems={'center'}
      onClick={onClick}
    >
      <Avatar src={avatar} />
      <Stack spacing={-1}>
        <Text fontSize={'md'} fontWeight={'bold'} maxW={'7rem'} isTruncated>
          {name}
        </Text>
        <Text fontSize={'xs'} color={'gray.500'}>
          Just contacted you
        </Text>
      </Stack>
      <Flex
        justifyContent={'center'}
        alignContent={'center'}
        ml={'auto'}
        minW={'6'}
        borderRadius={'50%'}
        minH={'6'}
        bg={'blue.300'}
      >
        <Text
          color={'white'}
          fontWeight={'bold'}
          fontSize={'md'}
          cursor={'pointer'}
          _hover={{
            color: 'blue.400',
          }}
        >
          1
        </Text>
      </Flex>
    </Flex>
  );
};

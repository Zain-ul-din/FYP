'use client';

import {
  Avatar,
  Box,
  Button,
  Center,
  Flex,
  Grid,
  GridItem,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Stack,
  Text,
  useDisclosure,
  useTimeout,
} from '@chakra-ui/react';
import { AddIcon, ChatIcon, HamburgerIcon, SearchIcon } from '@chakra-ui/icons';
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import SendMsgIcon from './icons/SendMsgIcon';
import ChatMessage from './shared/ChatMessage';
import useWindowResize from '@/lib/hooks/useWindowResize';
import DashboardHeader from './shared/DashboardHeader';
import { useCollection } from 'react-firebase-hooks/firestore';
import {
  SnapshotMetadata,
  addDoc,
  arrayUnion,
  collection,
  doc,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import { firestore } from '@/lib/firebase';
import { medicationsCol, messagesCol } from '@/lib/firebase/collections';
import Loader from './shared/Loader';
import MessageDoc from '@/lib/firebase/types/MessageDoc';
import ChatMessageDoc from '@/lib/firebase/types/ChatMessageDoc';
import useLoggedInUser from '@/lib/hooks/useLoggedInUser';
import sendNotification from '@/lib/util/sendNotification';
import MedicationDoc from '@/lib/firebase/types/MedicationDoc';
import MedicineIcon from './icons/MedicineIcon';

const MedicationContext = createContext<MedicationDoc[]>([]);

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
  const loggedInUserId = useLoggedInUser();

  const [medicationSnapShot] = useCollection(
    query(collection(firestore, medicationsCol), where('doctor_id', '==', loggedInUserId))
  );
  const [medications, setMedications] = useState<MedicationDoc[]>([]);

  useEffect(() => {
    if (!medicationSnapShot) return;
    setMedications(medicationSnapShot.docs.map((d) => d.data()) as MedicationDoc[]);
  }, [medicationSnapShot]);

  const [search, setSearch] = useState<string>('');

  if (!snapShot) return <Loader />;

  const messages = snapShot.docs.map((d) => d.data()) as MessageDoc[];

  return (
    <MedicationContext.Provider value={medications}>
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
              <Input
                placeholder="Search..."
                variant={'search'}
                fontSize={'xs'}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </InputGroup>
          </Box>

          <Flex flexDir={'column'} gap={2}>
            {messages.filter((msg) => msg.patient_name.toLowerCase().includes(search.toLowerCase())).length == 0 && (
              <>
                <Center py={4}>
                  <Text color={'gray.600'}>Not Patient Found</Text>
                </Center>
              </>
            )}
            {messages
              .filter((msg) => msg.patient_name.toLowerCase().includes(search.toLowerCase()))
              .map((msg, idx) => {
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
    </MedicationContext.Provider>
  );
}

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
  const medications = useContext(MedicationContext);

  const handleSendMessage = async () => {
    if (messageInput.trim() === '') return;

    try {
      const data: ChatMessageDoc = {
        message: messageInput,
        sender_id: loggedInUserId,
        sender_name: model.doctor_display_name,
        timestamp: serverTimestamp(),
        type: 'conversation',
        sender: 'doctor',
      };
      await addDoc(colRef, data);

      setMessageInput(''); // Clear the input field after sending the message

      await sendNotification({
        doctor_display_name: model.doctor_display_name,
        msg: data.message,
        patient_id: model.patient_id,
      });
    } catch (error) {
      console.error('Error sending message: ', error);
    }
  };

  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chatContainerRef.current) return;
    chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
  }, [chatMessages]);

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
      <GridItem
        rowSpan={6}
        display={'flex'}
        w={'100%'}
        px={4}
        flexDir={'column'}
        gap={2}
        overflowY={'auto'}
        ref={chatContainerRef}
      >
        {chatMessages.map((chat, i) => (
          <ChatMessage
            key={i}
            sender={chat.sender}
            isActivity={chat.type == 'activity'}
            time={''}
            isActiveUser={chat.sender == 'doctor'}
          >
            {chat.message}
          </ChatMessage>
        ))}
      </GridItem>
      <GridItem rowSpan={1} display={'flex'}>
        <InputGroup mt={'auto'}>
          <InputRightElement top={'20%'} right={'5%'}>
            <HStack>
              <Menu colorScheme="linkedin">
                <MenuButton>
                  <Button size={'sm'} colorScheme="blackAlpha" variant={'ghost'}>
                    <AddIcon />
                  </Button>
                </MenuButton>
                <MenuList>
                  {medications.map((med, idx) => {
                    return (
                      <MenuItem
                        key={idx}
                        onClick={() => {
                          const docRef = doc(collection(firestore, medicationsCol), med.uid);
                          updateDoc(docRef, {
                            subscribers: arrayUnion(model.patient_id),
                          });

                          const data: ChatMessageDoc = {
                            message: `Assigned new medication plan. - ${med.name}`,
                            sender_id: loggedInUserId,
                            sender_name: model.doctor_display_name,
                            timestamp: serverTimestamp(),
                            type: 'activity',
                            sender: 'doctor',
                          };

                          addDoc(colRef, data);

                          sendNotification({
                            doctor_display_name: model.doctor_display_name,
                            msg: `Assigned new medication plan. - ${med.name}`,
                            patient_id: model.patient_id,
                          });
                        }}
                      >
                        <MedicineIcon
                          color="black"
                          fill="black"
                          fontSize={'1.3rem'}
                          style={{
                            margin: '0rem 0.5rem',
                          }}
                        />
                        {med.name}
                      </MenuItem>
                    );
                  })}
                </MenuList>
              </Menu>
              <Button variant={'unstyled'} onClick={handleSendMessage}>
                <SendMsgIcon />
              </Button>
            </HStack>
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

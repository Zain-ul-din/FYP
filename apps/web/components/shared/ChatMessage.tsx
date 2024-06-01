import { Flex, FlexProps, Stack, Text, TextProps } from '@chakra-ui/react';

interface ChatMessageProps extends FlexProps {
  sender: string;
  time?: string;
  isActiveUser?: boolean;
  senderTextProps?: TextProps;
}

const ChatMessage = ({ children, time, sender, senderTextProps, isActiveUser, ...rest }: ChatMessageProps) => {
  return (
    <Flex maxW={'80%'} flexDir={'column'} ml={isActiveUser ? 'auto' : 'initial'} {...rest}>
      <Text
        color={'gray.500'}
        fontSize={'md'}
        ml={isActiveUser ? 'auto' : 'initial'}
        mr={2}
        my={1}
        {...senderTextProps}
      >
        {sender}
      </Text>
      <Flex>
        <Flex
          borderRadius={isActiveUser ? '0px 16px 16px 16px' : '0px 16px 16px 16px'}
          padding={'12px 18px 6px 18px'}
          bg={isActiveUser ? '#EAEAEA' : '#8A92A6'}
        >
          <Stack color={isActiveUser ? 'black' : 'white'} spacing={1}>
            <Text fontSize={'sm'}>{children}</Text>
            <Text fontSize={'sm'} fontWeight={'light'}>
              {time}
            </Text>
          </Stack>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default ChatMessage;

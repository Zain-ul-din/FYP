import { FlexProps, Text, Flex } from '@chakra-ui/react';
import { ReactNode } from 'react';
import { IconProps } from '../../types/IconProps';

interface RoutesBreadcrumbProps extends FlexProps {
  path: string;
  icon: (props: IconProps) => ReactNode;
}

export default function RoutesBreadcrumb({ path, icon, children, ...rest }: RoutesBreadcrumbProps) {
  return (
    <Flex w={'full'} py={4} px={4} alignItems={'center'} gap={1} {...rest} bg={'white'}>
      {icon({
        width: '16px',
        height: '16px',
        style: {
          minWidth: '16px',
          minHeight: '16px',
        },
      })}
      <Text color={'gray.500'} fontSize={'sm'} fontWeight={'light'}>
        {path}
      </Text>
      {children}
    </Flex>
  );
}

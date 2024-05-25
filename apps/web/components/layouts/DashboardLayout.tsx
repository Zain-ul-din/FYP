'use client';

import {
  Avatar,
  Box,
  Button,
  ButtonProps,
  Collapse,
  Flex,
  Image,
  Stack,
  useDisclosure,
  useMediaQuery,
  useTimeout,
  Text,
  HStack,
  Link,
  Heading,
  Center,
} from '@chakra-ui/react';
import { ReactNode, useEffect, useState } from 'react';
import OrganizationIcon from '../icons/OrganizationIcon';
import { ROUTES, SLUG_ROUTES, SUB_ROUTES } from '@/lib/constants/dashboard_routes';
import { IconProps } from '../../types/IconProps';

import AmbulanceIcon from '../icons/AmbulanceIcon';
import FluentPersonIcon from '../icons/FluentPersonIcon';
import SteeringIcon from '../icons/SteeringIcon';
import SettingIcons from '../icons/SettingsIcon';
import CategoryIcon from '../icons/CategoryIcon';
import FluentSupportIcon from '../icons/FluentSupportIcon';
import ChatIcon from '../icons/ChatIcon';
import { ChevronDownIcon, ChevronRightIcon, CloseIcon, HamburgerIcon } from '@chakra-ui/icons';
import ManageIcons from '../icons/ManageIcon';
import LinkWrapper from '../shared/LinkWrapper';
import { usePathname } from 'next/navigation';
import Logo from '../icons/Logo';
import { useAuthState } from 'react-firebase-hooks/auth';
import { firebaseAuth } from '@/lib/firebase';

export default function DashboardLayout({ children }: { children?: ReactNode }) {
  const [isMdScreen] = useMediaQuery('(max-width: 850px)');
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useTimeout(() => setIsMounted(true), 1000);
  const [user] = useAuthState(firebaseAuth);

  return (
    <Flex w={'100%'} h={'100%'}>
      {/* side bar */}
      <Flex
        minW={isMdScreen ? '100%' : 'max(15rem,20%)'}
        h={'100%'}
        flexDir={'column'}
        alignItems={'center'}
        gap={'max(2rem, 5%)'}
        position={isMdScreen ? 'fixed' : 'initial'}
        bg={'white'}
        zIndex={999}
        overflowY={'auto'}
        className={`${isOpen || !isMdScreen ? 'sticky-sidebar-open' : 'sticky-sidebar-close'} ${isMounted && 'ease-in-out'}`}
      >
        {isOpen && isMdScreen && (
          <Button position={'fixed'} right={2} top={2} colorScheme="red" onClick={() => setIsOpen(false)}>
            {' '}
            <CloseIcon />{' '}
          </Button>
        )}
        <Sidebar onRouteChange={() => setIsOpen(false)} />
      </Flex>

      {/* right side content */}
      <Flex
        flex={1}
        h={'100%'}
        flexDir={'column'}
        bg={'rgba(244, 244, 245, 1)'}
        maxWidth={isMdScreen ? '100%' : 'calc(100% - max(15rem,20%))'}
        overflowY={'auto'}
      >
        {/* top header */}
        <Flex w={'100%'} px={isMdScreen ? '0.2rem' : '1rem'} py={2} gap={2} alignItems={'center'}>
          {isMdScreen && (
            <Button colorScheme="red" onClick={() => setIsOpen(true)} size={'sm'}>
              <HamburgerIcon />
            </Button>
          )}
          <Link href={ROUTES['SupportChat']} style={{ marginLeft: 'auto' }}>
            <Button
              colorScheme="blue"
              p={0}
              px={2}
              ml={'auto'}
              fontWeight={'normal'}
              fontSize={isMdScreen ? 'x-small' : 'sm'}
              size={isMdScreen ? 'sm' : 'md'}
            >
              <ChatIcon
                width={isMdScreen ? '15' : '25'}
                height={isMdScreen ? '15' : '25'}
                style={{
                  marginRight: '4px',
                }}
              />
              Support Chat
            </Button>
          </Link>

          {/* <Flex alignItems={'center'}>
            <Avatar src={'' + user?.photoURL} size={isMdScreen ? 'xs' : 'sm'} />
            <Button size={'xs'} p={0} m={0} variant={'unstyled'} color={'gray.500'}>
              <ChevronDownIcon fontWeight={'bold'} fontSize={'lg'} />
            </Button>
          </Flex> */}
          <HStack spacing={3}>
            <Flex h={'15px'} w={'1px'} bg={'gray.500'}></Flex>

            <Flex alignItems={'center'} gap={1}>
              <Avatar src={user?.photoURL || ''} size={isMdScreen ? 'xs' : 'sm'} />
              {!isMdScreen && (
                <Stack spacing={'-6px'}>
                  <Text fontWeight={'normal'} fontSize={'md'}>
                    {user?.displayName}
                  </Text>
                  <Text color={'gray.500'} fontSize={'xs'}>
                    Doctor
                  </Text>
                </Stack>
              )}
              <Button size={'xs'} p={0} m={0} variant={'unstyled'} color={'gray.500'}>
                <ChevronDownIcon fontWeight={'bold'} fontSize={'lg'} />
              </Button>
            </Flex>
          </HStack>
        </Flex>
        {children}
      </Flex>
    </Flex>
  );
}

const dashboardLinks: {
  text: keyof typeof ROUTES;
  Icon: React.ElementType<IconProps>;
}[] = [
  { text: 'Dashboard', Icon: CategoryIcon },
  { text: 'Hospitals', Icon: OrganizationIcon },
  { text: 'Patients', Icon: FluentPersonIcon },
  { text: 'Booking', Icon: SteeringIcon },
  { text: 'Settings', Icon: SettingIcons },
  { text: 'Emergency contact', Icon: FluentSupportIcon },
  { text: 'Manage Admins', Icon: ManageIcons },
];

const Sidebar = ({ onRouteChange }: { onRouteChange?: () => void }) => {
  const pathname = usePathname();

  return (
    <>
      <Box p={'max(2rem,12%)'} pb={1} w={'100%'} justifyContent={'center'}>
        <HStack>
          <Logo width={50} height={50} />
          <Heading fontSize={'2xl'} color={'blue.600'}>
            Dokto
          </Heading>
        </HStack>
      </Box>

      <Flex w={'100%'} flexDir={'column'} px={'max(1.2rem, 8%)'} gap={2}>
        {dashboardLinks.map(({ Icon, text }, i) => {
          SLUG_ROUTES.some((v) => {
            console.log(pathname, ' starts with ', v);
          });

          return (
            <SideBarLink
              key={i}
              icon={(props) => <Icon style={{ marginRight: '0.6rem' }} {...props} />}
              active={
                pathname === ROUTES[text] ||
                (SLUG_ROUTES.some((v) => v === ROUTES[text]) && pathname.startsWith(ROUTES[text]))
              }
              link={ROUTES[text]}
              path={text}
              onRouteChange={onRouteChange}
            >
              {text}
            </SideBarLink>
          );
        })}
      </Flex>
    </>
  );
};

interface SideBarLinkProps extends ButtonProps {
  active?: boolean;
  path?: keyof typeof ROUTES;
  link: string;
  onRouteChange?: () => void;
  icon?: (props: IconProps) => ReactNode;
}

const SideBarLink = ({ icon, path, link, active, onRouteChange, ...rest }: SideBarLinkProps) => {
  const { isOpen, onToggle, onClose } = useDisclosure();
  const hasSubRoutes = (path || '') in SUB_ROUTES;
  const pathname = usePathname();
  const [hasActiveChild, setHasActiveChild] = useState<boolean>(false);

  // checks if has active route
  useEffect(() => {
    const firstActiveRouteSegment = `/${pathname.split('/')[1]}`;
    if (!hasSubRoutes) return setHasActiveChild(false);
    // setHasActiveChild(firstActiveRouteSegment === link && (path || '') in ROUTES);
    setHasActiveChild(
      (SUB_ROUTES[path as keyof typeof ROUTES]?.filter((route) => pathname === route.link) || []).length > 0 ||
        firstActiveRouteSegment === link
    );
  }, [hasSubRoutes, pathname, path, link]);

  useEffect(() => {
    const hasActiveChild =
      (SUB_ROUTES[path as keyof typeof ROUTES]?.filter((route) => pathname === route.link) || []).length > 0;
    if (!active && !hasActiveChild) onClose();
  }, [pathname, onClose, active, hasActiveChild]);

  return (
    <>
      <LinkWrapper
        href={link}
        onClick={() => {
          onRouteChange && onRouteChange();
        }}
        disabled={hasSubRoutes}
      >
        <Button
          onClick={onToggle}
          w={'100%'}
          pl={2}
          colorScheme="red"
          justifyContent={'flex-start'}
          fontWeight={'normal'}
          bg={active || hasActiveChild ? 'var(--blue-grad)' : 'transparent'}
          color={active || hasActiveChild ? 'white' : '#8A92A6'}
          _active={{
            bg: '',
          }}
          _hover={{
            bg: '',
            opacity: 0.9,
          }}
          {...rest}
          rightIcon={
            hasSubRoutes ? (
              <ChevronRightIcon
                position={'absolute'}
                right={'5px'}
                top={'30%'}
                __css={{
                  transform: isOpen ? 'rotate(90deg)' : undefined,
                  transition: 'transform 0.5',
                }}
              />
            ) : (
              <></>
            )
          }
        >
          {icon && icon({ active: active || hasActiveChild })}
          {rest.children}
        </Button>
      </LinkWrapper>

      {hasSubRoutes && (
        <Collapse in={isOpen} transition={{ enter: { duration: 0.2 } }} animateOpacity>
          <Flex flexDir={'column'} pl={5}>
            {SUB_ROUTES[path as keyof typeof ROUTES]?.map((route, idx) => {
              return (
                <SideBarLink key={idx} link={route.link} active={pathname === route.link} onRouteChange={onRouteChange}>
                  {route.name}
                </SideBarLink>
              );
            })}
          </Flex>
        </Collapse>
      )}
    </>
  );
};

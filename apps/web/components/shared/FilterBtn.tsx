import {
  Box,
  Center,
  Input,
  Menu,
  MenuButton,
  MenuButtonProps,
  MenuItem,
  MenuList,
  Spinner,
  UseMenuItemProps,
  useMenuItem,
} from '@chakra-ui/react';
import FilterIcon from '../icons/FilterIcon';
import { useMemo, useState } from 'react';

interface FilterBtnProps extends MenuButtonProps {
  onFilterChange?: (selectedOption: string) => void;
  children: string[];
  createNewOpt?: (opt: string) => Promise<void>;
}

export default function FilterBtn({ onFilterChange, children, createNewOpt, ...rest }: FilterBtnProps) {
  const [search, setSearch] = useState<string>('');

  const notFound = useMemo(
    () => children.filter((opt) => opt.toLowerCase().includes(search.toLowerCase())).length == 0,
    [search, children]
  );

  const [loading, setLoading] = useState<boolean>(false);

  return (
    <Menu size={'xs'}>
      <MenuButton fontSize={'xl'} {...rest}>
        <FilterIcon />
      </MenuButton>
      <MenuList>
        <MenuInput
          value={search}
          onChange={(e) => {
            setSearch((e.target as any).value);
          }}
        />
        {children
          .filter((opt) => opt.toLowerCase().includes(search.toLowerCase()))
          .map((opt, idx) => {
            return (
              <MenuItem
                key={idx}
                fontSize={'sm'}
                onClick={() => {
                  onFilterChange && onFilterChange(opt);
                }}
              >
                {opt}
              </MenuItem>
            );
          })}
        {notFound && (
          <MenuItem
            fontSize={'xs'}
            closeOnSelect={false}
            onClick={async () => {
              if (search.trim().length == 0) return;
              setLoading(true);
              createNewOpt && (await createNewOpt(search));
              setLoading(false);
            }}
            isDisabled={loading}
          >
            {loading ? (
              <Center w={'full'} p={3}>
                <Spinner />
              </Center>
            ) : search.trim().length == 0 ? (
              <>No option found. Type to create a new one.</>
            ) : (
              <>create new '{search}'</>
            )}
          </MenuItem>
        )}
      </MenuList>
    </Menu>
  );
}

interface MenuInputProps extends UseMenuItemProps {
  value?: string;
}

const MenuInput = (props: MenuInputProps) => {
  const { role, ...rest } = useMenuItem(props);
  return (
    <Box px="1" role={role}>
      <Input placeholder="Search" variant={'solid'} border={'1px solid'} borderColor={'gray.300'} size="sm" {...rest} />
    </Box>
  );
};

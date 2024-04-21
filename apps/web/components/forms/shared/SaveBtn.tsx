'use client';
import { Button, ButtonProps } from '@chakra-ui/react';
import SaveIcon from '../../icons/SaveIcon';

export default function SaveBtn({ ...rest }: ButtonProps) {
  return (
    <Button variant={'red'} px={4} {...rest}>
      <SaveIcon
        style={{
          margin: '0rem 0.4rem',
        }}
      />{' '}
      Save
    </Button>
  );
}

/* eslint-disable @typescript-eslint/no-unused-vars */
import { IconProps } from '@/types/IconProps';
import MedicineIcon from '../MedicineIcon';

export default function EarnedCommissionIcon({ active, color, ...rest }: IconProps) {
  return (
    <div
      className=""
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '60px',
        width: '60px',
        backgroundColor: 'rgba(0, 153, 101, 0.2)',
        borderRadius: '50%',
      }}
    >
      <MedicineIcon color="white" fill="#009965" width={'50'} height={'50'} fontSize={'2rem'} />
    </div>
  );
}

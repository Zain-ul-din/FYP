import { IconProps } from '@/types/IconProps';
import { GiMedicines } from 'react-icons/gi';

interface MedicineIconProps extends IconProps {}

export default function MedicineIcon({ active, ...rest }: MedicineIconProps) {
  return <GiMedicines fill={active ? 'white' : '#8A92A6'} {...rest} />;
}

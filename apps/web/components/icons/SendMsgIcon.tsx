/* eslint-disable @typescript-eslint/no-unused-vars */
import { IconProps } from '@/types/IconProps';

export default function SendMsgIcon({ active, color, ...rest }: IconProps) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...rest}>
      <g id="material-symbols:send">
        <path id="Vector" d="M3 20V14L11 12L3 10V4L22 12L3 20Z" fill={color || 'black'} />
      </g>
    </svg>
  );
}

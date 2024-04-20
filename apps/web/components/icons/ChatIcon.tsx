/* eslint-disable @typescript-eslint/no-unused-vars */
import { IconProps } from '@/types/IconProps';

export default function ChatIcon({ active, color, ...rest }: IconProps) {
  return (
    <svg width="30" height="30" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" {...rest}>
      <g id="gridicons:chat">
        <path
          id="Vector"
          d="M4.5 18C2.85 18 1.5 16.65 1.5 15V7.5C1.5 5.85 2.85 4.5 4.5 4.5H16.5C18.15 4.5 19.5 5.85 19.5 7.5V15C19.5 16.65 18.15 18 16.5 18H13.5V22.5L9 18H4.5ZM31.5 27C33.15 27 34.5 25.65 34.5 24V16.5C34.5 14.85 33.15 13.5 31.5 13.5H22.5V15C22.5 18.3 19.8 21 16.5 21V24C16.5 25.65 17.85 27 19.5 27H22.5V31.5L27 27H31.5Z"
          fill={color || 'white'}
        />
      </g>
    </svg>
  );
}

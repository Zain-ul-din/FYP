/* eslint-disable @typescript-eslint/no-unused-vars */
import { IconProps } from '@/types/IconProps';

export default function UploadIcon({ color, active, ...rest }: IconProps) {
  return (
    <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...rest}>
      <g id="ic:round-upload">
        <path
          id="Vector"
          d="M10.5 16H14.5C15.05 16 15.5 15.55 15.5 15V10H17.09C17.98 10 18.43 8.92001 17.8 8.29001L13.21 3.70001C13.1175 3.6073 13.0076 3.53376 12.8866 3.48357C12.7657 3.43339 12.636 3.40756 12.505 3.40756C12.374 3.40756 12.2443 3.43339 12.1234 3.48357C12.0024 3.53376 11.8925 3.6073 11.8 3.70001L7.21 8.29001C6.58 8.92001 7.02 10 7.91 10H9.5V15C9.5 15.55 9.95 16 10.5 16ZM6.5 18H18.5C19.05 18 19.5 18.45 19.5 19C19.5 19.55 19.05 20 18.5 20H6.5C5.95 20 5.5 19.55 5.5 19C5.5 18.45 5.95 18 6.5 18Z"
          fill={color || 'white'}
        />
      </g>
    </svg>
  );
}

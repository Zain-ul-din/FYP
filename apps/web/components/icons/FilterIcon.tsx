/* eslint-disable @typescript-eslint/no-unused-vars */
import { IconProps } from '@/types/IconProps';

export default function FilterIcon({ active, ...rest }: IconProps) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...rest}>
      <g id="Two Tone / Content / filter_list">
        <path
          id="&#240;&#159;&#148;&#185; Primary Color"
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M10 18H14V16H10V18ZM3 6V8H21V6H3ZM6 13H18V11H6V13Z"
          fill="url(#paint0_linear_3653_4089)"
        />
      </g>
      <defs>
        <linearGradient id="paint0_linear_3653_4089" x1="12" y1="6" x2="12" y2="18" gradientUnits="userSpaceOnUse">
          <stop stop-color="#E71B40" />
          <stop offset="1" stop-color="#A5001F" />
        </linearGradient>
      </defs>
    </svg>
  );
}

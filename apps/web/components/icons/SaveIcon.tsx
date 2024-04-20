import { IconProps } from '@/types/IconProps';

export default function SaveIcon({ ...rest }: IconProps) {
  return (
    <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...rest}>
      <g id="ic:outline-save">
        <path
          id="Vector"
          d="M17.5 3H5.5C4.96957 3 4.46086 3.21071 4.08579 3.58579C3.71071 3.96086 3.5 4.46957 3.5 5V19C3.5 19.5304 3.71071 20.0391 4.08579 20.4142C4.46086 20.7893 4.96957 21 5.5 21H19.5C20.6 21 21.5 20.1 21.5 19V7L17.5 3ZM19.5 19H5.5V5H16.67L19.5 7.83V19ZM12.5 12C10.84 12 9.5 13.34 9.5 15C9.5 16.66 10.84 18 12.5 18C14.16 18 15.5 16.66 15.5 15C15.5 13.34 14.16 12 12.5 12ZM6.5 6H15.5V10H6.5V6Z"
          fill="white"
        />
      </g>
    </svg>
  );
}

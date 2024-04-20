import { IconProps } from '@/types/IconProps';

export default function AmbulanceIcon({ active, color, ...rest }: IconProps) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...rest}>
      <g id="emojione-monotone:ambulance" clipPath="url(#clip0_909_6324)">
        <path
          id="Vector"
          d="M8.98494 0.75L10.0664 2.508L8.30844 1.27725L8.98494 0.75ZM13.6094 0.75L14.2852 1.27725L12.5272 2.508L13.6094 0.75ZM7.42944 3.21112L7.78119 2.508L9.53882 3.21112H7.42944ZM14.8124 2.508L15.1638 3.21112H13.0544L14.8124 2.508ZM8.83569 10.4179H7.60532C7.41219 10.4179 7.25357 10.5761 7.25357 10.7696V12C7.25337 12.0932 7.21625 12.1826 7.15033 12.2485C7.0844 12.3144 6.99505 12.3516 6.90182 12.3517H6.55007C6.45687 12.3515 6.36757 12.3143 6.30167 12.2484C6.23577 12.1825 6.19862 12.0932 6.19832 12V10.7696C6.19812 10.6764 6.161 10.587 6.09507 10.5211C6.02915 10.4552 5.9398 10.4181 5.84657 10.4179H4.61619C4.523 10.4176 4.4337 10.3804 4.3678 10.3145C4.30189 10.2486 4.26474 10.1593 4.26444 10.0661V9.71437C4.26474 9.62118 4.30189 9.53188 4.3678 9.46598C4.4337 9.40007 4.523 9.36292 4.61619 9.36262H5.84657C5.9398 9.36243 6.02915 9.3253 6.09507 9.25938C6.161 9.19346 6.19812 9.1041 6.19832 9.01087V7.78125C6.19862 7.68805 6.23577 7.59875 6.30167 7.53285C6.36757 7.46695 6.45687 7.4298 6.55007 7.4295H6.90182C6.99505 7.4297 7.0844 7.46682 7.15033 7.53274C7.21625 7.59867 7.25337 7.68802 7.25357 7.78125V9.01162C7.25386 9.10482 7.29102 9.19412 7.35692 9.26002C7.42282 9.32592 7.51212 9.36308 7.60532 9.36337H8.83569C8.92892 9.36357 9.01828 9.4007 9.0842 9.46662C9.15012 9.53254 9.18725 9.62189 9.18744 9.71512V10.0669C9.18705 10.16 9.14984 10.2491 9.08394 10.3149C9.01803 10.3807 8.92879 10.4177 8.83569 10.4179Z"
          fill={color || (active ? 'white' : '#8A92A6')}
        />
        <path
          id="Vector_2"
          d="M1.45312 19.7344H1.97025C1.97025 19.7344 1.46625 18.2835 1.10625 15.1935C1.10588 15.1909 1.10588 15.1879 1.10513 15.1856C1.053 14.7367 1.00388 14.2534 0.960001 13.7347L0.959249 13.7287C0.835125 12.264 0.75 10.5225 0.75 8.48437C0.75 5.73112 2.46525 5.67187 8.48438 5.67187C8.85262 5.67187 9.20362 5.67412 9.53925 5.67862V4.79325H9.891C9.891 4.79325 10.1985 3.87975 10.2428 3.56287C10.3237 2.98612 10.7153 2.508 11.2976 2.508C11.8807 2.508 12.2723 2.98575 12.3525 3.56287C12.3971 3.88012 12.7043 4.79325 12.7043 4.79325H13.056V5.85337C15.4433 6.10612 16.4047 6.62587 17.2747 7.42987C18.4594 8.526 20.8721 11.253 22.2784 12.9075C22.4614 13.1242 22.5469 14.1094 22.5469 14.1094V19.7344C22.9335 19.7344 23.25 20.0509 23.25 20.4375C23.25 20.8241 22.9335 21.1406 22.5469 21.1406H21.048C20.7352 22.3522 19.638 23.25 18.3281 23.25C17.0194 23.25 15.9214 22.3522 15.6079 21.1406H8.39213C8.079 22.3522 6.98137 23.25 5.67225 23.25C4.36387 23.25 3.26513 22.3522 2.95162 21.1406H1.45312C1.0665 21.1406 0.75 20.8241 0.75 20.4375C0.75 20.0509 1.0665 19.7344 1.45312 19.7344ZM11.2969 2.85937V4.26562C11.4834 4.26562 11.6622 4.19154 11.7941 4.05968C11.9259 3.92782 12 3.74898 12 3.5625C12 3.37602 11.9259 3.19717 11.7941 3.06531C11.6622 2.93345 11.4834 2.85937 11.2969 2.85937ZM21.6615 13.3395C21.3797 13.0085 21.0961 12.6792 20.8106 12.3514H13.7576V6.70012C12.5925 6.52087 10.9406 6.42187 8.484 6.42187C2.15212 6.42187 1.49963 6.61462 1.49963 8.48437C1.49963 10.5296 1.58737 12.2696 1.7145 13.7284H11.6483L13.0624 15.1639H21.2348V14.8125C21.2348 14.475 21.4759 14.1907 21.7946 14.1244C21.7654 13.8195 21.7065 13.4752 21.6615 13.3395ZM17.9366 21.9907C17.9485 21.8951 17.9948 21.807 18.0668 21.7429C18.1389 21.6788 18.2317 21.6431 18.3281 21.6424C18.531 21.6424 18.6919 21.7954 18.7189 21.9911C19.0083 21.9192 19.2719 21.7681 19.4801 21.5546C19.3222 21.4335 19.2697 21.2167 19.3714 21.0405C19.4202 20.9578 19.4973 20.8956 19.5884 20.8652C19.6794 20.8349 19.7784 20.8384 19.8671 20.8751C19.9102 20.733 19.9331 20.5856 19.9354 20.4371C19.9354 20.2867 19.908 20.1439 19.8694 20.0059C19.8232 20.0242 19.7734 20.0359 19.7205 20.0359C19.6677 20.0359 19.6154 20.0256 19.5667 20.0054C19.5179 19.9852 19.4736 19.9556 19.4363 19.9182C19.399 19.8809 19.3694 19.8365 19.3492 19.7877C19.3291 19.7389 19.3188 19.6867 19.3189 19.6339C19.3196 19.5725 19.3346 19.5122 19.3627 19.4577C19.3908 19.4033 19.4313 19.3561 19.4809 19.32C19.2727 19.1062 19.0089 18.9549 18.7193 18.8831C18.6923 19.0789 18.5314 19.2319 18.3285 19.2319C18.1253 19.2319 17.9644 19.0796 17.937 18.8835C17.648 18.9557 17.3848 19.107 17.1769 19.3204C17.2721 19.3939 17.3374 19.5041 17.3374 19.6339C17.3374 19.8551 17.1578 20.0351 16.9361 20.0351C16.8836 20.0351 16.8345 20.0235 16.7884 20.0051C16.7494 20.1435 16.722 20.2864 16.722 20.4371C16.722 20.5875 16.7494 20.7307 16.788 20.8687C16.835 20.8497 16.8851 20.8396 16.9358 20.8391C16.9885 20.839 17.0408 20.8493 17.0895 20.8694C17.1383 20.8896 17.1826 20.9191 17.22 20.9564C17.2573 20.9936 17.2869 21.0379 17.3071 21.0866C17.3273 21.1354 17.3377 21.1876 17.3377 21.2404C17.3377 21.3709 17.2721 21.4811 17.1765 21.5542C17.3844 21.7675 17.6476 21.9187 17.9366 21.9907ZM5.28075 21.9907C5.29259 21.895 5.33884 21.8069 5.41088 21.7428C5.48292 21.6787 5.57582 21.643 5.67225 21.6424C5.87512 21.6424 6.036 21.7954 6.063 21.9911C6.35241 21.9193 6.61596 21.768 6.82388 21.5542C6.72787 21.4807 6.66225 21.3709 6.66225 21.2411C6.66225 21.1884 6.67264 21.1362 6.69283 21.0875C6.71302 21.0388 6.74261 20.9945 6.77991 20.9573C6.81721 20.92 6.86148 20.8904 6.91021 20.8703C6.95893 20.8502 7.01115 20.8398 7.06388 20.8399C7.11675 20.8399 7.1655 20.8515 7.212 20.8695C7.254 20.7291 7.27634 20.5836 7.27838 20.4371C7.27838 20.2867 7.251 20.1439 7.21238 20.0059C7.16625 20.0242 7.11675 20.0359 7.06388 20.0359C7.01115 20.0359 6.95893 20.0256 6.91021 20.0054C6.86148 19.9853 6.81721 19.9557 6.77991 19.9185C6.74261 19.8812 6.71302 19.837 6.69283 19.7883C6.67264 19.7396 6.66225 19.6873 6.66225 19.6346C6.66284 19.5733 6.67777 19.5129 6.70583 19.4583C6.73389 19.4038 6.77431 19.3565 6.82388 19.3204C6.616 19.1067 6.35242 18.9554 6.063 18.8839C6.036 19.0792 5.87512 19.2326 5.67225 19.2326C5.46862 19.2326 5.30775 19.0796 5.28075 18.8839C4.99135 18.956 4.72775 19.1073 4.5195 19.3207C4.67737 19.4411 4.73025 19.6582 4.62825 19.8352C4.52737 20.0092 4.31587 20.0722 4.13325 19.9999C4.09387 20.1397 4.06537 20.2845 4.06537 20.4371C4.06537 20.5879 4.09275 20.7307 4.13175 20.8687C4.17882 20.8496 4.22907 20.8396 4.27987 20.8391C4.3326 20.8391 4.38482 20.8494 4.43354 20.8696C4.48227 20.8897 4.52654 20.9192 4.56384 20.9565C4.60114 20.9938 4.63073 21.038 4.65092 21.0867C4.67111 21.1354 4.6815 21.1876 4.6815 21.2404C4.6815 21.3705 4.61588 21.4807 4.51987 21.5542C4.72796 21.7677 4.99146 21.9188 5.28075 21.9907ZM3.26738 18.9844C3.51713 18.5698 3.86979 18.2268 4.29114 17.9886C4.71249 17.7504 5.18824 17.6252 5.67225 17.625C6.15627 17.6251 6.63203 17.7504 7.05339 17.9885C7.47475 18.2267 7.82739 18.5698 8.07713 18.9844H15.9233C16.1729 18.5696 16.5255 18.2265 16.9469 17.9882C17.3682 17.7499 17.844 17.6245 18.3281 17.6242C18.8123 17.6244 19.2882 17.7497 19.7096 17.988C20.131 18.2263 20.4837 18.5696 20.7334 18.9844H21.7969V18.1965C21.6384 18.1636 21.496 18.0772 21.3936 17.9518C21.2913 17.8263 21.2352 17.6695 21.2348 17.5076V16.5701H12.3517L10.9676 15.1931H1.86525C2.09175 17.0917 2.36925 18.3469 2.535 18.984L3.26738 18.9844Z"
          fill={color || (active ? 'white' : '#8A92A6')}
        />
        <path
          id="Vector_3"
          d="M5.6722 21.2404C5.22837 21.2404 4.86858 20.8806 4.86858 20.4367C4.86858 19.9929 5.22837 19.6331 5.6722 19.6331C6.11603 19.6331 6.47583 19.9929 6.47583 20.4367C6.47583 20.8806 6.11603 21.2404 5.6722 21.2404Z"
          fill={color || (active ? 'white' : '#8A92A6')}
        />
        <path
          id="Vector_4"
          d="M18.3281 21.2404C17.8843 21.2404 17.5245 20.8806 17.5245 20.4367C17.5245 19.9929 17.8843 19.6331 18.3281 19.6331C18.7719 19.6331 19.1317 19.9929 19.1317 20.4367C19.1317 20.8806 18.7719 21.2404 18.3281 21.2404Z"
          fill={color || (active ? 'white' : '#8A92A6')}
        />
      </g>
      <defs>
        <clipPath id="clip0_909_6324">
          <rect width="24" height="24" fill="white" transform="matrix(-1 0 0 1 24 0)" />
        </clipPath>
      </defs>
    </svg>
  );
}

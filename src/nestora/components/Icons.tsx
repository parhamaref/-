import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement> & { strokeWidth?: number };

function Icon({ children, strokeWidth = 1.3, ...rest }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {children}
    </svg>
  );
}

/** Nestora mark — geometric house outline with an N formed inside it. */
export function NestoraMark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" focusable="false" {...props}>
      <path
        d="M4 12.8 16 4l12 8.8V28H4V12.8Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M11.2 24V14.4L20.8 24V14.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export const PinIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z" />
    <circle cx="12" cy="10" r="2.6" />
  </Icon>
);

export const SearchIcon = (props: IconProps) => (
  <Icon {...props}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="m16 16 4.5 4.5" />
  </Icon>
);

export const BedIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M3 18v-8m0 4h18m0 4v-6a2 2 0 0 0-2-2h-8v4" />
    <circle cx="7" cy="13" r="1.4" />
  </Icon>
);

export const BathIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M4 12h16v3.5A3.5 3.5 0 0 1 16.5 19h-9A3.5 3.5 0 0 1 4 15.5V12Z" />
    <path d="M7 12V6.5A2.5 2.5 0 0 1 11.5 5" />
    <path d="M8 21l-1 1.5M17 21l1 1.5" />
  </Icon>
);

export const AreaIcon = (props: IconProps) => (
  <Icon {...props}>
    <rect x="3.5" y="3.5" width="17" height="17" rx="2" />
    <path d="M8.5 3.5v4M3.5 8.5h4M15.5 20.5v-4M20.5 15.5h-4" />
  </Icon>
);

export const HeartIcon = ({ filled, ...props }: IconProps & { filled?: boolean }) => (
  <Icon {...props} fill={filled ? 'currentColor' : 'none'}>
    <path d="M12 20s-7-4.4-7-9.4A4.1 4.1 0 0 1 12 8a4.1 4.1 0 0 1 7 2.6c0 5-7 9.4-7 9.4Z" />
  </Icon>
);

export const ChevronDownIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="m6 9.5 6 6 6-6" />
  </Icon>
);

export const ArrowRightIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M4 12h15m0 0-6-6m6 6-6 6" />
  </Icon>
);

export const ArrowLeftIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M20 12H5m0 0 6-6m-6 6 6 6" />
  </Icon>
);

export const MenuIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </Icon>
);

export const CloseIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M6 6l12 12M18 6 6 18" />
  </Icon>
);

export const CheckIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="m5 12.5 4.5 4.5L19 7" />
  </Icon>
);

export const LayersIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M12 3.5 3.5 8 12 12.5 20.5 8 12 3.5Z" />
    <path d="m3.5 12.5 8.5 4.5 8.5-4.5M3.5 16.5 12 21l8.5-4.5" />
  </Icon>
);

export const HandshakeIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M3 11.5 6.5 8h4l2 1.8h3.2L21 13" />
    <path d="m6.5 8 3 3.2a1.6 1.6 0 0 0 2.3 0L14 9.8" />
    <path d="M10.5 15.5 13 18a1.7 1.7 0 0 0 2.4 0l4.6-4.6" />
    <path d="M3 11.5V16c0 .8.7 1.5 1.5 1.5H7" />
  </Icon>
);

export const ChartIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M4 19.5h16" />
    <path d="m6 16 4-5 3.5 3L20 6" />
    <path d="M16.5 6H20v3.5" />
  </Icon>
);

export const ShieldIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M12 21s7-3 7-9V5.8L12 3.5 5 5.8V12c0 6 7 9 7 9Z" />
    <path d="m9 12 2 2 4-4" />
  </Icon>
);

export const GridIcon = (props: IconProps) => (
  <Icon {...props}>
    <rect x="3.5" y="3.5" width="7" height="7" rx="1.5" />
    <rect x="13.5" y="3.5" width="7" height="7" rx="1.5" />
    <rect x="3.5" y="13.5" width="7" height="7" rx="1.5" />
    <rect x="13.5" y="13.5" width="7" height="7" rx="1.5" />
  </Icon>
);

export const ListIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M4 6.5h16M4 12h16M4 17.5h16" />
    <path d="M4 6.5h.01M4 12h.01M4 17.5h.01" />
  </Icon>
);

export const ShareIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M12 4v10m0-10L8.5 8M12 4l3.5 4" />
    <path d="M5 14v4.5C5 19.4 5.6 20 6.5 20h11c.9 0 1.5-.6 1.5-1.5V14" />
  </Icon>
);

export const PlusIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M12 5v14M5 12h14" />
  </Icon>
);

export const TrashIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M4.5 7h15M9.5 7V5h5v2M6.5 7l1 12.5h9L17.5 7" />
  </Icon>
);

export const EditIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M4 20h4l10-10-4-4L4 16v4Z" />
    <path d="m14 6 4 4" />
  </Icon>
);

export const StarIcon = ({ filled, ...props }: IconProps & { filled?: boolean }) => (
  <Icon {...props} fill={filled ? 'currentColor' : 'none'}>
    <path d="m12 4 2.5 5.3 5.5.8-4 3.9 1 5.6-5-2.9-5 2.9 1-5.6-4-3.9 5.5-.8L12 4Z" />
  </Icon>
);

export const MailIcon = (props: IconProps) => (
  <Icon {...props}>
    <rect x="3.5" y="5.5" width="17" height="13" rx="2" />
    <path d="m4.5 7 7.5 6 7.5-6" />
  </Icon>
);

export const PhoneIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M6.5 3.5H4.8A1.3 1.3 0 0 0 3.5 5c0 8.6 6.9 15.5 15.5 15.5.7 0 1.5-.6 1.5-1.3v-1.7l-4-2-2 2c-3.5-1.6-5.5-3.6-7-7l2-2-2-4Z" />
  </Icon>
);

export const ClockIcon = (props: IconProps) => (
  <Icon {...props}>
    <circle cx="12" cy="12" r="8" />
    <path d="M12 8v4.5l3 1.8" />
  </Icon>
);

export const FacebookIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M14.5 8.5H16V5.8h-1.8c-1.9 0-3.2 1.3-3.2 3.3v1.6H9v2.6h2v6h2.7v-6h2l.4-2.6h-2.4V9.4c0-.5.3-.9.8-.9Z" />
  </Icon>
);

export const InstagramIcon = (props: IconProps) => (
  <Icon {...props}>
    <rect x="4" y="4" width="16" height="16" rx="4.5" />
    <circle cx="12" cy="12" r="3.6" />
    <path d="M16.8 7.4h.01" />
  </Icon>
);

export const LinkedinIcon = (props: IconProps) => (
  <Icon {...props}>
    <rect x="4" y="4" width="16" height="16" rx="3" />
    <path d="M8 10.5V16M8 7.8h.01M12 16v-3.2a1.8 1.8 0 0 1 3.6 0V16" />
  </Icon>
);

export const LayoutIcon = (props: IconProps) => (
  <Icon {...props}>
    <rect x="3.5" y="4.5" width="17" height="15" rx="2" />
    <path d="M9 4.5v15M3.5 10h5" />
  </Icon>
);

/**
 * @file CustomerWardrobeView.tsx
 * Digital Wardrobe Archive & Lifetime Garment Stewardship.
 * Mounts the complete DigitalWardrobeWorkspace for customer garment management.
 */

import React from 'react';
import { DigitalWardrobeWorkspace } from './wardrobe/DigitalWardrobeWorkspace';

interface CustomerWardrobeViewProps {
  customerId?: string;
  customerName?: string;
}

export const CustomerWardrobeView: React.FC<CustomerWardrobeViewProps> = ({
  customerId = 'cust_001',
  customerName = 'Lord Alistair Sterling-Fox',
}) => {
  return (
    <DigitalWardrobeWorkspace
      customerId={customerId}
      customerName={customerName}
    />
  );
};

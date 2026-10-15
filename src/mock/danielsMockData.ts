/**
 * @file danielsMockData.ts
 * Typed initial mock data store for DANIELS platform entities.
 * Includes sample records for all entities, including users for each of the 9 roles.
 */

import {
  User,
  Customer,
  Partner,
  Product,
  MeasurementProfile,
  Order,
  ProductionJob,
  QCRecord,
  InvoicePayment,
  Delivery,
  WardrobeItem,
  Message,
  Notification,
  DanielsDataStore,
} from '../types/daniels.types';

// ==========================================
// 1. Users (Sample record for each of the 9 roles)
// ==========================================

export const MOCK_USERS: User[] = [
  {
    id: 'usr_super_admin_01',
    role: 'Super Admin',
    name: 'Daniel Sterling',
    email: 'd.sterling@daniels-couture.com',
    phone: '+44 20 7946 0910',
    status: 'Active',
    authMetadata: {
      lastLoginAt: '2026-10-05T08:30:00Z',
      provider: 'credentials',
      mfaEnabled: true,
      ipAddress: '82.165.197.1',
    },
    timestamps: {
      createdAt: '2025-01-10T10:00:00Z',
      updatedAt: '2026-10-05T08:30:00Z',
    },
  },
  {
    id: 'usr_mgmt_01',
    role: 'Management',
    name: 'Eleanor Vance',
    email: 'e.vance@daniels-couture.com',
    phone: '+33 1 42 68 55 00',
    status: 'Active',
    authMetadata: {
      lastLoginAt: '2026-10-05T09:12:00Z',
      provider: 'google_workspace',
      mfaEnabled: true,
      ipAddress: '194.254.12.8',
    },
    timestamps: {
      createdAt: '2025-02-01T09:00:00Z',
      updatedAt: '2026-10-05T09:12:00Z',
    },
  },
  {
    id: 'usr_sales_01',
    role: 'Sales',
    name: 'Julian Montgomery',
    email: 'j.montgomery@daniels-couture.com',
    phone: '+44 20 7946 0912',
    status: 'Active',
    authMetadata: {
      lastLoginAt: '2026-10-05T10:15:00Z',
      provider: 'credentials',
      mfaEnabled: true,
      ipAddress: '82.165.197.4',
    },
    timestamps: {
      createdAt: '2025-03-15T11:00:00Z',
      updatedAt: '2026-10-05T10:15:00Z',
    },
  },
  {
    id: 'usr_prod_01',
    role: 'Production',
    name: 'Master Tailor Henri Laurent',
    email: 'h.laurent@daniels-atelier.fr',
    phone: '+33 1 42 68 55 18',
    status: 'Active',
    authMetadata: {
      lastLoginAt: '2026-10-05T07:45:00Z',
      provider: 'credentials',
      mfaEnabled: false,
      ipAddress: '194.254.12.14',
    },
    timestamps: {
      createdAt: '2025-01-15T08:00:00Z',
      updatedAt: '2026-10-05T07:45:00Z',
    },
  },
  {
    id: 'usr_qc_01',
    role: 'QC',
    name: 'Claire Dupont',
    email: 'c.dupont@daniels-couture.com',
    phone: '+33 1 42 68 55 22',
    status: 'Active',
    authMetadata: {
      lastLoginAt: '2026-10-05T11:05:00Z',
      provider: 'credentials',
      mfaEnabled: true,
      ipAddress: '194.254.12.30',
    },
    timestamps: {
      createdAt: '2025-02-10T12:00:00Z',
      updatedAt: '2026-10-05T11:05:00Z',
    },
  },
  {
    id: 'usr_finance_01',
    role: 'Finance',
    name: 'Marcus Rothschild-Wren',
    email: 'm.rothschild@daniels-couture.com',
    phone: '+44 20 7946 0918',
    status: 'Active',
    authMetadata: {
      lastLoginAt: '2026-10-05T08:00:00Z',
      provider: 'credentials',
      mfaEnabled: true,
      ipAddress: '82.165.197.8',
    },
    timestamps: {
      createdAt: '2025-01-20T14:00:00Z',
      updatedAt: '2026-10-05T08:00:00Z',
    },
  },
  {
    id: 'usr_logistics_01',
    role: 'Logistics',
    name: 'Soren Lindqvist',
    email: 's.lindqvist@daniels-couture.com',
    phone: '+39 02 8739 4410',
    status: 'Active',
    authMetadata: {
      lastLoginAt: '2026-10-05T09:40:00Z',
      provider: 'credentials',
      mfaEnabled: false,
      ipAddress: '151.38.45.19',
    },
    timestamps: {
      createdAt: '2025-03-01T10:00:00Z',
      updatedAt: '2026-10-05T09:40:00Z',
    },
  },
  {
    id: 'usr_partner_01',
    role: 'Partner',
    name: 'Matteo Bernardi (Atelier Biella)',
    email: 'm.bernardi@biellacraft.it',
    phone: '+39 015 849 2200',
    status: 'Active',
    authMetadata: {
      lastLoginAt: '2026-10-04T16:20:00Z',
      provider: 'credentials',
      mfaEnabled: true,
      ipAddress: '93.42.112.5',
    },
    timestamps: {
      createdAt: '2025-02-15T09:30:00Z',
      updatedAt: '2026-10-04T16:20:00Z',
    },
  },
  {
    id: 'usr_customer_01',
    role: 'Customer',
    name: 'Lord Alistair Sterling-Fox',
    email: 'alistair.sterling@mayfairholdings.co.uk',
    phone: '+44 7700 900821',
    status: 'Active',
    authMetadata: {
      lastLoginAt: '2026-10-05T12:00:00Z',
      provider: 'credentials',
      mfaEnabled: true,
      ipAddress: '86.14.99.112',
    },
    timestamps: {
      createdAt: '2025-04-10T16:00:00Z',
      updatedAt: '2026-10-05T12:00:00Z',
    },
  },
  {
    id: 'usr_designer_01',
    role: 'Designer',
    name: 'Daniel’s Maison',
    email: 'daniel@danielmaison.atelier',
    phone: '+44 20 7946 0888',
    status: 'Active',
    authMetadata: {
      lastLoginAt: '2026-10-12T08:00:00Z',
      provider: 'credentials',
      mfaEnabled: true,
      ipAddress: '82.165.197.4',
    },
    timestamps: {
      createdAt: '2025-01-01T00:00:00Z',
      updatedAt: '2026-10-12T08:00:00Z',
    },
  },
];

// ==========================================
// 2. Customers
// ==========================================

export const MOCK_CUSTOMERS: Customer[] = [
  {
    id: 'cust_001',
    userId: 'usr_customer_01',
    profile: {
      title: 'Lord',
      firstName: 'Alistair',
      lastName: 'Sterling-Fox',
      company: 'Mayfair Holdings Corp',
      notes: 'Prefers basted bespoke fittings at the Mayfair Salon; requires double Milanese buttonholes.',
      address: {
        street: '14 Grosvenor Square, Flat 4B',
        city: 'London',
        state: 'Greater London',
        postalCode: 'W1K 6LG',
        country: 'United Kingdom',
      },
    },
    preferences: {
      preferredContactMethod: 'WhatsApp',
      currency: 'GBP',
      language: 'en',
      stylingNotes: 'Double-breasted peak lapel coats, midnight navy and charcoal palette.',
      notificationOptIn: true,
    },
    vipLevel: 'Private Client',
    status: 'Active',
    timestamps: {
      createdAt: '2025-04-10T16:00:00Z',
      updatedAt: '2026-10-05T12:00:00Z',
    },
  },
  {
    id: 'cust_002',
    userId: 'usr_super_admin_01', // Secondary reference
    profile: {
      title: 'Madame',
      firstName: 'Helene',
      lastName: 'de Saint-Germain',
      company: 'Fondation d’Art Moderne Paris',
      notes: 'Private collector of architectural evening gowns and cashmere outerwear.',
      address: {
        street: '28 Rue du Faubourg Saint-Honoré',
        city: 'Paris',
        postalCode: '75008',
        country: 'France',
      },
    },
    preferences: {
      preferredContactMethod: 'Email',
      currency: 'GBP',
      language: 'en',
      stylingNotes: 'Sculptural silhouette, matte noir silk and vicuña textiles.',
      notificationOptIn: true,
    },
    vipLevel: 'Platinum',
    status: 'Active',
    timestamps: {
      createdAt: '2025-05-12T11:20:00Z',
      updatedAt: '2026-09-28T14:10:00Z',
    },
  },
];

// ==========================================
// 3. Partners
// ==========================================

export const MOCK_PARTNERS: Partner[] = [
  {
    id: 'ptnr_biella_01',
    userId: 'usr_partner_01',
    businessDetails: {
      legalBusinessName: 'Atelier Sartoriale Biella S.r.l.',
      tradeName: 'Biella Master Craft',
      registrationNumber: 'IT-09283740961',
      vatTaxId: 'IT09283740961',
      primaryContactName: 'Matteo Bernardi',
      address: {
        street: 'Via Pietro Micca 44',
        city: 'Biella',
        postalCode: '13900',
        country: 'Italy',
      },
    },
    capabilities: {
      craftSpecialties: [
        'Hand-padded floating canvas lapels',
        'Hand-sewn horn buttonholes',
        'Fine cashmere cold-pressing',
      ],
      garmentTypes: ['Bespoke Overcoats', 'Double-breasted Suits', 'Tuxedos'],
      machineTypes: ['Dürkopp Adler Stitcher', 'Hoffman Steam Form Press'],
      capacityPerMonth: 45,
      leadTimeDays: 28,
      certifications: ['ISO 9001 Haute Tailoring', 'Biella Wool Guild Certified'],
    },
    verificationStatus: 'Verified',
    portfolio: {
      lookbookUrls: ['https://daniels-couture.com/partners/biella-archive.pdf'],
      previousBrands: ['Brioni Custom', 'Loro Piana Bespoke Project'],
      highlights: 'Over 65 years of heritage tailoring in Piedmont.',
    },
    status: 'Active',
  },
];

// ==========================================
// 4. Products
// ==========================================

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'prod_overcoat_001',
    category: 'Outerwear',
    collection: 'Volume IX — Architectural Fluidity',
    name: 'The Haussmann Structured Greatcoat',
    materials: [
      {
        name: 'Dormeuil Royal 11 Dover Wool',
        composition: '100% Super 160s Merino Wool (580g/m)',
        origin: 'Huddersfield, UK',
        supplier: 'Dormeuil & Sons',
      },
      {
        name: 'Bemberg Cupro Jacquard Lining',
        composition: '100% Cupro Silk Weave',
        origin: 'Osaka, Japan',
      },
    ],
    colours: [
      { name: 'Soot Charcoal', hex: '#1C1C1E', code: 'SC-01' },
      { name: 'Midnight Obsidian', hex: '#0B0D12', code: 'MO-02' },
      { name: 'Oatmeal Melton', hex: '#9E9484', code: 'OM-03' },
    ],
    pricing: {
      basePrice: 4850,
      currency: 'GBP',
      taxRate: 0.2,
      markupPercentage: 65,
    },
    customisationOptions: [
      {
        optionName: 'Monogramming',
        allowedValues: ['None', 'Interior Breast Pocket', 'Under-Collar Felt'],
        additionalCost: 120,
      },
      {
        optionName: 'Buttons',
        allowedValues: ['Smoked Mother of Pearl', 'Matte Black Buffalo Horn', 'Antiqued Sterling Silver'],
        additionalCost: 240,
      },
      {
        optionName: 'Lining Pattern',
        allowedValues: ['Monochrome Satin', 'Architectural Cross-Hatch', 'Archival Crest Damask'],
        additionalCost: 180,
      },
    ],
    status: 'Active',
  },
  {
    id: 'prod_suit_002',
    category: 'Tailoring',
    collection: 'Volume IX — Architectural Fluidity',
    name: 'The Mayfair Double-Breasted Lounge Suit',
    materials: [
      {
        name: 'Fox Brothers 310g Worsted Flannel',
        composition: '100% British Worsted Wool',
        origin: 'Somerset, UK',
      },
    ],
    colours: [
      { name: 'Savile Navy Chalkstripe', hex: '#1A2332', code: 'SNC-01' },
      { name: 'Pebble Melange', hex: '#3B3B3D', code: 'PM-02' },
    ],
    pricing: {
      basePrice: 5600,
      currency: 'GBP',
      taxRate: 0.2,
      markupPercentage: 70,
    },
    customisationOptions: [
      {
        optionName: 'Lapel Style',
        allowedValues: ['11cm Peak Lapel', 'Bellied Notch Lapel', 'Shawl Collar'],
        additionalCost: 0,
      },
      {
        optionName: 'Waistband',
        allowedValues: ['Side Adjusters with Brass Buckles', 'High-Rise Gurkha Belt'],
        additionalCost: 95,
      },
    ],
    status: 'Active',
  },
];

// ==========================================
// 5. Measurement Profiles (Adhering to Versioning)
// ==========================================

export const MOCK_MEASUREMENT_PROFILES: MeasurementProfile[] = [
  // Historical Version 1 (Superseded)
  {
    id: 'meas_prof_001_v1',
    customerId: 'cust_001',
    measurements: {
      unit: 'cm',
      neck: 41.5,
      shoulderWidth: 48.0,
      chest: 104.0,
      waist: 87.0,
      hips: 102.0,
      sleeveLength: 65.0,
      bicep: 35.0,
      wrist: 18.0,
      jacketLength: 78.0,
      inseam: 83.5,
      outseam: 108.0,
      thigh: 60.0,
      ankle: 21.0,
    },
    fitPreferences: {
      silhouette: 'Slim',
      shoulderPad: 'Light',
      trouserBreak: 'Slight Break',
      notes: 'Initial fitting discovery at Savile Row Salon.',
    },
    specialRequirements: ['Right shoulder drops 1.2cm lower than left', 'Prominent blade posture adjustment'],
    version: 1,
    approvedAt: '2025-04-12T14:00:00Z',
    supersededById: 'meas_prof_001_v2',
    isLatest: false,
    notes: 'Superseded by v2 after autumn basted fitting session.',
  },
  // Active Version 2 (Latest Approved Version)
  {
    id: 'meas_prof_001_v2',
    customerId: 'cust_001',
    measurements: {
      unit: 'cm',
      neck: 41.5,
      shoulderWidth: 48.5,
      chest: 104.5,
      waist: 86.0,
      hips: 101.5,
      sleeveLength: 65.5,
      bicep: 35.5,
      wrist: 18.0,
      jacketLength: 78.5,
      inseam: 84.0,
      outseam: 108.5,
      thigh: 59.5,
      ankle: 20.5,
    },
    fitPreferences: {
      silhouette: 'Classic',
      shoulderPad: 'Structured',
      trouserBreak: 'Slight Break',
      notes: 'Requested slightly more chest drape for winter heavy knitwear layering.',
    },
    specialRequirements: [
      'Right shoulder drops 1.2cm lower than left (rooped sleeve head balanced)',
      'Extra 1.5cm chest drape allowence for cashmere vests',
    ],
    version: 2,
    approvedAt: '2026-01-18T16:30:00Z',
    supersededById: null,
    isLatest: true,
    notes: 'Approved by Master Tailor Henri Laurent following forward basted fitting.',
  },
];

// ==========================================
// 6. Orders
// ==========================================

export const MOCK_ORDERS: Order[] = [
  {
    id: 'ord_2026_0891',
    customerId: 'cust_001',
    productId: 'prod_overcoat_001',
    partnerId: 'ptnr_biella_01',
    dates: {
      created: '2026-09-01T10:00:00Z',
      due: '2026-10-25T18:00:00Z',
      completed: null,
      estimatedShipping: '2026-10-20T12:00:00Z',
    },
    pricing: {
      subtotal: 4850,
      customisationFee: 360,
      tax: 1042,
      total: 6252,
      currency: 'GBP',
    },
    status: 'In Production',
    personalisation: {
      monogram: 'A.S.F.',
      monogramFont: 'Classic Serif Roman',
      liningFabric: 'Bemberg Cupro Jacquard Monogram',
      buttonSelection: 'Matte Black Buffalo Horn',
      customMeasurementsProfileId: 'meas_prof_001_v2',
      specialInstructions: 'Hand-sewn horn buttonholes with Milanese silk gimp cord.',
    },
    approvalStatus: 'Approved',
  },
  {
    id: 'ord_2026_0892',
    customerId: 'cust_002',
    productId: 'prod_suit_002',
    partnerId: 'ptnr_biella_01',
    dates: {
      created: '2026-09-15T14:30:00Z',
      due: '2026-11-10T18:00:00Z',
      completed: null,
      estimatedShipping: '2026-11-05T12:00:00Z',
    },
    pricing: {
      subtotal: 5600,
      customisationFee: 95,
      tax: 1139,
      total: 6834,
      currency: 'GBP',
    },
    status: 'Confirmed',
    personalisation: {
      monogram: 'H.S.G.',
      monogramFont: 'Archival French Script',
      liningFabric: 'Tone-on-tone French Navy Twill',
      buttonSelection: 'Smoked Mother of Pearl',
      specialInstructions: 'High-rise Gurkha waistband with polished brass adjusters.',
    },
    approvalStatus: 'Approved',
  },
  {
    id: 'ord_2026_0780',
    customerId: 'cust_001',
    productId: 'prod_suit_002',
    partnerId: 'ptnr_biella_01',
    dates: {
      created: '2026-06-10T11:00:00Z',
      due: '2026-07-28T18:00:00Z',
      completed: '2026-07-25T15:20:00Z',
      estimatedShipping: '2026-07-26T09:00:00Z',
    },
    pricing: {
      subtotal: 5600,
      customisationFee: 95,
      tax: 1139,
      total: 6834,
      currency: 'GBP',
    },
    status: 'Delivered',
    personalisation: {
      monogram: 'A.S.F.',
      monogramFont: 'Classic Serif Roman',
    },
    approvalStatus: 'Approved',
  },
];

// ==========================================
// 7. Production Jobs
// ==========================================

export const MOCK_PRODUCTION_JOBS: ProductionJob[] = [
  {
    id: 'pjob_891_01',
    orderId: 'ord_2026_0891',
    partnerId: 'ptnr_biella_01',
    stage: 'Making',
    deadlines: {
      startExpected: '2026-09-08T08:00:00Z',
      targetFinish: '2026-10-14T17:00:00Z',
      actualFinish: null,
    },
    progress: 68,
    notes: [
      {
        timestamp: '2026-09-09T10:15:00Z',
        authorId: 'usr_partner_01',
        text: 'Dormeuil Royal 11 cloth chalk-marked and precision hand-sheared.',
      },
      {
        timestamp: '2026-09-18T14:40:00Z',
        authorId: 'usr_prod_01',
        text: 'Chest canvas pad-stitched with floating horsehair core (1,250 prick stitches).',
      },
      {
        timestamp: '2026-10-02T16:00:00Z',
        authorId: 'usr_partner_01',
        text: 'Sleeve heads mounted with roped roll; preparing for final collar basting.',
      },
    ],
    status: 'In Progress',
  },
];

// ==========================================
// 8. Quality Control (QC) Records
// ==========================================

export const MOCK_QC_RECORDS: QCRecord[] = [
  {
    id: 'qc_rec_780_01',
    orderId: 'ord_2026_0780',
    inspectionDetails: {
      inspectionDate: '2026-07-24T14:00:00Z',
      inspectorId: 'usr_qc_01',
      criteriaChecked: [
        { item: 'Pattern symmetry across center back seam', passed: true, toleranceMm: 0.5 },
        { item: 'Shoulder drop offset (1.2cm delta validated)', passed: true, toleranceMm: 1.0 },
        { item: 'Milanese hand-buttonhole stitch density (12 stitches/cm)', passed: true },
        { item: 'Underarm ease & lining slip room', passed: true },
        { item: 'Cold iron finish & absence of fabric shine', passed: true },
      ],
    },
    result: 'Pass',
    defects: [],
    correctiveAction: null,
    approval: {
      approvedBy: 'usr_qc_01',
      approvedAt: '2026-07-24T16:15:00Z',
      version: 1,
    },
  },
  {
    id: 'qc_rec_sample_defect',
    orderId: 'ord_2026_0891',
    inspectionDetails: {
      inspectionDate: '2026-10-04T11:00:00Z',
      inspectorId: 'usr_qc_01',
      criteriaChecked: [
        { item: 'Left pocket flap horizontal alignment', passed: false, toleranceMm: 2.2, notes: 'Slight 1.8mm dip on left corner.' },
        { item: 'Bemberg lining tension', passed: true },
      ],
    },
    result: 'Fail',
    defects: [
      {
        defectCode: 'DEF-PKT-04',
        description: 'Left jetted pocket flap misaligned with chalk line by 1.8mm',
        severity: 'Minor',
        locationOnGarment: 'Left waist exterior pocket',
      },
    ],
    correctiveAction: 'Unpick exterior hand-baste and re-press pocket jetting aligned to grain line.',
    approval: {
      approvedBy: null,
      approvedAt: null,
      version: 1,
    },
  },
];

// ==========================================
// 9. Invoices & Payments
// ==========================================

export const MOCK_INVOICE_PAYMENTS: InvoicePayment[] = [
  {
    id: 'inv_pay_891_01',
    orderId: 'ord_2026_0891',
    customerId: 'cust_001',
    amount: 3126, // 50% deposit
    status: 'Part Paid',
    method: 'Wire Transfer',
    reference: 'WT-GB-2026-8910-01',
    timestamps: {
      createdAt: '2026-09-01T10:15:00Z',
      paidAt: '2026-09-02T11:30:00Z',
      refundedAt: null,
    },
  },
  {
    id: 'inv_pay_780_01',
    orderId: 'ord_2026_0780',
    customerId: 'cust_001',
    amount: 6834, // 100% full settlement
    status: 'Paid',
    method: 'Credit Card',
    reference: 'STRIPE-CHG-99482103',
    timestamps: {
      createdAt: '2026-06-10T11:30:00Z',
      paidAt: '2026-06-10T11:35:00Z',
      refundedAt: null,
    },
  },
];

// ==========================================
// 10. Deliveries
// ==========================================

export const MOCK_DELIVERIES: Delivery[] = [
  {
    id: 'del_780_01',
    orderId: 'ord_2026_0780',
    method: 'White Glove Concierge',
    trackingNumber: 'DLS-MAYFAIR-WG-0042',
    dispatchDate: '2026-07-26T09:00:00Z',
    status: 'Delivered',
    confirmation: {
      signedBy: 'Lord Alistair Sterling-Fox',
      deliveredAt: '2026-07-26T14:15:00Z',
      signatureUrl: 'https://daniels-couture.com/signatures/del_780_sig.png',
      photoProofUrl: 'https://daniels-couture.com/proof/del_780_concierge.jpg',
    },
  },
  {
    id: 'del_891_01',
    orderId: 'ord_2026_0891',
    method: 'White Glove Concierge',
    trackingNumber: 'DLS-MAYFAIR-WG-0079',
    dispatchDate: null,
    status: 'Pending',
    confirmation: {
      signedBy: null,
      deliveredAt: null,
    },
  },
];

// ==========================================
// 11. Wardrobe Items (Client Garment Archive)
// ==========================================

export const MOCK_WARDROBE_ITEMS: WardrobeItem[] = [
  {
    id: 'wardrobe_item_001',
    customerId: 'cust_001',
    orderId: 'ord_2026_0780',
    productId: 'prod_suit_002',
    size: 'Bespoke Profile v1',
    colour: 'Savile Navy Chalkstripe',
    material: 'Fox Brothers 310g Worsted Flannel',
    alterations: [
      {
        id: 'alt_001',
        date: '2026-08-15T11:00:00Z',
        description: 'Waist taken in 1.0cm following client request for athletic silhouette.',
        performedBy: 'Master Tailor Henri Laurent',
        cost: 0, // Complimentary lifetime alteration privilege
      },
    ],
    status: 'In Wardrobe',
  },
];

// ==========================================
// 12. Messages & Notifications
// ==========================================

export const MOCK_MESSAGES: Message[] = [
  {
    id: 'msg_001',
    sender: {
      id: 'usr_sales_01',
      name: 'Julian Montgomery',
      role: 'Sales',
    },
    recipient: {
      id: 'usr_customer_01',
      name: 'Lord Alistair Sterling-Fox',
      role: 'Customer',
    },
    context: {
      entityType: 'Order',
      entityId: 'ord_2026_0891',
    },
    subject: 'Daniel’s Maison: Dormeuil Royal 11 Cloth Basting Completed',
    body: 'Dear Lord Sterling-Fox, Master Tailor Henri Laurent has completed the primary chest canvas pad-stitching. Your forward basted fitting at our Mayfair Salon is scheduled for Thursday next week.',
    attachments: [
      {
        id: 'att_001',
        filename: 'canvas_basting_progress.jpg',
        url: 'https://daniels-couture.com/media/basting_progress_photo.jpg',
        mimeType: 'image/jpeg',
        sizeBytes: 1845000,
      },
    ],
    readStatus: true,
    timestamps: {
      sentAt: '2026-10-02T16:30:00Z',
      readAt: '2026-10-02T17:15:00Z',
    },
  },
  {
    id: 'msg_002',
    sender: {
      id: 'usr_prod_01',
      name: 'Master Tailor Henri Laurent',
      role: 'Production',
    },
    recipient: {
      id: 'usr_partner_01',
      name: 'Matteo Bernardi (Atelier Biella)',
      role: 'Partner',
    },
    context: {
      entityType: 'ProductionJob',
      entityId: 'pjob_891_01',
    },
    subject: 'Collar & Sleeve Roping Technical Guideline',
    body: 'Please ensure the left roped sleeve roll maintains the specified 1.2cm compensation for client posture balance.',
    attachments: [],
    readStatus: false,
    timestamps: {
      sentAt: '2026-10-05T08:15:00Z',
      readAt: null,
    },
  },
];

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif_001',
    sender: 'SYSTEM',
    recipient: {
      id: 'usr_sales_01',
      name: 'Julian Montgomery',
      role: 'Sales',
    },
    context: {
      entityType: 'Order',
      entityId: 'ord_2026_0891',
      actionUrl: '/orders/ord_2026_0891',
    },
    title: 'Deposit Received',
    message: 'Wire transfer payment of £3,126.00 confirmed for Order #ord_2026_0891.',
    attachments: [],
    readStatus: true,
    timestamps: {
      sentAt: '2026-09-02T11:32:00Z',
      readAt: '2026-09-02T11:45:00Z',
    },
  },
  {
    id: 'notif_002',
    sender: {
      id: 'usr_qc_01',
      name: 'Claire Dupont',
      role: 'QC',
    },
    recipient: {
      id: 'usr_prod_01',
      name: 'Master Tailor Henri Laurent',
      role: 'Production',
    },
    context: {
      entityType: 'QC',
      entityId: 'qc_rec_sample_defect',
      actionUrl: '/qc/qc_rec_sample_defect',
    },
    title: 'QC Inspection Report Logged',
    message: 'Minor defect noted on pocket flap jetting for Order #ord_2026_0891. Corrective action required.',
    attachments: [],
    readStatus: false,
    timestamps: {
      sentAt: '2026-10-04T11:15:00Z',
      readAt: null,
    },
  },
];

// ==========================================
// 13. Aggregate Data Store Export
// ==========================================

export const danielsMockDataStore: DanielsDataStore = {
  users: MOCK_USERS,
  customers: MOCK_CUSTOMERS,
  partners: MOCK_PARTNERS,
  products: MOCK_PRODUCTS,
  measurementProfiles: MOCK_MEASUREMENT_PROFILES,
  orders: MOCK_ORDERS,
  productionJobs: MOCK_PRODUCTION_JOBS,
  qcRecords: MOCK_QC_RECORDS,
  invoices: MOCK_INVOICE_PAYMENTS,
  deliveries: MOCK_DELIVERIES,
  wardrobeItems: MOCK_WARDROBE_ITEMS,
  messages: MOCK_MESSAGES,
  notifications: MOCK_NOTIFICATIONS,
};

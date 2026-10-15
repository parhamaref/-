/**
 * @file inventoryStore.ts
 * Reactive state store for the Atelier Inventory & Supplier Management Suite.
 * Handles Fabric yardage, Material trims, Mill suppliers, Purchase Orders,
 * automated Low-Stock Triggers, and Financial Cost & Margin Analytics.
 */

import { useState, useEffect } from 'react';
import {
  FabricItem,
  MaterialItem,
  Supplier,
  PurchaseOrder,
  PurchaseOrderLineItem,
  StockAlert,
  InventoryCostSummary,
  GarmentBomModel,
  StockStatus,
} from '../types/inventory.types';

const STORAGE_KEY_PREFIX = 'daniels_atelier_inventory_v1';

export const INITIAL_FABRICS: FabricItem[] = [
  {
    id: 'fab_scb_001',
    sku: 'FAB-SCB-001',
    name: 'Scabal Super 150s Diamond Chip Cashmere-Wool',
    supplierId: 'sup_scabal',
    supplierName: 'Scabal S.A.',
    millCode: 'SCB-BE-7729',
    composition: '85% Super 150s Worsted Wool, 15% Cashmere',
    weave: 'Twill',
    weightGsm: 310,
    widthCm: 152,
    colorName: 'Midnight Obsidian Navy',
    hexColor: '#0c192c',
    currentStockMeters: 45.5,
    reservedMeters: 8.0,
    minReorderThresholdMeters: 15.0,
    costPerMeter: 185.0,
    currency: 'GBP',
    storageLocation: 'Roll Bay 04 - Shelf B2',
    batchLotNumber: 'LOT-2026-SCB-89',
    inspectionStatus: 'Passed',
    swatchImageUrl: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=400&q=80',
    shrinkageRatePercent: 1.8,
    leadTimeDays: 7,
    status: 'in_stock',
    reservedOrderNumbers: ['DM-2026-9480', 'DM-2026-9481'],
    notes: 'Signature tuxedo and three-piece suit cloth. Hand-spotted finish with diamond powder sheen.',
    createdAt: '2026-08-15T10:00:00Z',
    updatedAt: '2026-10-12T08:30:00Z',
  },
  {
    id: 'fab_lp_002',
    sku: 'FAB-LP-002',
    name: 'Loro Piana Storm System Tasmania Wool',
    supplierId: 'sup_loropiana',
    supplierName: 'Loro Piana S.p.A.',
    millCode: 'LP-IT-9912',
    composition: '100% Extra-Fine Merino Wool (Water-Resistant Membrane)',
    weave: 'Herringbone',
    weightGsm: 340,
    widthCm: 150,
    colorName: 'Charcoal Slate Melange',
    hexColor: '#2b2d31',
    currentStockMeters: 22.0,
    reservedMeters: 5.5,
    minReorderThresholdMeters: 12.0,
    costPerMeter: 210.0,
    currency: 'GBP',
    storageLocation: 'Roll Bay 02 - Shelf A1',
    batchLotNumber: 'LOT-2026-LP-44',
    inspectionStatus: 'Passed',
    swatchImageUrl: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=400&q=80',
    shrinkageRatePercent: 1.2,
    leadTimeDays: 10,
    status: 'in_stock',
    reservedOrderNumbers: ['DM-2026-9483'],
    notes: 'Wind & rain repellent breathable membrane backing. Premier overcoat and travel jacket cloth.',
    createdAt: '2026-07-20T11:00:00Z',
    updatedAt: '2026-10-11T14:20:00Z',
  },
  {
    id: 'fab_dor_003',
    sku: 'FAB-DOR-003',
    name: 'Dormeuil Amadeus 365 Silk-Wool Blend',
    supplierId: 'sup_dormeuil',
    supplierName: 'Dormeuil Frères',
    millCode: 'DOR-FR-5021',
    composition: '80% Fine Worsted Wool, 20% Mulberry Silk',
    weave: 'Plain Weave',
    weightGsm: 260,
    widthCm: 148,
    colorName: 'Deep Royal Sapphire',
    hexColor: '#172554',
    currentStockMeters: 14.2,
    reservedMeters: 4.0,
    minReorderThresholdMeters: 15.0,
    costPerMeter: 195.0,
    currency: 'GBP',
    storageLocation: 'Roll Bay 05 - Shelf C3',
    batchLotNumber: 'LOT-2026-DOR-12',
    inspectionStatus: 'Passed',
    swatchImageUrl: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=400&q=80',
    shrinkageRatePercent: 1.5,
    leadTimeDays: 8,
    status: 'low_stock',
    reservedOrderNumbers: ['DM-2026-9484'],
    notes: 'Superb drape with subtle high-luster silk reflection. Year-round 365 collection.',
    createdAt: '2026-06-10T09:00:00Z',
    updatedAt: '2026-10-12T07:15:00Z',
  },
  {
    id: 'fab_alb_004',
    sku: 'FAB-ALB-004',
    name: 'Albini Thomas Mason Giza 87 Egyptian Cotton',
    supplierId: 'sup_albini',
    supplierName: 'Albini Group / Thomas Mason',
    millCode: 'ALB-TM-8700',
    composition: '100% Extra-Long Staple Giza 87 Egyptian Cotton',
    weave: 'Twill',
    weightGsm: 135,
    widthCm: 145,
    colorName: 'Crisp Chalk White',
    hexColor: '#f8fafc',
    currentStockMeters: 62.0,
    reservedMeters: 12.0,
    minReorderThresholdMeters: 25.0,
    costPerMeter: 68.0,
    currency: 'GBP',
    storageLocation: 'Roll Bay 01 - Shelf D1',
    batchLotNumber: 'LOT-2026-TM-91',
    inspectionStatus: 'Passed',
    swatchImageUrl: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=400&q=80',
    shrinkageRatePercent: 2.2,
    leadTimeDays: 5,
    status: 'in_stock',
    reservedOrderNumbers: ['DM-2026-9480', 'DM-2026-9485'],
    notes: 'Silky soft handfeel that softens further with every wash. Standard bespoke shirt shirting.',
    createdAt: '2026-05-18T14:00:00Z',
    updatedAt: '2026-10-10T12:00:00Z',
  },
  {
    id: 'fab_kur_005',
    sku: 'FAB-KUR-005',
    name: 'Kuroki Mills 14oz Japanese Raw Selvedge Denim',
    supplierId: 'sup_kuroki',
    supplierName: 'Kuroki Co., Ltd.',
    millCode: 'KUR-JP-1400',
    composition: '100% Zimbabwe Long-Staple Cotton, Pure Indigo Dyed',
    weave: 'Selvedge',
    weightGsm: 475,
    widthCm: 84, // Traditional shuttle loom narrow width
    colorName: 'Deep Kurashiki Indigo',
    hexColor: '#1e1b4b',
    currentStockMeters: 18.0,
    reservedMeters: 7.0,
    minReorderThresholdMeters: 20.0,
    costPerMeter: 55.0,
    currency: 'GBP',
    storageLocation: 'Roll Bay 06 - Shelf A3',
    batchLotNumber: 'LOT-2026-KUR-08',
    inspectionStatus: 'Passed',
    swatchImageUrl: 'https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=400&q=80',
    shrinkageRatePercent: 4.5, // Unsanforized / shrink-to-fit
    leadTimeDays: 21,
    status: 'low_stock',
    reservedOrderNumbers: ['DM-2026-9486'],
    notes: 'Woven on vintage Toyoda shuttle looms with signature pink ticker selvedge edge ID.',
    createdAt: '2026-04-12T16:00:00Z',
    updatedAt: '2026-10-11T16:40:00Z',
  },
  {
    id: 'fab_hs_006',
    sku: 'FAB-HS-006',
    name: 'Holland & Sherry Crispaire High-Twist Fresco',
    supplierId: 'sup_scabal',
    supplierName: 'Scabal S.A.',
    millCode: 'HS-UK-3310',
    composition: '100% High-Twist 2-Ply Worsted Wool (Crease-Resistant)',
    weave: 'Plain Weave',
    weightGsm: 280,
    widthCm: 150,
    colorName: 'Forest Pine Green',
    hexColor: '#14532d',
    currentStockMeters: 4.0,
    reservedMeters: 6.5, // Deficit!
    minReorderThresholdMeters: 12.0,
    costPerMeter: 145.0,
    currency: 'GBP',
    storageLocation: 'Roll Bay 03 - Shelf B1',
    batchLotNumber: 'LOT-2026-HS-21',
    inspectionStatus: 'Passed',
    swatchImageUrl: 'https://images.unsplash.com/photo-1520006403909-838d6b89c79e?auto=format&fit=crop&w=400&q=80',
    shrinkageRatePercent: 1.0,
    leadTimeDays: 12,
    status: 'low_stock',
    reservedOrderNumbers: ['DM-2026-9482'],
    notes: 'Open porous weave with extreme springback bounce. Ideal for hot-climate bespoke traveling.',
    createdAt: '2026-03-01T10:00:00Z',
    updatedAt: '2026-10-12T09:00:00Z',
  },
  {
    id: 'fab_lin_007',
    sku: 'FAB-LIN-007',
    name: 'Baird McNutt Heritage Irish Linen',
    supplierId: 'sup_albini',
    supplierName: 'Albini Group / Thomas Mason',
    millCode: 'BMN-IE-400',
    composition: '100% Pure Flax Irish Linen',
    weave: 'Plain Weave',
    weightGsm: 240,
    widthCm: 146,
    colorName: 'Natural Oat Sand',
    hexColor: '#e2d9c8',
    currentStockMeters: 34.0,
    reservedMeters: 3.5,
    minReorderThresholdMeters: 15.0,
    costPerMeter: 48.0,
    currency: 'GBP',
    storageLocation: 'Roll Bay 01 - Shelf C2',
    batchLotNumber: 'LOT-2026-BMN-77',
    inspectionStatus: 'Passed',
    swatchImageUrl: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=400&q=80',
    shrinkageRatePercent: 3.0,
    leadTimeDays: 7,
    status: 'in_stock',
    reservedOrderNumbers: [],
    notes: 'Traditional Ballymena river-water washed flax. Mellow character and soft patina.',
    createdAt: '2026-02-14T10:00:00Z',
    updatedAt: '2026-10-09T11:20:00Z',
  },
  {
    id: 'fab_vel_008',
    sku: 'FAB-VEL-008',
    name: 'Jakob Schlaepfer Couture Silk Velvet',
    supplierId: 'sup_dormeuil',
    supplierName: 'Dormeuil Frères',
    millCode: 'JS-CH-9090',
    composition: '75% Silk Pile, 25% Cotton Ground',
    weave: 'Velvet',
    weightGsm: 390,
    widthCm: 140,
    colorName: 'Gothic Obsidian Black',
    hexColor: '#09090b',
    currentStockMeters: 11.5,
    reservedMeters: 0,
    minReorderThresholdMeters: 10.0,
    costPerMeter: 260.0,
    currency: 'GBP',
    storageLocation: 'Roll Bay 07 - Shelf D4 (Vertical Hanging)',
    batchLotNumber: 'LOT-2026-JS-01',
    inspectionStatus: 'Passed',
    swatchImageUrl: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=400&q=80',
    shrinkageRatePercent: 0.5,
    leadTimeDays: 14,
    status: 'in_stock',
    reservedOrderNumbers: [],
    notes: 'Stored vertically in custom suspended velour boxes to preserve pile orientation without crush marks.',
    createdAt: '2026-01-20T10:00:00Z',
    updatedAt: '2026-10-08T15:00:00Z',
  },
];

export const INITIAL_MATERIALS: MaterialItem[] = [
  {
    id: 'mat_001_zipper',
    sku: 'TRM-RAC-880',
    name: 'Raccagni SuperR 2-Way Antique Brass Zipper (65cm)',
    category: 'Zippers & Fasteners',
    supplierId: 'sup_raccagni',
    supplierName: 'Raccagni Fasteners',
    unit: 'pieces',
    unitCost: 14.5,
    currency: 'GBP',
    currentStock: 42,
    reservedStock: 6,
    minThreshold: 20,
    reorderQuantity: 50,
    storageBin: 'Bin Z-12',
    colorOrFinish: 'Antique Brushed Brass / Black Tape',
    photoUrl: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=300&q=80',
    status: 'in_stock',
    notes: 'Smooth electroplated teeth with laser-etched atelier puller.',
    updatedAt: '2026-10-12T08:00:00Z',
  },
  {
    id: 'mat_002_lining',
    sku: 'TRM-BEM-501',
    name: 'Bemberg Cupro Jacquard Monogram Lining (Midnight)',
    category: 'Linings',
    supplierId: 'sup_scabal',
    supplierName: 'Scabal S.A.',
    unit: 'meters',
    unitCost: 18.0,
    currency: 'GBP',
    currentStock: 85.0,
    reservedStock: 16.0,
    minThreshold: 30,
    reorderQuantity: 60,
    storageBin: 'Lining Rack L-02',
    colorOrFinish: 'Deep Navy Monogram Jacquard',
    photoUrl: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=300&q=80',
    status: 'in_stock',
    notes: 'Anti-static, breathable, regenerated cellulose yarn made in Japan.',
    updatedAt: '2026-10-11T12:00:00Z',
  },
  {
    id: 'mat_003_horn',
    sku: 'TRM-HORN-32L',
    name: 'Genuine Water Buffalo Horn Buttons 4-Hole (32L / 20mm)',
    category: 'Buttons',
    supplierId: 'sup_gritti',
    supplierName: 'Gritti Group Buttons',
    unit: 'pieces',
    unitCost: 2.4,
    currency: 'GBP',
    currentStock: 140,
    reservedStock: 24,
    minThreshold: 50,
    reorderQuantity: 150,
    storageBin: 'Drawer B-04',
    colorOrFinish: 'Matte Smoky Espresso Striated',
    photoUrl: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=300&q=80',
    status: 'in_stock',
    notes: 'Jacket front closures. Natural variation ensures each horn button is distinct.',
    updatedAt: '2026-10-10T16:00:00Z',
  },
  {
    id: 'mat_004_mop',
    sku: 'TRM-MOP-18L',
    name: 'Australian Smoked Mother-of-Pearl Buttons (18L / 11mm)',
    category: 'Buttons',
    supplierId: 'sup_gritti',
    supplierName: 'Gritti Group Buttons',
    unit: 'pieces',
    unitCost: 3.2,
    currency: 'GBP',
    currentStock: 38,
    reservedStock: 18,
    minThreshold: 60,
    reorderQuantity: 120,
    storageBin: 'Drawer B-01',
    colorOrFinish: 'Iridescent Smoked Grey Shell',
    photoUrl: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=300&q=80',
    status: 'low_stock',
    notes: 'Deep rainbow luster, 4mm extra-thick rim, cross-drilled.',
    updatedAt: '2026-10-12T07:45:00Z',
  },
  {
    id: 'mat_005_canvas',
    sku: 'TRM-CANV-001',
    name: 'Horsehair Chest Canvas & Wool Pad Interfacing',
    category: 'Canvas & Interfacing',
    supplierId: 'sup_scabal',
    supplierName: 'Scabal S.A.',
    unit: 'meters',
    unitCost: 32.0,
    currency: 'GBP',
    currentStock: 28.0,
    reservedStock: 6.0,
    minThreshold: 15,
    reorderQuantity: 30,
    storageBin: 'Rack C-01',
    colorOrFinish: 'Natural Ecru Unbleached',
    photoUrl: 'https://images.unsplash.com/photo-1520006403909-838d6b89c79e?auto=format&fit=crop&w=300&q=80',
    status: 'in_stock',
    notes: 'Full floating anatomical chest piece with real Mongolian horsehair weft.',
    updatedAt: '2026-10-09T14:30:00Z',
  },
  {
    id: 'mat_006_thread',
    sku: 'TRM-GUT-30',
    name: 'Gütermann Mara 30 Heavy Silk-Finish Topstitch Thread',
    category: 'Threads & Sundries',
    supplierId: 'sup_gritti',
    supplierName: 'Gritti Group Buttons',
    unit: 'spools',
    unitCost: 6.8,
    currency: 'GBP',
    currentStock: 18,
    reservedStock: 4,
    minThreshold: 10,
    reorderQuantity: 25,
    storageBin: 'Spool Carousel T-01',
    colorOrFinish: 'Col. 910 Antique Gold / Champagne',
    photoUrl: 'https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=300&q=80',
    status: 'in_stock',
    notes: 'Buttonhole gimp and lapel AMF hand-stitch contrast embroidery.',
    updatedAt: '2026-10-10T10:00:00Z',
  },
  {
    id: 'mat_007_chain',
    sku: 'TRM-MET-CHN',
    name: 'Solid Brass Coat Hanging Collar Chains & Rings',
    category: 'Hardware',
    supplierId: 'sup_raccagni',
    supplierName: 'Raccagni Fasteners',
    unit: 'sets',
    unitCost: 4.5,
    currency: 'GBP',
    currentStock: 64,
    reservedStock: 8,
    minThreshold: 25,
    reorderQuantity: 60,
    storageBin: 'Drawer H-02',
    colorOrFinish: 'Aged Brushed Brass',
    photoUrl: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=300&q=80',
    status: 'in_stock',
    notes: 'Interior collar neck loop with reinforced bar tacks.',
    updatedAt: '2026-10-08T11:00:00Z',
  },
  {
    id: 'mat_008_shoulder',
    sku: 'TRM-PAD-PAG',
    name: 'Hand-Molded Wool Shoulder Pads (Concave Pagoda)',
    category: 'Canvas & Interfacing',
    supplierId: 'sup_scabal',
    supplierName: 'Scabal S.A.',
    unit: 'sets',
    unitCost: 8.9,
    currency: 'GBP',
    currentStock: 12,
    reservedStock: 6,
    minThreshold: 20,
    reorderQuantity: 40,
    storageBin: 'Drawer S-05',
    colorOrFinish: 'Natural Wool Felt',
    photoUrl: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=300&q=80',
    status: 'low_stock',
    notes: 'Crafted for British structured shoulder roping with anatomical concave bevel.',
    updatedAt: '2026-10-12T07:50:00Z',
  },
];

export const INITIAL_SUPPLIERS: Supplier[] = [
  {
    id: 'sup_scabal',
    name: 'Scabal S.A.',
    code: 'SCB-BE',
    specialty: 'Savile Row Suiting & Cashmere Blends',
    country: 'Belgium & United Kingdom',
    city: 'Brussels / Huddersfield',
    contactName: 'Philippe De Smet',
    email: 'atelier.bespoke@scabal.com',
    phone: '+32 2 217 98 00',
    website: 'https://www.scabal.com',
    qualityRating: 4.9,
    averageLeadTimeDays: 7,
    moqMeters: 3.5,
    paymentTerms: 'Net 30 EOM',
    certifications: ['OEKO-TEX Standard 100', 'RWS Certified Wool', 'Savile Row Guild Partner'],
    tier: 'Strategic Partner',
    activePoCount: 1,
    totalSpendGbp: 38450,
    notes: 'Primary fabric partner for tuxedo worsted wools, superfine cashmeres, and custom floating canvas.',
    currency: 'GBP',
    createdAt: '2025-01-10T10:00:00Z',
  },
  {
    id: 'sup_loropiana',
    name: 'Loro Piana S.p.A.',
    code: 'LP-IT',
    specialty: 'Noble Fibers, Vicuña & Storm System Weatherproof Wools',
    country: 'Italy',
    city: 'Quarona / Biella',
    contactName: 'Gianluca Rossi',
    email: 'textiles.bespoke@loropiana.com',
    phone: '+39 015 7711',
    website: 'https://www.loropiana.com',
    qualityRating: 5.0,
    averageLeadTimeDays: 10,
    moqMeters: 5.0,
    paymentTerms: '50% Advance / Net 30',
    certifications: ['GOTS Organic', 'Vicuña Protocol Certified', 'Traceable Piedmont Water Mill'],
    tier: 'Strategic Partner',
    activePoCount: 1,
    totalSpendGbp: 46200,
    notes: 'Exceptional weather-barrier membranes and Tasmanian wool rolls.',
    currency: 'GBP',
    createdAt: '2025-02-12T09:00:00Z',
  },
  {
    id: 'sup_dormeuil',
    name: 'Dormeuil Frères',
    code: 'DOR-FR',
    specialty: 'High-Luster Amadeus Wools, Silk Blends & Couturier Velvets',
    country: 'France & United Kingdom',
    city: 'Paris / Yorkshire',
    contactName: 'Henri Dormeuil-Leclerc',
    email: 'trade@dormeuil.fr',
    phone: '+33 1 42 66 50 00',
    website: 'https://www.dormeuil.com',
    qualityRating: 4.8,
    averageLeadTimeDays: 8,
    moqMeters: 4.0,
    paymentTerms: 'Net 30 EOM',
    certifications: ['OEKO-TEX Step', 'Yorkshire Heritage Mill Guild'],
    tier: 'Preferred Mill',
    activePoCount: 1,
    totalSpendGbp: 29800,
    notes: 'Finest silk-wool blends with high draping and wrinkle resilience.',
    currency: 'GBP',
    createdAt: '2025-03-01T11:00:00Z',
  },
  {
    id: 'sup_albini',
    name: 'Albini Group / Thomas Mason',
    code: 'ALB-IT',
    specialty: 'Egyptian Giza 87 Shirting & Irish Flax Linens',
    country: 'Italy & United Kingdom',
    city: 'Albino (Bergamo)',
    contactName: 'Chiara Albini',
    email: 'orders@albinigroup.com',
    phone: '+39 035 777 111',
    website: 'https://www.albinigroup.com',
    qualityRating: 4.9,
    averageLeadTimeDays: 5,
    moqMeters: 10.0,
    paymentTerms: 'Net 30 EOM',
    certifications: ['Giza Cotton Association Verified', 'European Flax Masters of Linen'],
    tier: 'Preferred Mill',
    activePoCount: 0,
    totalSpendGbp: 18400,
    notes: 'Historical mill founded in 1796. Supreme 2-fold Egyptian cotton shirting and Irish flax.',
    currency: 'GBP',
    createdAt: '2025-04-10T14:00:00Z',
  },
  {
    id: 'sup_kuroki',
    name: 'Kuroki Co., Ltd.',
    code: 'KUR-JP',
    specialty: 'Vintage Shuttle Loom Selvedge Denim',
    country: 'Japan',
    city: 'Ibara, Okayama',
    contactName: 'Kenji Kuroki',
    email: 'export@kuroki-denim.co.jp',
    phone: '+81 866 62 1010',
    website: 'https://www.kuroki-denim.com',
    qualityRating: 4.9,
    averageLeadTimeDays: 21,
    moqMeters: 15.0,
    paymentTerms: 'Proforma Wire',
    certifications: ['Kurashiki Indigo Heritage Guild', 'OEKO-TEX 100'],
    tier: 'Artisan Specialist',
    activePoCount: 0,
    totalSpendGbp: 14750,
    notes: 'Narrow 32-inch vintage Toyoda shuttle loom rolls with distinct rope-dyed indigo saturation.',
    currency: 'GBP',
    createdAt: '2025-05-15T08:00:00Z',
  },
  {
    id: 'sup_raccagni',
    name: 'Raccagni Fasteners',
    code: 'RAC-IT',
    specialty: 'Haute Horlogerie Precision Zippers & Solid Brass Hardware',
    country: 'Italy',
    city: 'Bergamo',
    contactName: 'Matteo Raccagni',
    email: 'custom@raccagnigroup.it',
    phone: '+39 035 848 100',
    website: 'https://www.raccagnigroup.com',
    qualityRating: 4.7,
    averageLeadTimeDays: 14,
    moqMeters: 20, // or 20 pcs
    paymentTerms: 'Net 30',
    certifications: ['REACH Compliant Heavy Metals Free', 'Made in Italy Traceability'],
    tier: 'Artisan Specialist',
    activePoCount: 0,
    totalSpendGbp: 9600,
    notes: 'Ultra-luxurious tooth symmetry with electro-polished bevels and bespoke atelier sliders.',
    currency: 'GBP',
    createdAt: '2025-06-20T10:00:00Z',
  },
  {
    id: 'sup_gritti',
    name: 'Gritti Group Buttons',
    code: 'GRT-IT',
    specialty: 'Natural Water Buffalo Horn & Mother-of-Pearl Haberdashery',
    country: 'Italy',
    city: 'Grassobbio (Bergamo)',
    contactName: 'Marco Gritti',
    email: 'sales@grittigroup.com',
    phone: '+39 035 384 711',
    website: 'https://www.grittigroup.com',
    qualityRating: 4.8,
    averageLeadTimeDays: 6,
    moqMeters: 100, // pcs
    paymentTerms: 'Net 30 EOM',
    certifications: ['CITES Horn Ethical Certification', 'Recycled Water Closed-Loop Polishing'],
    tier: 'Preferred Mill',
    activePoCount: 0,
    totalSpendGbp: 12100,
    notes: 'Genuine horn carved and polished in Lombardy with natural marble striations.',
    currency: 'GBP',
    createdAt: '2025-07-01T12:00:00Z',
  },
];

export const INITIAL_PURCHASE_ORDERS: PurchaseOrder[] = [
  {
    id: 'po_001',
    poNumber: 'PO-2026-0088',
    supplierId: 'sup_loropiana',
    supplierName: 'Loro Piana S.p.A.',
    supplierContact: 'Gianluca Rossi (textiles.bespoke@loropiana.com)',
    issueDate: '2026-10-06T10:00:00Z',
    expectedDate: '2026-10-16T18:00:00Z',
    status: 'in_transit',
    items: [
      {
        id: 'poi_001',
        itemType: 'fabric',
        itemId: 'fab_lp_002',
        sku: 'FAB-LP-002',
        name: 'Loro Piana Storm System Tasmania Wool (Charcoal)',
        quantity: 25.0,
        unit: 'meters',
        unitPrice: 210.0,
        lineTotal: 5250.0,
      },
    ],
    subtotal: 5250.0,
    freightAndCustoms: 180.0,
    tax: 150.0,
    totalAmount: 5580.0,
    currency: 'GBP',
    paymentStatus: 'deposit_paid',
    carrier: 'DHL Express CrossBorder',
    trackingNumber: 'DHL-994827104',
    notes: 'Scheduled for autumn/winter bespoke trench coat collection. Air express dispatch.',
    receivingNotes: '',
    createdAt: '2026-10-06T10:00:00Z',
    updatedAt: '2026-10-10T14:00:00Z',
  },
  {
    id: 'po_002',
    poNumber: 'PO-2026-0089',
    supplierId: 'sup_dormeuil',
    supplierName: 'Dormeuil Frères',
    supplierContact: 'Henri Dormeuil-Leclerc (trade@dormeuil.fr)',
    issueDate: '2026-10-08T11:00:00Z',
    expectedDate: '2026-10-17T18:00:00Z',
    status: 'confirmed',
    items: [
      {
        id: 'poi_002',
        itemType: 'fabric',
        itemId: 'fab_dor_003',
        sku: 'FAB-DOR-003',
        name: 'Dormeuil Amadeus 365 Silk-Wool Blend (Sapphire)',
        quantity: 30.0,
        unit: 'meters',
        unitPrice: 195.0,
        lineTotal: 5850.0,
      },
    ],
    subtotal: 5850.0,
    freightAndCustoms: 210.0,
    tax: 180.0,
    totalAmount: 6240.0,
    currency: 'GBP',
    paymentStatus: 'net30_pending',
    carrier: 'FedEx International Priority',
    trackingNumber: 'FDX-774102941',
    notes: 'Mill confirmed bolt rolling. Dispatched from Huddersfield finishing plant.',
    receivingNotes: '',
    createdAt: '2026-10-08T11:00:00Z',
    updatedAt: '2026-10-09T09:30:00Z',
  },
  {
    id: 'po_003',
    poNumber: 'PO-2026-0090',
    supplierId: 'sup_gritti',
    supplierName: 'Gritti Group Buttons',
    supplierContact: 'Marco Gritti (sales@grittigroup.com)',
    issueDate: '2026-09-28T14:00:00Z',
    expectedDate: '2026-10-05T18:00:00Z',
    actualDeliveryDate: '2026-10-05T14:30:00Z',
    status: 'received',
    items: [
      {
        id: 'poi_003',
        itemType: 'material',
        itemId: 'mat_003_horn',
        sku: 'TRM-HORN-32L',
        name: 'Genuine Water Buffalo Horn Buttons (32L)',
        quantity: 200,
        unit: 'pieces',
        unitPrice: 2.4,
        lineTotal: 480.0,
      },
      {
        id: 'poi_004',
        itemType: 'material',
        itemId: 'mat_004_mop',
        sku: 'TRM-MOP-18L',
        name: 'Smoked Mother-of-Pearl Buttons (18L)',
        quantity: 100,
        unit: 'pieces',
        unitPrice: 3.2,
        lineTotal: 320.0,
      },
    ],
    subtotal: 800.0,
    freightAndCustoms: 45.0,
    tax: 35.0,
    totalAmount: 880.0,
    currency: 'GBP',
    paymentStatus: 'paid',
    carrier: 'UPS Standard Europe',
    trackingNumber: '1Z9928190012',
    notes: 'Seasonal restock of artisan buttons. Fully inspected and verified in Grassobbio.',
    receivingNotes: 'Batch passed visual check. 0% defect rate. Added to Drawers B-01 and B-04.',
    receivedBy: 'Master Cutter Arthur Vance',
    createdAt: '2026-09-28T14:00:00Z',
    updatedAt: '2026-10-05T15:00:00Z',
  },
  {
    id: 'po_004',
    poNumber: 'PO-2026-0091',
    supplierId: 'sup_scabal',
    supplierName: 'Scabal S.A.',
    supplierContact: 'Philippe De Smet (atelier.bespoke@scabal.com)',
    issueDate: '2026-10-12T09:15:00Z',
    expectedDate: '2026-10-22T18:00:00Z',
    status: 'draft',
    items: [
      {
        id: 'poi_005',
        itemType: 'fabric',
        itemId: 'fab_hs_006',
        sku: 'FAB-HS-006',
        name: 'Holland & Sherry Crispaire High-Twist Fresco (Pine)',
        quantity: 20.0,
        unit: 'meters',
        unitPrice: 145.0,
        lineTotal: 2900.0,
      },
    ],
    subtotal: 2900.0,
    freightAndCustoms: 120.0,
    tax: 100.0,
    totalAmount: 3120.0,
    currency: 'GBP',
    paymentStatus: 'unpaid',
    notes: 'Urgent replenishing draft to cover active order deficit on order DM-2026-9482.',
    receivingNotes: '',
    createdAt: '2026-10-12T09:15:00Z',
    updatedAt: '2026-10-12T09:15:00Z',
  },
];

export const INITIAL_GARMENT_BOMS: GarmentBomModel[] = [
  {
    garmentName: 'Savile Row 3-Piece Tuxedo Suit',
    category: 'Full Suit',
    retailPriceGbp: 3850,
    fabricUsageMeters: 4.2,
    fabricCostPerMeter: 185.0, // £777
    liningUsageMeters: 3.0,
    liningCostPerMeter: 18.0, // £54
    canvasCost: 64.0, // 2m horsehair
    buttonsCost: 28.8, // 12 horn buttons
    zippersSundriesCost: 45.0, // Raccagni + Gütermann + collar chain
    craftLaborHours: 42,
    laborRatePerHour: 45.0, // £1,890
  },
  {
    garmentName: 'Anatomical Overcoat (Loro Piana Storm System)',
    category: 'Outerwear',
    retailPriceGbp: 4200,
    fabricUsageMeters: 3.8,
    fabricCostPerMeter: 210.0, // £798
    liningUsageMeters: 3.5,
    liningCostPerMeter: 18.0, // £63
    canvasCost: 55.0,
    buttonsCost: 36.0,
    zippersSundriesCost: 50.0,
    craftLaborHours: 36,
    laborRatePerHour: 45.0, // £1,620
  },
  {
    garmentName: 'Bespoke Double-Cuff Dress Shirt',
    category: 'Shirting',
    retailPriceGbp: 420,
    fabricUsageMeters: 2.1,
    fabricCostPerMeter: 68.0, // £142.80
    liningUsageMeters: 0,
    liningCostPerMeter: 0,
    canvasCost: 12.0, // collar & cuff interlining
    buttonsCost: 25.6, // 8 MOP buttons
    zippersSundriesCost: 10.0,
    craftLaborHours: 4.5,
    laborRatePerHour: 40.0, // £180
  },
  {
    garmentName: 'Kurashiki Selvedge Artisan Overshirt',
    category: 'Casual Bespoke',
    retailPriceGbp: 680,
    fabricUsageMeters: 2.8,
    fabricCostPerMeter: 55.0, // £154
    liningUsageMeters: 0,
    liningCostPerMeter: 0,
    canvasCost: 8.0,
    buttonsCost: 19.2,
    zippersSundriesCost: 25.0,
    craftLaborHours: 7.0,
    laborRatePerHour: 40.0, // £280
  },
];

class InventoryStore {
  private fabrics: FabricItem[] = [];
  private materials: MaterialItem[] = [];
  private suppliers: Supplier[] = [];
  private purchaseOrders: PurchaseOrder[] = [];
  private garmentBoms: GarmentBomModel[] = [];
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      const fabData = localStorage.getItem(`${STORAGE_KEY_PREFIX}_fabrics`);
      this.fabrics = fabData ? JSON.parse(fabData) : INITIAL_FABRICS;

      const matData = localStorage.getItem(`${STORAGE_KEY_PREFIX}_materials`);
      this.materials = matData ? JSON.parse(matData) : INITIAL_MATERIALS;

      const supData = localStorage.getItem(`${STORAGE_KEY_PREFIX}_suppliers`);
      this.suppliers = supData ? JSON.parse(supData) : INITIAL_SUPPLIERS;

      const poData = localStorage.getItem(`${STORAGE_KEY_PREFIX}_pos`);
      this.purchaseOrders = poData ? JSON.parse(poData) : INITIAL_PURCHASE_ORDERS;

      const bomData = localStorage.getItem(`${STORAGE_KEY_PREFIX}_boms`);
      this.garmentBoms = bomData ? JSON.parse(bomData) : INITIAL_GARMENT_BOMS;
    } catch {
      this.fabrics = INITIAL_FABRICS;
      this.materials = INITIAL_MATERIALS;
      this.suppliers = INITIAL_SUPPLIERS;
      this.purchaseOrders = INITIAL_PURCHASE_ORDERS;
      this.garmentBoms = INITIAL_GARMENT_BOMS;
    }
  }

  private persist() {
    try {
      localStorage.setItem(`${STORAGE_KEY_PREFIX}_fabrics`, JSON.stringify(this.fabrics));
      localStorage.setItem(`${STORAGE_KEY_PREFIX}_materials`, JSON.stringify(this.materials));
      localStorage.setItem(`${STORAGE_KEY_PREFIX}_suppliers`, JSON.stringify(this.suppliers));
      localStorage.setItem(`${STORAGE_KEY_PREFIX}_pos`, JSON.stringify(this.purchaseOrders));
      localStorage.setItem(`${STORAGE_KEY_PREFIX}_boms`, JSON.stringify(this.garmentBoms));
    } catch (err) {
      console.error('Failed to persist inventory store', err);
    }
    this.notify();
  }

  public subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((l) => l());
  }

  // --- GETTERS ---
  public getFabrics(): FabricItem[] {
    return [...this.fabrics];
  }

  public getMaterials(): MaterialItem[] {
    return [...this.materials];
  }

  public getSuppliers(): Supplier[] {
    return [...this.suppliers];
  }

  public getPurchaseOrders(): PurchaseOrder[] {
    return [...this.purchaseOrders];
  }

  public getGarmentBoms(): GarmentBomModel[] {
    return [...this.garmentBoms];
  }

  public getStockAlerts(): StockAlert[] {
    const alerts: StockAlert[] = [];

    // Analyze fabrics
    this.fabrics.forEach((fab) => {
      const available = fab.currentStockMeters - fab.reservedMeters;
      if (available < 0) {
        // Critical deficit: reserved exceeds stock
        alerts.push({
          id: `alt_crit_fab_${fab.id}`,
          severity: 'critical',
          itemType: 'fabric',
          itemId: fab.id,
          sku: fab.sku,
          itemName: fab.name,
          currentQuantity: fab.currentStockMeters,
          threshold: fab.minReorderThresholdMeters,
          deficit: Math.abs(available),
          unit: 'meters',
          message: `CRITICAL DEFICIT: Active bespoke orders require ${fab.reservedMeters}m, but only ${fab.currentStockMeters}m in stock. Deficit: ${Math.abs(available).toFixed(1)}m.`,
          affectedOrderNumbers: fab.reservedOrderNumbers || [],
          recommendedSupplierId: fab.supplierId,
          recommendedSupplierName: fab.supplierName,
          recommendedOrderQty: Math.max(fab.minReorderThresholdMeters * 2, Math.abs(available) + 15),
          isAcknowledged: false,
          timestamp: fab.updatedAt,
        });
      } else if (fab.currentStockMeters <= fab.minReorderThresholdMeters) {
        alerts.push({
          id: `alt_warn_fab_${fab.id}`,
          severity: 'warning',
          itemType: 'fabric',
          itemId: fab.id,
          sku: fab.sku,
          itemName: fab.name,
          currentQuantity: fab.currentStockMeters,
          threshold: fab.minReorderThresholdMeters,
          deficit: fab.minReorderThresholdMeters - fab.currentStockMeters,
          unit: 'meters',
          message: `Bolt below safety threshold (${fab.currentStockMeters}m remaining, minimum safety buffer: ${fab.minReorderThresholdMeters}m).`,
          affectedOrderNumbers: fab.reservedOrderNumbers || [],
          recommendedSupplierId: fab.supplierId,
          recommendedSupplierName: fab.supplierName,
          recommendedOrderQty: fab.minReorderThresholdMeters * 2,
          isAcknowledged: false,
          timestamp: fab.updatedAt,
        });
      }
    });

    // Analyze materials
    this.materials.forEach((mat) => {
      const available = mat.currentStock - mat.reservedStock;
      if (available < 0) {
        alerts.push({
          id: `alt_crit_mat_${mat.id}`,
          severity: 'critical',
          itemType: 'material',
          itemId: mat.id,
          sku: mat.sku,
          itemName: mat.name,
          currentQuantity: mat.currentStock,
          threshold: mat.minThreshold,
          deficit: Math.abs(available),
          unit: mat.unit,
          message: `CRITICAL SHORTAGE: Trims reserved exceed stock by ${Math.abs(available)} ${mat.unit}.`,
          affectedOrderNumbers: ['DM-2026-9480'],
          recommendedSupplierId: mat.supplierId,
          recommendedSupplierName: mat.supplierName,
          recommendedOrderQty: mat.reorderQuantity,
          isAcknowledged: false,
          timestamp: mat.updatedAt,
        });
      } else if (mat.currentStock <= mat.minThreshold) {
        alerts.push({
          id: `alt_warn_mat_${mat.id}`,
          severity: 'warning',
          itemType: 'material',
          itemId: mat.id,
          sku: mat.sku,
          itemName: mat.name,
          currentQuantity: mat.currentStock,
          threshold: mat.minThreshold,
          deficit: mat.minThreshold - mat.currentStock,
          unit: mat.unit,
          message: `Stock level (${mat.currentStock} ${mat.unit}) has breached reorder threshold (${mat.minThreshold} ${mat.unit}).`,
          affectedOrderNumbers: [],
          recommendedSupplierId: mat.supplierId,
          recommendedSupplierName: mat.supplierName,
          recommendedOrderQty: mat.reorderQuantity,
          isAcknowledged: false,
          timestamp: mat.updatedAt,
        });
      }
    });

    return alerts.sort((a, b) => {
      if (a.severity === 'critical' && b.severity !== 'critical') return -1;
      if (b.severity === 'critical' && a.severity !== 'critical') return 1;
      return 0;
    });
  }

  public getCostSummary(): InventoryCostSummary {
    const totalFabricValuationGbp = this.fabrics.reduce(
      (sum, f) => sum + f.currentStockMeters * f.costPerMeter,
      0
    );

    const totalMaterialValuationGbp = this.materials.reduce(
      (sum, m) => sum + m.currentStock * m.unitCost,
      0
    );

    const totalMetersInStock = this.fabrics.reduce(
      (sum, f) => sum + f.currentStockMeters,
      0
    );

    const activePoCapitalGbp = this.purchaseOrders
      .filter((po) => po.status === 'confirmed' || po.status === 'in_transit')
      .reduce((sum, po) => sum + po.totalAmount, 0);

    return {
      totalFabricValuationGbp: Math.round(totalFabricValuationGbp),
      totalMaterialValuationGbp: Math.round(totalMaterialValuationGbp),
      totalInventoryValuationGbp: Math.round(totalFabricValuationGbp + totalMaterialValuationGbp),
      totalMetersInStock: Math.round(totalMetersInStock * 10) / 10,
      activePoCapitalGbp: Math.round(activePoCapitalGbp),
      averageWastagePercent: 2.1,
      averageGarmentMarginPercent: 58.4,
      monthlyProcurementSpend: [
        { month: 'May 2026', spendGbp: 14200, ordersCount: 4 },
        { month: 'Jun 2026', spendGbp: 18900, ordersCount: 5 },
        { month: 'Jul 2026', spendGbp: 22400, ordersCount: 6 },
        { month: 'Aug 2026', spendGbp: 16800, ordersCount: 4 },
        { month: 'Sep 2026', spendGbp: 28500, ordersCount: 7 },
        { month: 'Oct 2026', spendGbp: 14940, ordersCount: 4 },
      ],
    };
  }

  // --- FABRIC ACTIONS ---
  public addFabric(fabricData: Omit<FabricItem, 'id' | 'createdAt' | 'updatedAt'>) {
    const newFab: FabricItem = {
      ...fabricData,
      id: `fab_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.fabrics = [newFab, ...this.fabrics];
    this.persist();
    return newFab;
  }

  public updateFabric(id: string, updates: Partial<FabricItem>) {
    this.fabrics = this.fabrics.map((f) => {
      if (f.id === id) {
        const updated = { ...f, ...updates, updatedAt: new Date().toISOString() };
        // compute status
        if (updated.currentStockMeters <= 0) {
          updated.status = 'out_of_stock';
        } else if (updated.currentStockMeters <= updated.minReorderThresholdMeters) {
          updated.status = 'low_stock';
        } else {
          updated.status = 'in_stock';
        }
        return updated;
      }
      return f;
    });
    this.persist();
  }

  public deleteFabric(id: string) {
    this.fabrics = this.fabrics.filter((f) => f.id !== id);
    this.persist();
  }

  public adjustFabricStock(
    id: string,
    deltaMeters: number,
    reason: 'delivery' | 'order_allocation' | 'sampling' | 'shrinkage' | 'manual_audit'
  ) {
    const target = this.fabrics.find((f) => f.id === id);
    if (!target) return;

    const newStock = Math.max(0, target.currentStockMeters + deltaMeters);
    this.updateFabric(id, {
      currentStockMeters: Math.round(newStock * 100) / 100,
      notes: `${target.notes || ''}\n[${new Date().toLocaleDateString()}] Stock adjusted by ${deltaMeters > 0 ? '+' : ''}${deltaMeters}m (${reason}).`.trim(),
    });
  }

  // --- MATERIAL ACTIONS ---
  public addMaterial(materialData: Omit<MaterialItem, 'id' | 'updatedAt'>) {
    const newMat: MaterialItem = {
      ...materialData,
      id: `mat_${Date.now()}`,
      updatedAt: new Date().toISOString(),
    };
    this.materials = [newMat, ...this.materials];
    this.persist();
    return newMat;
  }

  public updateMaterial(id: string, updates: Partial<MaterialItem>) {
    this.materials = this.materials.map((m) => {
      if (m.id === id) {
        const updated = { ...m, ...updates, updatedAt: new Date().toISOString() };
        if (updated.currentStock <= 0) {
          updated.status = 'out_of_stock';
        } else if (updated.currentStock <= updated.minThreshold) {
          updated.status = 'low_stock';
        } else {
          updated.status = 'in_stock';
        }
        return updated;
      }
      return m;
    });
    this.persist();
  }

  public deleteMaterial(id: string) {
    this.materials = this.materials.filter((m) => m.id !== id);
    this.persist();
  }

  public adjustMaterialStock(id: string, deltaQty: number) {
    const target = this.materials.find((m) => m.id === id);
    if (!target) return;
    const newStock = Math.max(0, target.currentStock + deltaQty);
    this.updateMaterial(id, { currentStock: newStock });
  }

  // --- SUPPLIER ACTIONS ---
  public addSupplier(supplierData: Omit<Supplier, 'id' | 'createdAt'>) {
    const newSup: Supplier = {
      ...supplierData,
      id: `sup_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    this.suppliers = [newSup, ...this.suppliers];
    this.persist();
    return newSup;
  }

  public updateSupplier(id: string, updates: Partial<Supplier>) {
    this.suppliers = this.suppliers.map((s) => (s.id === id ? { ...s, ...updates } : s));
    this.persist();
  }

  public deleteSupplier(id: string) {
    this.suppliers = this.suppliers.filter((s) => s.id !== id);
    this.persist();
  }

  // --- PURCHASE ORDER ACTIONS ---
  public createPurchaseOrder(
    poData: Omit<PurchaseOrder, 'id' | 'createdAt' | 'updatedAt'>
  ) {
    const newPo: PurchaseOrder = {
      ...poData,
      id: `po_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.purchaseOrders = [newPo, ...this.purchaseOrders];

    // Increment supplier active PO count
    this.suppliers = this.suppliers.map((s) =>
      s.id === poData.supplierId ? { ...s, activePoCount: s.activePoCount + 1 } : s
    );

    this.persist();
    return newPo;
  }

  public updatePurchaseOrderStatus(
    id: string,
    status: PurchaseOrder['status'],
    carrierInfo?: { carrier?: string; trackingNumber?: string }
  ) {
    this.purchaseOrders = this.purchaseOrders.map((po) => {
      if (po.id === id) {
        return {
          ...po,
          status,
          carrier: carrierInfo?.carrier ?? po.carrier,
          trackingNumber: carrierInfo?.trackingNumber ?? po.trackingNumber,
          updatedAt: new Date().toISOString(),
        };
      }
      return po;
    });
    this.persist();
  }

  public receiveAndRestockPurchaseOrder(
    poId: string,
    receivingNotes: string,
    inspectorName: string
  ) {
    const targetPo = this.purchaseOrders.find((p) => p.id === poId);
    if (!targetPo) return;

    // Automatically restock line items!
    targetPo.items.forEach((item) => {
      if (item.itemType === 'fabric') {
        const fab = this.fabrics.find((f) => f.id === item.itemId || f.sku === item.sku);
        if (fab) {
          this.adjustFabricStock(fab.id, item.quantity, 'delivery');
        }
      } else if (item.itemType === 'material') {
        const mat = this.materials.find((m) => m.id === item.itemId || m.sku === item.sku);
        if (mat) {
          this.adjustMaterialStock(mat.id, item.quantity);
        }
      }
    });

    // Update PO status
    this.purchaseOrders = this.purchaseOrders.map((po) => {
      if (po.id === poId) {
        return {
          ...po,
          status: 'received',
          actualDeliveryDate: new Date().toISOString(),
          paymentStatus: 'paid',
          receivingNotes,
          receivedBy: inspectorName,
          updatedAt: new Date().toISOString(),
        };
      }
      return po;
    });

    // Decrement supplier active PO count & add spend
    this.suppliers = this.suppliers.map((s) =>
      s.id === targetPo.supplierId
        ? {
            ...s,
            activePoCount: Math.max(0, s.activePoCount - 1),
            totalSpendGbp: s.totalSpendGbp + targetPo.totalAmount,
          }
        : s
    );

    this.persist();
  }

  public deletePurchaseOrder(id: string) {
    this.purchaseOrders = this.purchaseOrders.filter((po) => po.id !== id);
    this.persist();
  }

  // --- GARMENT BOM ACTIONS ---
  public updateGarmentBom(index: number, updated: GarmentBomModel) {
    this.garmentBoms[index] = updated;
    this.persist();
  }

  public resetToDefaults() {
    this.fabrics = INITIAL_FABRICS;
    this.materials = INITIAL_MATERIALS;
    this.suppliers = INITIAL_SUPPLIERS;
    this.purchaseOrders = INITIAL_PURCHASE_ORDERS;
    this.garmentBoms = INITIAL_GARMENT_BOMS;
    this.persist();
  }
}

export const inventoryStore = new InventoryStore();

export function useInventoryStore() {
  const [fabrics, setFabrics] = useState<FabricItem[]>(inventoryStore.getFabrics());
  const [materials, setMaterials] = useState<MaterialItem[]>(inventoryStore.getMaterials());
  const [suppliers, setSuppliers] = useState<Supplier[]>(inventoryStore.getSuppliers());
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(
    inventoryStore.getPurchaseOrders()
  );
  const [garmentBoms, setGarmentBoms] = useState<GarmentBomModel[]>(
    inventoryStore.getGarmentBoms()
  );
  const [stockAlerts, setStockAlerts] = useState<StockAlert[]>(inventoryStore.getStockAlerts());
  const [costSummary, setCostSummary] = useState<InventoryCostSummary>(
    inventoryStore.getCostSummary()
  );

  useEffect(() => {
    const unsubscribe = inventoryStore.subscribe(() => {
      setFabrics(inventoryStore.getFabrics());
      setMaterials(inventoryStore.getMaterials());
      setSuppliers(inventoryStore.getSuppliers());
      setPurchaseOrders(inventoryStore.getPurchaseOrders());
      setGarmentBoms(inventoryStore.getGarmentBoms());
      setStockAlerts(inventoryStore.getStockAlerts());
      setCostSummary(inventoryStore.getCostSummary());
    });
    return () => {
      unsubscribe();
    };
  }, []);

  return {
    fabrics,
    materials,
    suppliers,
    purchaseOrders,
    garmentBoms,
    stockAlerts,
    costSummary,
    // Methods
    addFabric: (fab: Omit<FabricItem, 'id' | 'createdAt' | 'updatedAt'>) =>
      inventoryStore.addFabric(fab),
    updateFabric: (id: string, updates: Partial<FabricItem>) =>
      inventoryStore.updateFabric(id, updates),
    deleteFabric: (id: string) => inventoryStore.deleteFabric(id),
    adjustFabricStock: (
      id: string,
      delta: number,
      reason: 'delivery' | 'order_allocation' | 'sampling' | 'shrinkage' | 'manual_audit'
    ) => inventoryStore.adjustFabricStock(id, delta, reason),

    addMaterial: (mat: Omit<MaterialItem, 'id' | 'updatedAt'>) =>
      inventoryStore.addMaterial(mat),
    updateMaterial: (id: string, updates: Partial<MaterialItem>) =>
      inventoryStore.updateMaterial(id, updates),
    deleteMaterial: (id: string) => inventoryStore.deleteMaterial(id),
    adjustMaterialStock: (id: string, delta: number) =>
      inventoryStore.adjustMaterialStock(id, delta),

    addSupplier: (sup: Omit<Supplier, 'id' | 'createdAt'>) => inventoryStore.addSupplier(sup),
    updateSupplier: (id: string, updates: Partial<Supplier>) =>
      inventoryStore.updateSupplier(id, updates),
    deleteSupplier: (id: string) => inventoryStore.deleteSupplier(id),

    createPurchaseOrder: (po: Omit<PurchaseOrder, 'id' | 'createdAt' | 'updatedAt'>) =>
      inventoryStore.createPurchaseOrder(po),
    updatePurchaseOrderStatus: (
      id: string,
      status: PurchaseOrder['status'],
      carrierInfo?: { carrier?: string; trackingNumber?: string }
    ) => inventoryStore.updatePurchaseOrderStatus(id, status, carrierInfo),
    receiveAndRestockPurchaseOrder: (
      poId: string,
      receivingNotes: string,
      inspectorName: string
    ) => inventoryStore.receiveAndRestockPurchaseOrder(poId, receivingNotes, inspectorName),
    deletePurchaseOrder: (id: string) => inventoryStore.deletePurchaseOrder(id),

    updateGarmentBom: (idx: number, updated: GarmentBomModel) =>
      inventoryStore.updateGarmentBom(idx, updated),
    resetToDefaults: () => inventoryStore.resetToDefaults(),
  };
}

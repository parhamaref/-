/**
 * @file inventory.types.ts
 * Enterprise type definitions for the Atelier Inventory & Supplier Management Suite.
 * Covers Fabric Rolls/Yardage, Haberdashery Materials & Trims, Mill Suppliers,
 * Purchase Tracking & Receiving, Automated Stock Alerts, and Financial Cost Analysis.
 */

export type StockStatus = 'in_stock' | 'low_stock' | 'out_of_stock' | 'discontinued';

export interface FabricItem {
  id: string;
  sku: string;
  name: string;
  supplierId: string;
  supplierName: string;
  millCode: string;
  composition: string;
  weave: 'Herringbone' | 'Twill' | 'Plain Weave' | 'Sateen' | 'Flannel' | 'Jacquard' | 'Velvet' | 'Selvedge';
  weightGsm: number;
  widthCm: number;
  colorName: string;
  hexColor: string;
  currentStockMeters: number;
  reservedMeters: number;
  minReorderThresholdMeters: number;
  costPerMeter: number;
  currency: 'GBP' | 'EUR' | 'USD';
  storageLocation: string; // e.g. "Bay 04 - Shelf B2"
  batchLotNumber: string;
  inspectionStatus: 'Passed' | 'Pending' | 'Flagged';
  swatchImageUrl: string;
  shrinkageRatePercent: number;
  leadTimeDays: number;
  status: StockStatus;
  notes?: string;
  reservedOrderNumbers?: string[];
  createdAt: string;
  updatedAt: string;
}

export type MaterialCategory =
  | 'Buttons'
  | 'Linings'
  | 'Canvas & Interfacing'
  | 'Zippers & Fasteners'
  | 'Threads & Sundries'
  | 'Hardware';

export type MaterialUnit = 'pieces' | 'meters' | 'spools' | 'sets' | 'gross';

export interface MaterialItem {
  id: string;
  sku: string;
  name: string;
  category: MaterialCategory;
  supplierId: string;
  supplierName: string;
  unit: MaterialUnit;
  unitCost: number;
  currency: 'GBP' | 'EUR' | 'USD';
  currentStock: number;
  reservedStock: number;
  minThreshold: number;
  reorderQuantity: number;
  storageBin: string;
  colorOrFinish: string;
  photoUrl: string;
  status: StockStatus;
  notes?: string;
  updatedAt: string;
}

export type SupplierTier = 'Strategic Partner' | 'Preferred Mill' | 'Artisan Specialist' | 'Standard';

export interface Supplier {
  id: string;
  name: string;
  code: string;
  specialty: string;
  country: string;
  city: string;
  contactName: string;
  email: string;
  phone: string;
  website: string;
  qualityRating: number; // 1 to 5
  averageLeadTimeDays: number;
  moqMeters: number;
  paymentTerms: string; // e.g. "Net 30 EOM", "50% Advance"
  certifications: string[]; // e.g. ["OEKO-TEX 100", "GOTS Organic", "RWS Wool"]
  tier: SupplierTier;
  activePoCount: number;
  totalSpendGbp: number;
  notes?: string;
  currency: 'GBP' | 'EUR' | 'USD';
  createdAt: string;
}

export type PurchaseOrderStatus =
  | 'draft'
  | 'sent'
  | 'confirmed'
  | 'in_transit'
  | 'customs_clearance'
  | 'received'
  | 'cancelled';

export interface PurchaseOrderLineItem {
  id: string;
  itemType: 'fabric' | 'material';
  itemId: string;
  sku: string;
  name: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  lineTotal: number;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  supplierId: string;
  supplierName: string;
  supplierContact: string;
  issueDate: string;
  expectedDate: string;
  actualDeliveryDate?: string;
  status: PurchaseOrderStatus;
  items: PurchaseOrderLineItem[];
  subtotal: number;
  freightAndCustoms: number;
  tax: number;
  totalAmount: number;
  currency: 'GBP' | 'EUR' | 'USD';
  paymentStatus: 'unpaid' | 'deposit_paid' | 'paid' | 'net30_pending';
  carrier?: string;
  trackingNumber?: string;
  notes?: string;
  receivingNotes?: string;
  receivedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export type AlertSeverity = 'critical' | 'warning' | 'info' | 'surplus';

export interface StockAlert {
  id: string;
  severity: AlertSeverity;
  itemType: 'fabric' | 'material';
  itemId: string;
  sku: string;
  itemName: string;
  currentQuantity: number;
  threshold: number;
  deficit: number;
  unit: string;
  message: string;
  affectedOrderNumbers: string[];
  recommendedSupplierId: string;
  recommendedSupplierName: string;
  recommendedOrderQty: number;
  isAcknowledged: boolean;
  timestamp: string;
}

export interface GarmentBomModel {
  garmentName: string;
  category: string;
  retailPriceGbp: number;
  fabricUsageMeters: number;
  fabricCostPerMeter: number;
  liningUsageMeters: number;
  liningCostPerMeter: number;
  canvasCost: number;
  buttonsCost: number;
  zippersSundriesCost: number;
  craftLaborHours: number;
  laborRatePerHour: number;
}

export interface InventoryCostSummary {
  totalFabricValuationGbp: number;
  totalMaterialValuationGbp: number;
  totalInventoryValuationGbp: number;
  totalMetersInStock: number;
  activePoCapitalGbp: number;
  averageWastagePercent: number;
  averageGarmentMarginPercent: number;
  monthlyProcurementSpend: {
    month: string;
    spendGbp: number;
    ordersCount: number;
  }[];
}

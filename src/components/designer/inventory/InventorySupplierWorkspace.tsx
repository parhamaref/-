/**
 * @file InventorySupplierWorkspace.tsx
 * Master Workspace for Atelier Inventory & Mill Supplier Management.
 * Integrates Fabric Inventory, Haberdashery Materials, Mill Suppliers,
 * Purchase Tracking & Receiving, Automated Stock Alerts, and Financial Cost Analysis.
 */

import React, { useState } from 'react';
import {
  Boxes,
  Layers,
  Sparkles,
  Truck,
  ShoppingCart,
  AlertTriangle,
  TrendingUp,
  RotateCcw,
  Plus,
  CheckCircle2,
} from 'lucide-react';
import { useInventoryStore } from '../../../stores/inventoryStore';
import { FabricInventoryView } from './FabricInventoryView';
import { MaterialInventoryView } from './MaterialInventoryView';
import { SupplierRegistryView } from './SupplierRegistryView';
import { PurchaseTrackingView } from './PurchaseTrackingView';
import { StockAlertsView } from './StockAlertsView';
import { CostAnalysisView } from './CostAnalysisView';

export type InventoryTab =
  | 'fabrics'
  | 'materials'
  | 'suppliers'
  | 'purchases'
  | 'alerts'
  | 'costs';

interface InventorySupplierWorkspaceProps {
  initialTab?: InventoryTab;
}

export const InventorySupplierWorkspace: React.FC<InventorySupplierWorkspaceProps> = ({
  initialTab = 'fabrics',
}) => {
  const [activeTab, setActiveTab] = useState<InventoryTab>(initialTab);
  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);

  const {
    fabrics,
    materials,
    suppliers,
    purchaseOrders,
    garmentBoms,
    stockAlerts,
    costSummary,
    addFabric,
    updateFabric,
    deleteFabric,
    adjustFabricStock,
    addMaterial,
    updateMaterial,
    deleteMaterial,
    adjustMaterialStock,
    addSupplier,
    updateSupplier,
    deleteSupplier,
    createPurchaseOrder,
    updatePurchaseOrderStatus,
    receiveAndRestockPurchaseOrder,
    deletePurchaseOrder,
    updateGarmentBom,
    resetToDefaults,
  } = useInventoryStore();

  const showNotification = (msg: string) => {
    setNotificationMsg(msg);
    setTimeout(() => {
      setNotificationMsg(null);
    }, 4000);
  };

  const handleAddFabric = (data: any) => {
    addFabric(data);
    showNotification(`Fabric bolt "${data.name}" registered successfully.`);
  };

  const handleUpdateFabric = (id: string, updates: any) => {
    updateFabric(id, updates);
    showNotification('Fabric bolt details updated.');
  };

  const handleDeleteFabric = (id: string) => {
    deleteFabric(id);
    showNotification('Fabric bolt deleted from inventory.');
  };

  const handleAdjustFabricStock = (
    id: string,
    delta: number,
    reason: 'delivery' | 'order_allocation' | 'sampling' | 'shrinkage' | 'manual_audit'
  ) => {
    adjustFabricStock(id, delta, reason);
    showNotification(`Adjusted bolt stock by ${delta > 0 ? '+' : ''}${delta}m (${reason}).`);
  };

  const handleAddMaterial = (data: any) => {
    addMaterial(data);
    showNotification(`Material "${data.name}" added to inventory.`);
  };

  const handleUpdateMaterial = (id: string, updates: any) => {
    updateMaterial(id, updates);
    showNotification('Material updated.');
  };

  const handleDeleteMaterial = (id: string) => {
    deleteMaterial(id);
    showNotification('Material deleted.');
  };

  const handleAdjustMaterialStock = (id: string, delta: number) => {
    adjustMaterialStock(id, delta);
    showNotification(`Material quantity adjusted by ${delta > 0 ? '+' : ''}${delta}.`);
  };

  const handleAddSupplier = (data: any) => {
    addSupplier(data);
    showNotification(`Partner mill "${data.name}" registered.`);
  };

  const handleUpdateSupplier = (id: string, updates: any) => {
    updateSupplier(id, updates);
    showNotification('Supplier dossier updated.');
  };

  const handleDeleteSupplier = (id: string) => {
    deleteSupplier(id);
    showNotification('Supplier deleted.');
  };

  const handleCreatePo = (poData: any) => {
    createPurchaseOrder(poData);
    showNotification(`Purchase Order ${poData.poNumber} generated successfully.`);
    setActiveTab('purchases');
  };

  const handleReceivePo = (poId: string, notes: string, inspector: string) => {
    receiveAndRestockPurchaseOrder(poId, notes, inspector);
    showNotification('Shipment received! Cloth rolls and trims automatically added to physical stock.');
  };

  const criticalAlertsCount = stockAlerts.filter((a) => a.severity === 'critical').length;
  const warningAlertsCount = stockAlerts.filter((a) => a.severity === 'warning').length;

  const tabs: {
    id: InventoryTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number;
    badgeColor?: string;
  }[] = [
    {
      id: 'fabrics',
      label: 'Fabric Inventory',
      icon: Layers,
      badge: fabrics.length,
    },
    {
      id: 'materials',
      label: 'Material Inventory',
      icon: Sparkles,
      badge: materials.length,
    },
    {
      id: 'suppliers',
      label: 'Mill Suppliers',
      icon: Truck,
      badge: suppliers.length,
    },
    {
      id: 'purchases',
      label: 'Purchase Tracking',
      icon: ShoppingCart,
      badge: purchaseOrders.filter(
        (po) => po.status === 'confirmed' || po.status === 'in_transit'
      ).length,
      badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    },
    {
      id: 'alerts',
      label: 'Stock Alerts',
      icon: AlertTriangle,
      badge: stockAlerts.length,
      badgeColor:
        criticalAlertsCount > 0
          ? 'bg-red-500/30 text-red-300 border-red-500 animate-pulse'
          : 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    },
    {
      id: 'costs',
      label: 'Cost Analysis',
      icon: TrendingUp,
    },
  ];

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Toast Notification */}
      {notificationMsg && (
        <div className="fixed bottom-6 right-6 z-50 p-4 bg-[#181818] border border-amber-500/50 rounded-xl shadow-2xl flex items-center gap-3 text-xs text-white max-w-md animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="flex-1 font-medium">{notificationMsg}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#222] pb-5">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Boxes className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-serif font-bold text-white tracking-wide">
                Inventory & Supplier Management
              </h1>
              <p className="text-xs text-gray-400 mt-0.5">
                Precision cloth yardage, haberdashery sundries, partner mills, purchase orders, and BOM margins
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 self-end md:self-auto">
          <button
            onClick={() => {
              if (window.confirm('Reset all inventory, suppliers, and purchase orders to luxury atelier defaults?')) {
                resetToDefaults();
                showNotification('Inventory system reset to factory presets.');
              }
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-400 hover:text-white bg-[#181818] hover:bg-[#222] rounded-lg border border-[#333] transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Data</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#222] scrollbar-none">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all border ${
                isActive
                  ? 'bg-amber-500 text-black font-semibold border-amber-400 shadow-lg shadow-amber-500/20'
                  : 'bg-[#141414] border-[#262626] text-gray-300 hover:text-white hover:border-[#3a3a3a]'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-black' : 'text-gray-400'}`} />
              <span>{tab.label}</span>
              {typeof tab.badge !== 'undefined' && (
                <span
                  className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-full border ${
                    isActive
                      ? 'bg-black text-amber-400 border-black'
                      : tab.badgeColor || 'bg-[#222] text-gray-300 border-[#333]'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Main Tab Content */}
      <div className="pt-2">
        {activeTab === 'fabrics' && (
          <FabricInventoryView
            fabrics={fabrics}
            suppliers={suppliers}
            onAddFabric={handleAddFabric}
            onUpdateFabric={handleUpdateFabric}
            onDeleteFabric={handleDeleteFabric}
            onAdjustStock={handleAdjustFabricStock}
            onCreatePo={handleCreatePo}
            allMaterials={materials}
          />
        )}

        {activeTab === 'materials' && (
          <MaterialInventoryView
            materials={materials}
            suppliers={suppliers}
            onAddMaterial={handleAddMaterial}
            onUpdateMaterial={handleUpdateMaterial}
            onDeleteMaterial={handleDeleteMaterial}
            onAdjustStock={handleAdjustMaterialStock}
            onCreatePo={handleCreatePo}
            allFabrics={fabrics}
          />
        )}

        {activeTab === 'suppliers' && (
          <SupplierRegistryView
            suppliers={suppliers}
            fabrics={fabrics}
            materials={materials}
            purchaseOrders={purchaseOrders}
            onAddSupplier={handleAddSupplier}
            onUpdateSupplier={handleUpdateSupplier}
            onDeleteSupplier={handleDeleteSupplier}
            onCreatePo={handleCreatePo}
          />
        )}

        {activeTab === 'purchases' && (
          <PurchaseTrackingView
            purchaseOrders={purchaseOrders}
            suppliers={suppliers}
            fabrics={fabrics}
            materials={materials}
            onCreatePo={handleCreatePo}
            onUpdatePoStatus={updatePurchaseOrderStatus}
            onReceivePo={handleReceivePo}
            onDeletePo={deletePurchaseOrder}
          />
        )}

        {activeTab === 'alerts' && (
          <StockAlertsView
            alerts={stockAlerts}
            suppliers={suppliers}
            fabrics={fabrics}
            materials={materials}
            onCreatePo={handleCreatePo}
          />
        )}

        {activeTab === 'costs' && (
          <CostAnalysisView
            costSummary={costSummary}
            garmentBoms={garmentBoms}
            fabrics={fabrics}
            materials={materials}
            onUpdateBom={updateGarmentBom}
          />
        )}
      </div>
    </div>
  );
};

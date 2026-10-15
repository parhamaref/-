/**
 * @file StockAlertsView.tsx
 * Automated Stock Alerts & Safety Buffer Trigger module for intelligent atelier inventory management.
 */

import React, { useState } from 'react';
import {
  AlertTriangle,
  AlertCircle,
  Bell,
  CheckCircle2,
  ShoppingCart,
  Clock,
  Tag,
  ArrowRight,
  ShieldAlert,
  Sliders,
  Layers,
  Sparkles,
} from 'lucide-react';
import { StockAlert, Supplier, FabricItem, MaterialItem } from '../../../types/inventory.types';
import { CreatePurchaseOrderModal } from './CreatePurchaseOrderModal';

interface StockAlertsViewProps {
  alerts: StockAlert[];
  suppliers: Supplier[];
  fabrics: FabricItem[];
  materials: MaterialItem[];
  onCreatePo: (poData: any) => void;
}

export const StockAlertsView: React.FC<StockAlertsViewProps> = ({
  alerts,
  suppliers,
  fabrics,
  materials,
  onCreatePo,
}) => {
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');
  const [reorderingAlert, setReorderingAlert] = useState<StockAlert | null>(null);

  const filteredAlerts = alerts.filter((alert) => {
    if (severityFilter === 'critical') return alert.severity === 'critical';
    if (severityFilter === 'warning') return alert.severity === 'warning';
    return true;
  });

  const criticalCount = alerts.filter((a) => a.severity === 'critical').length;
  const warningCount = alerts.filter((a) => a.severity === 'warning').length;

  return (
    <div className="space-y-6">
      {/* Critical Deficit Alert Banner if any exist */}
      {criticalCount > 0 && (
        <div className="p-4 bg-red-950/40 border border-red-500/50 rounded-xl flex items-start gap-3.5 text-xs text-red-200">
          <ShieldAlert className="w-5 h-5 text-red-400 shrink-0 mt-0.5 animate-pulse" />
          <div className="flex-1 space-y-1">
            <h4 className="font-semibold text-white text-sm">
              Critical Material Deficit Detected ({criticalCount} Items)
            </h4>
            <p className="text-red-300">
              Active bespoke customer orders currently exceed physical shop-floor yardage. Pattern
              cutting is at risk of production stoppage until replenishing cloth is confirmed.
            </p>
          </div>
          <button
            onClick={() => setSeverityFilter('critical')}
            className="px-3 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-200 border border-red-500/40 font-semibold transition-colors shrink-0"
          >
            Filter Deficits
          </button>
        </div>
      )}

      {/* Metrics Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-[#141414] border border-[#222] rounded-xl">
          <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
            <span>Critical Deficits</span>
            <AlertCircle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-mono font-bold text-rose-400">{criticalCount}</div>
          <span className="text-[11px] text-gray-500">Orders exceeding roll balance</span>
        </div>

        <div className="p-4 bg-[#141414] border border-[#222] rounded-xl">
          <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
            <span>Safety Buffer Warnings</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-mono font-bold text-amber-400">{warningCount}</div>
          <span className="text-[11px] text-gray-500">Breached minimum threshold</span>
        </div>

        <div className="p-4 bg-[#141414] border border-[#222] rounded-xl">
          <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
            <span>Fabric Bolt Hazards</span>
            <Layers className="w-4 h-4 text-gray-400" />
          </div>
          <div className="text-2xl font-mono font-bold text-white">
            {alerts.filter((a) => a.itemType === 'fabric').length}
          </div>
          <span className="text-[11px] text-gray-500">Textile rolls requiring reorder</span>
        </div>

        <div className="p-4 bg-[#141414] border border-[#222] rounded-xl">
          <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
            <span>Trim & Sundry Hazards</span>
            <Sparkles className="w-4 h-4 text-gray-400" />
          </div>
          <div className="text-2xl font-mono font-bold text-white">
            {alerts.filter((a) => a.itemType === 'material').length}
          </div>
          <span className="text-[11px] text-gray-500">Buttons, canvas & linings</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setSeverityFilter('ALL')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            severityFilter === 'ALL'
              ? 'bg-amber-500 text-black font-semibold'
              : 'bg-[#181818] border border-[#262626] text-gray-300 hover:text-white'
          }`}
        >
          All Stock Alerts ({alerts.length})
        </button>
        <button
          onClick={() => setSeverityFilter('critical')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            severityFilter === 'critical'
              ? 'bg-red-500 text-white font-semibold'
              : 'bg-[#181818] border border-[#262626] text-gray-300 hover:text-white'
          }`}
        >
          Critical Deficits ({criticalCount})
        </button>
        <button
          onClick={() => setSeverityFilter('warning')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            severityFilter === 'warning'
              ? 'bg-amber-500 text-black font-semibold'
              : 'bg-[#181818] border border-[#262626] text-gray-300 hover:text-white'
          }`}
        >
          Safety Buffer Warnings ({warningCount})
        </button>
      </div>

      {/* Alert Cards */}
      <div className="space-y-3.5">
        {filteredAlerts.map((alert) => {
          const isCritical = alert.severity === 'critical';

          return (
            <div
              key={alert.id}
              className={`p-5 rounded-xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all ${
                isCritical
                  ? 'bg-red-950/20 border-red-500/40 hover:border-red-500/60'
                  : 'bg-[#141414] border-amber-500/30 hover:border-amber-500/50'
              }`}
            >
              {/* Left Side: Icon & Details */}
              <div className="flex items-start gap-3.5 flex-1">
                <div
                  className={`p-2.5 rounded-lg shrink-0 mt-0.5 ${
                    isCritical
                      ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                      : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                  }`}
                >
                  {isCritical ? (
                    <AlertCircle className="w-5 h-5 animate-pulse" />
                  ) : (
                    <AlertTriangle className="w-5 h-5" />
                  )}
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`font-mono text-[10px] px-2 py-0.5 rounded font-medium border ${
                        isCritical
                          ? 'bg-red-950/80 border-red-500 text-red-300'
                          : 'bg-amber-950/80 border-amber-500 text-amber-300'
                      }`}
                    >
                      {alert.sku}
                    </span>
                    <span className="text-xs font-semibold text-white">{alert.itemName}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-[#222] text-gray-400 capitalize">
                      {alert.itemType}
                    </span>
                  </div>

                  <p className="text-xs text-gray-300">{alert.message}</p>

                  {/* Impacted Orders Strip */}
                  {alert.affectedOrderNumbers && alert.affectedOrderNumbers.length > 0 && (
                    <div className="flex items-center gap-2 text-xs pt-1">
                      <span className="text-gray-400 text-[11px]">Impacted Orders:</span>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {alert.affectedOrderNumbers.map((orderNum) => (
                          <span
                            key={orderNum}
                            className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded bg-black/60 border border-[#333] text-amber-300"
                          >
                            <Tag className="w-3 h-3" />
                            {orderNum}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Recommended Action */}
                  <div className="text-[11px] text-gray-400 pt-0.5 flex items-center gap-1.5">
                    <span>Recommended:</span>
                    <span className="text-emerald-400 font-medium">
                      Order +{alert.recommendedOrderQty} {alert.unit} from{' '}
                      {alert.recommendedSupplierName}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Side: Reorder CTA */}
              <div className="flex items-center gap-3 self-end md:self-auto shrink-0">
                <div className="text-right text-xs">
                  <span className="text-gray-500 block text-[10px]">Current Stock</span>
                  <span className="font-mono font-bold text-white text-sm">
                    {alert.currentQuantity} {alert.unit}
                  </span>
                  <span className="text-[10px] text-gray-500 block">
                    Min Threshold: {alert.threshold}
                  </span>
                </div>

                <button
                  onClick={() => setReorderingAlert(alert)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold shadow-lg transition-colors ${
                    isCritical
                      ? 'bg-red-500 hover:bg-red-400 text-white shadow-red-500/20'
                      : 'bg-amber-500 hover:bg-amber-400 text-black shadow-amber-500/20'
                  }`}
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Draft Purchase Order</span>
                </button>
              </div>
            </div>
          );
        })}

        {filteredAlerts.length === 0 && (
          <div className="p-8 text-center bg-[#141414] border border-[#222] rounded-xl text-gray-400 space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
            <h4 className="text-sm font-semibold text-white">All Stock Levels Optimal</h4>
            <p className="text-xs text-gray-500">
              No inventory deficits or low-stock safety triggers active at this time.
            </p>
          </div>
        )}
      </div>

      {/* Modal */}
      {reorderingAlert && (
        <CreatePurchaseOrderModal
          isOpen={!!reorderingAlert}
          onClose={() => setReorderingAlert(null)}
          suppliers={suppliers}
          fabrics={fabrics}
          materials={materials}
          onSave={onCreatePo}
          preselectedSupplierId={reorderingAlert.recommendedSupplierId}
          preselectedItem={{
            itemType: reorderingAlert.itemType,
            itemId: reorderingAlert.itemId,
            quantity: reorderingAlert.recommendedOrderQty,
          }}
        />
      )}
    </div>
  );
};

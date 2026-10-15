/**
 * @file CustomerPortal.tsx
 * Unified Customer Bespoke Portal Container.
 * Integrates Measurement Profile Versioning, Order & Delivery Tracking,
 * and Digital Wardrobe with lifetime alterations.
 */

import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { CustomerMeasurementsView } from './CustomerMeasurementsView';
import { CustomerOrderTracker } from './CustomerOrderTracker';
import { CustomerWardrobeView } from './CustomerWardrobeView';
import { CustomerAlterationsWorkspace } from '../alterations/CustomerAlterationsWorkspace';
import { CustomerDesignApprovalsView } from '../designApproval/CustomerDesignApprovalsView';
import { CustomerPreferencesWorkspace } from '../preferences/CustomerPreferencesWorkspace';
import { useDesignApprovalStore } from '../../stores/designApprovalStore';
import { ProtectedRoute } from '../auth/ProtectedRoute';
import { Ruler, Package, Layers, Sparkles, UserCheck, Scissors, FileCheck, Heart } from 'lucide-react';

interface CustomerPortalProps {
  initialTab?: 'measurements' | 'tracker' | 'wardrobe' | 'alterations' | 'approvals' | 'preferences';
  onNavigateHome?: () => void;
}

export const CustomerPortal: React.FC<CustomerPortalProps> = ({
  initialTab = 'tracker',
  onNavigateHome,
}) => {
  const [activeTab, setActiveTab] = useState<'measurements' | 'tracker' | 'wardrobe' | 'alterations' | 'approvals' | 'preferences'>(initialTab);
  const { currentUser, customerData, currentRole } = useAuth();
  const { countsByStage } = useDesignApprovalStore();

  const pendingApprovalsCount = countsByStage.SUBMITTED + countsByStage.UPDATED;

  React.useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  const customerId = customerData?.id || 'cust_001';
  const customerName = currentUser?.name || 'Lord Alistair Sterling-Fox';

  return (
    <ProtectedRoute
      module="Customers"
      action="view"
      resourceContext={{ customerId, ownerId: currentUser?.id }}
      onNavigateBack={onNavigateHome}
    >
      <div className="max-w-7xl 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-12 space-y-8 animate-fadeIn font-mono text-left">
        {/* Client Identity & VIP Tier Badge */}
        <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-6 bg-[#0E0E0E] border border-[#2B2B2B] p-6 rounded-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-sm bg-black border border-[#2B2B2B] flex items-center justify-center text-white shrink-0">
              <UserCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-serif text-xl sm:text-2xl text-white uppercase font-bold tracking-wider">
                  {customerName}
                </h1>
                <span className="text-[8.5px] font-mono px-2 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase font-bold rounded-2xs">
                  {customerData?.vipLevel || 'PRIVATE CLIENT'}
                </span>
              </div>
              <p className="text-[10px] text-neutral-400 font-sans mt-0.5">
                Client ID: <span className="font-mono text-neutral-300">{customerId}</span> • Salon Coordinate: Mayfair & Place Vendôme
              </p>
            </div>
          </div>

          {/* Navigation Subtabs (Responsive wrap for phones & tablets) */}
          <div className="flex flex-wrap sm:flex-nowrap border border-[#2B2B2B] rounded-xs overflow-hidden text-[9px] sm:text-[10px] bg-black/40 w-full lg:w-auto">
            <button
              onClick={() => setActiveTab('tracker')}
              className={`flex-1 sm:flex-initial px-3 sm:px-4 py-2.5 uppercase tracking-widest transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === 'tracker'
                  ? 'bg-white text-black font-bold shadow-md'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              <span>ORDERS & DISPATCH</span>
            </button>

            <button
              onClick={() => setActiveTab('measurements')}
              className={`flex-1 sm:flex-initial px-3 sm:px-4 py-2.5 uppercase tracking-widest transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === 'measurements'
                  ? 'bg-white text-black font-bold shadow-md'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Ruler className="w-3.5 h-3.5" />
              <span>MEASUREMENTS</span>
            </button>

            <button
              onClick={() => setActiveTab('wardrobe')}
              className={`flex-1 sm:flex-initial px-3 sm:px-4 py-2.5 uppercase tracking-widest transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === 'wardrobe'
                  ? 'bg-white text-black font-bold shadow-md'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>WARDROBE VAULT</span>
            </button>

            <button
              onClick={() => setActiveTab('approvals')}
              className={`flex-1 sm:flex-initial px-3 sm:px-4 py-2.5 uppercase tracking-widest transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === 'approvals'
                  ? 'bg-amber-500 text-black font-extrabold shadow-md'
                  : 'text-neutral-400 hover:text-amber-300'
              }`}
            >
              <FileCheck className="w-3.5 h-3.5" />
              <span>DESIGN APPROVALS</span>
              {pendingApprovalsCount > 0 && (
                <span className="px-1.5 py-0.2 text-[9px] bg-red-600 text-white rounded-full font-bold animate-pulse">
                  {pendingApprovalsCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('alterations')}
              className={`flex-1 sm:flex-initial px-3 sm:px-4 py-2.5 uppercase tracking-widest transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === 'alterations'
                  ? 'bg-amber-400 text-black font-bold shadow-md'
                  : 'text-neutral-400 hover:text-amber-300'
              }`}
            >
              <Scissors className="w-3.5 h-3.5" />
              <span>ALTERATIONS & TAILORING</span>
            </button>
          </div>
        </div>

        {/* Tab View Content */}
        <div className="bg-[#050505] min-h-[50vh]">
          {activeTab === 'tracker' && (
            <CustomerOrderTracker customerId={customerId} customerName={customerName} />
          )}

          {activeTab === 'approvals' && (
            <CustomerDesignApprovalsView customerId={customerId} customerName={customerName} />
          )}

          {activeTab === 'measurements' && (
            <CustomerMeasurementsView customerId={customerId} customerName={customerName} />
          )}

          {activeTab === 'wardrobe' && (
            <CustomerWardrobeView customerId={customerId} customerName={customerName} />
          )}

          {activeTab === 'alterations' && (
            <CustomerAlterationsWorkspace customerId={customerId} customerName={customerName} />
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default CustomerPortal;

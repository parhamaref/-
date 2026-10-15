/**
 * @file LogisticsManagerView.tsx
 * Logistics & White Glove Courier Dispatch Management Console.
 * Assigns waybill tracking numbers, coordinates carrier dispatch dates,
 * and manages delivery lifecycle state transitions (Dispatched -> In Transit -> Delivered).
 */

import React, { useState } from 'react';
import { Order, Delivery, DeliveryStatus, DeliveryMethod } from '../../types/daniels.types';
import { MOCK_ORDERS, MOCK_DELIVERIES, MOCK_CUSTOMERS, MOCK_PRODUCTS } from '../../mock/danielsMockData';
import { canTransitionDelivery } from '../../utils/danielsStateValidators';
import { logAuditAction } from '../../utils/rbac';
import { useAuth } from '../../contexts/AuthContext';
import {
  Truck,
  Package,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Calendar,
  UserCheck,
  ArrowRight,
  AlertTriangle,
  Check,
} from 'lucide-react';

interface LogisticsManagerViewProps {
  orders: Order[];
  onOrderUpdated: (updatedOrder: Order) => void;
}

export const LogisticsManagerView: React.FC<LogisticsManagerViewProps> = ({
  orders,
  onOrderUpdated,
}) => {
  const { currentUser } = useAuth();

  const [deliveries, setDeliveries] = useState<Delivery[]>(MOCK_DELIVERIES);
  const [selectedDeliveryId, setSelectedDeliveryId] = useState<string | null>(null);

  // Edit form state
  const [carrierMethod, setCarrierMethod] = useState<DeliveryMethod>('White Glove Concierge');
  const [trackingNumber, setTrackingNumber] = useState<string>('DLS-MAYFAIR-WG-0099');
  const [dispatchDate, setDispatchDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [signedBy, setSignedBy] = useState<string>('Lord Alistair Sterling-Fox');
  const [advanceNotice, setAdvanceNotice] = useState<string | null>(null);

  // Orders in shipping pipeline
  const shippingPipelineOrders = orders.filter((o) =>
    ['Ready', 'Dispatched', 'Delivered'].includes(o.status)
  );

  const handleAdvanceDeliveryState = (del: Delivery, targetNextStatus: DeliveryStatus) => {
    const context = {
      hasTrackingNumber: Boolean(del.trackingNumber),
      courierAccepted: true,
      recipientSigned: targetNextStatus === 'Delivered' ? Boolean(signedBy) : undefined,
    };

    const validation = canTransitionDelivery(del.status, targetNextStatus, context);
    if (!validation.allowed) {
      setAdvanceNotice(validation.reason || `Cannot advance to ${targetNextStatus}`);
      return;
    }

    const updatedDelivery: Delivery = {
      ...del,
      status: targetNextStatus,
      dispatchDate: targetNextStatus === 'Dispatched' ? dispatchDate : del.dispatchDate,
      confirmation:
        targetNextStatus === 'Delivered'
          ? {
              signedBy: signedBy || 'Client Signature',
              deliveredAt: new Date().toISOString(),
              signatureUrl: 'https://daniels-couture.com/signatures/verified_handover.png',
            }
          : del.confirmation,
    };

    setDeliveries((prev) =>
      prev.map((d) => (d.id === del.id ? updatedDelivery : d))
    );

    // Also update order status if matching
    const matchingOrder = orders.find((o) => o.id === del.orderId);
    if (matchingOrder) {
      const nextOrderStatus =
        targetNextStatus === 'Delivered' ? 'Delivered' : 'Dispatched';
      onOrderUpdated({ ...matchingOrder, status: nextOrderStatus });
    }

    // Log audit
    logAuditAction(
      currentUser,
      'Delivery',
      'edit',
      'ALLOWED',
      del.id,
      `Delivery ${del.id} for order ${del.orderId} advanced to '${targetNextStatus}'.`
    );

    setAdvanceNotice(`Delivery ${del.id} successfully updated to status: ${targetNextStatus}`);
    setTimeout(() => setAdvanceNotice(null), 4000);
  };

  return (
    <div className="space-y-8 text-left font-mono animate-fadeIn">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-[#2B2B2B] pb-4">
        <div>
          <div className="flex items-center gap-2 text-neutral-400 text-[9px] uppercase tracking-widest mb-1">
            <Truck className="w-3.5 h-3.5 text-white" />
            <span>GLOBAL COURIER CONCIERGE NETWORK</span>
          </div>
          <h2 className="font-serif text-2xl text-white uppercase font-bold tracking-wider">
            LOGISTICS & DISPATCH CONSOLE
          </h2>
          <p className="text-[10.5px] text-neutral-400 font-sans">
            Manage White Glove courier handovers, real-time air waybill assignments, and signature chain of custody.
          </p>
        </div>

        <div className="flex items-center gap-4 text-[9px]">
          <div className="px-3 py-1.5 bg-[#0E0E0E] border border-[#2B2B2B] rounded-xs">
            <span className="text-neutral-500 block">PIPELINE SHIPMENTS:</span>
            <span className="text-white font-bold text-xs">{deliveries.length} ACTIVE</span>
          </div>
        </div>
      </div>

      {advanceNotice && (
        <div className="p-3 bg-emerald-950/60 border border-emerald-500/60 text-emerald-300 text-[10.5px] rounded-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{advanceNotice}</span>
        </div>
      )}

      {/* Deliveries Master Table */}
      <div className="bg-[#0E0E0E] border border-[#2B2B2B] p-6 rounded-sm space-y-4">
        <span className="text-[10px] text-white font-bold uppercase tracking-widest block border-b border-[#2B2B2B] pb-2">
          COURIER DISPATCH MANIFESTS
        </span>

        <div className="overflow-x-auto">
          <table className="w-full text-[10px] text-left">
            <thead>
              <tr className="border-b border-[#2B2B2B] text-neutral-500 text-[8.5px] uppercase tracking-wider">
                <th className="py-2.5 pr-4">DELIVERY ID</th>
                <th className="py-2.5 px-4">ORDER REF</th>
                <th className="py-2.5 px-4">CLIENT RECIPIENT</th>
                <th className="py-2.5 px-4">METHOD</th>
                <th className="py-2.5 px-4">TRACKING DOCKET</th>
                <th className="py-2.5 px-4">STATUS</th>
                <th className="py-2.5 pl-4 text-right">DISPATCH CONTROLLER</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2B2B2B]/60">
              {deliveries.map((del) => {
                const order = orders.find((o) => o.id === del.orderId);
                const client = MOCK_CUSTOMERS.find((c) => c.id === order?.customerId);

                return (
                  <tr key={del.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3.5 pr-4 font-bold text-white font-mono">{del.id}</td>
                    <td className="py-3.5 px-4 text-neutral-300 font-mono">{del.orderId}</td>
                    <td className="py-3.5 px-4 text-neutral-200">
                      {client ? `${client.profile.firstName} ${client.profile.lastName}` : 'Client'}
                    </td>
                    <td className="py-3.5 px-4 text-neutral-300">{del.method}</td>
                    <td className="py-3.5 px-4 font-mono text-emerald-400 font-bold">
                      {del.trackingNumber || 'Pending Waybill'}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`text-[8px] font-bold px-2 py-0.5 rounded-2xs uppercase tracking-widest ${
                          del.status === 'Delivered'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                            : del.status === 'In Transit'
                            ? 'bg-sky-500/20 text-sky-400 border border-sky-500/40'
                            : del.status === 'Dispatched'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            : 'bg-neutral-800 text-neutral-400 border border-neutral-700'
                        }`}
                      >
                        {del.status}
                      </span>
                    </td>
                    <td className="py-3.5 pl-4 text-right">
                      {del.status === 'Pending' && (
                        <button
                          onClick={() => handleAdvanceDeliveryState(del, 'Dispatched')}
                          className="py-1 px-3 bg-white text-black hover:bg-neutral-200 text-[8.5px] font-bold uppercase rounded-xs transition-colors cursor-pointer"
                        >
                          DISPATCH COURIER
                        </button>
                      )}
                      {del.status === 'Dispatched' && (
                        <button
                          onClick={() => handleAdvanceDeliveryState(del, 'In Transit')}
                          className="py-1 px-3 bg-sky-500 text-black hover:bg-sky-400 text-[8.5px] font-bold uppercase rounded-xs transition-colors cursor-pointer"
                        >
                          MARK IN TRANSIT
                        </button>
                      )}
                      {del.status === 'In Transit' && (
                        <button
                          onClick={() => handleAdvanceDeliveryState(del, 'Delivered')}
                          className="py-1 px-3 bg-emerald-500 text-black hover:bg-emerald-400 text-[8.5px] font-bold uppercase rounded-xs transition-colors cursor-pointer"
                        >
                          CONFIRM HANDOVER
                        </button>
                      )}
                      {del.status === 'Delivered' && (
                        <span className="text-[8.5px] text-neutral-500 italic">
                          Signed by {del.confirmation.signedBy || 'Client'}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LogisticsManagerView;

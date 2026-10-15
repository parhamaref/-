/**
 * @file CustomerCommunicationCenter.tsx
 * Enterprise Customer Communication Center for independent fashion designers.
 * Features real-time direct messaging, chat threads, structured measurement requests,
 * production progress milestone updates, order discussions, and notifications.
 */

import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  MessageSquare,
  Send,
  Ruler,
  Sparkles,
  Paperclip,
  Check,
  CheckCheck,
  Clock,
  User,
  Flame,
  Search,
  Filter,
  Pin,
  Archive,
  Phone,
  Mail,
  Calendar,
  AlertCircle,
  Eye,
  Lock,
  RotateCcw,
  Bell,
  ChevronRight,
  ChevronDown,
  Info,
  Maximize2,
  CheckCircle2,
  Sliders,
  DollarSign,
  Tag,
  ArrowUpRight,
  FileText,
} from 'lucide-react';
import { useCommunicationStore } from '../../../stores/communicationStore';
import { useDesignerOrderStore } from '../../../stores/designerOrderStore';
import { useDesignerStore } from '../../../stores/designerStore';
import {
  ConversationThread,
  ChatMessage,
  MeasurementRequestPayload,
  ProgressUpdatePayload,
} from '../../../types/communication.types';
import { RequestMeasurementsModal } from './RequestMeasurementsModal';
import { SendUpdateModal } from './SendUpdateModal';

const MACRO_TEMPLATES = [
  {
    label: 'Shoulder Slope Check',
    text: 'Greetings. Before we cut the cloth, could you kindly re-verify your shoulder slope balance against a vertical mirror?',
  },
  {
    label: 'Floating Canvas Progress',
    text: 'Your floating horsehair chest canvas has been pad-stitched and rested. Lapels are rolling with anatomical drape.',
  },
  {
    label: 'Basting Fitting Ready',
    text: 'Your first basting fitting stage is prepared. All seams are basted with white contrast silk thread for tolerance check.',
  },
  {
    label: 'Courier Dispatch Notice',
    text: 'Your garment has passed final 24-point QC and has been placed in a breathable cedar-carrier for white-glove delivery.',
  },
];

export const CustomerCommunicationCenter: React.FC = () => {
  const {
    conversations,
    activeConversation,
    activeMessages,
    notifications,
    setActiveConversationId,
    sendMessage,
    requestMeasurements,
    sendProgressUpdate,
    togglePinConversation,
    archiveConversation,
    simulateCustomerReply,
    markNotificationRead,
    markAllNotificationsRead,
    resetToDefaults,
  } = useCommunicationStore();

  const { orders } = useDesignerOrderStore();
  const { setActiveSection } = useDesignerStore();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTab, setFilterTab] = useState<'all' | 'unread' | 'vip' | 'pinned'>('all');
  const [isDossierOpen, setIsDossierOpen] = useState(true);
  const [showNotificationDrawer, setShowNotificationDrawer] = useState(false);

  // Message Input State
  const [inputText, setInputText] = useState('');
  const [showMacros, setShowMacros] = useState(false);

  // Modals State
  const [isMeasurementModalOpen, setIsMeasurementModalOpen] = useState(false);
  const [isProgressModalOpen, setIsProgressModalOpen] = useState(false);

  // Lightbox for attachment photos
  const [enlargedPhotoUrl, setEnlargedPhotoUrl] = useState<string | null>(null);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of active messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeMessages.length, activeConversation.id]);

  // Find linked order in designerOrderStore
  const linkedOrder = useMemo(() => {
    if (!activeConversation.orderId) return null;
    return orders.find((o) => o.id === activeConversation.orderId) || null;
  }, [activeConversation.orderId, orders]);

  // KPIs
  const kpis = useMemo(() => {
    const totalThreads = conversations.length;
    const unreadCount = conversations.reduce((acc, c) => acc + c.unreadCount, 0);
    const vipCount = conversations.filter((c) => c.customer.tier === 'VIP Patron').length;
    const onlineCount = conversations.filter((c) => c.customer.isOnline).length;
    const unreadNotifications = notifications.filter((n) => !n.read).length;
    return {
      totalThreads,
      unreadCount,
      vipCount,
      onlineCount,
      unreadNotifications,
    };
  }, [conversations, notifications]);

  // Filtered Conversations List
  const filteredConversations = useMemo(() => {
    return conversations.filter((c) => {
      const matchesSearch =
        !searchQuery.trim() ||
        c.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (c.orderNumber && c.orderNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (c.garmentName && c.garmentName.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesTab =
        filterTab === 'all' ||
        (filterTab === 'unread' && c.unreadCount > 0) ||
        (filterTab === 'vip' && c.customer.tier === 'VIP Patron') ||
        (filterTab === 'pinned' && c.isPinned);

      return matchesSearch && matchesTab;
    });
  }, [conversations, searchQuery, filterTab]);

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    sendMessage(activeConversation.id, {
      text: inputText.trim(),
      type: 'text',
      sender: 'designer',
    });
    setInputText('');
  };

  const handleSimulateReply = () => {
    const sampleReplies = [
      'Thank you Master Daniel! I have checked the measurements and everything matches your recommendations.',
      'Wonderful craftsmanship update. The lapel drape is shaping up splendidly!',
      'Understood. I will await courier dispatch notification.',
      'Could we also verify the sleeve cuff buttons are functioning horn?',
    ];
    const randomReply = sampleReplies[Math.floor(Math.random() * sampleReplies.length)];
    simulateCustomerReply(activeConversation.id, randomReply);
    showToast(`Simulated customer response from ${activeConversation.customer.name}`);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-16">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#141414] border border-amber-500/50 text-white px-4 py-3 rounded-xs shadow-2xl flex items-center gap-2.5 text-xs font-mono">
          <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. TOP COMMUNICATION HUB KPI STRIP */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div className="p-3.5 bg-[#0E0E0E] border border-[#222] rounded-xs space-y-1">
          <span className="text-[10px] font-mono text-neutral-500 uppercase block">Client Discussions</span>
          <span className="text-xl font-serif text-white font-bold">{kpis.totalThreads} Active</span>
        </div>

        <div className="p-3.5 bg-[#0E0E0E] border border-[#222] rounded-xs space-y-1">
          <span className="text-[10px] font-mono text-amber-400 uppercase block">Unread Client Messages</span>
          <div className="flex items-center gap-2">
            <span className="text-xl font-serif text-amber-400 font-bold">{kpis.unreadCount}</span>
            {kpis.unreadCount > 0 && (
              <span className="px-1.5 py-0.2 bg-amber-400/20 text-amber-300 font-mono text-[9px] rounded-xs">
                ATTN
              </span>
            )}
          </div>
        </div>

        <div className="p-3.5 bg-[#0E0E0E] border border-[#222] rounded-xs space-y-1">
          <span className="text-[10px] font-mono text-purple-400 uppercase block">VIP Patrons in Thread</span>
          <span className="text-xl font-serif text-purple-400 font-bold">{kpis.vipCount} Clients</span>
        </div>

        <div className="p-3.5 bg-[#0E0E0E] border border-[#222] rounded-xs space-y-1">
          <span className="text-[10px] font-mono text-emerald-400 uppercase block">Clients Online Now</span>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xl font-serif text-emerald-400 font-bold">{kpis.onlineCount} Live</span>
          </div>
        </div>

        <div className="p-3.5 bg-[#0E0E0E] border border-[#222] rounded-xs space-y-1 relative">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-neutral-400 uppercase block">Hub Alerts</span>
            <button
              onClick={() => setShowNotificationDrawer(!showNotificationDrawer)}
              className="p-1 text-neutral-400 hover:text-white cursor-pointer relative"
              title="Notifications"
            >
              <Bell className="w-3.5 h-3.5 text-amber-400" />
              {kpis.unreadNotifications > 0 && (
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-rose-500" />
              )}
            </button>
          </div>
          <span className="text-xl font-serif text-white font-bold">
            {kpis.unreadNotifications} Unread
          </span>
        </div>
      </div>

      {/* Notifications Popover Dropdown */}
      {showNotificationDrawer && (
        <div className="p-4 bg-[#141414] border border-[#2B2B2B] rounded-xs shadow-2xl space-y-3 animate-fadeIn text-xs font-mono">
          <div className="flex items-center justify-between border-b border-[#222] pb-2">
            <span className="text-white font-bold flex items-center gap-1.5 uppercase text-[11px]">
              <Bell className="w-3.5 h-3.5 text-amber-400" />
              Communication Alerts & Notifications
            </span>
            <button
              onClick={markAllNotificationsRead}
              className="text-[10px] text-amber-400 hover:underline cursor-pointer"
            >
              Mark all read
            </button>
          </div>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => {
                  markNotificationRead(n.id);
                  setActiveConversationId(n.conversationId);
                  setShowNotificationDrawer(false);
                }}
                className={`p-2.5 rounded-xs border cursor-pointer transition-colors flex items-start justify-between gap-3 ${
                  n.read
                    ? 'bg-[#181818] border-[#222] text-neutral-400'
                    : 'bg-amber-400/5 border-amber-500/30 text-white'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-amber-400">{n.customerName}</span>
                    {n.orderNumber && (
                      <span className="text-[10px] text-neutral-500">({n.orderNumber})</span>
                    )}
                  </div>
                  <p className="text-[11px] font-sans text-neutral-300 mt-0.5">{n.body}</p>
                </div>
                <span className="text-[9px] text-neutral-500 whitespace-nowrap">
                  {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. MASTER COMMUNICATION WINDOW CONTAINER (Split 3 Panes) */}
      <div className="bg-[#0E0E0E] border border-[#2B2B2B] rounded-xs shadow-2xl overflow-hidden flex flex-col lg:flex-row h-[780px]">
        {/* PANE 1: CONVERSATIONS LIST (Left, 320px) */}
        <div className="w-full lg:w-80 border-b lg:border-b-0 lg:border-r border-[#222] bg-[#0A0A0A] flex flex-col shrink-0">
          {/* List Search & Controls Header */}
          <div className="p-3.5 border-b border-[#222] space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-white font-bold flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
                Inbox Threads ({filteredConversations.length})
              </span>
              <button
                onClick={() => {
                  resetToDefaults();
                  showToast('Communication threads reset to demo defaults');
                }}
                className="p-1 text-neutral-400 hover:text-white cursor-pointer"
                title="Reset sample conversations"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-neutral-500" />
              <input
                type="text"
                placeholder="Search clients or orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-[#141414] border border-[#2B2B2B] rounded-xs text-white text-xs placeholder:text-neutral-600 focus:outline-none focus:border-amber-400 font-mono"
              />
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pt-1 text-[10px] font-mono">
              {[
                { id: 'all', label: 'All' },
                { id: 'unread', label: `Unread (${kpis.unreadCount})` },
                { id: 'vip', label: 'VIP' },
                { id: 'pinned', label: 'Pinned' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setFilterTab(tab.id as any)}
                  className={`px-2 py-0.5 rounded-xs transition-colors cursor-pointer shrink-0 ${
                    filterTab === tab.id
                      ? 'bg-amber-400 text-black font-bold'
                      : 'bg-[#161616] text-neutral-400 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Conversation Cards List */}
          <div className="flex-1 overflow-y-auto divide-y divide-[#181818]">
            {filteredConversations.length === 0 ? (
              <div className="p-8 text-center text-xs font-mono text-neutral-500">
                No matching dialogue threads.
              </div>
            ) : (
              filteredConversations.map((conv) => {
                const isSelected = conv.id === activeConversation.id;

                return (
                  <div
                    key={conv.id}
                    onClick={() => setActiveConversationId(conv.id)}
                    className={`p-3.5 cursor-pointer transition-colors relative flex items-start gap-3 ${
                      isSelected
                        ? 'bg-amber-400/10 border-l-2 border-amber-400'
                        : 'hover:bg-[#121212]'
                    }`}
                  >
                    {/* Customer Avatar & Online Dot */}
                    <div className="relative shrink-0 mt-0.5">
                      <img
                        src={conv.customer.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                        alt={conv.customer.name}
                        className="w-10 h-10 rounded-full object-cover border border-[#333]"
                      />
                      {conv.customer.isOnline && (
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-black" />
                      )}
                    </div>

                    {/* Thread Info */}
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs font-serif text-white font-medium truncate">
                          {conv.customer.name}
                        </span>
                        <span className="text-[9px] font-mono text-neutral-500 shrink-0">
                          {new Date(conv.lastMessage.timestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {conv.orderNumber && (
                          <span className="px-1.5 py-0.2 bg-[#1A1A1A] border border-[#2B2B2B] text-amber-400 text-[9px] font-mono rounded-xs font-bold shrink-0">
                            {conv.orderNumber}
                          </span>
                        )}
                        <span className="text-[10px] font-mono text-neutral-400 truncate">
                          {conv.topic}
                        </span>
                      </div>

                      <p
                        className={`text-[11px] font-sans truncate ${
                          conv.unreadCount > 0 ? 'text-white font-bold' : 'text-neutral-400'
                        }`}
                      >
                        {conv.lastMessage.sender === 'designer' ? 'You: ' : ''}
                        {conv.lastMessage.text}
                      </p>
                    </div>

                    {/* Unread & Pin Icons */}
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      {conv.unreadCount > 0 && (
                        <span className="w-4 h-4 rounded-full bg-amber-400 text-black font-mono text-[9px] font-bold flex items-center justify-center">
                          {conv.unreadCount}
                        </span>
                      )}
                      {conv.isPinned && <Pin className="w-3 h-3 text-amber-400 fill-amber-400" />}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* PANE 2: ACTIVE CHAT TIMELINE (Center, flex-1) */}
        <div className="flex-1 flex flex-col bg-[#0D0D0D] min-w-0">
          {/* Thread Header */}
          <div className="p-4 border-b border-[#222] bg-[#121212] flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative shrink-0">
                <img
                  src={activeConversation.customer.avatarUrl}
                  alt={activeConversation.customer.name}
                  className="w-10 h-10 rounded-full object-cover border border-[#333]"
                />
                {activeConversation.customer.isOnline && (
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-black" />
                )}
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-serif text-white uppercase tracking-wide font-medium truncate">
                    {activeConversation.customer.name}
                  </h2>
                  <span className="px-2 py-0.2 bg-amber-400/10 border border-amber-400/30 text-amber-400 text-[9px] font-mono uppercase rounded-xs">
                    {activeConversation.customer.tier}
                  </span>
                </div>
                <p className="text-[10px] font-mono text-neutral-400 truncate">
                  {activeConversation.orderNumber ? (
                    <>
                      Order <strong className="text-white">{activeConversation.orderNumber}</strong> ({activeConversation.garmentName})
                    </>
                  ) : (
                    'General Atelier Fitting Discussion'
                  )}
                </p>
              </div>
            </div>

            {/* Header Action Buttons */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setIsMeasurementModalOpen(true)}
                className="px-2.5 py-1.5 bg-[#1F1F1F] hover:bg-[#2A2A2A] border border-[#333] text-amber-300 text-xs font-mono uppercase rounded-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                title="Request anatomical measurements"
              >
                <Ruler className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Request Measurements</span>
              </button>

              <button
                onClick={() => setIsProgressModalOpen(true)}
                className="px-2.5 py-1.5 bg-[#1F1F1F] hover:bg-[#2A2A2A] border border-[#333] text-amber-300 text-xs font-mono uppercase rounded-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                title="Send production progress milestone"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Send Progress</span>
              </button>

              <button
                onClick={handleSimulateReply}
                className="px-2 py-1.5 bg-emerald-950/40 hover:bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-[10px] font-mono uppercase rounded-xs transition-colors flex items-center gap-1 cursor-pointer"
                title="Simulate customer reply in this thread"
              >
                <span>Simulate Reply</span>
              </button>

              <button
                onClick={() => setIsDossierOpen(!isDossierOpen)}
                className={`p-1.5 rounded-xs border text-neutral-400 hover:text-white cursor-pointer ${
                  isDossierOpen ? 'bg-[#222] border-neutral-500' : 'bg-[#161616] border-[#333]'
                }`}
                title="Toggle Client Dossier Drawer"
              >
                <Info className="w-4 h-4 text-amber-400" />
              </button>
            </div>
          </div>

          {/* Messages Scroll View */}
          <div className="flex-1 p-5 overflow-y-auto space-y-4">
            {activeMessages.map((msg) => {
              const isDesigner = msg.sender === 'designer';

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isDesigner ? 'items-end' : 'items-start'} space-y-1 animate-fadeIn`}
                >
                  <div className="flex items-center gap-2 text-[10px] font-mono text-neutral-500 px-1">
                    <span>{msg.senderName}</span>
                    <span>•</span>
                    <span>
                      {new Date(msg.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>

                  {/* Standard Message Bubble vs Structured Cards */}
                  {msg.type === 'text' && (
                    <div
                      className={`p-3.5 rounded-xs text-xs font-sans max-w-lg leading-relaxed shadow-md ${
                        isDesigner
                          ? 'bg-[#181818] border border-amber-500/30 text-white rounded-tr-none'
                          : 'bg-[#121212] border border-[#2B2B2B] text-neutral-200 rounded-tl-none'
                      }`}
                    >
                      <p>{msg.text}</p>
                    </div>
                  )}

                  {/* Structured Measurement Request Card */}
                  {msg.type === 'measurement_request' && msg.measurementRequest && (
                    <div className="w-full max-w-md p-4 bg-[#141414] border border-amber-500/40 rounded-xs space-y-3 shadow-xl">
                      <div className="flex items-center justify-between border-b border-[#222] pb-2">
                        <span className="text-xs font-mono uppercase font-bold text-amber-400 flex items-center gap-1.5">
                          <Ruler className="w-4 h-4" />
                          Anatomical Measurement Verification
                        </span>
                        <span className="px-1.5 py-0.2 bg-rose-950/70 border border-rose-800 text-rose-300 text-[9px] font-mono rounded-xs font-bold uppercase">
                          {msg.measurementRequest.urgency}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[10px] font-mono text-neutral-400 uppercase block">
                          Parameters Requested:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {msg.measurementRequest.fieldsRequested.map((f) => (
                            <span
                              key={f}
                              className="px-2 py-0.5 rounded-xs bg-[#222] border border-[#333] text-amber-300 font-mono text-[10px]"
                            >
                              {f}
                            </span>
                          ))}
                        </div>
                      </div>

                      <p className="text-xs text-neutral-300 font-sans italic bg-[#0F0F0F] p-2.5 rounded-xs border border-[#1F1F1F]">
                        "{msg.measurementRequest.tailorNote}"
                      </p>

                      {/* Submitted Values or Pending Notice */}
                      {msg.measurementRequest.submittedValues ? (
                        <div className="p-3 bg-emerald-950/40 border border-emerald-800/80 rounded-xs space-y-1 text-xs font-mono">
                          <div className="flex items-center gap-1.5 text-emerald-300 font-bold">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            <span>Client Verified Dimensions:</span>
                          </div>
                          {Object.entries(msg.measurementRequest.submittedValues).map(([k, v]) => (
                            <div key={k} className="flex justify-between text-neutral-200 text-[11px] pl-5">
                              <span>• {k}:</span>
                              <span className="font-bold text-white">
                                {v} {msg.measurementRequest?.unit || 'cm'}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-2.5 bg-[#181818] border border-[#2B2B2B] rounded-xs flex items-center justify-between text-xs font-mono text-neutral-400">
                          <span className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-amber-400" />
                            Awaiting Customer Input
                          </span>
                          <button
                            onClick={handleSimulateReply}
                            className="text-[10px] text-amber-400 hover:underline cursor-pointer"
                          >
                            Simulate Submission
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Structured Production Progress Update Card */}
                  {msg.type === 'progress_update' && msg.progressUpdate && (
                    <div className="w-full max-w-md p-4 bg-[#141414] border border-amber-500/40 rounded-xs space-y-3 shadow-xl">
                      <div className="flex items-center justify-between border-b border-[#222] pb-2">
                        <span className="text-xs font-mono uppercase font-bold text-amber-400 flex items-center gap-1.5">
                          <Sparkles className="w-4 h-4" />
                          Milestone: {msg.progressUpdate.stage}
                        </span>
                        <span className="text-amber-400 font-mono text-xs font-bold">
                          {msg.progressUpdate.progressPercent}% Complete
                        </span>
                      </div>

                      <div className="h-1.5 bg-[#222] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-amber-400 rounded-full"
                          style={{ width: `${msg.progressUpdate.progressPercent}%` }}
                        />
                      </div>

                      <h4 className="text-xs font-mono text-white font-bold">
                        {msg.progressUpdate.headline}
                      </h4>

                      <p className="text-xs text-neutral-300 font-sans leading-relaxed">
                        {msg.progressUpdate.notes}
                      </p>

                      {/* Attached Milestone Photos */}
                      {msg.progressUpdate.photoUrls && msg.progressUpdate.photoUrls.length > 0 && (
                        <div
                          onClick={() => setEnlargedPhotoUrl(msg.progressUpdate?.photoUrls?.[0] || null)}
                          className="h-44 rounded-xs overflow-hidden border border-[#2B2B2B] bg-black cursor-pointer relative group"
                        >
                          <img
                            src={msg.progressUpdate.photoUrls[0]}
                            alt="Milestone proof"
                            className="w-full h-full object-cover transition-transform group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-mono gap-1">
                            <Maximize2 className="w-4 h-4" /> Click to Inspect
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Status Indicator (Delivered/Read) */}
                  {isDesigner && (
                    <div className="flex items-center gap-1 text-[9px] font-mono text-neutral-500 pr-1">
                      <span>{msg.status}</span>
                      {msg.status === 'read' ? (
                        <CheckCheck className="w-3 h-3 text-amber-400" />
                      ) : (
                        <Check className="w-3 h-3 text-neutral-400" />
                      )}
                    </div>
                  )}
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Macro Templates Tray */}
          {showMacros && (
            <div className="p-3 bg-[#141414] border-t border-[#222] space-y-2 animate-fadeIn text-xs font-mono">
              <div className="flex items-center justify-between text-neutral-400 text-[10px] uppercase">
                <span>Select Craftsmanship Response Macro:</span>
                <button
                  onClick={() => setShowMacros(false)}
                  className="hover:text-white cursor-pointer"
                >
                  Close
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {MACRO_TEMPLATES.map((m, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setInputText(m.text);
                      setShowMacros(false);
                    }}
                    className="p-2 bg-[#1A1A1A] hover:bg-[#252525] border border-[#333] rounded-xs text-left cursor-pointer transition-colors"
                  >
                    <span className="block text-amber-400 font-bold text-[10px]">{m.label}</span>
                    <span className="text-[11px] text-neutral-400 font-sans block truncate mt-0.5">
                      {m.text}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Bar */}
          <div className="p-3.5 border-t border-[#222] bg-[#121212]">
            <form onSubmit={handleSendMessage} className="space-y-2">
              <div className="flex items-end gap-2">
                <textarea
                  rows={2}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder={`Direct message to ${activeConversation.customer.name}... (Press Enter to send, Shift+Enter for new line)`}
                  className="flex-1 p-2.5 bg-[#181818] border border-[#2B2B2B] rounded-xs text-white text-xs font-sans placeholder:text-neutral-600 focus:outline-none focus:border-amber-400 resize-none leading-relaxed"
                />

                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className="px-4 py-3 bg-amber-400 hover:bg-amber-300 disabled:opacity-40 text-black font-bold rounded-xs transition-colors cursor-pointer flex items-center justify-center shrink-0 shadow-lg shadow-amber-400/20"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>

              {/* Input Action Shortcuts */}
              <div className="flex items-center justify-between text-xs font-mono text-neutral-400 pt-1">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowMacros(!showMacros)}
                    className="px-2 py-0.5 bg-[#1A1A1A] hover:bg-[#222] border border-[#333] rounded-xs text-[10px] text-amber-300 cursor-pointer transition-colors flex items-center gap-1"
                  >
                    <FileText className="w-3 h-3" />
                    Macro Templates
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsMeasurementModalOpen(true)}
                    className="px-2 py-0.5 bg-[#1A1A1A] hover:bg-[#222] border border-[#333] rounded-xs text-[10px] text-neutral-300 hover:text-white cursor-pointer transition-colors flex items-center gap-1"
                  >
                    <Ruler className="w-3 h-3 text-amber-400" />
                    Measurement Check
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsProgressModalOpen(true)}
                    className="px-2 py-0.5 bg-[#1A1A1A] hover:bg-[#222] border border-[#333] rounded-xs text-[10px] text-neutral-300 hover:text-white cursor-pointer transition-colors flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    Stage Update
                  </button>
                </div>

                <span className="text-[10px] text-neutral-500">
                  Encrypted Direct Channel
                </span>
              </div>
            </form>
          </div>
        </div>

        {/* PANE 3: COLLAPSIBLE CUSTOMER & ORDER DOSSIER (Right, 280px) */}
        {isDossierOpen && (
          <div className="w-full lg:w-72 border-t lg:border-t-0 lg:border-l border-[#222] bg-[#0A0A0A] p-4 space-y-5 overflow-y-auto shrink-0 text-xs font-mono">
            {/* Customer Dossier Card */}
            <div className="space-y-3 pb-3 border-b border-[#1C1C1C]">
              <span className="text-[10px] uppercase text-neutral-500 tracking-wider block font-bold">
                Client Profile
              </span>

              <div className="flex items-center gap-3">
                <img
                  src={activeConversation.customer.avatarUrl}
                  alt={activeConversation.customer.name}
                  className="w-12 h-12 rounded-full object-cover border border-[#333]"
                />
                <div className="min-w-0">
                  <h3 className="text-xs font-serif text-white uppercase font-bold truncate">
                    {activeConversation.customer.name}
                  </h3>
                  <span className="text-[10px] text-amber-400 block font-mono">
                    {activeConversation.customer.tier}
                  </span>
                  <span className="text-[9px] text-neutral-500 block truncate">
                    {activeConversation.customer.email}
                  </span>
                </div>
              </div>

              <div className="space-y-1.5 pt-2 text-[11px] text-neutral-300">
                <div className="flex justify-between">
                  <span className="text-neutral-500">Total Commissions:</span>
                  <span className="font-bold">{activeConversation.customer.totalOrdersCount} Garments</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Cumulative Spend:</span>
                  <span className="font-bold text-amber-400">
                    £{activeConversation.customer.totalSpendGbp.toLocaleString('en-GB')}
                  </span>
                </div>
                {activeConversation.customer.phone && (
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Direct Phone:</span>
                    <span className="text-white">{activeConversation.customer.phone}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Linked Order Card */}
            {linkedOrder ? (
              <div className="space-y-3 pb-3 border-b border-[#1C1C1C]">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase text-amber-400 tracking-wider font-bold">
                    Associated Order
                  </span>
                  <button
                    onClick={() => setActiveSection('orders')}
                    className="text-[10px] text-amber-400 hover:underline cursor-pointer flex items-center gap-0.5"
                  >
                    View <ArrowUpRight className="w-3 h-3" />
                  </button>
                </div>

                <div className="p-3 bg-[#141414] border border-[#222] rounded-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">{linkedOrder.orderNumber}</span>
                    <span className="px-1.5 py-0.2 bg-amber-400/20 text-amber-300 rounded-xs text-[9px]">
                      {linkedOrder.status}
                    </span>
                  </div>
                  <span className="text-neutral-300 block truncate text-[11px]">
                    {linkedOrder.garmentName}
                  </span>
                  <div className="flex justify-between text-[10px] text-neutral-500 pt-1 border-t border-[#1F1F1F]">
                    <span>Target Finish:</span>
                    <span className="text-neutral-300 font-bold">
                      {new Date(linkedOrder.targetCompletionDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-3 bg-[#141414] border border-[#222] rounded-xs text-neutral-500 text-[11px]">
                No specific order linked to this discussion.
              </div>
            )}

            {/* Anatomical Measurements Verification Box */}
            <div className="space-y-2">
              <span className="text-[10px] uppercase text-neutral-500 tracking-wider block font-bold flex items-center gap-1">
                <Ruler className="w-3 h-3 text-amber-400" />
                Measurement Status
              </span>

              {linkedOrder?.measurements ? (
                <div className="p-3 bg-[#141414] border border-[#222] rounded-xs space-y-2 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Status:</span>
                    <span className="text-emerald-400 font-bold">
                      {linkedOrder.measurements.anatomicalStatus}
                    </span>
                  </div>
                  <div className="space-y-1 text-neutral-300">
                    <div className="flex justify-between">
                      <span>Chest:</span>
                      <span className="font-bold">{linkedOrder.measurements.values.chest || 108} cm</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Waist:</span>
                      <span className="font-bold">{linkedOrder.measurements.values.waist || 92} cm</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sleeve:</span>
                      <span className="font-bold">{linkedOrder.measurements.values.sleeve || 66} cm</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-[#141414] border border-[#222] rounded-xs text-neutral-500 text-[11px]">
                  Measurements verified on client anatomical dossier.
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 3. MODALS */}
      <RequestMeasurementsModal
        isOpen={isMeasurementModalOpen}
        onClose={() => setIsMeasurementModalOpen(false)}
        customerName={activeConversation.customer.name}
        orderNumber={activeConversation.orderNumber}
        garmentName={activeConversation.garmentName}
        onRequest={(payload) => {
          requestMeasurements(activeConversation.id, payload);
          showToast(`Measurement verification requested from ${activeConversation.customer.name}`);
        }}
      />

      <SendUpdateModal
        isOpen={isProgressModalOpen}
        onClose={() => setIsProgressModalOpen(false)}
        customerName={activeConversation.customer.name}
        orderNumber={activeConversation.orderNumber}
        garmentName={activeConversation.garmentName}
        onSend={(payload) => {
          sendProgressUpdate(activeConversation.id, payload);
          showToast(`Progress update sent to ${activeConversation.customer.name}`);
        }}
      />

      {/* Photo Enlarger Modal */}
      {enlargedPhotoUrl && (
        <div
          onClick={() => setEnlargedPhotoUrl(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fadeIn cursor-zoom-out"
        >
          <div className="relative max-w-4xl max-h-[85vh] rounded-xs overflow-hidden border border-white/20">
            <img
              src={enlargedPhotoUrl}
              alt="Milestone snapshot"
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
};

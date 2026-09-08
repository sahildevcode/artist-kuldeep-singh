import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  ShieldCheck,
  Calendar,
  Play,
  Package,
  MapPin,
  Phone,
  CreditCard,
  Sparkles
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { MagneticButton } from '../ui/MagneticButton';

interface OrderHistoryModalProps {
  onNavigateToCourse?: (courseId: string) => void;
}

export const OrderHistoryModal: React.FC<OrderHistoryModalProps> = ({ onNavigateToCourse }) => {
  const { orders, isOrderHistoryOpen, setIsOrderHistoryOpen } = useCart();
  const { currentUser } = useAuth();
  const [filterType, setFilterType] = useState<'all' | 'artwork' | 'course'>('all');
  const [viewingCertificate, setViewingCertificate] = useState<string | null>(null);

  if (!isOrderHistoryOpen) return null;

  // Filter orders based on user or show all orders in session
  const filteredOrders = orders.filter((order) => {
    if (filterType === 'all') return true;
    return order.items.some((i) => i.type === filterType);
  });

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      {/* Backdrop */}
      <div
        onClick={() => setIsOrderHistoryOpen(false)}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
      />

      {/* Slide-over Drawer */}
      <div className="relative w-screen max-w-2xl bg-[#FDFBF7] shadow-2xl flex flex-col justify-between z-10 border-l border-stone-200 animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-6 border-b border-stone-200/80 bg-white/80 backdrop-blur-md flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#1A1816] text-white flex items-center justify-center font-serif text-lg font-bold">
              KS
            </div>
            <div>
              <h2 className="font-display font-bold text-lg text-[#1A1816] flex items-center gap-2">
                <span>My Order History & Acquisitions</span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                  Verified Patron
                </span>
              </h2>
              <p className="text-xs text-stone-500">
                {currentUser?.name || 'Art Collector'} • {currentUser?.email || 'collector@kuldeepsingh.art'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsOrderHistoryOpen(false)}
            className="p-2 rounded-full text-stone-400 hover:text-stone-800 hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Pills */}
        <div className="px-6 pt-4 pb-2 flex items-center gap-2 border-b border-stone-100 bg-stone-50/50">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
              filterType === 'all'
                ? 'bg-[#1A1816] text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-200/70'
            }`}
          >
            All Purchases ({orders.length})
          </button>
          <button
            onClick={() => setFilterType('artwork')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
              filterType === 'artwork'
                ? 'bg-[#1A1816] text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-200/70'
            }`}
          >
            Original Artworks
          </button>
          <button
            onClick={() => setFilterType('course')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
              filterType === 'course'
                ? 'bg-[#1A1816] text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-200/70'
            }`}
          >
            Enrolled Masterclasses
          </button>
        </div>

        {/* Orders List Container */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {filteredOrders.length === 0 ? (
            <div className="py-24 text-center space-y-3">
              <Package className="w-12 h-12 text-stone-300 mx-auto" />
              <h3 className="font-serif text-lg font-bold text-stone-800">No Orders Found</h3>
              <p className="text-xs text-stone-500 max-w-xs mx-auto">
                You have not placed any orders matching this filter yet. Browse the Gallery Store or Masterclasses to start acquiring.
              </p>
            </div>
          ) : (
            filteredOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-3xl border border-stone-200 shadow-sm hover:shadow-md transition-all overflow-hidden space-y-4"
              >
                {/* Order Top Bar */}
                <div className="p-4 sm:p-5 bg-stone-50 border-b border-stone-200/80 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div>
                    <span className="text-[10px] text-stone-400 uppercase font-bold block">
                      Order Reference
                    </span>
                    <span className="font-mono font-bold text-stone-900 text-sm">
                      #{order.id}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-stone-400 uppercase font-bold block">
                      Date Placed
                    </span>
                    <span className="font-medium text-stone-800 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-stone-400" />
                      {order.date}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-stone-400 uppercase font-bold block">
                      Total Paid
                    </span>
                    <span className="font-serif font-bold text-sm text-artisan-crimson">
                      ${order.totalAmount.toLocaleString()} USD
                    </span>
                  </div>

                  {/* Status Badges */}
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      {order.paymentStatus}
                    </span>

                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        order.orderStatus === 'Delivered'
                          ? 'bg-blue-100 text-blue-800'
                          : order.orderStatus === 'In Transit'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-purple-100 text-purple-800'
                      }`}
                    >
                      {order.orderStatus}
                    </span>
                  </div>
                </div>

                {/* Items in this Order */}
                <div className="p-4 sm:p-5 space-y-3.5">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-4 items-center p-3 rounded-2xl bg-stone-50/70 border border-stone-200/60"
                    >
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-16 h-16 rounded-xl object-cover border border-stone-200 flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-stone-200 text-stone-700">
                          {item.type}
                        </span>
                        <h4 className="font-serif font-bold text-sm text-stone-900 truncate mt-1">
                          {item.title}
                        </h4>
                        <p className="text-xs text-stone-500 truncate">
                          {item.subtitle}
                        </p>
                        <span className="text-xs font-bold text-artisan-crimson block mt-1">
                          ${item.price.toLocaleString()} × {item.quantity}
                        </span>
                      </div>

                      {/* Quick Item Actions */}
                      <div className="flex flex-col gap-1.5 flex-shrink-0">
                        {item.type === 'course' ? (
                          <button
                            onClick={() => {
                              setIsOrderHistoryOpen(false);
                              if (onNavigateToCourse) onNavigateToCourse(item.id);
                            }}
                            className="px-3 py-1.5 bg-stone-900 hover:bg-black text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-xs transition-all"
                          >
                            <Play className="w-3 h-3 text-artisan-gold fill-artisan-gold" />
                            <span>Access Lessons</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => setViewingCertificate(item.title)}
                            className="px-3 py-1.5 bg-white border border-stone-300 hover:bg-stone-100 text-stone-800 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all"
                          >
                            <ShieldCheck className="w-3.5 h-3.5 text-artisan-gold" />
                            <span>Certificate</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Live 4-Step Pipeline Tracker */}
                {(() => {
                  const getStepNumber = (): number => {
                    if (order.currentStep) return order.currentStep;
                    const s = (order.orderStatus || '').toLowerCase();
                    if (s.includes('deliver')) return 4;
                    if (s.includes('transit') || s.includes('dispatch')) return 3;
                    if (s.includes('accept') || s.includes('proceed') || s.includes('process')) return 2;
                    return 1;
                  };
                  const currentStep = getStepNumber();
                  const pipelineSteps = [
                    { step: 1, title: 'Order Placed', desc: 'Received & Logged' },
                    { step: 2, title: 'Accepted by Studio', desc: 'Your order has been proceed' },
                    { step: 3, title: 'Out for Delivery', desc: order.carrierName ? `${order.carrierName}` : 'In Transit' },
                    { step: 4, title: 'Delivered', desc: 'Handed Over' }
                  ];

                  return (
                    <div className="mx-4 sm:mx-5 p-4 rounded-2xl bg-[#FAF7F2] border border-stone-200/80 space-y-3.5">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="relative flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                          </span>
                          <span className="text-xs font-bold uppercase tracking-wider text-stone-800">
                            Live Studio Pipeline
                          </span>
                        </div>
                        <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-stone-900 text-white">
                          Step {currentStep} of 4: {pipelineSteps[currentStep - 1]?.title}
                        </span>
                      </div>

                      {/* Step Progress Bar */}
                      <div className="relative pt-1 pb-1">
                        <div className="absolute top-1/2 left-0 right-0 h-1 -translate-y-1/2 bg-stone-200 z-0"></div>
                        <div
                          className="absolute top-1/2 left-0 h-1 -translate-y-1/2 bg-emerald-500 transition-all duration-500 z-0"
                          style={{
                            width: `${((currentStep - 1) / 3) * 100}%`
                          }}
                        ></div>

                        <div className="relative z-10 grid grid-cols-4 gap-1">
                          {pipelineSteps.map((s) => {
                            const isPassed = s.step < currentStep;
                            const isCurrent = s.step === currentStep;
                            return (
                              <div key={s.step} className="flex flex-col items-center text-center">
                                <div
                                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                                    isPassed
                                      ? 'bg-emerald-500 text-white shadow-xs'
                                      : isCurrent
                                      ? 'bg-[#1A1816] text-white ring-4 ring-emerald-200 scale-110 shadow-md'
                                      : 'bg-white border-2 border-stone-300 text-stone-400'
                                  }`}
                                >
                                  {isPassed ? <CheckCircle2 className="w-4 h-4" /> : s.step}
                                </div>
                                <span className={`mt-1.5 text-[10px] font-bold leading-tight ${isCurrent ? 'text-stone-900 font-extrabold' : isPassed ? 'text-emerald-700' : 'text-stone-400'}`}>
                                  {s.title}
                                </span>
                                <span className="hidden sm:block text-[9px] text-stone-500 leading-tight">
                                  {s.desc}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Live notification message */}
                      {currentStep >= 2 && (
                        <div className="p-2.5 rounded-xl bg-white border border-stone-200/80 text-xs flex items-center gap-2 text-stone-800">
                          <Sparkles className="w-4 h-4 text-artisan-gold flex-shrink-0" />
                          <span>
                            {currentStep === 2 && "Kuldeep Singh's studio has accepted this order. The artwork is being inspected, framed, and placed in an archival crate."}
                            {currentStep === 3 && `The artwork has been dispatched with ${order.carrierName || 'Secure Fine Art Logistics'}. Tracking: ${order.trackingNumber || 'Active'}`}
                            {currentStep === 4 && "This piece has been successfully delivered and signed by the patron. Provenance is sealed."}
                          </span>
                        </div>
                      )}

                      {/* Delivery & Contact Details */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-[11px] text-stone-600 border-t border-stone-200/60">
                        {order.deliveryAddress && (
                          <div className="flex items-start gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-stone-400 flex-shrink-0 mt-0.5" />
                            <span className="line-clamp-2">
                              <strong className="text-stone-800">Ship to: </strong>
                              {order.deliveryAddress}
                            </span>
                          </div>
                        )}
                        {order.customerPhone && (
                          <div className="flex items-center gap-1.5">
                            <Phone className="w-3.5 h-3.5 text-stone-400 flex-shrink-0" />
                            <span>
                              <strong className="text-stone-800">Contact: </strong>
                              {order.customerPhone}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })()}

                {/* Order Footer Details */}
                <div className="px-5 pb-4 pt-1 flex flex-wrap items-center justify-between gap-3 text-xs text-stone-500 border-t border-stone-100">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-artisan-gold" />
                    <span>Official Provenance by Artist Kuldeep Singh</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-3.5 h-3.5 text-stone-400" />
                    <span className="font-semibold px-2 py-0.5 rounded-full bg-stone-100 text-stone-800 border border-stone-200">
                      Payment Mode: {order.paymentMethod}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Certificate Modal Overlay */}
        {viewingCertificate && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
            <div className="bg-[#FDFBF7] p-8 rounded-3xl border-4 border-artisan-gold/40 shadow-2xl max-w-lg w-full text-center space-y-4 relative">
              <button
                onClick={() => setViewingCertificate(null)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-stone-200 text-stone-500"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-12 h-12 rounded-full bg-artisan-gold/20 text-artisan-gold flex items-center justify-center mx-auto border border-artisan-gold/40">
                <ShieldCheck className="w-7 h-7" />
              </div>

              <span className="text-[10px] tracking-[0.25em] uppercase font-bold text-stone-500 block">
                Official Certificate of Authenticity
              </span>

              <h3 className="font-serif font-bold text-2xl text-stone-900">
                {viewingCertificate}
              </h3>

              <p className="text-xs text-stone-600 leading-relaxed italic">
                "This document certifies that the aforementioned work of fine art is an authentic, original masterpiece executed by Artist Kuldeep Singh using archival European linen and hand-ground mineral pigments."
              </p>

              <div className="pt-4 border-t border-stone-200 flex items-center justify-between text-xs text-stone-700">
                <div className="text-left">
                  <span className="text-stone-400 block text-[10px] uppercase font-bold">Studio Seal</span>
                  <span className="font-bold">#KS-CERT-2026</span>
                </div>
                <div className="text-right">
                  <span className="text-stone-400 block text-[10px] uppercase font-bold">Master Painter</span>
                  <span className="font-bold font-serif">Artist Kuldeep Singh</span>
                </div>
              </div>

              <MagneticButton
                onClick={() => setViewingCertificate(null)}
                variant="primary"
                className="w-full mt-3"
              >
                Close Certificate
              </MagneticButton>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

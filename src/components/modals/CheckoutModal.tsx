import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, Truck, Lock, CreditCard, Banknote, CheckCircle2, User, Phone, Mail, MapPin } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { MagneticButton } from '../ui/MagneticButton';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose }) => {
  const { cart, subtotal, discount, shipping, finalTotal, performCheckout, isCheckingOut } = useCart();
  const { currentUser, setIsAuthModalOpen } = useAuth();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [city, setCity] = useState('');
  const [stateName, setStateName] = useState('');
  const [pincode, setPincode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'online' | 'cod'>('online');
  const [notes, setNotes] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (currentUser) {
      setFullName(currentUser.name || '');
      setEmail(currentUser.email || '');
    }
  }, [currentUser]);

  if (!isOpen) return null;

  // 1. Mandatory Login Gate
  if (!currentUser) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
        <div className="bg-[#FAF8F5] border border-stone-200 rounded-3xl w-full max-w-md p-8 shadow-2xl text-center space-y-5 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-800 rounded-full hover:bg-stone-100"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-16 h-16 rounded-2xl bg-artisan-crimson/10 border border-artisan-crimson/20 flex items-center justify-center text-artisan-crimson mx-auto">
            <Lock className="w-8 h-8" />
          </div>

          <div>
            <h3 className="font-serif font-bold text-2xl text-stone-900">
              Collector Login Required
            </h3>
            <p className="text-xs text-stone-600 mt-2 leading-relaxed">
              To guarantee verified provenance, personalized Certificate of Authenticity, and live 24/7 shipment tracking, please sign in or register before placing an order.
            </p>
          </div>

          <div className="pt-2 space-y-2.5">
            <MagneticButton
              onClick={() => {
                onClose();
                setIsAuthModalOpen(true);
              }}
              variant="primary"
              className="w-full py-3 text-xs font-bold"
            >
              Sign In or Register with Email →
            </MagneticButton>
            <button
              onClick={onClose}
              className="w-full py-2.5 text-xs text-stone-500 hover:text-stone-800 font-medium"
            >
              Back to Studio Gallery
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. Checkout Submission Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!fullName.trim() || !phone.trim() || !streetAddress.trim() || !city.trim()) {
      setErrorMessage('Please fill all required delivery details (Name, Mobile, Street Address, and City).');
      return;
    }

    const fullDeliveryAddress = `${streetAddress}, ${city}, ${stateName ? stateName + ' ' : ''}${pincode ? '- ' + pincode : ''}`.trim();
    const chosenPaymentLabel = paymentMethod === 'online'
      ? 'Online Payment (Demo Razorpay / UPI)'
      : 'Cash on Delivery (COD)';

    try {
      await performCheckout({
        name: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        address: fullDeliveryAddress,
        city: city.trim(),
        state: stateName.trim(),
        paymentMethod: chosenPaymentLabel,
        paymentStatus: paymentMethod === 'online' ? 'Paid' : 'Pending Payment',
        notes: notes.trim()
      });
      onClose();
    } catch (err: any) {
      console.error('Checkout error:', err);
      setErrorMessage(err.message || 'Error processing your order. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-md animate-in fade-in">
      <div className="bg-[#FAF8F5] border border-stone-200 rounded-3xl w-full max-w-3xl shadow-2xl my-8 overflow-hidden relative text-stone-800">
        {/* Header */}
        <div className="px-6 py-5 bg-white border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-stone-100 flex items-center justify-center text-artisan-crimson">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-lg text-stone-900">
                Secure Fine Art Acquisition
              </h2>
              <p className="text-[11px] text-stone-500">
                Artist Kuldeep Singh Atelier • 100% Insured Delivery
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-800 rounded-full hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Checkout Form */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
          {errorMessage && (
            <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-medium">
              {errorMessage}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Collector & Delivery Address */}
            <div className="lg:col-span-7 space-y-4 text-xs">
              <div className="flex items-center gap-2 pb-1 border-b border-stone-200 font-bold text-stone-800 text-xs uppercase tracking-wider">
                <User className="w-3.5 h-3.5 text-artisan-crimson" />
                <span>1. Collector & Delivery Details</span>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-stone-600 font-semibold mb-1">
                  Collector Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Aarav Singhania"
                  className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs text-stone-900 focus:outline-none focus:border-stone-800"
                />
              </div>

              {/* Phone & Email in 2 columns */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-600 font-semibold mb-1">
                    Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full bg-white border border-stone-300 rounded-xl pl-9 pr-3 py-2.5 text-xs text-stone-900 focus:outline-none focus:border-stone-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-stone-600 font-semibold mb-1">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="collector@domain.com"
                      className="w-full bg-white border border-stone-300 rounded-xl pl-9 pr-3 py-2.5 text-xs text-stone-900 focus:outline-none focus:border-stone-800"
                    />
                  </div>
                </div>
              </div>

              {/* Delivery Address */}
              <div>
                <label className="block text-stone-600 font-semibold mb-1">
                  Delivery Address (Apartment, House, Street) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <MapPin className="w-3.5 h-3.5 absolute left-3 top-3 text-stone-400" />
                  <textarea
                    rows={2}
                    required
                    value={streetAddress}
                    onChange={(e) => setStreetAddress(e.target.value)}
                    placeholder="Bungalow / Flat No., Society, Road Area..."
                    className="w-full bg-white border border-stone-300 rounded-xl pl-9 pr-3 py-2 text-xs text-stone-900 focus:outline-none focus:border-stone-800"
                  />
                </div>
              </div>

              {/* City, State, Pincode */}
              <div className="grid grid-cols-3 gap-2.5">
                <div>
                  <label className="block text-stone-600 font-semibold mb-1">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Mumbai"
                    className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-none focus:border-stone-800"
                  />
                </div>

                <div>
                  <label className="block text-stone-600 font-semibold mb-1">State</label>
                  <input
                    type="text"
                    value={stateName}
                    onChange={(e) => setStateName(e.target.value)}
                    placeholder="e.g. Maharashtra"
                    className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-none focus:border-stone-800"
                  />
                </div>

                <div>
                  <label className="block text-stone-600 font-semibold mb-1">Pincode</label>
                  <input
                    type="text"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    placeholder="400049"
                    className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-none focus:border-stone-800"
                  />
                </div>
              </div>

              {/* Delivery Notes */}
              <div>
                <label className="block text-stone-600 font-semibold mb-1">Special Handover Instructions</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Call before delivery, handle with extra care"
                  className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-none focus:border-stone-800"
                />
              </div>
            </div>

            {/* Right Column: Payment Selection & Order Summary */}
            <div className="lg:col-span-5 space-y-4 text-xs">
              <div className="flex items-center gap-2 pb-1 border-b border-stone-200 font-bold text-stone-800 text-xs uppercase tracking-wider">
                <CreditCard className="w-3.5 h-3.5 text-artisan-crimson" />
                <span>2. Select Payment Mode</span>
              </div>

              {/* Payment Option 1: Online Demo Razorpay */}
              <label
                className={`p-3.5 rounded-2xl border flex items-start gap-3 cursor-pointer transition-all ${
                  paymentMethod === 'online'
                    ? 'bg-white border-artisan-crimson shadow-md ring-1 ring-artisan-crimson/20'
                    : 'bg-white/60 border-stone-200 hover:border-stone-400'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMode"
                  checked={paymentMethod === 'online'}
                  onChange={() => setPaymentMethod('online')}
                  className="mt-1 text-artisan-crimson"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-stone-900">Online Payment</span>
                    <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
                      Razorpay Demo
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-500 mt-0.5">
                    UPI, Google Pay, NetBanking & Cards (Razorpay gateway simulation)
                  </p>
                </div>
              </label>

              {/* Payment Option 2: Cash on Delivery (COD) */}
              <label
                className={`p-3.5 rounded-2xl border flex items-start gap-3 cursor-pointer transition-all ${
                  paymentMethod === 'cod'
                    ? 'bg-white border-artisan-crimson shadow-md ring-1 ring-artisan-crimson/20'
                    : 'bg-white/60 border-stone-200 hover:border-stone-400'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMode"
                  checked={paymentMethod === 'cod'}
                  onChange={() => setPaymentMethod('cod')}
                  className="mt-1 text-artisan-crimson"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-stone-900 flex items-center gap-1.5">
                      <Banknote className="w-3.5 h-3.5 text-amber-600" />
                      Cash on Delivery (COD)
                    </span>
                    <span className="text-[10px] font-semibold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                      Pay on Delivery
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-500 mt-0.5">
                    Pay securely in cash or UPI to the courier agent upon receiving your artwork.
                  </p>
                </div>
              </label>

              {/* Acquisition Order Summary */}
              <div className="p-4 bg-white rounded-2xl border border-stone-200 space-y-2.5">
                <div className="font-bold text-stone-800 text-xs border-b border-stone-100 pb-1.5 flex justify-between">
                  <span>Artwork Summary</span>
                  <span>{cart.length} {cart.length === 1 ? 'Item' : 'Items'}</span>
                </div>

                <div className="max-h-28 overflow-y-auto space-y-1.5 pr-1">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center justify-between text-[11px]">
                      <span className="truncate max-w-[160px] text-stone-700">{item.title}</span>
                      <span className="font-semibold text-stone-900">${item.price.toLocaleString()}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-stone-100 space-y-1 text-[11px] text-stone-600">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${subtotal.toLocaleString()}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-emerald-600">
                      <span>Discount</span>
                      <span>-${discount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Insured Wooden Crating</span>
                    <span>{shipping === 0 ? 'Complimentary' : `$${shipping}`}</span>
                  </div>
                  <div className="pt-2 border-t border-stone-200 flex justify-between text-sm font-bold text-stone-900">
                    <span>Total Payable</span>
                    <span className="text-base text-artisan-crimson font-serif font-bold">
                      ${finalTotal.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Trust Indicators */}
              <div className="flex items-center justify-center gap-4 text-[10px] text-stone-500 pt-1">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Authenticity Guaranteed
                </span>
                <span className="flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-blue-600" />
                  Live 4-Step Tracking
                </span>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-4 border-t border-stone-200 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-xs text-stone-500 hover:text-stone-900 font-semibold cursor-pointer"
            >
              Cancel
            </button>

            <MagneticButton
              type="submit"
              disabled={isCheckingOut}
              variant="primary"
              className="px-8 py-3.5 text-xs font-bold flex items-center gap-2 cursor-pointer shadow-lg shadow-artisan-crimson/20"
            >
              {isCheckingOut ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  <span>Connecting 24/7 Database...</span>
                </div>
              ) : (
                <span>Confirm & Place Order →</span>
              )}
            </MagneticButton>
          </div>
        </form>
      </div>
    </div>
  );
};

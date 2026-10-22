import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, Truck, Lock, CreditCard, Banknote, CheckCircle2, User, Phone, Mail, MapPin } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { MagneticButton } from '../ui/MagneticButton';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessCourseEnroll?: (courseId: string) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose, onSuccessCourseEnroll }) => {
  const { cart, subtotal, discount, shipping, deliveryLabel, finalTotal, performCheckout, isCheckingOut } = useCart();
  const { currentUser, setIsAuthModalOpen, unlockCourse } = useAuth();

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

  const isOnlyCourses = cart.length > 0 && cart.every((i) => i.type === 'course');

  useEffect(() => {
    if (currentUser) {
      setFullName(currentUser.name || '');
      setEmail(currentUser.email || '');
    }
  }, [currentUser]);

  useEffect(() => {
    if (isOnlyCourses) {
      setPaymentMethod('online');
    }
  }, [isOnlyCourses]);

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
              {isOnlyCourses ? 'Student Account Required' : 'Collector Login Required'}
            </h3>
            <p className="text-xs text-stone-600 mt-2 leading-relaxed">
              {isOnlyCourses
                ? 'To ensure your live Google Meet link, lecture recordings, and student dashboard are instantly activated, please sign in or register before checking out.'
                : 'To guarantee verified provenance, personalized Certificate of Authenticity, and live 24/7 shipment tracking, please sign in or register before placing an order.'}
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
              className="w-full py-2.5 text-xs text-stone-500 hover:text-stone-800 font-medium cursor-pointer"
            >
              {isOnlyCourses ? 'Cancel & Return to Masterclasses' : 'Back to Studio Gallery'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const finalizeOrder = async (paymentRefId?: string) => {
    const courseItem = cart.find((i) => i.type === 'course');
    const fullDeliveryAddress = isOnlyCourses
      ? 'Digital Atelier Delivery (Online Course Enrollment)'
      : `${streetAddress}, ${city}, ${stateName ? stateName + ' ' : ''}${pincode ? '- ' + pincode : ''}`.trim();
    const resolvedCity = isOnlyCourses ? (city.trim() || 'Online Atelier') : city.trim();
    const chosenPaymentLabel = paymentMethod === 'online'
      ? `Razorpay (${paymentRefId || 'Verified'})`
      : 'Cash on Delivery (COD)';

    await performCheckout({
      name: fullName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      address: fullDeliveryAddress,
      city: resolvedCity,
      state: isOnlyCourses ? 'Online' : stateName.trim(),
      paymentMethod: chosenPaymentLabel,
      paymentStatus: paymentMethod === 'online' ? 'Paid' : 'Pending Payment',
      notes: notes.trim()
    });

    if (courseItem) {
      if (unlockCourse) {
        unlockCourse(courseItem.id);
      }
      try {
        localStorage.setItem('ks_student_selected_course', courseItem.id);
      } catch (e) {
        console.warn(e);
      }
    }

    onClose();
    if (courseItem && onSuccessCourseEnroll) {
      onSuccessCourseEnroll(courseItem.id);
    }
  };

  // 2. Checkout Submission Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!fullName.trim() || !phone.trim() || (!isOnlyCourses && (!streetAddress.trim() || !city.trim()))) {
      setErrorMessage(
        isOnlyCourses
          ? 'Please enter your Full Name and Mobile Number to proceed with enrollment.'
          : 'Please fill all required delivery details (Name, Mobile, Street Address, and City).'
      );
      return;
    }

    try {
      if (paymentMethod === 'online') {
        if (typeof (window as any).Razorpay === 'undefined') {
          setErrorMessage('Payment gateway is loading. Please check your internet connection and try again.');
          return;
        }

        const amountInPaise = Math.round(Number(finalTotal) * 100);
        if (amountInPaise < 100) {
          setErrorMessage('Minimum payment amount must be at least ₹1 (100 paise).');
          return;
        }

        const baseUrl = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
          ? 'http://localhost:5000'
          : (import.meta.env.VITE_API_URL || 'https://kuldeep-singh-backend-q1di.onrender.com');

        const orderRes = await fetch(`${baseUrl}/api/create-order`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: amountInPaise,
            currency: 'INR',
            receipt: `rcpt_${Date.now()}`,
            notes: {
              customer_name: fullName.trim(),
              customer_email: email.trim(),
              customer_phone: phone.trim()
            }
          })
        });

        if (!orderRes.ok) {
          const errorPayload = await orderRes.json().catch(() => ({}));
          throw new Error(errorPayload.error || errorPayload.details || `Order creation failed (${orderRes.status})`);
        }

        const orderData = await orderRes.json();
        const razorpayKeyId = orderData.key_id || orderData.keyId || import.meta.env.VITE_RAZORPAY_KEY_ID;
        const razorpayOrderId = orderData.order_id || orderData.orderId;

        const rzp = new (window as any).Razorpay({
          key: razorpayKeyId,
          amount: orderData.amount,
          currency: orderData.currency || 'INR',
          name: 'Artist Kuldeep Singh Atelier',
          description: cart.map((i) => i.title).join(', ').slice(0, 100) || 'Fine Art Acquisition',
          order_id: razorpayOrderId,
          prefill: {
            name: fullName.trim(),
            email: email.trim(),
            contact: phone.trim()
          },
          theme: {
            color: '#1A1816'
          },
          handler: async (resp: {
            razorpay_payment_id: string;
            razorpay_order_id: string;
            razorpay_signature: string;
          }) => {
            try {
              const verifyRes = await fetch(`${baseUrl}/api/verify-payment`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  razorpay_order_id: resp.razorpay_order_id,
                  razorpay_payment_id: resp.razorpay_payment_id,
                  razorpay_signature: resp.razorpay_signature
                })
              });

              const verifyData = await verifyRes.json().catch(() => ({}));

              if (!verifyRes.ok || !verifyData.success) {
                throw new Error(verifyData.error || 'Payment signature verification failed.');
              }

              await finalizeOrder(resp.razorpay_payment_id);
            } catch (vErr: any) {
              console.error('Signature verification error:', vErr);
              setErrorMessage(vErr.message || 'Payment signature could not be verified. Please contact support.');
            }
          },
          modal: {
            ondismiss: () => {
              console.log('Payment modal dismissed by user');
              setErrorMessage('Payment was cancelled. You can retry whenever you are ready.');
            }
          }
        });

        rzp.on('payment.failed', function (failedResp: any) {
          console.error('Payment failed:', failedResp.error);
          setErrorMessage(failedResp.error?.description || 'Payment failed. Please try a different card, UPI or netbanking.');
        });

        rzp.open();
        return;
      }

      await finalizeOrder();
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
                {isOnlyCourses ? 'Masterclass Enrollment & Atelier Access' : 'Secure Fine Art Acquisition'}
              </h2>
              <p className="text-[11px] text-stone-500">
                {isOnlyCourses ? 'Artist Kuldeep Singh Atelier • Instant Live & Recorded Access' : 'Artist Kuldeep Singh Atelier • 100% Insured Delivery'}
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
            {/* Left Column: Collector / Student & Delivery Details */}
            <div className="lg:col-span-7 space-y-4 text-xs">
              <div className="flex items-center gap-2 pb-1 border-b border-stone-200 font-bold text-stone-800 text-xs uppercase tracking-wider">
                <User className="w-3.5 h-3.5 text-artisan-crimson" />
                <span>{isOnlyCourses ? '1. Student & Contact Details' : '1. Collector & Delivery Details'}</span>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-stone-600 font-semibold mb-1">
                  {isOnlyCourses ? 'Student Full Name' : 'Collector Full Name'} <span className="text-red-500">*</span>
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
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-stone-600 font-semibold text-xs">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    {currentUser && (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 flex items-center gap-1">
                        <Lock className="w-2.5 h-2.5" /> Verified & Locked
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <Mail className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                    <input
                      type="email"
                      required
                      readOnly={Boolean(currentUser)}
                      value={currentUser?.email || email}
                      onChange={(e) => !currentUser && setEmail(e.target.value)}
                      placeholder="collector@domain.com"
                      className={`w-full border rounded-xl pl-9 pr-3 py-2.5 text-xs font-medium focus:outline-none ${
                        currentUser
                          ? 'bg-stone-100/80 border-stone-300 text-stone-700 cursor-not-allowed select-none'
                          : 'bg-white border-stone-300 text-stone-900 focus:border-stone-800'
                      }`}
                    />
                  </div>
                  {currentUser && (
                    <p className="text-[10px] text-stone-500 mt-1">
                      Account email cannot be modified. Purchased courses will be auto-unlocked for <strong>{currentUser.email}</strong>.
                    </p>
                  )}
                </div>
              </div>

              {!isOnlyCourses ? (
                <>
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
                </>
              ) : (
                <div className="p-4 bg-emerald-50/90 border border-emerald-200 rounded-2xl text-emerald-900 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-xs text-emerald-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Instant Digital Atelier Delivery</span>
                  </div>
                  <p className="text-[11px] text-emerald-700 leading-relaxed">
                    Physical delivery address ki zaroorat nahi hai. Razorpay payment verify hote hi batch access, live Google Meet link aur recorded lecture videos <strong>{currentUser?.email || email}</strong> par instantly unlock ho jayenge!
                  </p>
                </div>
              )}
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
                      Razorpay Live
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-500 mt-0.5">
                    UPI, Google Pay, PhonePe, NetBanking & Cards (100% Secure)
                  </p>
                </div>
              </label>

              {/* Payment Option 2: Cash on Delivery (COD) */}
              {!isOnlyCourses ? (
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
              ) : (
                <div className="p-3 bg-stone-100/80 border border-stone-200 rounded-xl text-[11px] text-stone-600 flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5 text-artisan-crimson shrink-0" />
                  <span>Online masterclasses require instant online verification via Razorpay.</span>
                </div>
              )}

              {/* Acquisition Order Summary */}
              <div className="p-4 bg-white rounded-2xl border border-stone-200 space-y-2.5">
                <div className="font-bold text-stone-800 text-xs border-b border-stone-100 pb-1.5 flex justify-between">
                  <span>Order Summary</span>
                  <span>{cart.length} {cart.length === 1 ? 'Item' : 'Items'}</span>
                </div>

                <div className="max-h-28 overflow-y-auto space-y-1.5 pr-1">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center justify-between text-[11px]">
                      <span className="truncate max-w-[160px] text-stone-700">{item.title}</span>
                      <span className="font-semibold text-stone-900">₹{item.price.toLocaleString()}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-stone-100 space-y-1 text-[11px] text-stone-600">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toLocaleString()}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-emerald-600">
                      <span>Discount</span>
                      <span>-₹{discount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>{isOnlyCourses ? 'Digital Classroom Delivery' : (deliveryLabel || 'Insured Wooden Crating')}</span>
                    <span>{shipping === 0 ? 'Complimentary' : `₹${shipping}`}</span>
                  </div>
                  <div className="pt-2 border-t border-stone-200 flex justify-between text-sm font-bold text-stone-900">
                    <span>Total Payable</span>
                    <span className="text-base text-artisan-crimson font-serif font-bold">
                      ₹{finalTotal.toLocaleString()}
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

              {/* Mandatory Razorpay Compliance & Policy Agreement */}
              <div className="p-2.5 bg-stone-100/90 border border-stone-200 rounded-xl text-[10px] text-stone-600 text-center leading-relaxed">
                By confirming this acquisition, you agree to our{' '}
                <a href="/terms" target="_blank" rel="noreferrer" className="text-stone-900 font-bold underline hover:text-artisan-crimson">Terms of Service</a>,{' '}
                <a href="/privacy" target="_blank" rel="noreferrer" className="text-stone-900 font-bold underline hover:text-artisan-crimson">Privacy Policy</a>, and{' '}
                <a href="/refund" target="_blank" rel="noreferrer" className="text-stone-900 font-bold underline hover:text-artisan-crimson">Refund Policy</a>.
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
                <span>{isOnlyCourses ? 'Proceed to Razorpay Payment →' : 'Confirm & Place Order →'}</span>
              )}
            </MagneticButton>
          </div>
        </form>
      </div>
    </div>
  );
};

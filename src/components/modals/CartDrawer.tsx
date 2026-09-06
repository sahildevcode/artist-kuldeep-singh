import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, CheckCircle2, ShieldCheck, Truck } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { MagneticButton } from '../ui/MagneticButton';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    subtotal,
    discount,
    discountCode,
    applyDiscountCode,
    removeDiscount,
    discountError,
    shipping,
    finalTotal,
    isCartOpen,
    setIsCartOpen,
    isCheckingOut,
    checkoutSuccess,
    performCheckout,
    resetCheckout,
  } = useCart();

  const [inputCode, setInputCode] = useState('');

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in"
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FDFBF7] shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300 border-l border-stone-200">
          {/* Header */}
          <div className="p-6 border-b border-stone-200/80 bg-white/70 backdrop-blur-md flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-5 h-5 text-stone-800" />
              <h2 className="font-display font-bold text-lg text-[#1A1816]">
                Acquisitions & Cart ({cart.reduce((a, b) => a + b.quantity, 0)})
              </h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-full text-stone-400 hover:text-stone-800 hover:bg-stone-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {checkoutSuccess ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                <h3 className="font-display text-2xl font-bold text-stone-900">
                  Acquisition Confirmed!
                </h3>
                <p className="text-sm text-stone-600 max-w-xs mx-auto leading-relaxed">
                  Thank you for supporting fine art. A confirmation invoice, certificate of authenticity, and tracking details have been sent to your email.
                </p>
                <div className="p-4 rounded-xl bg-stone-100 border border-stone-200/80 text-xs text-stone-700 space-y-1 text-left">
                  <div className="flex justify-between">
                    <span className="text-stone-500">Order ID:</span>
                    <span className="font-mono font-bold">#JV-ART-{Math.floor(100000 + Math.random() * 900000)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Shipping Mode:</span>
                    <span className="font-medium">Climate-Controlled Wooden Crate</span>
                  </div>
                </div>
                <MagneticButton
                  onClick={resetCheckout}
                  variant="primary"
                  className="w-full mt-4"
                >
                  Continue Exploring Gallery
                </MagneticButton>
              </div>
            ) : cart.length === 0 ? (
              <div className="py-20 text-center space-y-4">
                <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto text-stone-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="font-display text-lg font-bold text-stone-800">Your Cart is Empty</h3>
                <p className="text-xs text-stone-500 max-w-xs mx-auto">
                  Explore original masterworks or enroll in our acclaimed oil and sketching masterclasses.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="mt-2 text-xs font-semibold text-artisan-crimson hover:underline"
                >
                  Browse Store & Courses →
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 bg-white rounded-2xl border border-stone-200/80 shadow-sm flex gap-3.5 items-center group hover:border-stone-400 transition-colors"
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-20 h-20 rounded-xl object-cover border border-stone-100 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-stone-100 text-stone-600">
                          {item.type}
                        </span>
                        {item.mediumOrCategory && (
                          <span className="text-[10px] text-stone-400 truncate">
                            • {item.mediumOrCategory}
                          </span>
                        )}
                      </div>
                      <h4 className="font-serif font-bold text-sm text-stone-900 truncate mt-1">
                        {item.title}
                      </h4>
                      <p className="text-xs font-semibold text-artisan-crimson mt-0.5">
                        ${item.price.toLocaleString()}
                      </p>

                      {/* Quantity or Remove Controls */}
                      <div className="flex items-center justify-between mt-2.5">
                        {item.type === 'artwork' ? (
                          <span className="text-[11px] text-stone-500 italic">Original 1 of 1</span>
                        ) : (
                          <div className="flex items-center border border-stone-200 rounded-lg overflow-hidden bg-stone-50">
                            <button
                              onClick={() => updateQuantity(item.id, -1)}
                              className="p-1 hover:bg-stone-200 transition-colors text-stone-600"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-2.5 text-xs font-bold text-stone-800">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, 1)}
                              className="p-1 hover:bg-stone-200 transition-colors text-stone-600"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        )}

                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-stone-400 hover:text-red-500 transition-colors p-1"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Promo Code Input */}
                <div className="pt-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={inputCode}
                      onChange={(e) => setInputCode(e.target.value)}
                      placeholder="Promo Code (e.g. ARTISAN15)"
                      className="flex-1 bg-white border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-800 uppercase tracking-wide focus:outline-none focus:border-stone-800"
                    />
                    <button
                      onClick={() => {
                        applyDiscountCode(inputCode);
                        setInputCode('');
                      }}
                      className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-semibold transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                  {discountError && (
                    <p className="text-[11px] text-red-500 mt-1">{discountError}</p>
                  )}
                  {discountCode && (
                    <div className="flex items-center justify-between text-xs text-emerald-600 mt-1.5 bg-emerald-50 p-2 rounded-lg border border-emerald-200">
                      <span>Code <b>{discountCode}</b> applied!</span>
                      <button
                        onClick={removeDiscount}
                        className="text-[10px] text-red-500 underline"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>

                {/* Trust Badges */}
                <div className="grid grid-cols-2 gap-2 pt-2 text-[11px] text-stone-500">
                  <div className="flex items-center gap-1.5 p-2 bg-white rounded-xl border border-stone-200/60">
                    <ShieldCheck className="w-4 h-4 text-artisan-gold flex-shrink-0" />
                    <span>Museum Provenance</span>
                  </div>
                  <div className="flex items-center gap-1.5 p-2 bg-white rounded-xl border border-stone-200/60">
                    <Truck className="w-4 h-4 text-artisan-ultramarine flex-shrink-0" />
                    <span>Insured Transit</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer Subtotal & Checkout */}
          {!checkoutSuccess && cart.length > 0 && (
            <div className="p-6 border-t border-stone-200/80 bg-white/90 backdrop-blur-md space-y-3">
              <div className="space-y-1.5 text-xs text-stone-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-stone-800">${subtotal.toLocaleString()}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Discount</span>
                    <span className="font-semibold">-${discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Insured Fine Art Delivery</span>
                  <span className="font-semibold text-stone-800">
                    {shipping === 0 ? 'Complimentary' : `$${shipping}`}
                  </span>
                </div>
                <div className="pt-2 border-t border-stone-200 flex justify-between text-sm font-bold text-stone-900">
                  <span>Total Amount</span>
                  <span className="text-base text-artisan-crimson font-serif font-bold">
                    ${finalTotal.toLocaleString()}
                  </span>
                </div>
              </div>

              <MagneticButton
                onClick={performCheckout}
                disabled={isCheckingOut}
                variant="primary"
                className="w-full py-3.5 flex items-center justify-center gap-2"
              >
                {isCheckingOut ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    <span>Securing Collector Record...</span>
                  </div>
                ) : (
                  <>
                    <span>Proceed to Secure Checkout</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </MagneticButton>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

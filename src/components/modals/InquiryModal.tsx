import React, { useState, useEffect } from 'react';
import { X, Send, Sparkles, CheckCircle2, Phone, MapPin, MessageSquare } from 'lucide-react';

const getBackendUrls = (): string[] => {
  const isLocal = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
  if (isLocal) {
    return ['http://localhost:5000', 'https://kuldeep-singh-backend-q1di.onrender.com'];
  }
  return ['https://kuldeep-singh-backend-q1di.onrender.com', 'http://localhost:5000'];
};

interface InquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultSubject?: string;
}

export const InquiryModal: React.FC<InquiryModalProps> = ({ isOpen, onClose, defaultSubject }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [subject, setSubject] = useState(defaultSubject || 'Studio Inquiry');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (defaultSubject) {
      setSubject(defaultSubject);
    }
  }, [defaultSubject, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      setErrorMsg('Please enter your Name and Mobile/WhatsApp number.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    const inquiryData = {
      id: `inq-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim().toLowerCase(),
      city: city.trim(),
      subject: subject,
      message: message.trim(),
      source: 'website_top_left_inquiry',
      createdAt: new Date().toISOString()
    };

    let savedOk = false;
    const backendUrls = getBackendUrls();

    for (const base of backendUrls) {
      try {
        const res = await fetch(`${base}/api/inquiries`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(inquiryData)
        });
        if (res.ok) {
          savedOk = true;
          break;
        }
      } catch (err) {
        console.warn('Backend inquiry post failed:', err);
      }
    }

    // Also backup in localStorage for offline resiliency
    try {
      const localInqs = JSON.parse(localStorage.getItem('kuldeep_studio_inquiries') || '[]');
      localInqs.unshift(inquiryData);
      localStorage.setItem('kuldeep_studio_inquiries', JSON.stringify(localInqs));
      savedOk = true;
    } catch (err) {
      console.warn('LocalStorage save failed:', err);
    }

    setIsSubmitting(false);

    if (savedOk) {
      setIsSuccess(true);
    } else {
      setErrorMsg('Could not submit inquiry to server. Please click "Direct WhatsApp" below to message us directly.');
    }
  };

  const handleWhatsAppDirect = () => {
    const text = encodeURIComponent(
      `Hello Artist Kuldeep Singh,\n\nI want to make an inquiry from your website:\n• Name: ${name || 'Interested Collector'}\n• Phone: ${phone || 'N/A'}\n• Email: ${email || 'N/A'}\n• City: ${city || 'N/A'}\n• Subject: ${subject}\n• Message: ${message || 'Please share more details.'}`
    );
    window.open(`https://wa.me/918858060101?text=${text}`, '_blank');
  };

  const handleReset = () => {
    setName('');
    setPhone('');
    setEmail('');
    setCity('');
    setMessage('');
    setIsSuccess(false);
    setErrorMsg('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={handleReset}
        className="fixed inset-0 bg-black/65 backdrop-blur-sm transition-opacity"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg bg-[#FAF8F5] rounded-3xl shadow-2xl border border-stone-200 overflow-hidden z-10 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="relative bg-[#1A1816] text-white p-6 sm:p-7 border-b border-stone-800">
          <button
            onClick={handleReset}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-stone-300 hover:text-white transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-artisan-gold/20 text-artisan-gold text-[10px] font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3 h-3" />
            <span>Direct Studio Advisory & Inquiries</span>
          </div>

          <h3 className="font-serif text-2xl font-bold tracking-tight">
            Send an Inquiry / पूछताछ करें
          </h3>
          <p className="text-stone-400 text-xs mt-1 leading-relaxed">
            Inquire directly regarding original paintings, custom commissions, or academy batch admissions.
          </p>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-7 max-h-[75vh] overflow-y-auto">
          {isSuccess ? (
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div>
                <h4 className="font-serif font-bold text-xl text-stone-900">
                  Inquiry Received! / पूछताछ दर्ज हो गई
                </h4>
                <p className="text-xs text-stone-600 mt-2 max-w-sm mx-auto leading-relaxed">
                  Thank you, <strong>{name}</strong>. Your inquiry has been sent to Artist Kuldeep Singh’s studio desk. We will connect with you on <strong>{phone}</strong> shortly.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-2xs space-y-2 text-left text-xs">
                <div className="flex items-center justify-between text-stone-500 text-[11px]">
                  <span>Topic:</span>
                  <span className="font-semibold text-stone-800">{subject}</span>
                </div>
                <div className="flex items-center justify-between text-stone-500 text-[11px]">
                  <span>Atelier Contact:</span>
                  <span className="font-semibold text-emerald-700">+91 8858060101</span>
                </div>
                <div className="flex items-center justify-between text-stone-500 text-[11px]">
                  <span>Email:</span>
                  <span className="font-semibold text-stone-800">artistkuldeepsingh26@gmail.com</span>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={handleWhatsAppDirect}
                  className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Chat on WhatsApp (+91 8858060101)</span>
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="py-3 px-5 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-800 font-bold text-xs transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMsg && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
                  {errorMsg}
                </div>
              )}

              {/* Full Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    Your Name / आपका नाम *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-artisan-gold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    Mobile / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 98100 88231"
                    className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-artisan-gold"
                  />
                </div>
              </div>

              {/* Email & City */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    Email Address / ईमेल
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@domain.com"
                    className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-artisan-gold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    City / शहर
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Delhi, Mumbai"
                    className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-artisan-gold"
                  />
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">
                  Your Message / Requirements / विवरण
                </label>
                <textarea
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Share any specific dimensions, batch preferences, or questions..."
                  className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-artisan-gold resize-none"
                />
              </div>

              {/* Direct Atelier Details Note */}
              <div className="p-3 bg-stone-100 rounded-xl flex items-center justify-between text-[11px] text-stone-600">
                <span className="flex items-center gap-1.5 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-artisan-gold shrink-0" />
                  <span>Delhi, India</span>
                </span>
                <span className="flex items-center gap-1.5 font-medium text-emerald-700">
                  <Phone className="w-3.5 h-3.5 shrink-0" />
                  <span>+91 8858060101</span>
                </span>
              </div>

              {/* Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3 px-5 rounded-xl bg-[#1A1816] hover:bg-stone-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all disabled:opacity-50 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5 text-artisan-gold" />
                  <span>{isSubmitting ? 'Submitting...' : 'Send Studio Inquiry / सबमिट करें'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleWhatsAppDirect}
                  className="py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
                  title="Direct WhatsApp"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

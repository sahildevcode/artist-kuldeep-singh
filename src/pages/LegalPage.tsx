import React, { useState, useEffect } from 'react';
import { 
  FileText, ShieldCheck, RefreshCw, Truck, Mail, Phone, MapPin, 
  Clock, CheckCircle2, ChevronRight, Lock, Sparkles 
} from 'lucide-react';

export type LegalTab = 'terms' | 'privacy' | 'refund' | 'shipping' | 'contact';

interface LegalPageProps {
  initialTab?: LegalTab;
  setActivePage?: (page: any) => void;
}

export const LegalPage: React.FC<LegalPageProps> = ({ initialTab = 'terms', setActivePage }) => {
  const [activeTab, setActiveTab] = useState<LegalTab>(initialTab);

  useEffect(() => {
    setActiveTab(initialTab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [initialTab]);

  const handleTabChange = (tab: LegalTab) => {
    setActiveTab(tab);
    window.location.hash = tab;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navTabs = [
    { id: 'terms' as LegalTab, label: 'Terms & Conditions', icon: <FileText className="w-4 h-4" /> },
    { id: 'privacy' as LegalTab, label: 'Privacy Policy', icon: <ShieldCheck className="w-4 h-4" /> },
    { id: 'refund' as LegalTab, label: 'Refund & Cancellation', icon: <RefreshCw className="w-4 h-4" /> },
    { id: 'shipping' as LegalTab, label: 'Shipping & Delivery', icon: <Truck className="w-4 h-4" /> },
    { id: 'contact' as LegalTab, label: 'Contact Us', icon: <Mail className="w-4 h-4" /> }
  ];

  return (
    <div className="pt-24 sm:pt-28 pb-20 min-h-screen bg-[#FDFBF7]">
      {/* Top Banner */}
      <div className="bg-[#1A1816] text-white py-12 px-4 sm:px-6 lg:px-8 border-b border-stone-800">
        <div className="max-w-6xl mx-auto text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-artisan-gold/10 border border-artisan-gold/30 text-artisan-gold text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            Legal & Compliance Center
          </div>
          <h1 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl tracking-tight text-white">
            Trust, Security & Policies
          </h1>
          <p className="text-xs sm:text-sm text-stone-300 max-w-2xl mx-auto leading-relaxed">
            Official operating guidelines, consumer protection, privacy protocols, and transaction policies for Artist Kuldeep Singh Atelier & Academy.
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Sidebar Navigation */}
          <aside className="lg:col-span-4">
            <div className="bg-white rounded-3xl p-4 sm:p-5 border border-stone-200 shadow-sm sticky top-28 space-y-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-stone-400 px-3 mb-2">
                Policy Navigation
              </h2>
              {navTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs sm:text-sm font-semibold transition-all ${
                    activeTab === tab.id
                      ? 'bg-[#1A1816] text-white shadow-md'
                      : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={activeTab === tab.id ? 'text-artisan-gold' : 'text-stone-400'}>
                      {tab.icon}
                    </span>
                    <span>{tab.label}</span>
                  </div>
                  <ChevronRight className={`w-4 h-4 transition-transform ${activeTab === tab.id ? 'text-artisan-gold translate-x-0.5' : 'text-stone-300'}`} />
                </button>
              ))}

              {/* Verified Trust Badge */}
              <div className="mt-6 pt-5 border-t border-stone-100 px-2 space-y-2.5">
                <div className="flex items-center gap-2 text-emerald-700 text-xs font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Razorpay Verified Merchant</span>
                </div>
                <p className="text-[11px] text-stone-500 leading-relaxed">
                  All digital and physical transactions are processed via RBI-compliant 256-bit SSL encrypted payment gateway.
                </p>
              </div>

              {setActivePage && (
                <div className="pt-3 border-t border-stone-100">
                  <button
                    onClick={() => {
                      setActivePage('gallery');
                      window.location.hash = '';
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="w-full py-2 px-3 text-xs font-bold text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors text-center"
                  >
                    ← Return to Gallery
                  </button>
                </div>
              )}
            </div>
          </aside>

          {/* Policy Document Content Container */}
          <main className="lg:col-span-8">
            <article className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200 shadow-sm space-y-8 text-stone-800 leading-relaxed">
              
              {/* =================================================== */}
              {/* 1. TERMS & CONDITIONS                               */}
              {/* =================================================== */}
              {activeTab === 'terms' && (
                <div className="space-y-6">
                  <div className="border-b border-stone-100 pb-4">
                    <span className="text-[11px] font-bold text-artisan-crimson uppercase tracking-wider">
                      Effective Date: January 1, 2026 • Last Updated: October 2026
                    </span>
                    <h2 className="font-serif font-bold text-2xl sm:text-3xl text-stone-900 mt-1">
                      Terms and Conditions of Service
                    </h2>
                    <p className="text-xs text-stone-500 mt-1">
                      Please read these terms carefully before accessing the masterclasses or acquiring original works.
                    </p>
                  </div>

                  <section className="space-y-3">
                    <h3 className="font-serif font-bold text-base text-stone-900">1. Acceptance of Terms</h3>
                    <p className="text-xs text-stone-600">
                      Welcome to <strong>Kuldeep Singh Fine Art Atelier & Academy</strong> (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;), operated by international fine artist Kuldeep Singh. By browsing our website, acquiring original artworks, enrolling in masterclass diplomas, or using our interactive student portal, you agree to be bound by these Terms and Conditions and all applicable laws and regulations of India.
                    </p>
                  </section>

                  <section className="space-y-3">
                    <h3 className="font-serif font-bold text-base text-stone-900">2. Scope of Services & Products</h3>
                    <p className="text-xs text-stone-600">
                      Our atelier provides the following primary services and fine art products:
                    </p>
                    <ul className="list-disc pl-5 text-xs text-stone-600 space-y-1">
                      <li><strong>Original Master Artworks:</strong> One-of-a-kind handmade oil paintings on Belgian linen, charcoal drawings on archival paper, and authenticated mixed-media compositions.</li>
                      <li><strong>Educational Masterclasses:</strong> Live atelier broadcasts, structured video curriculum modules, individual critique sessions, and signed draftsmanship certificates.</li>
                      <li><strong>Certificates of Authenticity (COA):</strong> Signed provenance documents accompanying genuine physical acquisitions.</li>
                    </ul>
                  </section>

                  <section className="space-y-3">
                    <h3 className="font-serif font-bold text-base text-stone-900">3. Intellectual Property Rights</h3>
                    <p className="text-xs text-stone-600">
                      All creative works, brush stroke studies, recorded lecture demonstrations, high-resolution painting imagery, course syllabus documents, and signatures are the exclusive intellectual property of <strong>Artist Kuldeep Singh</strong> protected under Indian and international copyright treaties.
                    </p>
                    <p className="text-xs text-stone-600 bg-stone-50 p-3 rounded-xl border border-stone-200">
                      ⚠️ <strong>Prohibition:</strong> You are strictly prohibited from copying, screen-recording, distributing, reproducing, or commercially exploiting any masterclass lecture, live stream, or art reproduction without prior written authorization from the artist.
                    </p>
                  </section>

                  <section className="space-y-3">
                    <h3 className="font-serif font-bold text-base text-stone-900">4. User Accounts & Single Active Device Policy</h3>
                    <p className="text-xs text-stone-600">
                      To protect course materials and verified collector provenance:
                    </p>
                    <ul className="list-disc pl-5 text-xs text-stone-600 space-y-1">
                      <li>Each registered student account is strictly tied to <strong>1 verified email address</strong>.</li>
                      <li>Account sharing, credential sharing, or unauthorized group viewing is prohibited.</li>
                      <li>Our security engine enforces a <strong>Single Active Device Policy</strong>. Logging into a second device (phone or laptop) automatically invalidates earlier active sessions.</li>
                    </ul>
                  </section>

                  <section className="space-y-3">
                    <h3 className="font-serif font-bold text-base text-stone-900">5. Commercial Pricing & Payment Processing</h3>
                    <p className="text-xs text-stone-600">
                      All prices on the platform are stated in <strong>Indian National Rupees (INR ₹)</strong> unless clearly toggled. We partner with RBI-approved, PCI-DSS Level 1 certified payment gateway <strong>Razorpay</strong> to process payments securely through UPI, Net Banking, Credit/Debit Cards, and Wallets. We never store raw payment card data on our servers.
                    </p>
                  </section>

                  <section className="space-y-3">
                    <h3 className="font-serif font-bold text-base text-stone-900">6. Governing Law & Legal Jurisdiction</h3>
                    <p className="text-xs text-stone-600">
                      These Terms of Service are governed by and construed in accordance with the laws of India. Any disputes, claims, or controversies arising out of or relating to your use of this atelier shall be subject to the exclusive jurisdiction of the competent courts of <strong>New Delhi, India</strong>.
                    </p>
                  </section>
                </div>
              )}

              {/* =================================================== */}
              {/* 2. PRIVACY POLICY                                   */}
              {/* =================================================== */}
              {activeTab === 'privacy' && (
                <div className="space-y-6">
                  <div className="border-b border-stone-100 pb-4">
                    <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">
                      Compliance: Information Technology Act, 2000 & SPDI Rules
                    </span>
                    <h2 className="font-serif font-bold text-2xl sm:text-3xl text-stone-900 mt-1">
                      Privacy & Data Protection Policy
                    </h2>
                    <p className="text-xs text-stone-500 mt-1">
                      How we safeguard your personal information, session tokens, and transaction telemetry.
                    </p>
                  </div>

                  <section className="space-y-3">
                    <h3 className="font-serif font-bold text-base text-stone-900">1. Information We Collect</h3>
                    <p className="text-xs text-stone-600">
                      We collect only the essential personal information required to deliver courses and fulfill high-value art shipments:
                    </p>
                    <ul className="list-disc pl-5 text-xs text-stone-600 space-y-1">
                      <li><strong>Identity Data:</strong> Full name, chosen unique @username, and avatar profile.</li>
                      <li><strong>Contact Information:</strong> Verified email address and mobile phone number for delivery coordination and OTP verification.</li>
                      <li><strong>Delivery Coordinates:</strong> Physical residential or gallery street address, city, state, and pincode for insured artwork crating.</li>
                      <li><strong>Transaction Records:</strong> Order identification numbers, payment status, amount paid, and Razorpay payment reference IDs.</li>
                    </ul>
                  </section>

                  <section className="space-y-3">
                    <h3 className="font-serif font-bold text-base text-stone-900">2. Financial Information Protection</h3>
                    <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-start gap-3">
                      <Lock className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                      <div className="text-xs text-emerald-900 leading-relaxed">
                        <strong>Zero Financial Storage:</strong> We do NOT capture, view, or store credit card numbers, debit card PINs, CVV codes, or net banking passwords. All financial transactions are directly tokenized and processed through Razorpay&apos;s 256-bit encrypted bank gateway.
                      </div>
                    </div>
                  </section>

                  <section className="space-y-3">
                    <h3 className="font-serif font-bold text-base text-stone-900">3. How Your Information Is Used</h3>
                    <ul className="list-disc pl-5 text-xs text-stone-600 space-y-1">
                      <li>Delivering live atelier broadcast links and 4K recorded lesson access.</li>
                      <li>Generating authentic, personalized Certificates of Authenticity with artist signature.</li>
                      <li>Coordinating customized, insured fine art packaging with trusted logistics partners (BlueDart, Delhivery, DHL).</li>
                      <li>Sending transactional 6-digit OTP verification codes to prevent unauthorized email account hijacking.</li>
                    </ul>
                  </section>

                  <section className="space-y-3">
                    <h3 className="font-serif font-bold text-base text-stone-900">4. Third-Party Disclosures</h3>
                    <p className="text-xs text-stone-600">
                      We never sell, trade, or rent collector or student data to advertisers or commercial third parties. Data is shared exclusively with certified operational vendors:
                    </p>
                    <ul className="list-disc pl-5 text-xs text-stone-600 space-y-1">
                      <li><strong>Razorpay:</strong> To verify legitimate payments and process automatic refunds.</li>
                      <li><strong>BlueDart Express / Delhivery:</strong> Solely to deliver physical artworks to your doorstep.</li>
                      <li><strong>Bunny.net CDN:</strong> High-speed secure video delivery with DRM and tokenized access.</li>
                    </ul>
                  </section>

                  <section className="space-y-3">
                    <h3 className="font-serif font-bold text-base text-stone-900">5. Grievance Officer Contact</h3>
                    <p className="text-xs text-stone-600">
                      In accordance with the Information Technology Act 2000, for any privacy queries or data deletion requests, you may contact our Grievance Officer:
                    </p>
                    <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 text-xs text-stone-700 space-y-1">
                      <p><strong>Grievance Officer:</strong> Mr. Kuldeep Singh</p>
                      <p><strong>Email:</strong> privacy@kuldeepsingh.art</p>
                      <p><strong>Address:</strong> South Extension Part II, New Delhi 110049, India</p>
                    </div>
                  </section>
                </div>
              )}

              {/* =================================================== */}
              {/* 3. CANCELLATION & REFUND POLICY                     */}
              {/* =================================================== */}
              {activeTab === 'refund' && (
                <div className="space-y-6">
                  <div className="border-b border-stone-100 pb-4">
                    <span className="text-[11px] font-bold text-artisan-gold uppercase tracking-wider">
                      Clear & Transparent Policy for Razorpay Compliance
                    </span>
                    <h2 className="font-serif font-bold text-2xl sm:text-3xl text-stone-900 mt-1">
                      Cancellation & Refund Policy
                    </h2>
                    <p className="text-xs text-stone-500 mt-1">
                      Clear timelines, eligibility criteria, and bank transfer processes for our courses and artworks.
                    </p>
                  </div>

                  <section className="space-y-3">
                    <h3 className="font-serif font-bold text-base text-stone-900">1. Online Masterclasses & Workshop Diplomas</h3>
                    <p className="text-xs text-stone-600">
                      We are committed to delivering the highest caliber of classical realism and fine art training.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 space-y-1">
                        <strong className="text-stone-900">Pre-Cohort Cancellation:</strong>
                        <p className="text-stone-600">100% full refund if requested at least <strong>48 hours prior</strong> to the cohort start date.</p>
                      </div>
                      <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 space-y-1">
                        <strong className="text-stone-900">7-Day Satisfaction Guarantee:</strong>
                        <p className="text-stone-600">If within the first 7 days of enrollment you feel the curriculum does not suit your goals (and less than 20% of recorded material has been accessed), a full refund will be granted.</p>
                      </div>
                    </div>
                  </section>

                  <section className="space-y-3">
                    <h3 className="font-serif font-bold text-base text-stone-900">2. Original Artworks Returns & Transit Damage</h3>
                    <p className="text-xs text-stone-600">
                      Because original fine artworks are one-of-a-kind physical masterpieces created over months:
                    </p>
                    <ul className="list-disc pl-5 text-xs text-stone-600 space-y-1">
                      <li><strong>Damaged in Transit:</strong> In the rare event that a package or canvas arrives damaged, please notify us within <strong>7 days of delivery</strong> at <span className="text-artisan-crimson font-medium">support@kuldeepsingh.art</span> with photographs/unboxing video of the crating and damage.</li>
                      <li><strong>Remedy:</strong> Upon verification, we will arrange for complimentary reverse pickup and issue a 100% full refund or offer an equivalent commissioned replacement as agreed with the collector.</li>
                      <li><strong>General Returns:</strong> Undamaged original artworks cannot be returned solely for change of mind after delivery, due to delicate pigment drying and varnish fragility.</li>
                    </ul>
                  </section>

                  <section className="space-y-3">
                    <h3 className="font-serif font-bold text-base text-stone-900">3. Refund Processing Timeline</h3>
                    <p className="text-xs text-stone-600">
                      Once a refund request is approved:
                    </p>
                    <ol className="list-decimal pl-5 text-xs text-stone-600 space-y-1">
                      <li>Our studio finance team initiates the refund via our payment gateway within <strong>24 to 48 business hours</strong>.</li>
                      <li>The refunded amount is credited directly back to the student&apos;s/collector&apos;s <strong>original payment method</strong> (bank account, credit/debit card, or UPI VPA) within <strong>5 to 7 working days</strong>, as per standard Indian banking processing times.</li>
                    </ol>
                  </section>
                </div>
              )}

              {/* =================================================== */}
              {/* 4. SHIPPING & DELIVERY POLICY                       */}
              {/* =================================================== */}
              {activeTab === 'shipping' && (
                <div className="space-y-6">
                  <div className="border-b border-stone-100 pb-4">
                    <span className="text-[11px] font-bold text-artisan-crimson uppercase tracking-wider">
                      Museum-Grade Fine Art Logistics
                    </span>
                    <h2 className="font-serif font-bold text-2xl sm:text-3xl text-stone-900 mt-1">
                      Shipping & Delivery Policy
                    </h2>
                    <p className="text-xs text-stone-500 mt-1">
                      Comprehensive packaging specifications, courier partners, and transit timeframes.
                    </p>
                  </div>

                  <section className="space-y-3">
                    <h3 className="font-serif font-bold text-base text-stone-900">1. Digital Masterclasses & Recordings</h3>
                    <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 text-xs text-stone-700 leading-relaxed">
                      <strong>Instant Automatic Delivery:</strong> Digital masterclasses, live class links, downloadable syllabus guides, and 4K video modules are unlocked <strong>immediately and automatically</strong> within your Student Portal upon successful payment completion. No physical shipping is involved for purely digital items.
                    </div>
                  </section>

                  <section className="space-y-3">
                    <h3 className="font-serif font-bold text-base text-stone-900">2. Physical Artworks Crating & Domestic Shipping</h3>
                    <p className="text-xs text-stone-600">
                      For all original canvases and charcoal drawings:
                    </p>
                    <ul className="list-disc pl-5 text-xs text-stone-600 space-y-1">
                      <li><strong>Packaging Standards:</strong> Every artwork is layered with acid-free glassine paper, heavy-duty moisture-barrier wrap, multiple layers of shock-absorbing foam, and housed in a bespoke reinforced wooden art crate.</li>
                      <li><strong>Dispatch Window:</strong> Artworks are inspected, certified with COA, and dispatched from our Delhi atelier within <strong>2 to 4 business days</strong>.</li>
                      <li><strong>Domestic Transit Time:</strong> <strong>3 to 7 business days</strong> across all major Indian metro and tier-1/2 cities via <strong>BlueDart Express</strong> or <strong>Delhivery Air</strong>.</li>
                      <li><strong>Shipping Fees:</strong> All artwork orders above ₹3,000 enjoy <strong>Free 100% Insured Delivery</strong> across India.</li>
                    </ul>
                  </section>

                  <section className="space-y-3">
                    <h3 className="font-serif font-bold text-base text-stone-900">3. International Fine Art Crating</h3>
                    <p className="text-xs text-stone-600">
                      For acquisitions delivered outside India:
                    </p>
                    <ul className="list-disc pl-5 text-xs text-stone-600 space-y-1">
                      <li>International shipments are routed via <strong>DHL Express Worldwide</strong> or <strong>FedEx Priority</strong>.</li>
                      <li>Estimated delivery timeframe: <strong>7 to 14 business days</strong> depending on destination country and customs clearance.</li>
                      <li>Complete export documentation, Non-Antiquity Archaeological Survey of India (ASI) clearance, and transit insurance are arranged by our studio.</li>
                    </ul>
                  </section>

                  <section className="space-y-3">
                    <h3 className="font-serif font-bold text-base text-stone-900">4. Live Shipment Tracking</h3>
                    <p className="text-xs text-stone-600">
                      As soon as your shipment is dispatched, you will receive an automated notification containing your airway bill (AWB) tracking number and carrier link. You can track your art crate in real-time from our website&apos;s Order History modal or directly via BlueDart/DHL tracking.
                    </p>
                  </section>
                </div>
              )}

              {/* =================================================== */}
              {/* 5. CONTACT US & OFFICIAL GRIEVANCE                  */}
              {/* =================================================== */}
              {activeTab === 'contact' && (
                <div className="space-y-6">
                  <div className="border-b border-stone-100 pb-4">
                    <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">
                      24/7 Official Support & Atelier Visits
                    </span>
                    <h2 className="font-serif font-bold text-2xl sm:text-3xl text-stone-900 mt-1">
                      Contact Us & Atelier Details
                    </h2>
                    <p className="text-xs text-stone-500 mt-1">
                      We welcome collector consultations, student inquiries, private exhibition viewings, and technical support.
                    </p>
                  </div>

                  {/* Contact Info Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
                      <div className="w-8 h-8 rounded-xl bg-artisan-gold/20 text-artisan-gold flex items-center justify-center">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <strong className="text-stone-900 block text-sm">Principal Atelier & Gallery</strong>
                      <p className="text-stone-600 leading-relaxed">
                        Artist Kuldeep Singh Studio<br />
                        Bungalow 14, South Extension Part II,<br />
                        New Delhi, Delhi 110049, India
                      </p>
                    </div>

                    <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
                      <div className="w-8 h-8 rounded-xl bg-artisan-crimson/10 text-artisan-crimson flex items-center justify-center">
                        <Clock className="w-4 h-4" />
                      </div>
                      <strong className="text-stone-900 block text-sm">Hours of Operation</strong>
                      <p className="text-stone-600 leading-relaxed">
                        Monday – Saturday: 10:00 AM – 7:00 PM IST<br />
                        Sunday: Reserved for Live Atelier Masterclasses<br />
                        Private Viewing: By Prior Appointment
                      </p>
                    </div>

                    <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
                      <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                        <Mail className="w-4 h-4" />
                      </div>
                      <strong className="text-stone-900 block text-sm">Electronic Inquiries</strong>
                      <p className="text-stone-600 leading-relaxed">
                        Student Support: <a href="mailto:support@kuldeepsingh.art" className="text-artisan-crimson font-medium hover:underline">support@kuldeepsingh.art</a><br />
                        Acquisitions & Sales: <a href="mailto:contact@kuldeepsingh.art" className="text-artisan-crimson font-medium hover:underline">contact@kuldeepsingh.art</a><br />
                        Legal & KYC: <a href="mailto:legal@kuldeepsingh.art" className="text-artisan-crimson font-medium hover:underline">legal@kuldeepsingh.art</a>
                      </p>
                    </div>

                    <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
                      <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                        <Phone className="w-4 h-4" />
                      </div>
                      <strong className="text-stone-900 block text-sm">Telephonic & WhatsApp</strong>
                      <p className="text-stone-600 leading-relaxed">
                        Studio Hotline: <a href="tel:+919810088231" className="text-stone-900 font-bold hover:underline">+91 98100 88231</a><br />
                        WhatsApp Support: <a href="https://wa.me/919810088231" target="_blank" rel="noreferrer" className="text-emerald-700 font-bold hover:underline">+91 98100 88231</a><br />
                        (Average response time: &lt; 2 hours)
                      </p>
                    </div>
                  </div>

                  {/* Registered Merchant Note for Razorpay Approval */}
                  <div className="p-4 bg-stone-900 text-white rounded-2xl space-y-2">
                    <div className="flex items-center gap-2 text-artisan-gold font-bold text-xs">
                      <ShieldCheck className="w-4 h-4" />
                      <span>Razorpay Verified Payment Merchant Information</span>
                    </div>
                    <p className="text-xs text-stone-300 leading-relaxed">
                      Operating Entity: <strong>Kuldeep Singh Fine Art Atelier</strong> • Category: Fine Art Gallery & Educational Masterclasses • Primary Country of Operation: India • Currency of Settlement: INR (₹).
                    </p>
                  </div>
                </div>
              )}

            </article>
          </main>

        </div>
      </div>
    </div>
  );
};

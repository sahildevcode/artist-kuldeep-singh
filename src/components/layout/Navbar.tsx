import React, { useState, useEffect } from 'react';
import { ShoppingBag, User, Menu, X, Sparkles, LogOut, BookOpen, Image as ImageIcon, Award, Compass } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

interface NavbarProps {
  activePage: 'home' | 'about' | 'courses' | 'store';
  setActivePage: (page: 'home' | 'about' | 'courses' | 'store') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activePage, setActivePage }) => {
  const { totalItems, setIsCartOpen, orders, setIsOrderHistoryOpen } = useCart();
  const { currentUser, setIsAuthModalOpen, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks: { id: 'home' | 'about' | 'courses' | 'store'; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'Home', icon: <Compass className="w-3.5 h-3.5" /> },
    { id: 'about', label: 'About & 12Y Legacy', icon: <Award className="w-3.5 h-3.5" /> },
    { id: 'courses', label: 'Masterclasses', icon: <BookOpen className="w-3.5 h-3.5" /> },
    { id: 'store', label: 'Gallery Store', icon: <ImageIcon className="w-3.5 h-3.5" /> },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'py-3.5 bg-white/85 backdrop-blur-xl border-b border-black/[0.06] shadow-sm'
            : 'py-6 bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <button
              onClick={() => {
                setActivePage('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-left group flex items-center gap-3 focus:outline-none"
            >
              <div className="w-10 h-10 rounded-full bg-[#1A1816] text-white flex items-center justify-center font-serif text-xl font-bold shadow-md group-hover:scale-105 transition-transform duration-300 relative overflow-hidden">
                <span className="relative z-10">K</span>
                <span className="absolute inset-0 bg-gradient-to-tr from-artisan-crimson/50 to-artisan-ochre/50 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div>
                <span className="font-display font-bold text-xl tracking-tight text-[#1A1816] block leading-none">
                  KULDEEP <span className="font-light text-artisan-gold">SINGH</span>
                </span>
                <span className="text-[10px] tracking-[0.2em] uppercase text-stone-500 font-medium block mt-1">
                  Artist • 12Y Fine Art Atelier
                </span>
              </div>
            </button>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1 bg-stone-100/80 backdrop-blur-md p-1.5 rounded-full border border-stone-200/60 shadow-inner">
              {navLinks.map((link) => {
                const isActive = activePage === link.id;
                return (
                  <button
                    key={link.id}
                    onClick={() => {
                      setActivePage(link.id);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`relative px-5 py-2 rounded-full text-xs font-semibold tracking-wide transition-all duration-300 flex items-center gap-2 select-none ${
                      isActive
                        ? 'text-white bg-[#1A1816] shadow-md shadow-black/10'
                        : 'text-stone-600 hover:text-stone-900 hover:bg-white/60'
                    }`}
                  >
                    {link.icon}
                    {link.label}
                    {isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-artisan-crimson animate-pulse" />
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Right Actions: Cart & Auth */}
            <div className="flex items-center gap-2.5 sm:gap-3">
              {/* Cart Button */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2.5 rounded-full bg-stone-100 hover:bg-stone-200 text-[#1A1816] transition-all duration-200 hover:scale-105 active:scale-95 focus:outline-none"
                aria-label="Open Cart"
              >
                <ShoppingBag className="w-5 h-5 text-stone-800" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-artisan-crimson text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-bounce">
                    {totalItems}
                  </span>
                )}
              </button>

              {/* User Account / Login Button */}
              {currentUser ? (
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 p-1.5 pr-3 rounded-full bg-stone-100 hover:bg-stone-200 transition-colors border border-stone-200"
                  >
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="w-7 h-7 rounded-full object-cover border border-white"
                    />
                    <span className="text-xs font-semibold text-stone-800 max-w-[90px] truncate hidden sm:inline">
                      {currentUser.name.split(' ')[0]}
                    </span>
                  </button>

                  {/* Dropdown Menu */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-stone-200/80 p-2 z-50 animate-in fade-in slide-in-from-top-2">
                      <div className="p-2 border-b border-stone-100">
                        <p className="text-xs font-bold text-stone-900">{currentUser.name}</p>
                        <p className="text-[11px] text-stone-500 capitalize flex items-center gap-1 mt-0.5">
                          <Sparkles className="w-3 h-3 text-artisan-gold" />
                          {currentUser.role} Account
                        </p>
                      </div>
                      <div className="py-1">
                        <button
                          onClick={() => {
                            setIsOrderHistoryOpen(true);
                            setIsUserMenuOpen(false);
                          }}
                          className="w-full text-left px-3 py-2 text-xs font-semibold text-artisan-crimson hover:bg-stone-100 rounded-lg flex items-center justify-between"
                        >
                          <span>📦 My Order History</span>
                          <span className="text-[10px] bg-artisan-crimson/10 text-artisan-crimson font-bold px-2 py-0.5 rounded-full">
                            {orders.length}
                          </span>
                        </button>
                        <button
                          onClick={() => {
                            setActivePage('store');
                            setIsUserMenuOpen(false);
                          }}
                          className="w-full text-left px-3 py-2 text-xs text-stone-700 hover:bg-stone-100 rounded-lg flex items-center justify-between"
                        >
                          Acquired Artworks
                          <span className="text-[10px] bg-stone-200 px-1.5 py-0.5 rounded-full">
                            {currentUser.collectedCount || 0}
                          </span>
                        </button>
                        <button
                          onClick={() => {
                            setActivePage('courses');
                            setIsUserMenuOpen(false);
                          }}
                          className="w-full text-left px-3 py-2 text-xs text-stone-700 hover:bg-stone-100 rounded-lg flex items-center justify-between"
                        >
                          Enrolled Courses
                          <span className="text-[10px] bg-stone-200 px-1.5 py-0.5 rounded-full">
                            {currentUser.enrolledCoursesCount || 0}
                          </span>
                        </button>
                      </div>
                      <div className="pt-1 border-t border-stone-100">
                        <button
                          onClick={() => {
                            logout();
                            setIsUserMenuOpen(false);
                          }}
                          className="w-full text-left px-3 py-2 text-xs text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-2"
                        >
                          <LogOut className="w-3.5 h-3.5" /> Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="px-4 py-2 text-xs font-semibold tracking-wide text-white bg-[#1A1816] hover:bg-black rounded-full transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-1.5 active:scale-95"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </button>
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 text-stone-700 hover:text-black focus:outline-none"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-3 px-4 pb-4 pt-2 glass-dropdown border-b border-stone-200/80">
            <div className="flex flex-col gap-1.5">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => {
                    setActivePage(link.id);
                    setIsMobileMenuOpen(false);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                    activePage === link.id
                      ? 'bg-[#1A1816] text-white'
                      : 'text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  {link.icon}
                  {link.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>
    </>
  );
};

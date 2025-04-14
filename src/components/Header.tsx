import React from 'react';
import { Home, Users, LogIn, LogOut, User, CreditCard } from 'lucide-react';
import { Link } from './Link';
import { signOut } from '../lib/supabase';
import { Stethoscope } from 'lucide-react';

interface HeaderProps {
  user: any;
}

export const Header: React.FC<HeaderProps> = ({ user }) => {
  const handleSignOut = async () => {
    try {
      await signOut();
      window.location.href = '/';
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-slate-900/90 backdrop-blur-sm z-50">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-amber-400 hover:text-amber-300">
            {/* <img src="/bone-icon.svg" alt="BoneAI Logo" className="w-8 h-8" /> */}
            <Stethoscope className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">Bone Fracture Analyzer</span>
          </Link>

          <div className="flex items-center gap-6">
            <Link href="/" className="text-slate-200 hover:text-amber-400 flex items-center gap-2">
              <Home size={18} />
              <span className="hidden md:inline">Home</span>
            </Link>
            <Link href="/team" className="text-slate-200 hover:text-amber-400 flex items-center gap-2">
              <Users size={18} />
              <span className="hidden md:inline">Team</span>
            </Link>

            {user ? (
              <>
                <Link 
                  href="/subscription" 
                  className="text-slate-200 hover:text-amber-400 flex items-center gap-2"
                >
                  <CreditCard size={18} />
                  <span className="hidden md:inline">Subscription</span>
                </Link>
                <div className="flex items-center gap-2 text-slate-200">
                  <User size={18} />
                  <span className="hidden md:inline">{user.email}</span>
                </div>
                <button
                  onClick={handleSignOut}
                  className="text-slate-200 hover:text-amber-400 flex items-center gap-2"
                >
                  <LogOut size={18} />
                  <span className="hidden md:inline">Sign Out</span>
                </button>
              </>
            ) : (
              <Link 
                href="/auth" 
                className="bg-amber-500 hover:bg-amber-400 text-slate-900 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <LogIn size={18} />
                <span>Sign In</span>
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};
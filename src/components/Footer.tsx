import React from 'react';
import { Github, Twitter, Linkedin } from 'lucide-react';
import { Link } from './Link';

export const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-200 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">BoneAI</h3>
            <p className="text-slate-400">
              Advanced AI-powered bone fracture detection for healthcare professionals.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-slate-400 hover:text-amber-400">Home</Link></li>
              <li><Link href="/team" className="text-slate-400 hover:text-amber-400">Team</Link></li>
              <li><Link href="/about" className="text-slate-400 hover:text-amber-400">About</Link></li>
              <li><Link href="/contact" className="text-slate-400 hover:text-amber-400">Contact</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Connect With Us</h3>
            <div className="flex gap-4">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" 
                 className="text-slate-400 hover:text-amber-400">
                <Github size={24} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"
                 className="text-slate-400 hover:text-amber-400">
                <Twitter size={24} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"
                 className="text-slate-400 hover:text-amber-400">
                <Linkedin size={24} />
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-slate-800 mt-8 pt-8 text-center text-slate-400">
          <p>&copy; {new Date().getFullYear()} BoneAI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
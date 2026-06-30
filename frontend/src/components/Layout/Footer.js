import React from 'react';
import Link from 'next/link';
<<<<<<< HEAD
import { Mail, Phone, MapPin, Code, Globe, Share2 } from 'lucide-react';
=======
import { Mail, Phone, MapPin } from 'lucide-react';

const Twitter = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

const Facebook = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const Github = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);
>>>>>>> 8ba213c (Solved many errors)

/**
 * Footer component for PG Near Me.
 * Provides quick links, contact channels, and social media references.
 */
export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-slate-900 text-slate-400 mt-auto border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Column */}
          <div className="space-y-4">
            <span className="text-xl font-bold text-white bg-gradient-to-r from-primary-500 to-rose-400 bg-clip-text text-transparent">
              PG Near Me
            </span>
            <p className="text-sm text-slate-400 leading-relaxed">
              Find premium, verified Paying Guest accommodations near you. We offer convenient coliving options close to major colleges, corporate offices, and transit hubs.
            </p>
          </div>

          {/* Quick Links Column */}
          <div>
            <h3 className="text-white text-sm font-semibold tracking-wider uppercase mb-4">Explore</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/search?query=Bangalore" className="hover:text-white transition-colors">PGs in Bangalore</Link>
              </li>
              <li>
                <Link href="/search?query=Delhi" className="hover:text-white transition-colors">PGs in Delhi NCR</Link>
              </li>
              <li>
                <Link href="/search?query=Mumbai" className="hover:text-white transition-colors">PGs in Mumbai</Link>
              </li>
              <li>
                <Link href="/search" className="hover:text-white transition-colors">Advanced Search</Link>
              </li>
            </ul>
          </div>

          {/* Support Column */}
          <div>
            <h3 className="text-white text-sm font-semibold tracking-wider uppercase mb-4">Support & Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">FAQs</Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">Report a Listing</Link>
              </li>
            </ul>
          </div>

          {/* Contact Column */}
          <div className="space-y-3">
            <h3 className="text-white text-sm font-semibold tracking-wider uppercase mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center text-slate-400">
                <Phone className="w-4 h-4 mr-2.5 text-primary-500" />
                <span>+91 99999 88888</span>
              </li>
              <li className="flex items-center text-slate-400">
                <Mail className="w-4 h-4 mr-2.5 text-primary-500" />
                <span>support@pgnearme.com</span>
              </li>
              <li className="flex items-center text-slate-400">
                <MapPin className="w-4 h-4 mr-2.5 text-primary-500" />
                <span>Koramangala 4th Block, Bangalore, India</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Socials & Copyright */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-xs">
          <div className="text-slate-500">
            &copy; {currentYear} PG Near Me. All rights reserved. Made for PG hunting made easy.
          </div>
          
          <div className="flex space-x-5">
            <a href="#" className="text-slate-500 hover:text-white transition-colors" aria-label="Twitter">
<<<<<<< HEAD
              <Globe className="w-4 h-4" />
            </a>
            <a href="#" className="text-slate-500 hover:text-white transition-colors" aria-label="Facebook">
              <Share2 className="w-4 h-4" />
            </a>
            <a href="#" className="text-slate-500 hover:text-white transition-colors" aria-label="Github">
              <Code className="w-4 h-4" />
=======
              <Twitter className="w-4 h-4" />
            </a>
            <a href="#" className="text-slate-500 hover:text-white transition-colors" aria-label="Facebook">
              <Facebook className="w-4 h-4" />
            </a>
            <a href="#" className="text-slate-500 hover:text-white transition-colors" aria-label="Github">
              <Github className="w-4 h-4" />
>>>>>>> 8ba213c (Solved many errors)
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

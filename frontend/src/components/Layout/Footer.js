import React from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, Code, Globe, Share2 } from 'lucide-react';

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
              <Globe className="w-4 h-4" />
            </a>
            <a href="#" className="text-slate-500 hover:text-white transition-colors" aria-label="Facebook">
              <Share2 className="w-4 h-4" />
            </a>
            <a href="#" className="text-slate-500 hover:text-white transition-colors" aria-label="Github">
              <Code className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { ChefHat, Menu, X, Search, Plus, User, LogOut } from 'lucide-react';

const Navigation: React.FC = () => {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-gradient-to-r from-orange-500 to-red-500 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 text-white hover:text-orange-100 transition-colors">
            <ChefHat className="h-8 w-8" />
            <span className="text-xl font-bold">FlavorAI</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-white hover:text-orange-100 transition-colors">
              Discover
            </Link>
            {user && (
              <>
                <Link href="/my-recipes" className="text-white hover:text-orange-100 transition-colors">
                  My Recipes
                </Link>
                <Link href="/create-recipe" className="text-white hover:text-orange-100 transition-colors">
                  Create Recipe
                </Link>
              </>
            )}
          </div>

          {/* Auth Section */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-white text-sm">Welcome, {user.name}</span>
                <button
                  onClick={handleLogout}
                  className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/login"
                  className="text-white hover:text-orange-100 transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="bg-white text-orange-500 hover:bg-orange-50 px-4 py-2 rounded-lg transition-colors font-medium"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:text-orange-100 transition-colors"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-orange-600 rounded-lg mt-2">
              <Link
                href="/"
                className="block px-3 py-2 text-white hover:text-orange-100 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Discover
              </Link>
              {user && (
                <>
                  <Link
                    href="/my-recipes"
                    className="block px-3 py-2 text-white hover:text-orange-100 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    My Recipes
                  </Link>
                  <Link
                    href="/create-recipe"
                    className="block px-3 py-2 text-white hover:text-orange-100 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Create Recipe
                  </Link>
                  <div className="border-t border-orange-500 pt-2 mt-2">
                    <span className="block px-3 py-2 text-white text-sm">Welcome, {user.name}</span>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-2 text-white hover:text-orange-100 transition-colors flex items-center space-x-2"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                </>
              )}
              {!user && (
                <>
                  <Link
                    href="/login"
                    className="block px-3 py-2 text-white hover:text-orange-100 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="block px-3 py-2 text-white hover:text-orange-100 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;

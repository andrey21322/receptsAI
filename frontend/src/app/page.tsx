'use client';

import React, { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import RecipeCard from '@/components/RecipeCard';
import { Recipe, recipesAPI } from '@/lib/api';
import { Search, ChefHat, Clock, Users, Star } from 'lucide-react';

export default function HomePage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async (query?: string) => {
    try {
      setIsLoading(true);
      const data = await recipesAPI.getAll(query);
      setRecipes(data);
      setError('');
    } catch (err) {
      setError('Failed to fetch recipes. Please try again later.');
      console.error('Error fetching recipes:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchRecipes(searchQuery);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const clearSearch = () => {
    setSearchQuery('');
    fetchRecipes();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Discover Amazing Recipes
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-orange-100">
            Find, create, and share your favorite dishes with our AI-powered recipe platform
          </p>
          
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search for recipes, ingredients, or cuisines..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full pl-12 pr-4 py-4 text-gray-900 rounded-lg text-lg focus:outline-none focus:ring-4 focus:ring-orange-300"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-md transition-colors"
              >
                Search
              </button>
            </div>
          </form>
          
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="mt-4 text-orange-100 hover:text-white underline"
            >
              Clear search
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white rounded-lg p-6 text-center shadow-md">
            <ChefHat className="h-12 w-12 text-orange-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900">{recipes.length}</h3>
            <p className="text-gray-600">Recipes Available</p>
          </div>
          <div className="bg-white rounded-lg p-6 text-center shadow-md">
            <Clock className="h-12 w-12 text-orange-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900">Quick & Easy</h3>
            <p className="text-gray-600">Fast Preparation</p>
          </div>
          <div className="bg-white rounded-lg p-6 text-center shadow-md">
            <Users className="h-12 w-12 text-orange-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900">Community</h3>
            <p className="text-gray-600">Shared by Food Lovers</p>
          </div>
        </div>

        {/* Recipes Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-gray-900">
              {searchQuery ? `Search Results for "${searchQuery}"` : 'Featured Recipes'}
            </h2>
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="text-orange-600 hover:text-orange-700 font-medium"
              >
                View All Recipes
              </button>
            )}
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
                  <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600 text-lg">{error}</p>
              <button
                onClick={() => fetchRecipes()}
                className="mt-4 bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : recipes.length === 0 ? (
            <div className="text-center py-12">
              <ChefHat className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">No recipes found</h3>
              <p className="text-gray-600">
                {searchQuery 
                  ? `No recipes match "${searchQuery}". Try a different search term.`
                  : 'No recipes available yet. Be the first to create one!'
                }
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recipes.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Recipe, recipesAPI } from '@/lib/api';
import Navigation from '@/components/Navigation';
import RecipeCard from '@/components/RecipeCard';
import { ChefHat, Plus, Edit, Trash2, AlertCircle } from 'lucide-react';

export default function MyRecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      fetchMyRecipes();
    }
  }, [user]);

  const fetchMyRecipes = async () => {
    try {
      setIsLoading(true);
      setError('');
      const data = await recipesAPI.getMyRecipes();
      setRecipes(data);
    } catch (err: any) {
      setError('Failed to fetch your recipes. Please try again later.');
      console.error('Error fetching recipes:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteRecipe = async (recipeId: string) => {
    if (!confirm('Are you sure you want to delete this recipe? This action cannot be undone.')) {
      return;
    }

    try {
      await recipesAPI.delete(recipeId);
      setRecipes(recipes.filter(recipe => recipe.id !== recipeId));
    } catch (err: any) {
      alert('Failed to delete recipe. Please try again.');
    }
  };

  if (!user) {
    window.location.href = '/login';
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <ChefHat className="h-8 w-8 text-orange-500" />
            <h1 className="text-3xl font-bold text-gray-900">My Recipes</h1>
          </div>
          <button
            onClick={() => router.push('/create-recipe')}
            className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Create Recipe</span>
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 text-center shadow-md">
            <ChefHat className="h-12 w-12 text-orange-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900">{recipes.length}</h3>
            <p className="text-gray-600">Total Recipes</p>
          </div>
          <div className="bg-white rounded-lg p-6 text-center shadow-md">
            <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-green-600 font-bold text-lg">
                {recipes.filter(r => r.isPublic).length}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{recipes.filter(r => r.isPublic).length}</h3>
            <p className="text-gray-600">Public Recipes</p>
          </div>
          <div className="bg-white rounded-lg p-6 text-center shadow-md">
            <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-blue-600 font-bold text-lg">
                {recipes.filter(r => !r.isPublic).length}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{recipes.filter(r => !r.isPublic).length}</h3>
            <p className="text-gray-600">Private Recipes</p>
          </div>
          <div className="bg-white rounded-lg p-6 text-center shadow-md">
            <div className="h-12 w-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-yellow-600 font-bold text-lg">
                {recipes.reduce((sum, r) => sum + (r.averageRating || 0), 0).toFixed(1)}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">
              {recipes.length > 0 ? (recipes.reduce((sum, r) => sum + (r.averageRating || 0), 0) / recipes.length).toFixed(1) : '0'}
            </h3>
            <p className="text-gray-600">Avg Rating</p>
          </div>
        </div>

        {/* Recipes */}
        <div className="mb-8">
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
                onClick={fetchMyRecipes}
                className="mt-4 bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : recipes.length === 0 ? (
            <div className="text-center py-12">
              <ChefHat className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">No recipes yet</h3>
              <p className="text-gray-600 mb-6">
                Start building your recipe collection by creating your first recipe!
              </p>
              <button
                onClick={() => router.push('/create-recipe')}
                className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg transition-colors flex items-center space-x-2 mx-auto"
              >
                <Plus className="h-4 w-4" />
                <span>Create Your First Recipe</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recipes.map((recipe) => (
                <div key={recipe.id} className="relative group">
                  <RecipeCard recipe={recipe} />
                  
                  {/* Action Overlay */}
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => router.push(`/edit-recipe/${recipe.id}`)}
                        className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full transition-colors"
                        title="Edit Recipe"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteRecipe(recipe.id)}
                        className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-full transition-colors"
                        title="Delete Recipe"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Privacy Badge */}
                  <div className="absolute top-4 left-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      recipe.isPublic 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {recipe.isPublic ? 'Public' : 'Private'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        {recipes.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => router.push('/create-recipe')}
                className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Create Another Recipe</span>
              </button>
              <button
                onClick={() => router.push('/')}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Browse All Recipes
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

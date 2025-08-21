'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { recipesAPI, CreateRecipeData } from '@/lib/api';
import Navigation from '@/components/Navigation';
import { Plus, X, ChefHat, AlertCircle, Loader } from 'lucide-react';

const editRecipeSchema = {
  title: (value: string) => value.length > 0 || 'Title is required',
  ingredients: (value: string[]) => value.length > 0 || 'At least one ingredient is required',
  instructions: (value: string[]) => value.length > 0 || 'At least one instruction is required',
  prepTime: (value: number) => value > 0 || 'Prep time must be at least 1 minute',
  cookTime: (value: number) => value >= 0 || 'Cook time cannot be negative',
  servings: (value: number) => value > 0 || 'Servings must be at least 1',
};

export default function EditRecipePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [recipe, setRecipe] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    ingredients: [''],
    instructions: [''],
    prepTime: 15,
    cookTime: 30,
    servings: 4,
    difficulty: 'medium',
    cuisine: '',
    imageUrl: '',
    isPublic: true,
  });
  
  const { user } = useAuth();
  const params = useParams();
  const router = useRouter();
  const recipeId = params.id as string;

  useEffect(() => {
    if (recipeId && user) {
      fetchRecipe();
    }
  }, [recipeId, user]);

  const fetchRecipe = async () => {
    try {
      setIsLoading(true);
      setError('');
      const data = await recipesAPI.getById(recipeId);
      setRecipe(data);
      
      // Check if user owns this recipe
      if (data.authorId !== user.id) {
        setError('You can only edit your own recipes');
        return;
      }

      setFormData({
        title: data.title,
        description: data.description || '',
        ingredients: data.ingredients,
        instructions: data.instructions,
        prepTime: data.prepTime,
        cookTime: data.cookTime,
        servings: data.servings,
        difficulty: data.difficulty,
        cuisine: data.cuisine || '',
        imageUrl: data.imageUrl || '',
        isPublic: data.isPublic,
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch recipe. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayChange = (field: string, index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item: string, i: number) => 
        i === index ? value : item
      )
    }));
  };

  const addArrayItem = (field: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayItem = (field: string, index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_: string, i: number) => i !== index)
    }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSaving(true);
      setError('');

      const recipeData: CreateRecipeData = {
        ...formData,
        imageUrl: formData.imageUrl || undefined,
        cuisine: formData.cuisine || undefined,
      };

      await recipesAPI.update(recipeId, recipeData);
      router.push('/my-recipes');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update recipe. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) {
    window.location.href = '/login';
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center">
            <Loader className="h-8 w-8 text-orange-500 animate-spin" />
            <span className="ml-2 text-gray-600">Loading recipe...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error && error.includes('own recipes')) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => router.push('/my-recipes')}
              className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Back to My Recipes
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
          <div className="flex items-center space-x-3 mb-8">
            <ChefHat className="h-8 w-8 text-orange-500" />
            <h1 className="text-3xl font-bold text-gray-900">Edit Recipe</h1>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
              <div className="flex">
                <AlertCircle className="h-5 w-5 text-red-400" />
                <div className="ml-3">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-black mb-2">
                  Recipe Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-black"
                  placeholder="e.g., Spaghetti Carbonara"
                  required
                />
              </div>

              <div>
                <label htmlFor="cuisine" className="block text-sm font-medium text-black mb-2">
                  Cuisine
                </label>
                <input
                  type="text"
                  value={formData.cuisine}
                  onChange={(e) => handleInputChange('cuisine', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-black"
                  placeholder="e.g., Italian, Mexican"
                />
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-black mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-black"
                placeholder="Brief description of your recipe..."
              />
            </div>

            {/* Recipe Details */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <label htmlFor="prepTime" className="block text-sm font-medium text-black mb-2">
                  Prep Time (minutes) *
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.prepTime}
                  onChange={(e) => handleInputChange('prepTime', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-black"
                  required
                />
              </div>

              <div>
                <label htmlFor="cookTime" className="block text-sm font-medium text-black mb-2">
                  Cook Time (minutes)
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.cookTime}
                  onChange={(e) => handleInputChange('cookTime', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-black"
                />
              </div>

              <div>
                <label htmlFor="servings" className="block text-sm font-medium text-black mb-2">
                  Servings *
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.servings}
                  onChange={(e) => handleInputChange('servings', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-black"
                  required
                />
              </div>

              <div>
                <label htmlFor="difficulty" className="block text-sm font-medium text-black mb-2">
                  Difficulty *
                </label>
                <select
                  value={formData.difficulty}
                  onChange={(e) => handleInputChange('difficulty', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-black"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
            </div>

            {/* Image URL */}
            <div>
              <label htmlFor="imageUrl" className="block text-sm font-medium text-black mb-2">
                Image URL
              </label>
              <input
                type="url"
                value={formData.imageUrl}
                onChange={(e) => handleInputChange('imageUrl', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-black"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            {/* Ingredients */}
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Ingredients *
              </label>
              <div className="space-y-3">
                {formData.ingredients.map((ingredient, index) => (
                  <div key={index} className="flex space-x-2">
                    <input
                      type="text"
                      value={ingredient}
                      onChange={(e) => handleArrayChange('ingredients', index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-black"
                      placeholder={`Ingredient ${index + 1}`}
                      required
                    />
                    {formData.ingredients.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayItem('ingredients', index)}
                        className="px-3 py-2 text-red-600 hover:text-red-800 border border-red-300 rounded-md hover:bg-red-50 transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayItem('ingredients')}
                  className="flex items-center space-x-2 text-orange-600 hover:text-orange-700 font-medium"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Ingredient</span>
                </button>
              </div>
            </div>

            {/* Instructions */}
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Instructions *
              </label>
              <div className="space-y-3">
                {formData.instructions.map((instruction, index) => (
                  <div key={index} className="flex space-x-2">
                    <span className="flex-shrink-0 w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </span>
                    <input
                      type="text"
                      value={instruction}
                      onChange={(e) => handleArrayChange('instructions', index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-black"
                      placeholder={`Step ${index + 1}`}
                      required
                    />
                    {formData.instructions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayItem('instructions', index)}
                        className="px-3 py-2 text-red-600 hover:text-red-800 border border-red-300 rounded-md hover:bg-red-50 transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayItem('instructions')}
                  className="flex items-center space-x-2 text-orange-600 hover:text-orange-700 font-medium"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Step</span>
                </button>
              </div>
            </div>

            {/* Privacy Setting */}
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={formData.isPublic}
                onChange={(e) => handleInputChange('isPublic', e.target.checked)}
                id="isPublic"
                className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
              />
              <label htmlFor="isPublic" className="text-sm font-medium text-black">
                Make this recipe public (visible to everyone)
              </label>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

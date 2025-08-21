'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/contexts/AuthContext';
import { recipesAPI, CreateRecipeData } from '@/lib/api';
import Navigation from '@/components/Navigation';
import { Plus, X, ChefHat, AlertCircle } from 'lucide-react';

const createRecipeSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  ingredients: z.array(z.string().min(1, 'Ingredient cannot be empty')).min(1, 'At least one ingredient is required'),
  instructions: z.array(z.string().min(1, 'Instruction cannot be empty')).min(1, 'At least one instruction is required'),
  prepTime: z.number().min(1, 'Prep time must be at least 1 minute'),
  cookTime: z.number().min(0, 'Cook time cannot be negative'),
  servings: z.number().min(1, 'Servings must be at least 1'),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  cuisine: z.string().optional(),
  imageUrl: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  isPublic: z.boolean().default(true),
});

type CreateRecipeFormData = z.infer<typeof createRecipeSchema>;

export default function CreateRecipePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const router = useRouter();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateRecipeFormData>({
    resolver: zodResolver(createRecipeSchema),
    defaultValues: {
      ingredients: [''],
      instructions: [''],
      prepTime: 15,
      cookTime: 30,
      servings: 4,
      difficulty: 'medium',
      isPublic: true,
    },
  });

  const {
    fields: ingredientFields,
    append: appendIngredient,
    remove: removeIngredient,
  } = useFieldArray({
    control,
    name: 'ingredients',
  });

  const {
    fields: instructionFields,
    append: appendInstruction,
    remove: removeInstruction,
  } = useFieldArray({
    control,
    name: 'instructions',
  });

  const onSubmit = async (data: CreateRecipeFormData) => {
    try {
      setIsLoading(true);
      setError('');
      
      const recipeData: CreateRecipeData = {
        ...data,
        imageUrl: data.imageUrl || undefined,
        cuisine: data.cuisine || undefined,
      };
      
      await recipesAPI.create(recipeData);
      router.push('/my-recipes');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create recipe. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    router.push('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
          <div className="flex items-center space-x-3 mb-8">
            <ChefHat className="h-8 w-8 text-orange-500" />
            <h1 className="text-3xl font-bold text-gray-900">Create New Recipe</h1>
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

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-black mb-2">
                  Recipe Title *
                </label>
                <div className="mt-1">
                  <input
                    {...register('title')}
                    id="title"
                    name="title"
                    type="text"
                    autoComplete="title"
                    required
                    className={`appearance-none block w-full px-3 py-2 border ${
                      errors.title ? 'border-red-300' : 'border-gray-300'
                    } rounded-md placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm text-black`}
                    placeholder="Enter recipe title"
                  />
                  {errors.title && (
                    <p className="mt-2 text-sm text-red-600">{errors.title.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="cuisine" className="block text-sm font-medium text-black mb-2">
                  Cuisine
                </label>
                <div className="mt-1">
                  <input
                    {...register('cuisine')}
                    id="cuisine"
                    name="cuisine"
                    type="text"
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm text-black"
                    placeholder="e.g., Italian, Mexican"
                  />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-black mb-2">
                Description
              </label>
              <div className="mt-1">
                <textarea
                  {...register('description')}
                  id="description"
                  name="description"
                  rows={3}
                  className={`appearance-none block w-full px-3 py-2 border ${
                    errors.description ? 'border-red-300' : 'border-gray-300'
                  } rounded-md placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm text-black`}
                  placeholder="Enter recipe description"
                />
                {errors.description && (
                  <p className="mt-2 text-sm text-red-600">{errors.description.message}</p>
                )}
              </div>
            </div>

            {/* Recipe Details */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <label htmlFor="prepTime" className="block text-sm font-medium text-black mb-2">
                  Prep Time (minutes) *
                </label>
                <div className="mt-1">
                  <input
                    {...register('prepTime', { valueAsNumber: true })}
                    id="prepTime"
                    name="prepTime"
                    type="number"
                    min="1"
                    className={`appearance-none block w-full px-3 py-2 border ${
                      errors.prepTime ? 'border-red-300' : 'border-gray-300'
                    } rounded-md placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm text-black`}
                    placeholder="15"
                  />
                  {errors.prepTime && (
                    <p className="mt-2 text-sm text-red-600">{errors.prepTime.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="cookTime" className="block text-sm font-medium text-black mb-2">
                  Cook Time (minutes) *
                </label>
                <div className="mt-1">
                  <input
                    {...register('cookTime', { valueAsNumber: true })}
                    id="cookTime"
                    name="cookTime"
                    type="number"
                    min="1"
                    className={`appearance-none block w-full px-3 py-2 border ${
                      errors.cookTime ? 'border-red-300' : 'border-gray-300'
                    } rounded-md placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm text-black`}
                    placeholder="30"
                  />
                  {errors.cookTime && (
                    <p className="mt-2 text-sm text-red-600">{errors.cookTime.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="servings" className="block text-sm font-medium text-black mb-2">
                  Servings *
                </label>
                <div className="mt-1">
                  <input
                    {...register('servings', { valueAsNumber: true })}
                    id="servings"
                    name="servings"
                    type="number"
                    min="1"
                    className={`appearance-none block w-full px-3 py-2 border ${
                      errors.servings ? 'border-red-300' : 'border-gray-300'
                    } rounded-md placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm text-black`}
                    placeholder="4"
                  />
                  {errors.servings && (
                    <p className="mt-2 text-sm text-red-600">{errors.servings.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="difficulty" className="block text-sm font-medium text-black mb-2">
                  Difficulty *
                </label>
                <div className="mt-1">
                  <select
                    {...register('difficulty')}
                    id="difficulty"
                    name="difficulty"
                    className={`appearance-none block w-full px-3 py-2 border ${
                      errors.difficulty ? 'border-red-300' : 'border-gray-300'
                    } rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm text-black`}
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                  {errors.difficulty && (
                    <p className="mt-2 text-sm text-red-600">{errors.difficulty.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Image URL */}
            <div>
              <label htmlFor="imageUrl" className="block text-sm font-medium text-black mb-2">
                Image URL
              </label>
              <div className="mt-1">
                <input
                  {...register('imageUrl')}
                  id="imageUrl"
                  name="imageUrl"
                  type="url"
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm text-black"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>

            {/* Ingredients */}
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Ingredients *
              </label>
              <div className="space-y-3">
                {ingredientFields.map((field, index) => (
                  <div key={field.id} className="flex space-x-2">
                    <input
                      {...register(`ingredients.${index}`)}
                      type="text"
                      className={`flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-black ${
                        errors.ingredients?.[index] ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder={`Ingredient ${index + 1}`}
                    />
                    {ingredientFields.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeIngredient(index)}
                        className="px-3 py-2 text-red-600 hover:text-red-800 border border-red-300 rounded-md hover:bg-red-50 transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => appendIngredient('')}
                  className="flex items-center space-x-2 text-orange-600 hover:text-orange-700 font-medium"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Ingredient</span>
                </button>
              </div>
              {errors.ingredients && (
                <p className="mt-1 text-sm text-red-600">{errors.ingredients.message}</p>
              )}
            </div>

            {/* Instructions */}
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Instructions *
              </label>
              <div className="space-y-3">
                {instructionFields.map((field, index) => (
                  <div key={field.id} className="flex space-x-2">
                    <span className="flex-shrink-0 w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </span>
                    <input
                      {...register(`instructions.${index}`)}
                      type="text"
                      className={`flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-black ${
                        errors.instructions?.[index] ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder={`Step ${index + 1}`}
                    />
                    {instructionFields.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeInstruction(index)}
                        className="px-3 py-2 text-red-600 hover:text-red-800 border border-red-300 rounded-md hover:bg-red-50 transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => appendInstruction('')}
                  className="flex items-center space-x-2 text-orange-600 hover:text-orange-700 font-medium"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Step</span>
                </button>
              </div>
              {errors.instructions && (
                <p className="mt-1 text-sm text-red-600">{errors.instructions.message}</p>
              )}
            </div>

            {/* Privacy Setting */}
            <div className="flex items-center">
              <input
                {...register('isPublic')}
                type="checkbox"
                id="isPublic"
                className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
              />
              <label htmlFor="isPublic" className="ml-2 block text-sm text-black">
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
                disabled={isLoading}
                className="px-6 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? 'Creating...' : 'Create Recipe'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

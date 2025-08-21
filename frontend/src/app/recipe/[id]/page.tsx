'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Recipe, Rating, recipesAPI } from '@/lib/api';
import Navigation from '@/components/Navigation';
import { ChefHat, Clock, Users, Star, Heart, Share2, ArrowLeft } from 'lucide-react';

export default function RecipeDetailPage() {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [userRating, setUserRating] = useState<number>(0);
  const [userComment, setUserComment] = useState('');
  const [isSubmittingRating, setIsSubmittingRating] = useState(false);
  const { user } = useAuth();
  const params = useParams();
  const router = useRouter();
  const recipeId = params.id as string;

  useEffect(() => {
    if (recipeId) {
      fetchRecipe();
    }
  }, [recipeId]);

  const fetchRecipe = async () => {
    try {
      setIsLoading(true);
      setError('');
      const data = await recipesAPI.getById(recipeId);
      setRecipe(data);
      
      // Check if user has already rated this recipe
      if (user && data.ratings) {
        const userRatingData = data.ratings.find((r: Rating) => r.user.id === user.id);
        if (userRatingData) {
          setUserRating(userRatingData.rating);
          setUserComment(userRatingData.comment || '');
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch recipe. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRatingSubmit = async () => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (userRating < 1 || userRating > 5) {
      alert('Please select a rating between 1 and 5 stars.');
      return;
    }

    try {
      setIsSubmittingRating(true);
      await recipesAPI.rate(recipeId, {
        rating: userRating,
        comment: userComment,
      });
      
      // Refresh recipe data to show updated rating
      await fetchRecipe();
      alert('Rating submitted successfully!');
    } catch (err: any) {
      alert('Failed to submit rating. Please try again.');
    } finally {
      setIsSubmittingRating(false);
    }
  };

  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'hard':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-64 bg-gray-200 rounded-lg mb-6"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-4/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <ChefHat className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Recipe Not Found</h2>
            <p className="text-gray-600 mb-6">{error || 'The recipe you are looking for does not exist.'}</p>
            <button
              onClick={() => router.push('/')}
              className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Back to Recipes
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
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Recipes</span>
        </button>

        {/* Recipe Header */}
        <div className="bg-white rounded-lg shadow-md p-6 md:p-8 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recipe Image */}
            <div className="h-64 lg:h-80 bg-gradient-to-br from-orange-100 to-red-100 rounded-lg flex items-center justify-center overflow-hidden">
              {recipe.imageUrl ? (
                <img
                  src={recipe.imageUrl}
                  alt={recipe.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <ChefHat className="h-24 w-24 text-orange-400" />
              )}
            </div>

            {/* Recipe Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  {recipe.title}
                </h1>
                <p className="text-gray-600 text-lg">
                  by <span className="font-medium text-gray-700">{recipe.author?.name || 'Unknown Author'}</span>
                </p>
              </div>

              {recipe.description && (
                <p className="text-gray-700 text-lg leading-relaxed">
                  {recipe.description}
                </p>
              )}

              {/* Recipe Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <Clock className="h-6 w-6 text-orange-500" />
                  <div>
                    <p className="text-sm text-gray-600">Total Time</p>
                    <p className="font-medium text-gray-900">
                      {formatTime(recipe.prepTime + recipe.cookTime)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Users className="h-6 w-6 text-orange-500" />
                  <div>
                    <p className="text-sm text-gray-600">Servings</p>
                    <p className="font-medium text-gray-900">{recipe.servings}</p>
                  </div>
                </div>
              </div>

              {/* Difficulty and Cuisine */}
              <div className="flex flex-wrap gap-3">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(recipe.difficulty)}`}>
                  {recipe.difficulty}
                </span>
                {recipe.cuisine && (
                  <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
                    {recipe.cuisine}
                  </span>
                )}
              </div>

              {/* Rating */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Star className="h-5 w-5 text-yellow-400" />
                  <span className="text-lg font-medium text-gray-900">
                    {recipe.averageRating > 0 ? recipe.averageRating.toFixed(1) : 'No ratings'}
                  </span>
                  {recipe.ratingCount > 0 && (
                    <span className="text-gray-600">({recipe.ratingCount} ratings)</span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4">
                <button className="flex items-center space-x-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
                  <Heart className="h-4 w-4" />
                  <span>Save Recipe</span>
                </button>
                <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  <Share2 className="h-4 w-4" />
                  <span>Share</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Recipe Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Ingredients */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Ingredients</h2>
            <ul className="space-y-3">
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">{ingredient}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Instructions */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Instructions</h2>
            <ol className="space-y-4">
              {recipe.instructions.map((instruction, index) => (
                <li key={index} className="flex items-start space-x-4">
                  <span className="flex-shrink-0 w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </span>
                  <span className="text-gray-700 leading-relaxed">{instruction}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Rating Section */}
        {user && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Rate This Recipe</h2>
            <div className="space-y-4">
              {/* Star Rating */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Your Rating</label>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setUserRating(star)}
                      className={`p-1 transition-colors ${
                        star <= userRating ? 'text-yellow-400' : 'text-gray-300'
                      }`}
                    >
                      <Star className="h-6 w-6 fill-current" />
                    </button>
                  ))}
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {userRating > 0 ? `${userRating} star${userRating > 1 ? 's' : ''}` : 'Select a rating'}
                </p>
              </div>

              {/* Comment */}
              <div>
                <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
                  Comment (Optional)
                </label>
                <textarea
                  id="comment"
                  value={userComment}
                  onChange={(e) => setUserComment(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Share your thoughts about this recipe..."
                />
              </div>

              {/* Submit Button */}
              <button
                onClick={handleRatingSubmit}
                disabled={isSubmittingRating || userRating === 0}
                className="bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg transition-colors disabled:cursor-not-allowed"
              >
                {isSubmittingRating ? 'Submitting...' : 'Submit Rating'}
              </button>
            </div>
          </div>
        )}

        {/* Reviews Section */}
        {recipe.ratings && recipe.ratings.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Reviews</h2>
            <div className="space-y-4">
              {recipe.ratings.map((rating: Rating) => (
                <div key={rating.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900">{rating.user.name}</span>
                      <div className="flex items-center space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-4 w-4 ${
                              star <= rating.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(rating.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  {rating.comment && (
                    <p className="text-gray-700">{rating.comment}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {!user && (
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">
              Want to rate this recipe? Sign in to share your thoughts!
            </p>
            <button
              onClick={() => router.push('/login')}
              className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Sign In
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

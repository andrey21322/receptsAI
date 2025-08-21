# FlavorAI Backend

A NestJS-based backend API for the FlavorAI recipe discovery platform.

## Features

- **User Authentication**: JWT-based authentication with registration and login
- **Recipe Management**: CRUD operations for recipes with ingredients and instructions
- **Rating System**: 1-5 star rating system with comments
- **Search**: Recipe search by title, description, and cuisine
- **User Recipes**: Separate management of user's own recipes
- **Prisma ORM**: Type-safe database operations with PostgreSQL

## Tech Stack

- **Framework**: NestJS with TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT with Passport
- **Validation**: class-validator and class-transformer
- **Password Hashing**: bcryptjs

## Prerequisites

- Node.js (v16 or higher)
- PostgreSQL database
- npm or yarn

## Installation

1. **Clone the repository and navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` file with your database credentials:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/flavorai?schema=public"
   JWT_SECRET="your-super-secret-jwt-key-change-in-production"
   JWT_EXPIRES_IN="7d"
   PORT=3001
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma client
   npm run db:generate
   
   # Push schema to database
   npm run db:push
   ```

## Running the Application

### Development Mode
```bash
npm run start:dev
```

### Production Build
```bash
npm run build
npm run start:prod
```

## API Endpoints

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login

### Recipes
- `GET /recipes` - Get all public recipes (with optional search query)
- `GET /recipes/my-recipes` - Get user's own recipes (authenticated)
- `GET /recipes/:id` - Get recipe by ID
- `POST /recipes` - Create new recipe (authenticated)
- `PATCH /recipes/:id` - Update recipe (authenticated, owner only)
- `DELETE /recipes/:id` - Delete recipe (authenticated, owner only)
- `POST /recipes/:id/rate` - Rate a recipe (authenticated)

## Database Schema

### Users
- id, email, password, name, createdAt, updatedAt

### Recipes
- id, title, description, ingredients[], instructions[], prepTime, cookTime, servings, difficulty, cuisine, imageUrl, isPublic, authorId, createdAt, updatedAt

### Ratings
- id, rating, comment, userId, recipeId, createdAt, updatedAt

## Development

### Database Commands
```bash
# Generate Prisma client after schema changes
npm run db:generate

# Push schema changes to database
npm run db:push

# Open Prisma Studio for database management
npm run db:studio
```

### Code Quality
```bash
# Format code
npm run format

# Lint code
npm run lint

# Run tests
npm run test
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | Required |
| `JWT_SECRET` | Secret key for JWT tokens | Required |
| `JWT_EXPIRES_IN` | JWT token expiration time | "7d" |
| `PORT` | Server port | 3001 |

## Security Features

- Password hashing with bcrypt
- JWT token-based authentication
- Input validation with class-validator
- CORS configuration for frontend integration
- Protected routes with JWT guards
- User ownership validation for recipe operations

## Error Handling

The API includes comprehensive error handling for:
- Validation errors
- Authentication failures
- Resource not found
- Permission denied
- Database errors

## Testing

```bash
# Run unit tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:cov
```

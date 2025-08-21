## Quick Start

### Prerequisites
- Node.js 18+ 
- Docker Desktop
- Git

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd testTask
```

### 2. Start the database
```bash
cd backend
docker-compose up -d
```

### 3. Setup Backend
```bash
cd backend
npm install
npx prisma generate
npx prisma db push
npm run start:dev
```

### 4. Setup Frontend
```bash
cd frontend
npm install
npm run dev
```

### 5. Open the application
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- Database Admin: http://localhost:8080 (admin@flavorai.com / admin123)


## Environment Variables

### Backend (`.env`)
```env
DATABASE_URL="postgresql://flavorai_user:flavorai_password@localhost:5432/flavorai?schema=public"
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_EXPIRES_IN="7d"
PORT=3001
```

### Frontend (`.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## Database Schema

The application uses PostgreSQL with the following main entities:

- **Users**: Authentication and profile information
- **Recipes**: Recipe details, ingredients, and instructions
- **Ratings**: User ratings and comments on recipes

## Testing the Application

1. **Register** a new account
2. **Create** your first recipe
3. **Browse** all available recipes
4. **Rate** recipes you've tried
5. **Edit** your own recipes
6. **Search** for specific dishes

### Backend
```bash
cd backend
npm run build
npm run start:prod
```

### Frontend
```bash
cd frontend
npm run build
npm run start
```

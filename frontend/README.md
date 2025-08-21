# FlavorAI Frontend

The frontend application for FlavorAI, built with Next.js 14, TypeScript, and Tailwind CSS.

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Backend API running (see main README)

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**
   ```bash
   # Create .env.local file
   NEXT_PUBLIC_API_URL=http://localhost:3001
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── create-recipe/     # Recipe creation page
│   ├── login/            # User login page
│   ├── my-recipes/       # User's recipes page
│   ├── register/         # User registration page
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page
├── components/            # Reusable components
│   ├── Navigation.tsx    # Main navigation
│   └── RecipeCard.tsx    # Recipe display card
├── contexts/              # React contexts
│   └── AuthContext.tsx   # Authentication state
└── lib/                   # Utilities
    └── api.ts            # API client and types
```

## 🎨 Features

### Pages
- **Home**: Recipe discovery with search functionality
- **Login/Register**: User authentication
- **Create Recipe**: Recipe creation form
- **My Recipes**: User's recipe management
- **Recipe Detail**: Individual recipe view (to be implemented)

### Components
- **Navigation**: Responsive navigation with mobile menu
- **RecipeCard**: Recipe display with hover effects
- **Forms**: Validated forms with React Hook Form and Zod

### State Management
- **AuthContext**: User authentication state
- **React Hook Form**: Form state and validation
- **API Integration**: RESTful API communication

## 🛠️ Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
```

### Code Style

- **TypeScript**: Strict type checking enabled
- **ESLint**: Code quality and consistency
- **Prettier**: Code formatting (configured in VS Code)
- **Tailwind CSS**: Utility-first CSS framework

### Component Guidelines

- Use TypeScript interfaces for props
- Implement responsive design with Tailwind CSS
- Follow React best practices and hooks
- Use semantic HTML elements
- Implement proper accessibility features

## 🔌 API Integration

The frontend communicates with the backend through the API client in `src/lib/api.ts`:

- **Authentication**: Login, registration, JWT handling
- **Recipes**: CRUD operations, search, ratings
- **Error Handling**: Automatic token refresh and error responses
- **Type Safety**: Full TypeScript support for API responses

## 📱 Responsive Design

Built with a mobile-first approach:
- Responsive breakpoints: sm (640px), md (768px), lg (1024px)
- Touch-friendly interface elements
- Optimized for cooking on mobile devices
- Progressive enhancement for desktop users

## 🎯 Key Features

### Authentication
- JWT token management
- Protected routes
- Automatic token refresh
- Secure logout

### Recipe Management
- Create recipes with ingredients and instructions
- Edit and delete personal recipes
- Public/private recipe visibility
- Recipe rating system

### User Experience
- Form validation with helpful error messages
- Loading states and error handling
- Responsive navigation
- Smooth transitions and hover effects

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Environment Variables

Set the following in your production environment:
```env
NEXT_PUBLIC_API_URL=https://your-api-domain.com
```

### Static Export (Optional)

For static hosting, you can export the app:
```bash
npm run build
npm run export
```

## 🧪 Testing

Testing setup to be implemented:
- Unit tests with Jest
- Component testing with React Testing Library
- E2E tests with Playwright

## 🔧 Configuration

### Tailwind CSS
- Custom color palette (orange/red theme)
- Responsive utilities
- Custom animations and transitions

### Next.js
- App Router for modern routing
- Image optimization
- API routes (if needed)
- Middleware support

## 📚 Dependencies

### Core
- **Next.js 14**: React framework
- **React 18**: UI library
- **TypeScript**: Type safety

### UI & Styling
- **Tailwind CSS**: Utility-first CSS
- **Lucide React**: Icon library

### Forms & Validation
- **React Hook Form**: Form management
- **Zod**: Schema validation
- **@hookform/resolvers**: Form validation integration

### HTTP Client
- **Axios**: HTTP client with interceptors

## 🐛 Troubleshooting

### Common Issues

1. **API Connection Errors**
   - Check if backend is running
   - Verify `NEXT_PUBLIC_API_URL` in environment
   - Check CORS configuration on backend

2. **Build Errors**
   - Clear `.next` folder
   - Check TypeScript errors
   - Verify all dependencies are installed

3. **Styling Issues**
   - Ensure Tailwind CSS is properly configured
   - Check for CSS conflicts
   - Verify responsive breakpoints

## 🤝 Contributing

1. Follow the existing code style
2. Add TypeScript types for new features
3. Implement responsive design
4. Add proper error handling
5. Test on mobile and desktop

## 📄 License

This project is licensed under the ISC License.

---

**Happy Coding! 🚀✨**

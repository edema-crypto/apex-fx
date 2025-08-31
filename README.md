# ApexFX - Professional Crypto Trading Platform

A modern, secure crypto trading platform built with React, TypeScript, and Supabase.

## Features

- **Real-time Authentication**: Secure user registration and login with Supabase Auth
- **Live Data Updates**: Real-time balance and transaction updates using Supabase Realtime
- **Admin Panel**: Comprehensive admin dashboard for user and transaction management
- **Responsive Design**: Mobile-first design with smooth animations and micro-interactions
- **Secure Transactions**: End-to-end encrypted transaction processing
- **Multi-currency Support**: Support for Bitcoin, Ethereum, Solana, USDC, and USDT

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Realtime, Storage)
- **State Management**: React Context with custom hooks
- **Forms**: React Hook Form with Yup validation
- **Routing**: React Router v6
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account and project

### Setup

1. **Clone and install dependencies:**
   ```bash
   npm install
   ```

2. **Set up Supabase:**
   - Create a new Supabase project at [supabase.com](https://supabase.com)
   - Copy your project URL and anon key
   - Create a `.env` file based on `.env.example`
   - Run the database migrations in the Supabase SQL editor

3. **Configure environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your Supabase credentials
   ```

4. **Run database migrations:**
   - Open your Supabase project dashboard
   - Go to SQL Editor
   - Copy and run the SQL from `supabase/migrations/create_initial_schema.sql`

5. **Start the development server:**
   ```bash
   npm run dev
   ```

### Database Schema

The application uses the following main tables:

- **profiles**: User profile information extending Supabase auth.users
- **transactions**: All user transactions with real-time updates
- **admin_users**: Admin access control

### Authentication

- **User Authentication**: Email/password with Supabase Auth
- **Admin Authentication**: Special admin credentials (admin@apexfx.com)
- **Protected Routes**: Role-based access control
- **Password Reset**: Secure password reset via email

### Real-time Features

- **Live Balance Updates**: Balance changes reflect immediately across all sessions
- **Transaction Notifications**: Real-time transaction status updates
- **Admin Dashboard**: Live user and transaction monitoring
- **Connection Status**: Online/offline indicators with sync timestamps

### Security Features

- **Row Level Security (RLS)**: Database-level access control
- **Admin Policies**: Separate admin access patterns
- **Secure File Upload**: Avatar uploads to Supabase Storage
- **Input Validation**: Comprehensive form validation with Yup schemas

## Deployment

The application is configured for deployment on Vercel with proper routing and security headers.

## Admin Access

Default admin credentials:
- Email: `admin@apexfx.com`
- Password: `ApexFX@Secure2025`

## Development

### Project Structure

```
src/
├── components/          # React components
│   ├── Admin/          # Admin panel components
│   ├── Auth/           # Authentication components
│   ├── Home/           # Dashboard components
│   ├── Layout/         # Layout components
│   └── UI/             # Reusable UI components
├── contexts/           # React contexts
├── hooks/              # Custom React hooks
├── lib/                # Utility libraries
└── types/              # TypeScript type definitions
```

### Key Hooks

- `useSupabaseAuth`: Handles Supabase authentication
- `useProfile`: Manages user profile data with real-time updates
- `useTransactions`: Handles transaction data with real-time subscriptions
- `useAdminData`: Admin-specific data management

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
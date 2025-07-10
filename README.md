# FT Marketplace

A modern health insurance marketplace application built with Next.js 15, TypeScript, and Supabase. This platform helps users find, compare, and understand health insurance plans based on their location, family situation, and budget.

## 🚀 Features

### 🔍 Plan Discovery & Comparison
- **Location-based filtering**: Find plans available in specific states and counties
- **Family situation matching**: Tailored results for individuals, couples, and families
- **Comprehensive filtering**: Filter by metal level (Bronze, Silver, Gold, Platinum), insurance company, and plan type (HMO, PPO, EPO, POS)
- **Cost analysis**: Compare monthly premiums, deductibles, and out-of-pocket maximums

### 💰 ICHRA Integration
- **Cost calculator**: Calculate net costs with Individual Coverage Health Reimbursement Arrangement (ICHRA)
- **Affordability analysis**: Understand what percentage of salary goes to health insurance
- **Savings breakdown**: Annual savings visualization with ICHRA contributions

### 📊 Detailed Plan Information
- **Comprehensive plan details**: Coverage benefits, network information, and cost breakdowns
- **Usage scenarios**: Cost projections for low, moderate, and high healthcare usage
- **Smart insights**: AI-driven recommendations based on plan characteristics
- **Network analysis**: Provider accessibility and network quality ratings

### 🎯 User Experience
- **Responsive design**: Optimized for desktop, tablet, and mobile devices
- **Interactive tooltips**: Contextual help throughout the application
- **Progressive disclosure**: Information layered by complexity level
- **Accessibility**: WCAG-compliant design with keyboard navigation support

## 🛠 Tech Stack

### Frontend
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript 5.6
- **UI Library**: HeroUI (modern React component library)
- **Styling**: Tailwind CSS
- **Animation**: Framer Motion
- **State Management**: React hooks and context

### Backend
- **Database**: Supabase (PostgreSQL)
- **API**: Next.js API routes
- **Authentication**: Ready for Supabase Auth integration
- **Type Safety**: Full TypeScript coverage with generated database types

### Development Tools
- **Linting**: ESLint with Next.js, TypeScript, and accessibility rules
- **Formatting**: Prettier
- **Version Control**: Git with conventional commits
- **Package Manager**: npm
- **Node.js**: Version 22+ required

## 📦 Installation

### Prerequisites
- Node.js 22.0.0 or higher
- npm or yarn
- Git

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/besteman/ft-marketplace.git
   cd ft-marketplace
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Database Setup**
   - Set up a Supabase project
   - Import the database schema (marketplace_plans table)
   - Configure Row Level Security policies if needed

5. **Start Development Server**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:3000`

## 🏗 Project Structure

```
ft-marketplace/
├── app/                          # Next.js App Router directory
│   ├── api/                      # API routes
│   │   ├── db/                   # Database-related endpoints
│   │   └── system/               # System utilities (Node.js version check)
│   ├── plans/                    # Plan listing and detail pages
│   ├── components/               # React components
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Home page
│   └── providers.tsx            # App providers
├── components/                   # Reusable UI components
│   ├── combinedFilters.tsx      # Location and demographic filters
│   ├── filtersSummary.tsx       # Applied filters summary
│   ├── helpModal.tsx            # Help and support modal
│   └── nodeVersionDisplay.tsx   # Node.js version indicator
├── service/                     # Business logic layer
│   └── db.ts                    # Supabase client configuration
├── types/                       # TypeScript type definitions
│   ├── database.types.ts        # Generated Supabase types
│   ├── nodeVersion.ts          # Node.js version checking types
│   └── index.ts                # Application-specific types
├── public/                      # Static assets
├── .nvmrc                       # Node Version Manager config
├── package.json                 # Dependencies and scripts
├── tailwind.config.js           # Tailwind CSS configuration
├── tsconfig.json               # TypeScript configuration
└── README.md                   # This file
```

## 🚦 Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build production bundle
- `npm run start` - Start production server
- `npm run lint` - Run ESLint with auto-fix

## 🗄 Database Schema

The application uses a single main table `marketplace_plans` with the following key fields:

### Plan Identification
- `id` - Unique plan identifier
- `plan_id_standard_component` - Standard plan ID
- `plan_marketing_name` - Display name
- `issuer_name` - Insurance company

### Geographic Data
- `state_code` - Two-letter state code
- `county_name` - County name
- `rating_area` - Insurance rating area

### Plan Details
- `metal_level` - Bronze, Silver, Gold, Platinum
- `plan_type` - HMO, PPO, EPO, POS
- `network_url` - Provider directory link
- `summary_of_benefits_url` - Plan benefits document

### Premium Data
- `premium_adult_individual_age_*` - Individual premiums by age
- `premium_couple_*` - Couple premiums by age
- `couple_plus_*_child_age_*` - Family premiums

### Cost Sharing
- `medical_deductible_individual_standard` - Individual deductible
- `medical_deductible_family_standard` - Family deductible
- `medical_maximum_out_of_pocket_individual_standard` - Individual OOP max
- `medical_maximum_out_of_pocket_family_standard` - Family OOP max

### Medical Services
- `primary_care_physician_standard` - Primary care cost
- `specialist_standard` - Specialist visit cost
- `emergency_room_standard` - Emergency room cost
- `generic_drugs_standard` - Generic drug cost

## 🔧 Configuration

### Environment Variables
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key

### Tailwind CSS
The project uses a custom Tailwind configuration with:
- HeroUI theme integration
- Custom color palette
- Responsive breakpoints
- Dark mode support (ready for implementation)

### TypeScript
Strict TypeScript configuration with:
- Path mapping for clean imports (`@/`)
- Comprehensive type checking
- Generated database types from Supabase

## 🎨 UI Components

The application uses HeroUI components including:
- **Layout**: Cards, Dividers, Spacers
- **Navigation**: Buttons, Links, Breadcrumbs
- **Data Display**: Tables, Chips, Tooltips, Progress bars
- **Feedback**: Modals, Alerts, Skeletons
- **Forms**: Inputs, Dropdowns, Switches

All components are fully typed and accessible by default.

## 📱 Responsive Design

The application is fully responsive with breakpoints:
- **Mobile**: 640px and below
- **Tablet**: 641px - 1024px
- **Desktop**: 1025px and above

Grid layouts automatically adapt using Tailwind's responsive utilities.

## 🔒 Security

### Data Protection
- Environment variables for sensitive configuration
- Supabase Row Level Security ready for implementation
- Input validation on all form fields
- XSS protection through React's built-in sanitization

### API Security
- Server-side validation on all endpoints
- Error handling that doesn't expose internal details
- Rate limiting ready for implementation

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on every push to master

Ensure Node.js 22+ is available on your chosen platform.

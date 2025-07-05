## Overview

This is a TypeScript repository that hosts a Next.js application. The React framework is used for building the front-end, and the Next App Router is utilized for routing, server-side rendering, and API routes. Heroui is used for UI components, and the application is styled using Tailwind CSS. The repository also includes a service layer for business logic and data fetching, with Supabase as the database solution.

## Repository Structure
- `docs/`: All documentation related to the project
- `public/`: Static assets served by Next.js, such as images and fonts
- `app/`: Main application code
  - `api/`: API routes for server-side logic
  - `components/`: Reusable React components
  - `lib/`: Utility functions and libraries
  - `service/`: Service layer for business logic and data fetching
  - `types/`: TypeScript type definitions

### Database
This app uses Supabase for its database needs. Supabase connection is found in the service/db.ts file. The database TypeScript types are defined in the `types/database.types.ts` file. Please use this file to understand the database schema and types used throughout the application.

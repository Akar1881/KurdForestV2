# Overview

KurdForest is a Next.js-based movie and TV show streaming web application that provides users with access to movies and TV shows with subtitle support. The application integrates with The Movie Database (TMDB) API for content metadata and uses a custom subtitle service for multi-language subtitle support. It features a mobile-first design with a dark theme, horizontal scrolling carousels, and a clean navigation system.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

**Framework**: Next.js 14+ with App Router
- **Rationale**: Provides server-side rendering capabilities for better SEO and initial page load performance, while enabling client-side interactivity where needed
- **Pros**: Built-in routing, API routes, image optimization, and modern React features
- **Cons**: Requires understanding of server vs client components

**UI Components**: shadcn/ui with Radix UI primitives
- **Rationale**: Provides accessible, customizable components built on Radix UI
- **Pros**: Full ownership of component code, TypeScript support, accessibility built-in
- **Cons**: Requires manual installation of each component

**Styling**: Tailwind CSS with custom dark theme
- **Rationale**: Utility-first approach enables rapid UI development with consistent design
- **Design System**: Black background (#000000), white text (#ffffff), yellow accents (#facc15) for ratings, grey tones for secondary elements
- **Pros**: Small bundle size, no CSS naming conventions needed, responsive utilities
- **Cons**: Can lead to verbose class names

**State Management**: React Query (@tanstack/react-query)
- **Rationale**: Handles server state management, caching, and automatic refetching
- **Configuration**: 1-minute stale time, disabled window focus refetching
- **Pros**: Automatic background updates, optimistic updates, request deduplication
- **Cons**: Additional learning curve for complex query scenarios

**Client/Server Split**:
- Server Components: Home page, static content, initial data fetching
- Client Components: Interactive elements (search, pagination, video player, modals)
- **Rationale**: Reduces client-side JavaScript while maintaining interactivity

## Backend Architecture

**API Layer**: Next.js API Routes
- **Structure**: RESTful endpoints under `/app/api/tmdb/`
- **Endpoints**:
  - `/api/tmdb/details` - Fetch movie/TV show details
  - `/api/tmdb/list` - Fetch paginated lists (popular, top-rated)
  - `/api/tmdb/search` - Search movies and TV shows
  - `/api/tmdb/season` - Fetch TV season details
  - `/api/tmdb/trending` - Fetch trending content
- **Rationale**: Co-location with frontend code, serverless deployment compatibility
- **Pros**: Type safety between frontend and backend, simplified deployment
- **Cons**: Limited to serverless execution constraints

**Video Embedding**: vidlink.pro iframe integration
- **Rationale**: Third-party service handles video streaming infrastructure
- **Parameters**: Autoplay control, poster display, subtitle injection
- **Pros**: No video hosting costs, CDN distribution handled externally
- **Cons**: Dependency on third-party service availability

## Data Storage Solutions

**No Primary Database**: Application is stateless
- **Rationale**: All content metadata sourced from TMDB API, no user accounts or persistent storage needed
- **Caching**: Next.js automatic caching with 1-hour revalidation
- **Pros**: Simplified architecture, no database maintenance
- **Cons**: Cannot store user preferences or watch history

**ORM Setup**: Drizzle ORM with Neon Database connection configured
- **Current Status**: Dependencies installed but not actively used
- **Rationale**: Prepared for future features requiring data persistence (user accounts, favorites, watch history)
- **Provider**: @neondatabase/serverless for Postgres connection

## Page Structure

**Core Pages**:
- `/` - Home page with hero carousel and horizontal content scrollers
- `/movies` - Vertical grid of popular movies with pagination
- `/tv` - Vertical grid of popular TV shows with pagination
- `/search` - Search interface with paginated results
- `/movie/[id]` - Movie details with cast, trailer, and similar content
- `/tv/[id]` - TV show details with season selector and episode list
- `/watch/movie/[id]` - Movie player with subtitle options
- `/watch/tv/[id]/[season]/[episode]` - TV episode player with subtitle options

**Layout System**:
- Fixed header (top) with back button, title, and search
- Main content area with top/bottom padding for fixed elements
- Fixed footer (bottom) with 3-tab navigation (Home, TV Shows, Movies)

## Design Patterns

**Mobile-First Responsive Design**:
- **Rationale**: Primary target is mobile users
- **Breakpoints**: Tailwind's default breakpoints (sm: 640px, md: 768px, lg: 1024px)
- **Grid Systems**: 2 columns on mobile, scaling to 6 columns on xl screens

**Horizontal Scrolling Pattern**:
- Used for: Home page content rows, cast lists, similar content
- **Implementation**: CSS overflow with hidden scrollbars, smooth scrolling
- **Rationale**: Maximizes content density while maintaining clean UI

**Vertical Grid with Pagination**:
- Used for: Movies page, TV shows page, search results
- **Rationale**: Better for browsing large catalogs with defined page boundaries

**Progressive Enhancement**:
- Server-rendered content loads first
- Client-side interactivity added progressively
- **Rationale**: Ensures content accessibility even with JavaScript disabled

# External Dependencies

## Third-Party APIs

**The Movie Database (TMDB) API**
- **Purpose**: Primary source for movie/TV show metadata, images, cast, and videos
- **Authentication**: API key via environment variable `TMDB_API_KEY`
- **Base URL**: `https://api.themoviedb.org/3`
- **Image CDN**: `https://image.tmdb.org/t/p`
- **Caching**: 1-hour revalidation via Next.js fetch cache
- **Endpoints Used**:
  - `/trending/{type}/{time_window}` - Trending content
  - `/{type}/popular` - Popular content
  - `/{type}/top_rated` - Top-rated content
  - `/{type}/{id}` - Content details with credits, videos, similar
  - `/tv/{id}/season/{season}` - Season details with episodes
  - `/search/multi` - Multi-search across movies and TV
- **Rate Limits**: Must respect TMDB's rate limiting policies

**Custom Subtitle Service API**
- **Base URL**: `https://api.kurdforest.xyz/api`
- **Endpoints**:
  - `POST /subtitle/fetch` - Initiate subtitle fetching and translation
  - `GET /subtitle/status/{processId}` - Poll subtitle processing status
  - `GET /languages` - Fetch available subtitle languages
- **Purpose**: Fetches, downloads, and translates subtitles to user-selected language
- **Process Flow**:
  1. Client requests subtitle with TMDB ID and language
  2. Service returns process ID
  3. Client polls status endpoint for progress updates
  4. Returns VTT subtitle URL when complete
- **Status States**: starting, fetching_imdb, searching_subs, downloading, translating, converting, finalizing, complete, failed, retrying

**vidlink.pro Video Embedding Service**
- **Purpose**: Video streaming infrastructure
- **Base URL**: `https://vidlink.pro`
- **URL Format**:
  - Movies: `/movie/{tmdbId}`
  - TV Shows: `/tv/{tmdbId}/{season}/{episode}`
- **Parameters**:
  - `autoplay` - Control video autoplay
  - `poster` - Display poster image
  - `sub_file` - Custom subtitle URL
  - `sub_label` - Subtitle language label
- **Integration**: Embedded via iframe in VideoPlayer component

## UI Component Libraries

**Radix UI** - Headless UI components
- Multiple packages for different components (dialog, dropdown, accordion, etc.)
- Provides accessibility, keyboard navigation, and ARIA attributes
- Styled via Tailwind CSS

**Lucide React** - Icon library
- Lightweight, consistent icon set
- Used for: navigation icons, UI indicators (Star, Play, Search, etc.)

**Embla Carousel** - Carousel/slider functionality
- Used for hero section auto-rotation
- Provides touch/swipe support

## Utility Libraries

**class-variance-authority** - Variant-based component styling
**clsx** & **tailwind-merge** - Conditional class name management
**date-fns** - Date formatting and manipulation
**zod** & **drizzle-zod** - Schema validation (prepared for future use)
**react-hook-form** & **@hookform/resolvers** - Form management (prepared for future use)

## Development Dependencies

**TypeScript** - Type safety across application
**PostCSS & Autoprefixer** - CSS processing
**Drizzle Kit** - Database schema management (prepared for future use)
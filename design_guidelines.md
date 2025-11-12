# Movie Database Website - Design Guidelines

## Color Palette
- **Primary Background**: Black (#000000)
- **Primary Text**: White (#ffffff)
- **Secondary Elements**: Grey (#6b7280, #9ca3af, #d1d5db)
- **Accent (Ratings)**: Yellow (#eab308, #facc15)
- **Buttons**: Grey backgrounds with white text
- **Hover States**: Light grey (#374151)

## Layout System
**Spacing**: Use Tailwind's spacing scale consistently (2, 4, 6, 8 units)
**Grid Systems**:
- Horizontal scrolling grids for Home page and Details pages
- Vertical grids with pagination for Movies, TV Shows, and Search pages

## Typography
**Header Title**: Small, clean format - "{Movie/TV Name} • {SiteName}"
**Hierarchy**: Clear distinction between titles, descriptions, and metadata
**Episode Titles**: Truncate with "..." when too long

## Header (Fixed Top)
- **Left**: Back button (←) for navigation
- **Center**: Page title in format "Content Name • SiteName" (single line, small and clean)
- **Right**: Search icon (🔍)
- **Background**: Solid black, white text/icons
- **Z-index**: Above all content

## Footer (Fixed Bottom Tabs)
- **3 Tabs**: Home (🏠), TV Shows (📺), Movies (🎬)
- **Layout**: Icons above text labels
- **Active State**: Highlighted white
- **Inactive State**: Dimmed grey
- **Background**: Solid black
- **Icons**: Use Flaticon icons (not emojis)

## Hero Section (Home Page)
- **Auto-rotation**: Background changes every 3 seconds
- **Content Display**: Movie description, genres, rating (yellow)
- **Buttons**: "Details" and "Watch" with blurred backgrounds
- **Images**: Full-width background images from TMDB backdrops

## Details Page
- **Banner**: Full-width background image
- **Movie Card**: Poster with overlay information
- **Information**: Title, rating (yellow), genres, description
- **Cast Section**: Horizontal scroll with profile images
- **Buttons**: "Trailer" and "Watch" 
- **Related Content**: Horizontal scroll section

## Trailer Modal
- **Header**: "Trailer" text (left), close button [×] (right)
- **Content**: YouTube embed below header
- **Overlay**: Dark semi-transparent background
- **Close Action**: Click [×] or overlay to dismiss

## Watch Pages
**For Movies**:
1. Subtitle message section explaining language support
2. Language dropdown selector
3. Two buttons: "Watch with subtitle" and "Watch without subtitle"
4. Video player iframe with full permissions (fullscreen, orientation, all controls)

**For TV Shows**:
1. Season selection dropdown
2. Vertical episode blocks with 1:1 aspect ratio thumbnails
3. Episode title, rating (yellow), thumbnail
4. Subtitle integration matching movie flow

## Search Page
- Search input at top
- Vertical grid of results
- Pagination format: [PREVIOUS] X/Y [NEXT]

## Pagination Component
- Format: [PREVIOUS] {current}/{total} [NEXT]
- Consistent placement at bottom of vertical grids
- Grey buttons with white text

## Subtitle Progress Indicator
- Real-time status bar showing: starting, fetching_imdb, searching_subs, downloading, translating, finalizing, converting, complete, failed, retrying
- Clear visual feedback during processing

## Video Player
- Responsive iframe adapting to screen size
- Full permissions for fullscreen and orientation changes
- Player controls always accessible
- Support for subtitle integration via URL parameters

## Responsive Design
- Perfect viewport fitting on all screen sizes
- Use responsive units (%, vw, vh) with max-width/min-width constraints
- Prevent overflow with max-width: 100% and overflow-hidden
- Components scale proportionally from mobile to desktop
- Horizontal scrollers on touch devices
- Grid columns adjust based on screen size

## Images
**Hero Section**: Large backdrop images from TMDB (auto-rotating every 3 seconds)
**Details Page**: Full-width banner background + poster card
**Media Cards**: Movie/TV show posters in vertical aspect ratio
**Episode Thumbnails**: 1:1 aspect ratio episode stills
**Cast Section**: Circular profile images in horizontal scroll

## Interactive States
- Smooth hover effects on all clickable elements
- Visual feedback on button presses
- Active tab highlighting in footer
- Modal transitions for trailer overlay
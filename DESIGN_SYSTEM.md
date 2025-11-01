# Event Scheduler Design System

A comprehensive design and branding guide for the Event Scheduler aesthetic.

## Overview

Event Scheduler uses a minimalist, brutalist design approach with clean typography, monospace numbers, and high-contrast black-and-white styling. The design emphasizes clarity, readability, and a clean interface centered around event aggregation and discovery.

---

## Color Palette

### Primary Colors
```css
--background: #ffffff (White)
--foreground: #000000 (Black)
```

### Grays (Tailwind CSS)
- `gray-50`: #f9fafb (Card backgrounds, subtle fills)
- `gray-100`: #f3f4f6 (Hover states, secondary backgrounds)
- `gray-200`: #e5e7eb (Borders, dividers)
- `gray-300`: #d1d4d8 (Stronger dividers)
- `gray-400`: #9ca3af (Icons, secondary text)
- `gray-500`: #6b7280 (Muted text)
- `gray-600`: #4b5563 (Labels, tertiary text)
- `gray-800`: #1f2937 (Hover text)

### Accent Colors
- **Yellow**: `#fdb813` (rgba(253, 184, 19)) - Used for featured events and highlights
- **Red**: `#dc2626` (red-600) - Error states
- **Green**: `#16a34a` (green-600) - Success states, confirmed events

---

## Typography

### Font Families

#### Primary Font Stack (Sans-serif)
```css
font-family: system-ui, -apple-system, sans-serif;
```
**Usage**: All body text, headings, labels, buttons

**Google Fonts Alternative**: Geist (loaded via Next.js)
```typescript
import { Geist } from "next/font/google";
```

#### Monospace Font Stack
```css
font-family: "SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace;
```
**Usage**: Time displays, numerical data, event dates, location data

**Google Fonts Alternative**: Geist Mono
```typescript
import { Geist_Mono } from "next/font/google";
```

### Type Scale & Hierarchy

#### Display/Hero
- **Sun Emoji Header**: `text-6xl` (96px) font-light
- **Main Title (Full)**: `text-3xl` (30px) font-thin, tracking-wide

#### Headings
- **H1 (Compact Header)**: `text-2xl` (24px) font-light, tracking-wide
- **H2 (Location)**: `text-xl` (20px) font-light
- **H3 (Card Titles)**: `text-lg` (18px) font-light
- **H4 (Section Headers)**: `text-xl` (20px) font-light, text-center

#### Body Text
- **Base**: 16px, line-height: 1.6 (25.6px)
- **Small Labels**: `text-sm` (14px) gray-600
- **Extra Small**: `text-xs` (12px) gray-600 or font-mono

#### Data Display (Monospace)
- **Large Data**: `text-lg` (18px) font-mono
- **Small Data**: `text-xs` (12px) font-mono

### Font Weights
- `font-thin`: 300 - Main title, primary headings
- `font-light`: 300 - Most headings and UI text
- `font-normal`: 400 - Body text (default)
- `font-medium`: 500 - Active/selected states
- `font-mono`: Special class for monospace numbers

### Letter Spacing
- `tracking-wide`: 0.025em - Used for titles and headings
- `tracking-wider`: 0.05em - Used for zipcode input (monospace)

---

## Layout & Spacing

### Container
```css
max-width: 1024px (max-w-4xl)
margin: 0 auto
padding: 32px (p-8)
```

### Spacing Scale (Tailwind)
- `gap-2`: 8px - Form elements
- `gap-3`: 12px - Header items
- `gap-4`: 16px - Grid items, card sections
- `mb-4`: 16px - Section bottom margin
- `mb-8`: 32px - Major section spacing
- `mb-12`: 48px - Form bottom margin
- `p-6`: 24px - Card padding
- `px-4, py-3`: Input/button padding
- `px-6, py-3`: Large button padding

### Borders
- **Standard Border**: `border-2 border-black` (2px solid black)
- **Thin Border**: `border border-gray-200` (1px solid gray)
- **Underline**: `underline decoration-1 underline-offset-4`

### Border Radius
- **Cards/Inputs**: No border radius (0px) - Brutalist style
- **Icons/Buttons**: `rounded` (4px) - Subtle rounding for small elements

### Shadows
- **Standard**: `shadow-lg` - Cards and elevated elements
- **Hover**: `hover:shadow-xl` - Interactive card states

---

## Components

### Buttons

#### Primary Button
```css
px-6 py-3
bg-black text-white
border-2 border-black
hover:bg-white hover:text-black
transition-colors
disabled:opacity-50
```

#### Icon Button
```css
p-1.5
hover:bg-gray-100
rounded
transition-colors
```

#### Text Button
```css
text-gray-400
hover:text-gray-600
cursor-pointer
focus:outline-none
```

### Cards

#### Primary Card (Today's Data)
```css
bg-gray-50
p-6
border-2 border-black
position: relative
```

#### Stackable Cards
```css
bg-white
border-2 border-black
shadow-lg
transition-all duration-400 ease-in-out
```
**Card Stacking Offsets**:
- Active card: translateX(0), translateY(0), scale(1)
- Next card: translateX(28px), translateY(8px), scale(0.98)
- Further cards: +11px X, +4px Y offset increments

#### Card Header
```css
px-6 pt-6 mb-4
flex items-center justify-between
```

### Forms

#### Input Field
```css
px-4 py-3
border-2 border-black
text-lg text-center
tracking-wider font-mono
maxLength: 5
```

### Icons & Emojis

#### Event Emoji
- **Large (Header)**: `text-4xl` (36px)
- **Hero**: `text-6xl` (96px)

#### SVG Icons
- **Size**: 20x20px
- **Stroke**: currentColor, strokeWidth: 1.5
- **Style**: Minimal, line-based icons

### Toggle/Switch (Filters)
```css
Background: #16a34a (green-600)
Text: white, text-xs, uppercase, tracking-wider
Padding: px-2 py-0.5
Border-radius: rounded (4px)
```

### Tooltips
```css
bg-gray-800
text-white text-xs
px-2 py-1
rounded
position: absolute
z-index: 50
```

---

## Data Display

### Grid Layouts

#### 4-Column Data Grid
```css
grid grid-cols-2 md:grid-cols-4
gap-4
text-center
```

#### 2-Column Data Grid
```css
grid grid-cols-2
gap-4
```

### Data Labels
```css
text-sm text-gray-600
margin-bottom: 4px
```

### Data Values
```css
text-lg font-mono
(for time/number data)
```

---

## Animations

### Fade In
```css
@keyframes fadeIn {
  from: opacity 0, translateY(-10px)
  to: opacity 1, translateY(0)
}
animation: fadeIn 0.5s ease-in-out
```

### Fade In Text
```css
@keyframes fadeInText {
  from: opacity 0
  to: opacity 1
}
animation: fadeInText 0.5s ease-in-out
```

### Pulse Highlight
```css
@keyframes pulse-highlight {
  0%, 100%: scale(1), drop-shadow(0 0 20px rgba(253, 184, 19, 0.5))
  50%: scale(1.08), drop-shadow(0 0 40px rgba(253, 184, 19, 0.8))
}
animation: pulse-highlight 3s ease-in-out infinite
```

### Slide Down (Accordion)
```css
@keyframes slideDown {
  from: opacity 0, max-height 0, translateY(-10px)
  to: opacity 1, max-height 200px, translateY(0)
}
animation: slideDown 0.3s ease-out forwards
```

### Transitions
- **Standard**: `transition-all duration-500 ease-in-out` (500ms)
- **Fast**: `transition-colors` or `transition-transform` (default 200ms)
- **Card Stack**: `duration-400` (400ms)

---

## Design Principles

### 1. Brutalism
- Sharp, rectangular edges (no border-radius on major elements)
- Bold 2px black borders
- High contrast black/white color scheme
- Minimal decoration

### 2. Typography Hierarchy
- Light/thin font weights throughout
- Wide letter spacing for elegance
- Monospace for data/numbers to maintain alignment
- Clear size differentiation between hierarchy levels

### 3. Minimalism
- White backgrounds with subtle gray accents
- Generous whitespace (padding and margins)
- Clean, uncluttered layouts
- Limited color palette

### 4. Data-Centric
- Numbers and times prominently displayed
- Grid-based data layouts
- Clear labels with subdued styling
- Monospace fonts for numerical consistency

### 5. Subtle Motion
- Smooth transitions (500ms ease-in-out)
- Fade-in animations for new content
- Stack-based card navigation with parallax effects
- Non-intrusive hover states

---

## Usage Examples

### Heading Structure
```html
<!-- Hero -->
<h1 class="text-6xl font-light">📅</h1>
<h2 class="text-3xl font-thin tracking-wide">Event Scheduler</h2>

<!-- Compact Header -->
<h1 class="text-2xl font-light tracking-wide">Event Scheduler</h1>

<!-- Section Header -->
<h4 class="text-xl font-light mb-4 text-center">Upcoming Events</h4>
```

### Data Display
```html
<div class="grid grid-cols-4 gap-4 text-center">
  <div>
    <p class="text-sm text-gray-600">Event Time</p>
    <p class="text-lg font-mono">7:30 PM</p>
  </div>
</div>
```

### Button
```html
<button class="px-6 py-3 bg-black text-white border-2 border-black hover:bg-white hover:text-black transition-colors">
  Add Event
</button>
```

### Card
```html
<div class="bg-gray-50 p-6 border-2 border-black">
  <h4 class="text-xl font-light mb-4 text-center">Event Title</h4>
  <!-- Content -->
</div>
```

---

## Technical Implementation

### Tailwind CSS v4
The design system uses Tailwind CSS v4 with PostCSS configuration:

```javascript
// postcss.config.mjs
{
  plugins: ["@tailwindcss/postcss"]
}
```

### CSS Variables
```css
:root {
  --background: #ffffff;
  --foreground: #000000;
  --font-sans: system-ui, -apple-system, sans-serif;
  --font-mono: "SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace;
}
```

### Next.js Font Loading
```typescript
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
```

---

## Responsive Considerations

### Breakpoints (Tailwind)
- **sm**: 640px
- **md**: 768px (used for grid layout changes)
- **lg**: 1024px
- **xl**: 1280px

### Mobile-First Grid
```css
grid-cols-2 md:grid-cols-4
```
2 columns on mobile, 4 columns on desktop (768px+)

---

## Accessibility

- Focus states on interactive elements
- Semantic HTML structure
- ARIA labels where needed
- Sufficient color contrast (black on white)
- Clear visual hierarchy
- Keyboard navigation support

---

## Brand Identity

### Logo/Mark
- Calendar emoji (📅) as primary brand mark
- Text: "Event Scheduler" in font-light/font-thin
- Minimalist, no additional graphics

### Voice & Tone
- Clean, organized
- Event-focused
- Minimal copy
- Straightforward language
- No unnecessary embellishment

### Application
This design system can be applied to other applications by:
1. Using the same font stack (system-ui primary, monospace for data)
2. Implementing the black/white/gray color palette
3. Using 2px black borders for major elements
4. Maintaining light font weights throughout
5. Using the same spacing scale
6. Following the brutalist, minimal aesthetic
7. Implementing smooth 500ms transitions
8. Using monospace fonts for all numerical data

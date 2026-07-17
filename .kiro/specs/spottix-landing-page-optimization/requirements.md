# Requirements: Spottix Landing Page Visual Optimization

## 1. Problem Statement

The Spottix landing page at https://spottix-app-landing-page.vercel.app/ currently suffers from a blurry, hazy appearance that degrades visual clarity and user experience. The excessive use of backdrop filters, CSS blur effects, oversized glowing shadows, transparent glass morphism cards, and bright decorative backgrounds create a visually heavy and unclear presentation.

## 2. Goals

1. **Improve Visual Clarity**: Remove all unnecessary blur effects to ensure sharp, crisp text and UI elements
2. **Enhance Readability**: Optimize typography contrast and sharpness across all sections
3. **Fix Performance**: Reduce render-blocking blur animations and optimize CSS
4. **Maintain Design Integrity**: Keep the dark theme aesthetic while improving visual clarity
5. **Ensure Responsiveness**: Fix all responsive breakpoints and prevent horizontal overflow

## 3. Core Requirements

### 3.1 Blur Removal Requirements

**R1.1** All `backdrop-filter: blur()` and `-webkit-backdrop-filter: blur()` properties exceeding 6px MUST be removed or reduced
- Context: Excessive backdrop blur (18px+) causes severe visual haziness
- Constraint: Maximum 6px blur only where absolutely necessary for depth perception

**R1.2** All `filter: blur()` effects on text, cards, buttons, navigation, and content containers MUST be removed
- Context: Text blur filters make content unreadable
- Constraint: Zero blur on any text elements

**R1.3** All `filter: drop-shadow()` with blur radius exceeding 10px MUST be reduced to maximum 10px
- Context: Large glowing shadows create visual noise
- Constraint: Subtle shadows only for depth, not decoration

**R1.4** All `text-shadow` properties on body text, paragraphs, and links MUST be removed
- Context: Text shadows on body copy reduce readability
- Constraint: Text shadow only on large headings if needed for contrast

### 3.2 Background and Decoration Requirements

**R2.1** All decorative `::before` and `::after` pseudo-elements MUST be positioned with proper `z-index` behind content
- Context: Decorative gradients overlaying content cause blur
- Constraint: Use `isolation: isolate` on section containers

**R2.2** Overlapping gradient backgrounds MUST be consolidated to single gradient per section
- Context: Multiple overlapping gradients increase opacity and blur
- Constraint: Maximum one decorative gradient per section

**R2.3** All decorative background opacity MUST NOT exceed 0.10 for green accents
- Context: Bright backgrounds reduce contrast
- Constraint: Subtle decorative effects only

### 3.3 Typography Requirements

**R3.1** All heading text MUST use solid colors without parent container opacity affecting text
- Context: Parent opacity reduces text clarity
- Constraint: Use individual RGBA colors on text elements

**R3.2** Text color hierarchy MUST follow:
- Main headings: `#ffffff` (100% white)
- Secondary headings: `rgba(255,255,255,0.92)` (92% white)
- Body text: `rgba(255,255,255,0.70)` (70% white)
- Muted text: `rgba(255,255,255,0.55)` (55% white)

**R3.3** Responsive typography MUST scale properly:
- Hero heading: `clamp(38px, 5.5vw, 68px)` with `line-height: 1.05`
- Section heading: `clamp(30px, 4vw, 44px)` with `line-height: 1.15`
- Body text: `16px` with `line-height: 1.7`

### 3.4 Header and Navigation Requirements

**R4.1** Navbar backdrop blur MUST NOT exceed 6px
- Context: Strong blur makes navigation hard to read while scrolling

**R4.2** Scrolled navbar state MUST use solid background: `rgba(8, 14, 12, 0.97)`
- Context: Near-solid background provides clarity without blur

**R4.3** Mobile menu MUST have solid background with no transparency over content
- Context: Transparent mobile menus are unreadable

**R4.4** Active navigation links MUST maintain green highlight with proper contrast

### 3.5 Card and Container Requirements

**R5.1** All glass morphism cards MUST be replaced with solid backgrounds:
- Background: `#101815` (solid dark)
- Border: `1px solid rgba(255,255,255,0.08)`
- Border radius: `20px`
- Box shadow: `0 14px 36px rgba(0,0,0,0.20)`

**R5.2** Card hover states MUST use:
- Transform: `translateY(-4px)`
- Border color: `rgba(54, 211, 153, 0.35)`
- Box shadow: `0 18px 42px rgba(0,0,0,0.26)`

**R5.3** All cards in problem, features, steps, showcase, gamification, leaderboards, map stats, testimonials, FAQ, and download sections MUST use solid backgrounds

### 3.6 Hero Section Requirements

**R6.1** Hero section minimum height MUST be `82vh` on desktop, auto with proper padding on mobile
- Context: Prevent awkward height on different screens

**R6.2** All blurred overlays on hero content MUST be removed
- Context: Blur over phone mockup and CTA buttons reduces clarity

**R6.3** Background decorative glow MUST be reduced to opacity 0.08
- Context: Bright glow reduces contrast

**R6.4** Phone mockup size MUST be responsive:
- Desktop: 320px width
- Tablet: 300px width  
- Mobile: 270px width

**R6.5** NO horizontal overflow allowed on any screen size

### 3.7 JavaScript Functionality Requirements

**R7.1** Impact counter animation MUST animate from 0 to target values (10K+, 5K+, 95%, 50+)
- Context: Counters currently not animating properly
- Implementation: Use IntersectionObserver with threshold 0.15

**R7.2** FAQ accordion MUST support:
- One item open at a time
- Smooth `maxHeight` animation using `scrollHeight`
- Rotate toggle icon on open
- ARIA attributes for accessibility

**R7.3** Before/After slider MUST support:
- Mouse drag interaction
- Touch interaction
- Keyboard arrow keys
- Update overlay width and handle position
- No blur on comparison images

### 3.8 Map Section Requirements

**R8.1** Bengaluru map MUST be fully interactive without blur overlay
- Context: Dark overlays reduce map visibility

**R8.2** Map statistics card MUST have solid background and readable text
- Context: Glass morphism makes stats hard to read

**R8.3** Mobile map height MUST be 360-420px, desktop 500-560px
- Context: Proper height for usability

**R8.4** "Back to Overview" button MUST be functional and clearly visible

### 3.9 Global Sizing Requirements

**R9.1** Container maximum width: `1200px`
**R9.2** Section padding: `80px` (desktop), `64px` (tablet), `48px` (mobile)
**R9.3** Container padding: `32px` (desktop), `24px` (tablet), `18px` (mobile)
**R9.4** Card padding: `24px` (desktop), `20px` (mobile)
**R9.5** Card gap: `20-24px`
**R9.6** Border radius: `20px` for cards
**R9.7** Icon size: `44-50px`
**R9.8** Button height: `48-52px`, border radius `12-14px`

### 3.10 Responsive Requirements

**R10.1** All breakpoints MUST be tested:
- 320px (small mobile)
- 375px (mobile)
- 425px (large mobile)
- 768px (tablet)
- 1024px (small desktop)
- 1280px (desktop)
- 1440px (large desktop)

**R10.2** NO horizontal scrolling allowed at any breakpoint
- Context: Do not use `overflow-x: hidden` as sole solution
- Constraint: Fix root causes of overflow

**R10.3** Mobile menu MUST not blur content underneath

**R10.4** Responsive text, phone mockups, maps, leaderboards, CTAs, and footer MUST adapt properly

### 3.11 Performance Requirements

**R11.1** Remove all unused blur animation keyframes
- Context: Unused animations increase CSS file size

**R11.2** Animate ONLY `transform` and `opacity` properties for performance
- Context: Blur animations are render-blocking

**R11.3** Lazy-load all images below the fold
- Context: Improve initial load time

**R11.4** Remove duplicate CSS rules
- Context: Reduce file size

**R11.5** Support `prefers-reduced-motion` for accessibility
- Context: Users with motion sensitivity

**R11.6** Fix all console errors and warnings
- Context: Clean JavaScript execution

### 3.12 Leaderboard and Gamification Requirements

**R12.1** All leaderboard and gamification cards MUST have solid backgrounds
**R12.2** NO backdrop blur on any gamification elements
**R12.3** Sharp, high-contrast text for names, wards, ranks, and points
**R12.4** Subtle green borders for active tabs without blur
**R12.5** Responsive: Convert table rows to cards on screens below 768px

### 3.13 Testimonials and Footer Requirements

**R13.1** All testimonial cards MUST have solid backgrounds without blur
**R13.2** High contrast text in testimonials
**R13.3** Subtle shadows without glow effects
**R13.4** QR code image MUST be sharp and clear
**R13.5** Footer MUST have solid background
**R13.6** Maintain copyright text: "© 2026 Spottix — Designed & Developed by Himalya NextGen"

### 3.14 Download CTA Requirements

**R14.1** Download section cards MUST be blur-free
**R14.2** Store buttons MUST have clear, readable text
**R14.3** Phone mockups in download section MUST be properly sized for responsive views

## 4. Non-Functional Requirements

### 4.1 Performance
- First Contentful Paint (FCP): < 1.5s
- Largest Contentful Paint (LCP): < 2.5s
- Cumulative Layout Shift (CLS): < 0.1

### 4.2 Accessibility
- WCAG 2.1 AA compliance
- Keyboard navigation support
- Screen reader compatibility
- Proper ARIA attributes

### 4.3 Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### 4.4 Device Support
- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## 5. Out of Scope

- Complete redesign of layout structure
- Adding new sections or features
- Backend functionality changes
- Content updates (text, images)
- New color scheme (keeping existing dark green theme)
- Animation rewrites (keeping existing animation library)

## 6. Success Criteria

1. **Visual Clarity**: All text is sharp and readable without blur
2. **Performance**: No blur-related render blocking, smooth scrolling
3. **Consistency**: Uniform card styling across all sections
4. **Responsiveness**: No horizontal overflow at any breakpoint
5. **Functionality**: All interactive elements work correctly (counters, accordion, slider, map)
6. **Accessibility**: Proper motion reduction support and ARIA attributes

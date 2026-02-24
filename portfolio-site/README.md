# Manpreet Singh — Portfolio

A modern, premium personal portfolio built with Next.js 15, TypeScript, Tailwind CSS v4, and Framer Motion.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Deployment**: Optimized for Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## Resume

Place your resume PDF at `public/resume.pdf` for the download button to work.

## Customization

- **Contact info**: Update links in `src/components/Contact.tsx`
- **Experience**: Edit timeline entries in `src/components/ExperienceTimeline.tsx`
- **Skills**: Modify categories in `src/components/Skills.tsx`
- **Theme**: Dark mode is default — toggle is in the navbar

## Deploy to Vercel

1. Push your code to a GitHub repository
2. Go to [vercel.com](https://vercel.com) and import the repo
3. Vercel auto-detects Next.js — click **Deploy**
4. Your site will be live at `your-project.vercel.app`

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

## Project Structure

```
src/
  app/
    globals.css          # Global styles + animations
    layout.tsx           # Root layout with Inter font + ThemeProvider
    page.tsx             # Main page composing all sections
    api/contact/route.ts # Contact form API endpoint
  components/
    ThemeProvider.tsx     # Dark/light mode context
    SectionReveal.tsx    # Scroll-triggered reveal animations
    Navbar.tsx           # Fixed navigation + theme toggle
    Hero.tsx             # Hero section with intro + blueprint
    SystemBlueprint.tsx  # Animated architecture diagram SVG
    CapabilityCards.tsx  # 4 animated capability cards
    ExperienceTimeline.tsx # Professional timeline
    Skills.tsx           # Categorized skill chips
    ResumeSection.tsx    # Resume download card
    Contact.tsx          # Contact info + form
    Footer.tsx           # Site footer
```

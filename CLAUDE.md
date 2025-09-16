# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
This is a personal blog built with Eleventy (11ty), a static site generator. The site generates from Markdown content files and Nunjucks templates to create a static HTML blog hosted at dantanner.com.

## Development Commands

### Build and Development
- `npm run build` - Build the site for production (outputs to `_site/`)
- `npm run start` - Start development server with live reload
- `npm run debug` - Build with debug output enabled
- `npm run debugstart` - Start dev server with debug output
- `npm run benchmark` - Run build with performance benchmarking

### Deployment
- `npm run build-ghpages` - Build specifically for GitHub Pages deployment

## Architecture

### Directory Structure
- `content/` - Source content directory (input for Eleventy)
  - `content/post/` - Blog posts in Markdown format with frontmatter
  - `content/about/` - About page content
  - `content/feed/` - RSS feed templates
- `_includes/` - Template partials and layouts
  - `_includes/layouts/` - Page layout templates (base.njk, post.njk, home.njk)
  - `_includes/postslist.njk` - Component for listing posts
- `_data/` - Global data files
  - `_data/metadata.js` - Site metadata and configuration
- `_site/` - Generated output directory (build artifact)
- `public/` - Static assets that are copied to output root

### Configuration
- `eleventy.config.js` - Main Eleventy configuration
- `eleventy.config.drafts.js` - Draft posts plugin configuration  
- `eleventy.config.images.js` - Image processing plugin configuration
- `package.json` - Dependencies and npm scripts

### Template Processing
- Input formats: Markdown (.md), Nunjucks (.njk), HTML (.html), Liquid (.liquid)
- Markdown files are preprocessed with Nunjucks templating
- HTML files are preprocessed with Nunjucks templating
- Posts use YAML frontmatter for metadata (title, date, description, tags)

### Key Features
- Blog post collection with tags and archive pages
- RSS feed generation
- Image optimization pipeline
- Reading time calculation
- Navigation plugin for structured menus
- Anchor links for headings
- Draft post support

### Content Structure
Blog posts are located in `content/post/` and follow this frontmatter pattern:
```yaml
---
title: "Post Title"
description: "Post description"
date: 2024-01-01
tags:
  - tag1
  - tag2
---
```

### Build Process
1. Eleventy processes content from `content/` directory
2. Templates from `_includes/` are applied
3. Static files from `public/` are copied
4. Output is generated to `_site/` directory
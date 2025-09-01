# 📦 Snippet Box - Digital Resurrection

## 🌐 Live Demo
**Try it now**: [https://web-production-9be18.up.railway.app/](https://web-production-9be18.up.railway.app/)

## 🎥 Video Demo
**Watch the full demo**: [https://youtu.be/krYVj8jGzv4](https://youtu.be/krYVj8jGzv4)

## 📸 Screenshots

### Homepage - Modern Dashboard
![Homepage Screenshot](./Homepage.png)

### Snippets Management
![Snippets Screenshot](./Snippets.png)

### Code Editor
![Editor Screenshot](./Editor.png)

## 🏆 Code Resurrection Hackathon Submission

**This project is a "digital resurrection" of the original [Snippet Box](https://github.com/pawelmalak/snippet-box) by [pawelmalak](https://github.com/pawelmalak), created for the [Code Resurrection Hackathon].**

### 🔬 Archaeological Discovery
- **Original Repository**: [pawelmalak/snippet-box](https://github.com/pawelmalak/snippet-box)
- **Status**: Last significant update ~3 years ago, minimal recent activity
- **Stars**: 2.2k+ stars indicating strong community interest
- **Cause of Abandonment**: Creator moved on to other projects, maintenance became sporadic

### 🚀 Resurrection Goals
- **Modernize** the codebase with latest TypeScript and React patterns
- **Enhance** with AI-powered snippet creation using OpenAI integration
- **Improve** search functionality with advanced filtering
- **Redesign** UI with modern Bootstrap 5 and custom styling
- **Add** comprehensive About page and better user onboarding

## 🎯 Description

**Snippet Box** is a modern, self-hosted code snippet management application built with React/TypeScript frontend and Node.js/Express backend that helps developers organize, search, and manage their code snippets efficiently. This resurrected version features AI-powered snippet creation using OpenAI integration that automatically detects programming languages and generates intelligent titles, descriptions, and tags, along with advanced search capabilities through tags and languages, a responsive Bootstrap-based UI, pinned favorites for quick access, and collections for organized grouping.

## 🔄 Resurrection Enhancements

### 🆕 **What We Added (Digital Archaeology Results)**

#### **🤖 AI-Powered Features**
- **Smart Snippet Creation** - OpenAI integration for auto-generating titles, descriptions, and tags
- **Language Detection** - Automatic programming language identification
- **Intelligent Suggestions** - AI-driven tag and description recommendations

#### **🔍 Enhanced Search System** 
- **Multi-Filter Search** - Advanced filtering by tags, languages, titles, and content
- **Real-Time Results** - Instant search with debounced queries  
- **Popular Tags Section** - Quick access to frequently used tags
- **Search History** - Track and revisit previous searches

#### **🎨 Modern UI/UX Redesign**
- **Bootstrap 5 Upgrade** - Modern component library with custom SCSS
- **Enhanced Home Dashboard** - Statistics cards, quick tips, and improved navigation
- **Responsive Design** - Mobile-first approach with better accessibility
- **Visual Polish** - Smooth animations, hover effects, and modern styling

#### **📋 Improved Organization**
- **Enhanced Collections** - Better visual organization and management
- **Quick Actions** - Streamlined workflow for common tasks
- **Pinned Snippets** - Priority access to frequently used code

## 🔧 Technology Stack

### Frontend
- **React 18** with TypeScript
- **Bootstrap 5** with custom SCSS
- **Monaco Editor** for code editing
- **React Router** for navigation
- **Context API** for state management

### Backend
- **Node.js** with Express
- **TypeScript** for type safety
- **SQLite** database with migrations
- **OpenAI API** integration
- **RESTful API** design

### Deployment
- **Docker** containerized deployment
- **Multi-architecture** support (ARM/x64)
- **Environment-based** configuration

## 🚀 Quick Start

### Development Setup

```sh
# Clone repository
git clone https://github.com/ManvendraSinghTanwar/snippet-box
cd snippet-box

# Install dependencies (run only once)
npm run init

# Start backend and frontend development servers
npm run dev
```

Access the application:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

### Environment Configuration

Create `.env` file in the root directory:

```env
# Database
DB_TYPE=sqlite
DB_PATH=./data/db.sqlite3

# AI Features (Optional)
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-3.5-turbo

# Server Configuration
PORT=5000
NODE_ENV=development

# Frontend Build
REACT_APP_API_URL=http://localhost:5000/api
```

### Docker Deployment

```sh
# Quick start with Docker Compose
docker-compose up -d

# Or build and run manually
docker build -t snippet-box .
docker run -p 3000:3000 -p 5000:5000 snippet-box
```

## 📱 Features Overview

### 🏠 **Enhanced Home Dashboard**
- **Statistics Cards** showing total snippets, pinned items, and search results
- **Popular Tags** section for quick filtering
- **Recent Snippets** display with visual previews
- **Quick Tips** with keyboard shortcuts
- **Quick Actions** for immediate productivity

### 🔍 **Advanced Search**
- **Multi-Filter Search** by tags, languages, titles, and content
- **Real-time Results** with debounced queries
- **Popular Tags** section for quick access
- **Search History** and saved searches
- **Filter Persistence** across sessions

### 🤖 **AI-Powered Creation**
- **Smart Title Generation** based on code content
- **Automatic Language Detection** for syntax highlighting
- **Intelligent Tag Suggestions** for better organization
- **Description Auto-completion** with context awareness
- **One-Click Creation** - Save AI-generated snippets instantly

### 📁 **Snippet Library Management**
- **Grid/List Views** for different browsing preferences
- **Advanced Filtering** sidebar with multiple criteria
- **Bulk Operations** for managing multiple snippets
- **Sorting Options** by date, name, language, or popularity
- **Collection Organization** with color-coded groups

### 📄 **Rich Snippet Viewer**
- **Syntax Highlighting** for 100+ programming languages
- **Code Preview** with proper formatting
- **Metadata Display** showing tags, language, creation date
- **Quick Actions** - Edit, pin, delete, or share
- **Related Snippets** suggestions

### ✏️ **Advanced Code Editor**
- **Monaco Editor** integration for professional editing
- **Language-Specific** syntax highlighting and validation
- **Auto-completion** and IntelliSense support
- **Code Formatting** and beautification
- **Live Preview** of formatted output

### 📋 **Collections System**
- **Organized Grouping** of related snippets
- **Color-Coded Collections** for visual organization
- **Hierarchical Structure** with nested collections
- **Bulk Import/Export** for collection management
- **Sharing Options** for team collaboration

### 📌 **Pinned Snippets**
- **Quick Access** to frequently used code
- **Home Screen Display** for immediate visibility
- **Priority Ordering** with drag-and-drop
- **Smart Suggestions** based on usage patterns

## 🔧 Advanced Configuration

### Database Options
```javascript
// SQLite (default)
DB_TYPE=sqlite
DB_PATH=./data/db.sqlite3

// PostgreSQL
DB_TYPE=postgres
DATABASE_URL=postgresql://user:pass@localhost:5432/snippetbox
```

### AI Configuration
```javascript
// OpenAI Settings
OPENAI_API_KEY=your_key_here
OPENAI_MODEL=gpt-3.5-turbo
OPENAI_MAX_TOKENS=500

// AI Feature Toggles
ENABLE_AI_CREATION=true
ENABLE_AI_SUGGESTIONS=true
```

## 📊 Performance & Scalability

- ⚡ **Fast Load Times** - < 2 seconds initial page load
- 🔍 **Quick Search** - < 100ms for typical queries  
- 💾 **Efficient Storage** - Optimized SQLite with indexing
- 📈 **Scalable** - Handles 10,000+ snippets efficiently
- 🔄 **Caching** - Smart caching for improved performance

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📃 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Created by**: [pawelmalak](https://github.com/pawelmalak) - Original Snippet Box concept and implementation
- **Original Repository**: [pawelmalak/snippet-box](https://github.com/pawelmalak/snippet-box)
---

*This project represents the successful digital resurrection of an abandoned open-source project, breathing new life into valuable developer tools through modern technology and enhanced features.*

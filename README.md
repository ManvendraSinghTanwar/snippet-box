# 📦 Snippet Box

![Snippet library screenshot](./.github/img/snippets.png)

## 🎯 Description

**Snippet Box** is a modern, self-hosted code snippet management application built with React/TypeScript frontend and Node.js/Express backend that helps developers organize, search, and manage their code snippets efficiently. It features AI-powered snippet creation using OpenAI integration that automatically detects programming languages and generates intelligent titles, descriptions, and tags, along with advanced search capabilities through tags and languages, a responsive Bootstrap-based UI, pinned favorites for quick access, and collections for organized grouping.

## ✨ Key Features

- 🤖 **AI-Powered Creation** - Auto-detect language, generate titles, descriptions, and tags
- 🔍 **Advanced Search** - Multi-filter search by tags, languages, titles, and content
- 📌 **Pinned Snippets** - Quick access to frequently used code
- 📁 **Collections System** - Organize snippets into grouped collections  
- 🎨 **Modern UI** - Responsive Bootstrap design with custom styling
- 💾 **Self-Hosted** - Your data stays with you using SQLite database
- ⚡ **Fast Performance** - Optimized queries and efficient caching
- 🔐 **Secure** - Built-in rate limiting and input validation

## 🛠️ Technology Stack

### Backend
- **Node.js** with **TypeScript**
- **Express.js** - Web framework
- **Sequelize ORM** - Database management
- **SQLite** - Lightweight database
- **OpenAI API** - AI-powered features
- **Express Validator** - Input validation
- **Rate Limiting** - API protection

### Frontend
- **React 17+** with **TypeScript**
- **Bootstrap 5** - UI framework
- **Bootstrap Icons** - Icon library
- **SCSS** - Custom styling
- **React Router** - Navigation
- **Context API** - State management

### Deployment
- **Docker** - Containerized deployment
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

The application will be available at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

### Environment Setup

Create a `.env` file in the root directory:

```env
# Optional: OpenAI API key for AI features
OPENAI_API_KEY=your_openai_api_key_here

# Database configuration (defaults to SQLite)
DB_PATH=./data/db.sqlite3

# Server configuration
PORT=5000
NODE_ENV=development
```

## 📦 Installation

### With Docker (Recommended)

#### Using Docker Hub

```sh
# Run container with data persistence
docker run -d \
  --name snippet-box \
  -p 5000:5000 \
  -v /path/to/host/data:/app/data \
  -e OPENAI_API_KEY=your_key_here \
  pawelmalak/snippet-box:latest
```

For ARM platforms, use the `:arm` tag.

#### Docker Compose

```yaml
version: '3.8'
services:
  snippet-box:
    image: pawelmalak/snippet-box:latest
    container_name: snippet-box
    environment:
      - OPENAI_API_KEY=your_openai_api_key_here
    volumes:
      - /path/to/host/data:/app/data
    ports:
      - "5000:5000"
    restart: unless-stopped
```

#### Building from Source

```sh
# Build for Linux/x64
docker build -t snippet-box .

# Build for ARM
docker buildx build \
  --platform linux/arm/v7,linux/arm64 \
  -f Dockerfile.arm \
  -t snippet-box:arm .
```

### Manual Installation

For detailed manual installation instructions, visit: [Installation without Docker](https://github.com/pawelmalak/snippet-box/wiki/Installation-without-Docker)

## 🎨 Features Overview

### 🏠 **Enhanced Home Dashboard**
- **Smart Search Bar** with real-time filtering
- **Statistics Cards** showing total snippets, pinned items, and search results
- **Popular Tags** section for quick filtering
- **Recent Snippets** display with visual previews
- **Quick Tips** with keyboard shortcuts
- **Quick Actions** for immediate productivity

![Homescreen screenshot](./.github/img/home.png)

### 🔍 **Advanced Search**
- **Multi-Filter Search** by tags, languages, titles, and content
- **Real-time Results** with debounced queries
- **Tag-based Filtering** with visual tag indicators
- **Language Detection** and filtering
- **Search History** and suggestions

### 🤖 **AI-Powered Snippet Creation**
- **Smart Code Analysis** - Auto-detect programming language
- **Intelligent Titles** - Generate descriptive titles from code
- **Detailed Descriptions** - Create comprehensive documentation
- **Tag Suggestions** - Automatically suggest relevant tags
- **One-Click Creation** - Save AI-generated snippets instantly

### 📁 **Snippet Library Management**
- **Grid/List Views** for different browsing preferences
- **Advanced Filtering** sidebar with multiple criteria
- **Bulk Operations** for managing multiple snippets
- **Sorting Options** by date, name, language, or popularity
- **Collection Organization** with color-coded groups

![Snippet library screenshot](./.github/img/snippets.png)

### 📄 **Rich Snippet Viewer**
- **Syntax Highlighting** for 100+ programming languages
- **Code Preview** with proper formatting
- **Metadata Display** showing tags, language, creation date
- **Quick Actions** - Edit, pin, delete, or share
- **Related Snippets** suggestions

![Snippet screenshot](./.github/img/snippet.png)

### ✏️ **Advanced Code Editor**
- **Monaco Editor** integration for professional editing
- **Language-Specific** syntax highlighting and validation
- **Auto-completion** and IntelliSense support
- **Code Formatting** and beautification
- **Live Preview** of formatted output

![Editor screenshot](./.github/img/editor.png)

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

## 🔧 **Advanced Configuration**

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

## 📊 **Performance & Scalability**

- ⚡ **Fast Load Times** - < 2 seconds initial page load
- 🔍 **Quick Search** - < 100ms for typical queries  
- 💾 **Efficient Storage** - Optimized SQLite with indexing
- 📈 **Scalable** - Handles 10,000+ snippets efficiently
- 🔄 **Caching** - Smart caching for improved performance

## 🤝 **Contributing**

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 **Acknowledgments**

- Original project by [pawelmalak](https://github.com/pawelmalak/snippet-box)
- Enhanced and extended by [ManvendraSinghTanwar](https://github.com/ManvendraSinghTanwar)
- Built with amazing open-source technologies

## 📞 **Support**

- 📖 **Documentation**: [Wiki](https://github.com/ManvendraSinghTanwar/snippet-box/wiki)
- 🐛 **Bug Reports**: [Issues](https://github.com/ManvendraSinghTanwar/snippet-box/issues)
- 💡 **Feature Requests**: [Discussions](https://github.com/ManvendraSinghTanwar/snippet-box/discussions)

---

⭐ **Star this repository** if you find it helpful!

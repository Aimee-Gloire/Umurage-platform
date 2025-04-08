# Umurage - Rwandan Learning Platform

Umurage is a comprehensive online learning platform focused on Rwandan culture, language, and heritage. The platform is designed to preserve and share Rwanda's knowledge, culture, and innovation for future generations.

![Umurage Platform]

## Features

- **Student & Teacher Dashboards**: Separate interfaces for students and educators
- **Interactive Courses**: Engaging content about Rwandan language, culture, and history
- **Progress Tracking**: Detailed analytics to monitor learning progress
- **Certificates**: Earn certificates upon course completion
- **Discussion Forums**: Community engagement and knowledge sharing
- **Assignments**: Structured learning with assessment capabilities

## Prerequisites

Before setting up the project, ensure you have the following installed:

- **Node.js** (version 18 or higher)
- **npm** (version 9 or higher)

## Setup Instructions

Follow these steps carefully to set up the project on your local machine:

### 1. Clone the Repository

```bash
# Clone the repository to your local machine
git clone https://github.com/your-username/Umurage-platform.git

# Navigate to the project directory
cd umurage-platform
```env

### 2. Install Dependencies

```bash
# Install all required dependencies
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory with the following contents:

```
VITE_SUPABASE_URL=https://xyjpbsktolnpjejzupdb.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5anBic2t0b2xucGplanp1cGRiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM1OTk3MTIsImV4cCI6MjA1OTE3NTcxMn0.p29MxYsWAFZshxDQU_Dq6o3iPHRYohkn5w_wQ_6ffFE
```

**Note**: These are development credentials only. In a production environment, you would use your own Supabase credentials.

### 4. Running the Development Server

```bash
# Start the development server
npm run dev
```

The application will start and be available at:

- **Local**: <http://localhost:3000/> / (<https://rptrdf3q-3000.inc1.devtunnels.ms/>)
- **Network**: Available on your local network with an IP address (displayed in terminal) / <http://192.168.1.252:3000/>

### 5. Building for Production

```bash
# Build the application for production
npm run build

# Preview the production build
npm run preview
```

## Project Structure

The project follows a modular structure:

```
src/
├── layouts/           # Layout components for student and teacher views
├── lib/               # Utility and service functions
├── pages/             # Page components
│   ├── student/       # Student-facing pages
│   ├── teacher/       # Teacher-facing pages
│   └── Landing.tsx    # Landing page
├── store/             # State management with Zustand
└── types/             # TypeScript type definitions
```

## Technology Stack

- **Frontend**: React, TypeScript, Vite
- **Styling**: TailwindCSS
- **Animation**: Framer Motion
- **State Management**: Zustand
- **Authentication**: Supabase Auth
- **Charts**: Recharts
- **Icons**: Lucide React

## Rwandan Theme

The platform celebrates Rwandan culture through:

- Authentic visual elements that showcase Rwanda's rich cultural heritage
- Content focused on Kinyarwanda language and Rwandan history
- Traditional artistic aesthetics integrated throughout the UI

## Troubleshooting

If you encounter any issues during setup:

1. **Port conflicts**: If port 3000 is already in use, Vite will automatically try other ports (3001, 3002, etc.)
2. **Dependencies issues**: Try deleting the `node_modules` folder and running `npm install` again
3. **Environment variables**: Ensure the `.env` file is in the root directory with correct values

## License

This project is for educational purposes only.

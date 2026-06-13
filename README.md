# Library Management System Frontend

## Prerequisites

- Node.js (v20 or later)
- pnpm

Install pnpm globally if not already installed:

```bash
npm install -g pnpm
```

## Installation

### Clone the Repository

```bash
git clone https://github.com/arjun-aryal/library-management-system-frontend.git
cd library-management-system-frontend
```

### Install Dependencies

```bash
pnpm install
```

### Configure Environment Variables

Create a `.env` file in the project root:

```env
VITE_API_URL=http://localhost:3000/api
```

Replace the URL with your backend API URL if different.

### Run the Development Server

```bash
pnpm dev
```

The application will start at:

```text
http://localhost:5173
```

## Available Commands

```bash
pnpm dev      # Start development server
pnpm build    # Build for production
pnpm preview  # Preview production build
pnpm lint     # Run ESLint
```

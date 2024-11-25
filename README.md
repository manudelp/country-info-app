# Country Info App

This project is a full-stack application that provides detailed information about countries, including population data, border countries, and flags.

## Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or higher)
- [npm](https://www.npmjs.com/) (v6 or higher)

## Getting Started

### Backend

1. Navigate to the `backend` directory:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Start the backend server:

```bash
node server.js
```

### Frontend

1. Navigate to the frontend directory:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Start the frontend server:

```bash
npm run dev
```

### Building for Production

## To create a production build of the frontend, run:

```bash
npm run build
```

## Environment Variables

### Backend

- NAGER_API_BASE_URL: Base URL for the Nager API.
- COUNTRIES_NOW_API_BASE_URL: Base URL for the Countries Now API.

### Frontend

- NEXT_PUBLIC_BACKEND_URL: URL of the backend server.

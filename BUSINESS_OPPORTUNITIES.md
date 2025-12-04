# Business Opportunity Management Module

A comprehensive module for managing business opportunities in Anderson CRM, featuring a FastAPI backend and React frontend with full CRUD operations.

## Overview

This module provides a complete solution for tracking and managing sales opportunities through their lifecycle. It includes a dashboard with key metrics, filtering and search capabilities, and an intuitive interface for managing opportunity data.

## Features

The module includes a dashboard displaying total opportunities, pipeline value, won deals count, and won value. Users can create, read, update, and delete opportunities with a full set of CRUD operations. The pipeline management feature supports six stages: Lead, Qualified, Proposal, Negotiation, Closed Won, and Closed Lost. Additional features include search functionality across opportunity names, companies, and contacts, as well as filtering by stage.

## Architecture

The backend is built with FastAPI (Python) using an in-memory database for demonstration purposes. Note that data will be reset when the server restarts. The frontend uses React with TypeScript, styled with Tailwind CSS.

## API Endpoints

The backend exposes the following REST API endpoints:

- `GET /api/opportunities` - List all opportunities with optional stage and search filters
- `GET /api/opportunities/{id}` - Get a single opportunity by ID
- `POST /api/opportunities` - Create a new opportunity
- `PUT /api/opportunities/{id}` - Update an existing opportunity
- `DELETE /api/opportunities/{id}` - Delete an opportunity
- `GET /api/opportunities/stats` - Get summary statistics

## Data Model

Each opportunity contains the following fields:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | integer | auto | Unique identifier |
| name | string | yes | Opportunity name |
| company | string | yes | Company name |
| value | float | yes | Monetary value |
| stage | enum | yes | Pipeline stage |
| contact_person | string | no | Contact name |
| email | string | no | Contact email |
| phone | string | no | Contact phone |
| notes | string | no | Additional notes |
| created_at | datetime | auto | Creation timestamp |
| updated_at | datetime | auto | Last update timestamp |

## Setup Instructions

### Backend Setup

Navigate to the backend directory and install dependencies:

```bash
cd backend
poetry install
```

Start the development server:

```bash
poetry run uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

The API will be available at http://localhost:8000. API documentation is available at http://localhost:8000/docs.

### Frontend Setup

Navigate to the frontend directory and install dependencies:

```bash
cd frontend
npm install
```

Configure the API URL by editing the `.env` file:

```
VITE_API_URL=http://localhost:8000
```

Start the development server:

```bash
npm run dev
```

The frontend will be available at http://localhost:5173.

## Usage Guide

### Creating an Opportunity

Click the "New Opportunity" button in the top right corner. Fill in the required fields (name, company, value, stage) and any optional contact information. Click "Create" to save the opportunity.

### Editing an Opportunity

Click the edit icon on any opportunity card to open the edit form. Modify the fields as needed and click "Update" to save changes.

### Changing Stage

Use the dropdown on each opportunity card to quickly change the pipeline stage without opening the full edit form.

### Searching and Filtering

Use the search box to find opportunities by name, company, or contact person. Use the stage dropdown to filter opportunities by their current stage.

### Deleting an Opportunity

Click the delete icon on any opportunity card. Confirm the deletion in the dialog that appears.

## Production Deployment

For production deployment, the backend can be deployed to any Python hosting service (e.g., Fly.io, Railway, Heroku). The frontend can be built and deployed to any static hosting service (e.g., Vercel, Netlify, Cloudflare Pages).

Build the frontend for production:

```bash
cd frontend
npm run build
```

The built files will be in the `dist` directory.

## Notes

This module uses an in-memory database for demonstration purposes. In a production environment, you would want to integrate with a persistent database such as PostgreSQL or MongoDB. The CORS configuration allows all origins for development; this should be restricted in production.

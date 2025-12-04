# Anderson CRM - Business Opportunity Backend

Backend API for managing business opportunities in Anderson CRM.

## Setup

```bash
cd backend
poetry install
```

## Running the Server

```bash
poetry run fastapi dev app/main.py
```

The API will be available at http://localhost:8000

## API Endpoints

- `GET /api/opportunities` - List all opportunities
- `GET /api/opportunities/{id}` - Get a single opportunity
- `POST /api/opportunities` - Create a new opportunity
- `PUT /api/opportunities/{id}` - Update an opportunity
- `DELETE /api/opportunities/{id}` - Delete an opportunity
- `GET /api/opportunities/stats` - Get summary statistics

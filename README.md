# Customer Management System

A full-stack Customer Management System built with *ASP.NET Core 8, **Entity Framework Core, **SQL Server, and **React (TypeScript)*.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | ASP.NET Core 8 Web API |
| ORM | Entity Framework Core 8 |
| Database | SQL Server |
| Mapping | AutoMapper 12 |
| Frontend | React + TypeScript |
| Testing | xUnit + Moq |

---

## Project Structure


/CustomerManagementSystem
  /Controllers              # API endpoints
  /Services                 # Business logic layer
  /Repositories             # Data access layer
  /Models                   # Entity models
  /DTOs                     # Data transfer objects
  /Data                     # DbContext & seeding
  /Mappings                 # AutoMapper profiles
  /Middleware               # Global error handling
  /Extensions               # DI extension methods
  /CustomerManagementSystem.Tests   # Unit tests


---

## Backend Setup

### Prerequisites

- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- SQL Server (LocalDB, Express, or full)
- [Visual Studio 2022](https://visualstudio.microsoft.com/) or [VS Code](https://code.visualstudio.com/)

### 1. Configure Database Connection

Edit appsettings.json and update the DefaultConnection string:

json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=CustomerManagementDb;Trusted_Connection=True;MultipleActiveResultSets=true"
  }
}


*For a remote SQL Server:*
json
"DefaultConnection": "Server=YOUR_SERVER;Database=CustomerManagementDb;User Id=YOUR_USER;Password=YOUR_PASSWORD;Encrypt=False;"


### 2. Install Dependencies

bash
dotnet restore


### 3. Run Migrations

> The application calls Database.Migrate() on startup automatically. However, if you want to apply migrations manually:

bash
# Add a new migration
dotnet ef migrations add <MigrationName>

# Apply migrations to the database
dotnet ef database update


### 4. Run the Backend

bash
dotnet run


The API will be available at:
- https://localhost:7290 (HTTPS)
- http://localhost:5282 (HTTP)

Swagger UI: https://localhost:7290/swagger

---

## API Endpoints

### Customers

| Method | Endpoint | Description |
|---|---|---|
| GET | /api/customers | Get paginated customers |
| GET | /api/customers/{id} | Get customer by ID |
| POST | /api/customers | Create customer |
| PUT | /api/customers/{id} | Update customer |
| DELETE | /api/customers/{id} | Delete customer |

#### Query Parameters for GET /api/customers

| Param | Type | Default | Description |
|---|---|---|---|
| pageNumber | int | 1 | Page number |
| pageSize | int | 10 | Results per page (max 50) |
| searchTerm | string | - | Search by name or city |
| sortBy | string | - | name, city, address |
| sortDescending | bool | false | Sort direction |

### Customer Types

| Method | Endpoint | Description |
|---|---|---|
| GET | /api/customertypes | Get all types |
| GET | /api/customertypes/{id} | Get type by ID |

---

## Running Unit Tests

### From CLI

bash
dotnet test CustomerManagementSystem.Tests/CustomerManagementSystem.Tests.csproj --verbosity minimal


### From Visual Studio

1. Open *View → Test Explorer*
2. Click *Run All Tests*

---

## Seed Data

The database is pre-seeded with:

- *3 Customer Types:* Regular, Premium, VIP
- *5 Customers:* Customers From (Lahore, Karachi, Islamabad, Peshawar, Quetta)

---

## Architecture


Controller → Service → Repository → DbContext → SQL Server


- *Controllers* — Thin, only handle HTTP request/response
- *Services* — Business logic, validation, mapping via AutoMapper
- *Repositories* — Data access only, no business logic
- *DbContext* — EF Core context, configured via Fluent API
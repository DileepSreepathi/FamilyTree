# Family Tree Application

A cross-platform web application for managing and visualizing a family tree. It consists of a modern React frontend built with Vite and a backend API built with .NET 8.0 Azure Functions.

## Architecture

* **Frontend (Client):** React, TypeScript, Tailwind CSS, Vite
* **Backend (API):** .NET 8.0 Azure Functions (Isolated Worker Model)
* **Database:** Azure Cosmos DB

## Prerequisites

Before running the application, ensure you have the following installed:
* [Node.js](https://nodejs.org/) (v18 or higher recommended)
* [.NET 8.0 SDK](https://dotnet.microsoft.com/en-us/download/dotnet/8.0)
* [Azure Functions Core Tools](https://learn.microsoft.com/en-us/azure/azure-functions/functions-run-local) (v4)
* Azure Cosmos DB Account (Local emulator or cloud instance)

## Getting Started

### 1. Backend (API) Setup

The backend is an Azure Functions project that runs on port `7200`.

1. Open a terminal and navigate to the `api` folder:
   ```bash
   cd api
   ```

2. Configure your `local.settings.json` file. Ensure it contains the necessary connection strings for Cosmos DB:
   ```json
   {
       "IsEncrypted": false,
       "Values": {
           "AzureWebJobsStorage": "UseDevelopmentStorage=true",
           "FUNCTIONS_WORKER_RUNTIME": "dotnet-isolated",
           "CosmosDbConnection": "AccountEndpoint=https://YOUR-COSMOS-ACCOUNT.documents.azure.com:443/;AccountKey=YOUR-PRIMARY-KEY;"
       }
   }
   ```
   > **Note:** Replace `YOUR-COSMOS-ACCOUNT` and `YOUR-PRIMARY-KEY` with the details from your actual Cosmos DB resource.

3. Run the API locally:
   ```bash
   func start
   # or
   dotnet run
   ```

### 2. Frontend (Client) Setup

The frontend is a React application built with Vite.

1. Open a new terminal and navigate to the `client` folder:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   The application will be accessible at `http://localhost:5173` (or the port specified by Vite in the terminal output).

## Features

- **Interactive Visualization:** Visualize family tree relationships (parents, children, and spouses).
- **Member Management:** Add new members and edit their details natively in the application.
- **Data Persistence:** Store tree data confidently via Cosmos DB.
- **Cross-Platform Readiness:** Clean codebase setup designed to be seamlessly adaptable for web and mobile usage in the future.

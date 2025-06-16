# Invoice Manager Frontend

<div align="center" style="margin: 30px;">
    <img alt="invoice manager logo" src="/public/logo.png" height="100">
</div>
<br/>

## About the Application

Invoice Manager is an invoice management application that allows you to create, edit, and track invoices. This application is built using [Refine](https://github.com/refinedev/refine) as a React framework.

### Key Features

- **Company Management**: Manage company profiles including logos
- **Client Management**: Manage client data with logos and payment terms
- **Product Management**: Register products and prices
- **Payment Method Management**: Configure various payment methods
- **Invoice Creation**: Create invoices with automatic calculations
- **Payment Status Tracking**: Monitor invoice payment statuses
- **PDF Export**: Export invoices to PDF format

## Getting Started

### Prerequisites

- Node.js version 16 or higher
- npm or yarn
- Git for cloning the repository
- Backend API (ensure the backend is running)
- A modern web browser (Chrome, Firefox, Safari, or Edge)

### Detailed Installation Guide

1. **Clone the Repository**
   
   Open your terminal/command prompt and run:
   ```bash
   git clone https://github.com/yourusername/invoice-manager.git
   cd invoice-manager/Frontend
   ```

2. **Install Dependencies**
   
   Using npm:
   ```bash
   npm install
   ```
   
   Or using yarn:
   ```bash
   yarn install
   ```
   
   This will install all required packages specified in package.json.

3. **Configure Environment**
   
   Create a `.env` file in the Frontend directory:
   ```bash
   touch .env
   ```
   
   Edit the `.env` file and add the following configuration:
   ```
   VITE_API_URL=http://localhost:3001/api
   ```
   
   Adjust the URL if your backend is running on a different port or host.

4. **Configure API Connection**
   
   Open `src/authProvider.ts` and verify that the API_URL constant points to your backend:
   ```typescript
   const API_URL = "/api"; // This will be prefixed with the base URL from the .env file
   ```

5. **Run the Development Server**
   
   Using npm:
   ```bash
   npm run dev
   ```
   
   Or using yarn:
   ```bash
   yarn dev
   ```
   
   This will start the Vite development server.

6. **Access the Application**
   
   Open your browser and navigate to:
   ```
   http://localhost:8080
   ```
   
   You should see the login page if everything is set up correctly.

7. **Login to the Application**
   
   Use the default credentials (if you're using the provided backend):
   - Email: admin@example.com
   - Password: password
   
   Or use the credentials you've set up in your backend.

### Troubleshooting Installation

- **Backend Connection Issues**: Ensure your backend server is running and accessible
- **CORS Errors**: Check that your backend allows requests from your frontend origin
- **Package Installation Errors**: Try deleting `node_modules` folder and `package-lock.json` (or `yarn.lock`), then reinstall dependencies
- **Port Conflicts**: If port 5173 is already in use, Vite will automatically try to use the next available port

## Usage

1. **Login**: Use registered credentials to log in
2. **Add Company**: Add your company information first
3. **Add Clients**: Register clients who will receive invoices
4. **Add Products**: Register products to be sold
5. **Add Payment Methods**: Register accepted payment methods
6. **Create Invoices**: Create new invoices by selecting clients, products, and payment methods

## Project Structure

- `src/`: Application source code
  - `components/`: Reusable React components
  - `contexts/`: Context API for global state management
  - `pages/`: Application pages
    - `clients/`: Client management
    - `company/`: Company management
    - `invoices/`: Invoice management
    - `payment-methods/`: Payment method management
    - `products/`: Product management
  - `App.tsx`: Main application component
  - `authProvider.ts`: Authentication configuration

## Support

If you encounter issues or have questions, please create an Issue in this repository.

## Technology Stack

- **React**: JavaScript library for building user interfaces
- **Refine**: Headless React framework for building CRUD applications
- **Material UI**: React component library for design
- **React Router**: Page navigation
- **Axios**: HTTP client for API communication

## Available Scripts

### Run development server

```bash
npm run dev
```

### Build for production

```bash
npm run build
```

### Run production server

```bash
npm run start
```

## Learn More

To learn more about the technologies used:

- **Refine** [Documentation](https://refine.dev/docs)
- **Material UI** [Documentation](https://refine.dev/docs/ui-frameworks/mui/tutorial/)
- **React Router** [Documentation](https://refine.dev/docs/core/providers/router-provider/)
- **Custom Auth Provider** [Documentation](https://refine.dev/docs/core/providers/auth-provider/)

## License

MIT

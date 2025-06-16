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
- Backend API (ensure the backend is running)

### Installation

1. Clone this repository
2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Adjust the API URL in the `src/authProvider.ts` file if necessary
4. Run the development server:

```bash
npm run dev
# or
yarn dev
```

5. Open your browser at `http://localhost:5173`

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

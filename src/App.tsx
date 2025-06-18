import { Authenticated, Refine } from "@refinedev/core";
import { DevtoolsPanel, DevtoolsProvider } from "@refinedev/devtools";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";

import {
  ErrorComponent,
  RefineSnackbarProvider,
  ThemedLayoutV2,
  ThemedSiderV2,
  ThemedTitleV2,
  useNotificationProvider,
} from "@refinedev/mui";

import CssBaseline from "@mui/material/CssBaseline";
import GlobalStyles from "@mui/material/GlobalStyles";
import routerBindings, {
  CatchAllNavigate,
  DocumentTitleHandler,
  NavigateToResource,
  UnsavedChangesNotifier,
} from "@refinedev/react-router";
import dataProvider from "@refinedev/simple-rest";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import { authProvider, axiosInstance } from "./authProvider";
import { Header, ModernLayout } from "./components";
import { ColorModeContextProvider } from "./contexts/color-mode";
import {
  ClientCreate,
  ClientEdit,
  ClientList,
  ClientShow,
} from "./pages/clients";
import { CompanyCreate } from "./pages/company/create";
import { CompanyEdit } from "./pages/company/edit";
import { CompanyList } from "./pages/company/list";
import { CompanyShow } from "./pages/company/show";
import {
  ProductCreate,
  ProductEdit,
  ProductList,
  ProductShow,
} from "./pages/products";
import {
  PaymentMethodCreate,
  PaymentMethodEdit,
  PaymentMethodList,
  PaymentMethodShow,
} from "./pages/payment-methods";
import { ForgotPassword } from "./pages/forgotPassword";
import { Login } from "./pages/login";
import { Register } from "./pages/register";
import { InvoiceCreate, InvoiceEdit, InvoiceList, InvoiceShow } from "./pages/invoices";
import { DownloadTemplate, UploadExcel } from "./pages/invoice-generator";

// Buat dataProvider yang menggunakan axiosInstance yang sudah dikonfigurasi
const customDataProvider = dataProvider("/api", axiosInstance);

function App() {
  return (
    <BrowserRouter>
      <RefineKbarProvider>
        <ColorModeContextProvider>
          <CssBaseline />
          <GlobalStyles styles={{ 
            html: { WebkitFontSmoothing: "auto" },
            body: { fontFamily: "'Inter', 'Roboto', 'Helvetica', 'Arial', sans-serif" }
          }} />
          <RefineSnackbarProvider>
            <DevtoolsProvider>
              <Refine
                dataProvider={customDataProvider}
                notificationProvider={useNotificationProvider}
                routerProvider={routerBindings}
                authProvider={authProvider}
                resources={[
                  {
                    name: "clients",
                    list: "/clients",
                    create: "/clients/create",
                    edit: "/clients/edit/:id",
                    show: "/clients/show/:id",
                    meta: {
                      canDelete: true,
                      icon: <i className="material-icons">people</i>,
                    },
                  },
                  {
                    name: "company",
                    list: "/company",
                    create: "/company/create",
                    edit: "/company/edit/:id",
                    show: "/company/show/:id",
                    meta: {
                      canDelete: true,
                      icon: <i className="material-icons">business</i>,
                    },
                  },
                  {
                    name: "product",
                    list: "/products",
                    create: "/products/create",
                    edit: "/products/edit/:id",
                    show: "/products/show/:id",
                    meta: {
                      canDelete: true,
                      icon: <i className="material-icons">inventory</i>,
                    },
                  },
                  {
                    name: "paymentMethod",
                    list: "/payment-methods",
                    create: "/payment-methods/create",
                    edit: "/payment-methods/edit/:id",
                    show: "/payment-methods/show/:id",
                    meta: {
                      canDelete: true,
                      icon: <i className="material-icons">payment</i>,
                    },
                  },
                  {
                    name: "invoice",
                    list: "/invoice",
                    create: "/invoice/create",
                    edit: "/invoice/edit/:id",
                    show: "/invoice/show/:id",
                    meta: {
                      canDelete: true,
                      icon: <i className="material-icons">payments</i>,
                    },
                  },
                  {
                    name: "invoice-generator",
                    meta: {
                      label: "Invoice Generator",
                      icon: <i className="material-icons">table_view</i>,
                    },
                    list: "/invoice-generator/download-template",
                  },
                  {
                    name: "download-template",
                    list: "/invoice-generator/download-template",
                    meta: {
                      label: "Download Template",
                      parent: "invoice-generator",
                      icon: <i className="material-icons">download</i>,
                    },
                  },
                  {
                    name: "upload-excel",
                    list: "/invoice-generator/upload-excel",
                    meta: {
                      label: "Upload Excel",
                      parent: "invoice-generator",
                      icon: <i className="material-icons">upload_file</i>,
                    },
                  },
                ]}
                options={{
                  syncWithLocation: true,
                  warnWhenUnsavedChanges: true,
                  useNewQueryKeys: true,
                }}
              >
                <Routes>
                  <Route
                    element={
                      <Authenticated
                        key="authenticated-inner"
                        fallback={<CatchAllNavigate to="/login" />}
                      >
                      <ThemedLayoutV2
                        Header={() => <Header />}
                        Sider={(props) => (
                          <ThemedSiderV2
                            Title={({ collapsed }) => (
                              <ThemedTitleV2
                                collapsed={collapsed}
                                text="Invoice Manager"
                                // icon={<img src="/pngwing.png" width="24" height="24" alt="Logo" />}
                              />
                            )}
                          />
                        )}
                      >
                        <Outlet />
                      </ThemedLayoutV2>
                      </Authenticated>
                    }
                  >
                    <Route
                      index
                      element={<NavigateToResource resource="invoice" />}
                    />
                    <Route path="/clients">
                      <Route index element={<ClientList />} />
                      <Route path="create" element={<ClientCreate />} />
                      <Route path="edit/:id" element={<ClientEdit />} />
                      <Route path="show/:id" element={<ClientShow />} />
                    </Route>
                    <Route path="/company">
                      <Route index element={<CompanyList />} />
                      <Route path="create" element={<CompanyCreate />} />
                      <Route path="edit/:id" element={<CompanyEdit />} />
                      <Route path="show/:id" element={<CompanyShow />} />
                    </Route>
                    <Route path="/products">
                      <Route index element={<ProductList />} />
                      <Route path="create" element={<ProductCreate />} />
                      <Route path="edit/:id" element={<ProductEdit />} />
                      <Route path="show/:id" element={<ProductShow />} />
                    </Route>
                    <Route path="/payment-methods">
                      <Route index element={<PaymentMethodList />} />
                      <Route path="create" element={<PaymentMethodCreate />} />
                      <Route path="edit/:id" element={<PaymentMethodEdit />} />
                      <Route path="show/:id" element={<PaymentMethodShow />} />
                    </Route>
                    <Route path="/invoice">
                      <Route index element={<InvoiceList />} />
                      <Route path="create" element={<InvoiceCreate />} />
                      <Route path="edit/:id" element={<InvoiceEdit />} />
                      <Route path="show/:id" element={<InvoiceShow />} />
                    </Route>
                    <Route path="/invoice-generator">
                      <Route path="download-template" element={<DownloadTemplate />} />
                      <Route path="upload-excel" element={<UploadExcel />} />
                    </Route>
                    <Route path="*" element={<ErrorComponent />} />
                  </Route>
                  <Route
                    element={
                      <Authenticated
                        key="authenticated-outer"
                        fallback={<Outlet />}
                      >
                        <NavigateToResource />
                      </Authenticated>
                    }
                  >
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route
                      path="/forgot-password"
                      element={<ForgotPassword />}
                    />
                  </Route>
                </Routes>

                <RefineKbar />
                <UnsavedChangesNotifier />
                <DocumentTitleHandler />
              </Refine>
            </DevtoolsProvider>
          </RefineSnackbarProvider>
        </ColorModeContextProvider>
      </RefineKbarProvider>
    </BrowserRouter>
  );
}

export default App;

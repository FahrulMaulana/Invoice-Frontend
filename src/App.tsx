import { Authenticated, Refine } from "@refinedev/core";
import { DevtoolsPanel, DevtoolsProvider } from "@refinedev/devtools";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";

import {
  ErrorComponent,
  RefineSnackbarProvider,
  ThemedLayoutV2,
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
import { Header } from "./components/header";
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
// Buat dataProvider yang menggunakan axiosInstance yang sudah dikonfigurasi
const customDataProvider = dataProvider("/api", axiosInstance);

function App() {
  return (
    <BrowserRouter>
      <RefineKbarProvider>
        <ColorModeContextProvider>
          <CssBaseline />
          <GlobalStyles styles={{ html: { WebkitFontSmoothing: "auto" } }} />
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
                        <ThemedLayoutV2 Header={Header}>
                          <Outlet />
                        </ThemedLayoutV2>
                      </Authenticated>
                    }
                  >
                    <Route
                      index
                      element={<NavigateToResource resource="blog_posts" />}
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
              <DevtoolsPanel />
            </DevtoolsProvider>
          </RefineSnackbarProvider>
        </ColorModeContextProvider>
      </RefineKbarProvider>
    </BrowserRouter>
  );
}

export default App;

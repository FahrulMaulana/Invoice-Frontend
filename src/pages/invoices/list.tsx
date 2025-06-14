import React from "react";
import {
  List,
  useDataGrid,
  DateField,
  EditButton,
  ShowButton,
  DeleteButton,
} from "@refinedev/mui";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useMany } from "@refinedev/core";
import { Chip } from "@mui/material";

// Define interface for invoice row data
interface InvoiceRowData {
  id: string;
  companyId: string;
  clientId: string;
  paymentMethodId: string;
  status: string;
  date: string;
  dueDate: string;
  subtotal: number;
  no?: number; // Optional property for row numbering
}

export const InvoiceList: React.FC = () => {
  const { dataGridProps } = useDataGrid({
    initialFilter: [
      {
        field: "status",
        operator: "eq",
        value: "pending",
      },
    ],
  });

  const { data: companiesData, isLoading: companiesIsLoading } = useMany({
    resource: "company",
    ids: dataGridProps?.rows?.map((item: any) => item?.companyId) ?? [],
    queryOptions: {
      enabled: !!dataGridProps?.rows,
    },
  });

  const { data: clientsData, isLoading: clientsIsLoading } = useMany({
    resource: "clients",
    ids: dataGridProps?.rows?.map((item: any) => item?.clientId) ?? [],
    queryOptions: {
      enabled: !!dataGridProps?.rows,
    },
  });

  const { data: paymentMethodsData, isLoading: paymentMethodsIsLoading } = useMany({
    resource: "paymentMethod",
    ids: dataGridProps?.rows?.map((item: any) => item?.paymentMethodId) ?? [],
    queryOptions: {
      enabled: !!dataGridProps?.rows,
    },
  });

  // Create rows with sequential numbering
  const rowsWithNumbers = React.useMemo(() => {
    if (!dataGridProps.rows) return [];
    return dataGridProps.rows.map((row: InvoiceRowData, index: number) => ({
      ...row,
      no: index + 1, // Add incremental number starting from 1
    }));
  }, [dataGridProps.rows]);

  const columns = React.useMemo<GridColDef[]>(
    () => [
      {
        field: "no",
        headerName: "No",
        type: "number",
        minWidth: 50,
        align: "left",
        headerAlign: "left",
        sortable: false,
      },
      {
        field: "companyId",
        headerName: "Company",
        flex: 1,
        renderCell: function render({ value }) {
          if (companiesIsLoading) {
            return "Loading...";
          }
          return companiesData?.data?.find((item) => item.id === value)?.name;
        },
      },
      {
        field: "clientId",
        headerName: "Client",
        flex: 1,
        renderCell: function render({ value }) {
          if (clientsIsLoading) {
            return "Loading...";
          }
          return clientsData?.data?.find((item) => item.id === value)?.legalName;
        },
      },
      {
        field: "paymentMethodId",
        headerName: "Payment Method",
        flex: 1,
        renderCell: function render({ value }) {
          if (paymentMethodsIsLoading) {
            return "Loading...";
          }
          return paymentMethodsData?.data?.find((item) => item.id === value)?.methodName;
        },
      },
      {
        field: "status",
        headerName: "Status",
        flex: 1,
        renderCell: function render({ value }) {
          let color: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
          switch (value) {
            case "PAID":
              color = "success";
              break;
            case "pending":
              color = "warning";
              break;
            case "canceled":
              color = "error";
              break;
            default:
              color = "default";
          }
          return <Chip color={color} label={value} />;
        },
      },
      {
        field: "date",
        headerName: "Date",
        flex: 1,
        headerAlign: "center",
        renderCell: function render({ value }) {
          return (
            <div style={{ width: '100%', textAlign: 'center', display: 'flex', alignItems: 'center', height: '100%' }}>
              <DateField value={value} format="LLL" />
            </div>
          );
        },
      },
      {
        field: "dueDate",
        headerName: "Due Date",
        flex: 1,
        headerAlign: "center",
        renderCell: function render({ value }) {
          return (
            <div style={{ width: '100%', textAlign: 'center', display: 'flex', alignItems: 'center', height: '100%' }}>
              <DateField value={value} format="LLL" />
            </div>
          );
        },
      },
      {
        field: "subtotal",
        headerName: "Total Amount",
        flex: 1,
        renderCell: function render({ value }) {
          return `$${parseFloat(value).toFixed(2)}`;
        },
      },
      {
        field: "actions",
        headerName: "Actions",
        align: "right",
        headerAlign: "right",
        minWidth: 180, // Memperbesar lebar kolom aksi
        sortable: false,
        renderCell: function render({ row }) {
          return (
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', width: '100%' }}>
              <EditButton hideText recordItemId={row.id} />
              <ShowButton hideText recordItemId={row.id} />
              <DeleteButton 
                hideText 
                recordItemId={row.id} 
                sx={{ color: 'error.main', visibility: 'visible' }} // Memastikan tombol delete terlihat
              />
            </div>
          );
        },
      },
    ],
    [
      companiesData?.data,
      companiesIsLoading,
      clientsData?.data,
      clientsIsLoading,
      paymentMethodsData?.data,
      paymentMethodsIsLoading,
    ],
  );

  return (
    <List>
      <DataGrid 
        {...dataGridProps} 
        rows={rowsWithNumbers}
        columns={columns}
        autoHeight 
      />
    </List>
  );
};
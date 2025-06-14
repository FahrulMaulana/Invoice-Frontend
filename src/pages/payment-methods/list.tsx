import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import {
  DeleteButton,
  EditButton,
  List,
  ShowButton,
  useDataGrid,
} from "@refinedev/mui";
import React from "react";

// Define a type for the row data
interface PaymentMethodRowData {
  id?: string | number;
  methodName?: string;
  info?: string;
  [key: string]: unknown;
}

export const PaymentMethodList = () => {
  const { dataGridProps } = useDataGrid({});

  // Define getRowId function to handle rows without id property
  const getRowId = (row: PaymentMethodRowData) => {
    // Use existing id if available
    if (row.id) return row.id;
    // Otherwise use methodName as fallback unique identifier
    return row.methodName || Math.random().toString();
  };

  // Add row numbers (incremental)
  const rowsWithNumbers = React.useMemo(() => {
    if (!dataGridProps.rows) return [];
    return dataGridProps.rows.map((row: PaymentMethodRowData, index: number) => ({
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
        display: "flex",
        align: "left",
        headerAlign: "left",
        sortable: false,
      },
      {
        field: "methodName",
        headerName: "Payment Method",
        minWidth: 200,
        display: "flex",
      },
      {
        field: "info",
        headerName: "Information",
        minWidth: 250,
        flex: 1,
        display: "flex",
      },
      {
        field: "actions",
        headerName: "Actions",
        align: "right",
        headerAlign: "right",
        minWidth: 120,
        sortable: false,
        display: "flex",
        renderCell: function render({ row }) {
          return (
            <>
              <EditButton hideText recordItemId={row.id} />
              <ShowButton hideText recordItemId={row.id} />
              <DeleteButton hideText recordItemId={row.id} />
            </>
          );
        },
      },
    ],
    []
  );

  return (
    <List>
      <DataGrid
        {...dataGridProps}
        rows={rowsWithNumbers}
        columns={columns}
        getRowId={getRowId}
      />
    </List>
  );
};
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
interface ProductRowData {
  id?: string | number;
  name?: string;
  sku?: string;
  price?: number;
  stock?: number;
  description?: string;
  [key: string]: unknown;
}

// Define our own interface for value formatter params
interface ValueFormatterParams {
  value: unknown;
}

export const ProductList = () => {
  const { dataGridProps } = useDataGrid({});

  // Define getRowId function to handle rows without id property
  const getRowId = (row: ProductRowData) => {
    // Use existing id if available
    if (row.id) return row.id;
    // Otherwise use name or sku as fallback unique identifiers
    return row.name || row.sku || Math.random().toString();
  };

  // Add row numbers (incremental)
  const rowsWithNumbers = React.useMemo(() => {
    if (!dataGridProps.rows) return [];
    return dataGridProps.rows.map((row: ProductRowData, index: number) => ({
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
        field: "name",
        headerName: "Product Name",
        minWidth: 200,
        display: "flex",
      },
      {
        field: "description",
        headerName: "Description",
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
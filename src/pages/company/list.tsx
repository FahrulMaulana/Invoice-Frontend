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
interface CompanyRowData {
  id?: string | number;
  name?: string;
  taxNumber?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  [key: string]: unknown;
}

export const CompanyList = () => {
  const { dataGridProps } = useDataGrid({});

  // Define getRowId function to handle rows without id property
  const getRowId = (row: CompanyRowData) => {
    // Use existing id if available
    if (row.id) return row.id;
    // Otherwise use name or taxNumber as fallback unique identifiers
    return row.name || row.taxNumber || Math.random().toString();
  };

  // Add row numbers (incremental)
  const rowsWithNumbers = React.useMemo(() => {
    if (!dataGridProps.rows) return [];
    return dataGridProps.rows.map((row: CompanyRowData, index: number) => ({
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
        headerName: "Company Name",
        minWidth: 200,
        display: "flex",
      },
      {
        field: "address",
        headerName: "Address",
        minWidth: 250,
        flex: 1,
        display: "flex",
      },
      {
        field: "email",
        headerName: "Email",
        minWidth: 200,
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
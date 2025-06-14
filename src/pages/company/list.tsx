import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { List, useDataGrid } from "@refinedev/mui";
import React from "react";
import {
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import { useDelete } from "@refinedev/core";

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
  const { dataGridProps } = useDataGrid<CompanyRowData>({});
  const navigate = useNavigate();
  const { mutate: deleteCompany } = useDelete();
  
  // For the dropdown menu
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [actionRow, setActionRow] = React.useState<CompanyRowData | null>(null);
  const open = Boolean(anchorEl);
  
  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>, row: CompanyRowData) => {
    setAnchorEl(event.currentTarget);
    setActionRow(row);
  };
  
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  
  const handleEdit = () => {
    if (actionRow?.id) {
      navigate(`/company/edit/${actionRow.id}`);
      handleMenuClose();
    }
  };
  
  const handleShow = () => {
    if (actionRow?.id) {
      navigate(`/company/show/${actionRow.id}`);
      handleMenuClose();
    }
  };
  
  const handleDelete = () => {
    if (actionRow?.id) {
      deleteCompany({
        resource: "company",
        id: actionRow.id,
      });
      handleMenuClose();
    }
  };

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
        align: "center",
        headerAlign: "center",
        minWidth: 120,
        sortable: false,
        renderCell: function render({ row }) {
          return (
            <IconButton
              onClick={(e) => handleMenuClick(e, row)}
              size="small"
              aria-controls={open ? "actions-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
            >
              <MoreVertIcon />
            </IconButton>
          );
        },
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      
      {/* Separate menu component outside the renderCell function */}
      <Menu
        id="actions-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        MenuListProps={{
          'aria-labelledby': 'actions-button',
        }}
      >
        <MenuItem onClick={handleEdit}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleShow}>
          <ListItemIcon>
            <VisibilityIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>View</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleDelete}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText sx={{ color: 'error.main' }}>Delete</ListItemText>
        </MenuItem>
      </Menu>
    </List>
  );
};
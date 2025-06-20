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
  const { dataGridProps } = useDataGrid<ProductRowData>({});
  const navigate = useNavigate();
  const { mutate: deleteProduct } = useDelete();
  
  // For the dropdown menu
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [actionRow, setActionRow] = React.useState<ProductRowData | null>(null);
  const open = Boolean(anchorEl);
  
  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>, row: ProductRowData) => {
    setAnchorEl(event.currentTarget);
    setActionRow(row);
  };
  
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  
  const handleEdit = () => {
    if (actionRow?.id) {
      navigate(`/products/edit/${actionRow.id}`);
      handleMenuClose();
    }
  };
  
  const handleShow = () => {
    if (actionRow?.id) {
      navigate(`/products/show/${actionRow.id}`);
      handleMenuClose();
    }
  };
  
  const handleDelete = () => {
    if (actionRow?.id) {
      deleteProduct({
        resource: "products",
        id: actionRow.id,
      });
      handleMenuClose();
    }
  };

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
        width: 65,
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
        autoHeight
        getEstimatedRowHeight={() => 100}
        getRowHeight={() => 'auto'}
        sx={{
          width: '100%',
          '& .MuiDataGrid-cell': {
            whiteSpace: 'normal !important',
            wordWrap: 'break-word !important',
            lineHeight: '1.2em',
            padding: '8px',
          },
          '& .MuiDataGrid-columnHeader': {
            whiteSpace: 'normal !important',
            wordWrap: 'break-word !important',
            lineHeight: '1.2em',
          },
          '& .MuiDataGrid-cell:focus': {
            outline: 'none',
          },
          '&::-webkit-scrollbar': {
            width: '8px',
            height: '8px',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: (theme) => theme.palette.grey[300],
            borderRadius: '4px',
          },
          // Pengaturan row height
          '& .MuiDataGrid-row': {
            maxHeight: 'none !important',
          }
        }}
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
import React, { useState } from "react";
import Container from "@material-ui/core/Container";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import MUIDataTable from "mui-datatables";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import datatableTheme from "assets/css/datatable-theme.js";
import dataJson from "./data.json";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Chip from "@material-ui/core/Chip";
import CustomToolbarSelect from "../../CustomToolbarSelect";
import CustomToolbar from "../../CustomToolbar";
import Dialog from "@material-ui/core/Dialog";
import AddFormDialog from "components/CustomComponents/AddFormDialog.js";
import Slide from "@material-ui/core/Slide";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Stores = () => {
  const [openDialog, setOpenDialog] = useState(false); //for modal2

  var selected_rows = null;
  var setSelectedRows_function = null;
  const MySwal = withReactContent(Swal); //swal

  /************ -Datatable START- **************/
  const [items, setItems] = useState(dataJson); //table items
  const options = {
    filterType: "dropdown",
    onRowsDelete: null,
    selectToolbarPlacement: "replace",
    customToolbarSelect: (selectedRows, displayData, setSelectedRows) => {
      selected_rows = selectedRows;
      setSelectedRows_function = setSelectedRows;

      return <CustomToolbarSelect delete_listener={delete_listener} />;
    },
    customToolbar: () => {
      return <CustomToolbar listener={handleAdd} />;
    },
    //this.deleteRows
  };
  const columns = [
    {
      name: "Code",
      label: "Code",
    },
    {
      name: "Name",
      label: "Name",
    },
    {
      name: "Branch",
      label: "Branch",
    },
    {
      name: "Branch Number",
      label: "Branch Number",
    },
    {
      name: "location",
      label: "Location",
      options: {
        customBodyRender: (value, tableMeta, updateValue) => (
          <div style={{ width: 200 }}>
            <strong>City</strong>: {value ? value.City : "-"}
            <br />
            <strong>Area</strong>: {value ? value.Area : "-"}
            <br />
            <strong>Mobile</strong>: {value ? value.Mobile : "-"}
            <br />
          </div>
        ),
      },
    },
    {
      name: "finance",
      label: "Finance",
    },
    {
      name: "status",
      label: "Status",
    },
  ];
  /************ -Datatable END- **************/
  const top100Films = [];

  function deleterows(row) {
    const requestOptions = {
      method: "POST",
      body: JSON.stringify(row),
    };

    MySwal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(
          `${process.env.REACT_APP_BASE_URL}ws_tfridges.php?action=2`,
          requestOptions
        )
          .then((response) => response.json())
          .then((data) => {
            var data1 = items;

            setSelectedRows_function([]);
            row.map((row) => {
              data1 = data1.filter((user) => user.serial !== row.serial);
            });

            console.log(data1);

            setItems(data1);
          })
          .catch((error) => {
            alert("error");
            console.log("There was an error!", error);
          });

        Swal.fire("Deleted!", "Your file has been deleted.", "success");
      }
    });
  }

  const delete_listener = () => {
    let myItems = [];

    selected_rows.data.map((anObjectMapped, index) => {
      myItems.push({ serial: items[anObjectMapped.dataIndex].serial });
    });

    console.log(myItems);

    deleterows(myItems);
  };

  const handleAdd = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  return (
    <div>
      <Container maxWidth="xl">
        <Autocomplete
          multiple
          id="tags-filled"
          options={top100Films.map((option) => option.title)}
          defaultValue={[]}
          freeSolo
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip
                variant="outlined"
                label={option}
                {...getTagProps({ index })}
              />
            ))
          }
          renderInput={(params) => (
            <TextField
              {...params}
              variant="filled"
              label=""
              placeholder="Search in Code/Name/Branch number/Finance"
            />
          )}
        />
        <MuiThemeProvider theme={datatableTheme}>
        <MUIDataTable
          title=""
          data={items}
          columns={columns}
          options={options}
          className="dataTableContainer"
        />
        </MuiThemeProvider>
      </Container>

      <div>
        <Dialog
          fullScreen
          open={openDialog}
          onClose={handleCloseDialog}
          TransitionComponent={Transition}
        >
          <AddFormDialog
            title="Add Stores"
            handleClose={handleCloseDialog}
            inputs={[
              { labelText: "Image", type: "file" },
              { labelText: "Code", type: "text" },
              { labelText: "Name", type: "text" },
              { labelText: "Branch Name", type: "text" },
              { labelText: "Branch Number", type: "text" },
              { labelText: "Address", type: "text" },
              { labelText: "Phone", type: "text" },
              { labelText: "City", type: "text" },
              { labelText: "Neighbourbood", type: "text" },
            ]}
          />
        </Dialog>
      </div>
    </div>
  );
};

export default Stores;

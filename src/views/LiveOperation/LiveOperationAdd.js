import React, { useState,useEffect } from "react";
import CustomToolbar from "../../CustomToolbar";
import {
  Container,
  Slide,
  TextField,
  Chip,
  Dialog,
} from "@material-ui/core";
import { MuiThemeProvider } from "@material-ui/core/styles";
import {Autocomplete} from "@material-ui/lab";
import axios from 'axios';

import MUIDataTable from "mui-datatables";
import {datatableTheme} from "assets/css/datatable-theme.js";
import AddOperationForm from "./Components/AddOperationForm.js";
// Top 100 films as rated by IMDb users. http://www.imdb.com/chart/top
const top100Films = [];

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const LiveOperationAdd = () => {
  const [items, setItems] = useState(); //table items
  const [itemsUpdated, setItemsUpdated] = useState(); //table items
  const [openAddDialog,setOpenAddDialog] = useState(false); //for modal
  const [citiesList, setCitiesList] = useState([]);
  const [suppliersList, setSuppliersList] = useState([]);
  const [neighbourhoodsList, setNeighbourhoodsList] = useState([]);
  const [jobNumber, setJobNumber] = useState();

  useEffect(() => {
    const fetchData = async () => {
      setJobNumber("JN"+Math.floor(Math.random() * 100000000) + 1)
      const cities = await axios(`${process.env.REACT_APP_BASE_URL}/cities`, {
        responseType: "json",
      }).then((response) => {
        setCitiesList(response.data)
        return response.data
      });
      const supplier = await axios(`${process.env.REACT_APP_BASE_URL}/suppliers`, {
        responseType: "json",
      }).then((response) => {
        setSuppliersList(response.data)
        return response.data
      });
      const neighbourhood = await axios(`${process.env.REACT_APP_BASE_URL}/neighbourhoods`, {
        responseType: "json",
      }).then((response) => {
        setNeighbourhoodsList(response.data)
        return response.data
      });
    };
    fetchData();
  }, []);
  const columns = [
    {
      name: "_id",
      options: {
        display: false,
      }
    },
    { name: "job_number", label: "Job #" },
    { name: "operation_number", label: "Operation #" },
    { name: "operation_type", label: "Operation Type" },
    { name: "sn" },
    { name: "brand" },
    {
      name: "supplier_id",
      label: "supplier",
      options: {
        customBodyRender: (value, tableMeta, updateValue) => {
          if (value) {
            let supplierValue = suppliersList.filter((e) => e._id == value);
            return supplierValue.length ? supplierValue[0].name : "-";
          }
        },
      },
    },
    {
      name: "initiation_address",
      label: "Initiation Address",
      options: {
        customBodyRender: (value, tableMeta, updateValue) => {
          let cityValue = "-";
          if (citiesList.filter((e) => e._id == value.city_id)[0]) {
            cityValue = citiesList.filter((e) => e._id == value.city_id)[0]
              .name;
          }
          let neighbourhoodValue = "-";
          if (neighbourhoodsList.filter((e) => e._id == value.neighbourhood_id)[0]) {
            neighbourhoodValue = neighbourhoodsList.filter((e) => e._id == value.neighbourhood_id)[0]
              .name;
          }
          return (
            <div style={{ width: 230, display: "flex", alignItems: "center" }}>
              <div className="avatar_circle">
                {cityValue.substring(0, 2)}
              </div>
              <div>
                {cityValue}
                <br />
                {neighbourhoodValue}
                <br />
                <strong>
                  {value ? value.shop_name : "-"} / {value ? value.mobile : "-"}
                </strong>
              </div>
            </div>
          );
        },
      },
    },
    {
      name: "execution_address",
      label: "Execution Address",
      options: {
        customBodyRender: (value, tableMeta, updateValue) => {
          let cityValue = "-";
          if (citiesList.filter((e) => e._id == value.city_id)[0]) {
            cityValue = citiesList.filter((e) => e._id == value.city_id)[0]
              .name;
          }
          let neighbourhoodValue = "-";
          if (neighbourhoodsList.filter((e) => e._id == value.neighbourhood_id)[0]) {
            neighbourhoodValue = neighbourhoodsList.filter((e) => e._id == value.neighbourhood_id)[0]
              .name;
          }
          return (
            <div style={{ width: 230, display: "flex", alignItems: "center" }}>
              <div className="avatar_circle">
                {cityValue.substring(0, 2)}
              </div>
              <div>
                {cityValue}
                <br />
                {neighbourhoodValue}
                <br />
                <strong>
                  {value ? value.shop_name : "-"} / {value ? value.mobile : "-"}
                </strong>
              </div>
            </div>
          );
        },
      },
    },
  ];
  const options = {
    filter: false,
    onRowsDelete: null,
    selectToolbarPlacement: "replace",
    customToolbar: () => {
      return <CustomToolbar listener={handleOpenAddDialog} />;
    },
    onRowsDelete: (rowsDeleted, dataRows) => {
      const idsToDelete = rowsDeleted.data.map(d => items[d.dataIndex]._id); // array of all ids to to be deleted
        axios.delete(`${process.env.REACT_APP_BASE_URL}/liveOperations/${idsToDelete}`, {
          responseType: "json",
        }).then((response) => {
          console.log("deleted")
        });
    },
  };
  const handleOpenAddDialog = () => {
    setOpenAddDialog(true);
  };
  



    useEffect(()=>{  
      const fetchData = async () => {
        const itemsByJobNumber = await axios(`${process.env.REACT_APP_BASE_URL}/liveOperations/byJobNumber/${jobNumber}`, {
          responseType: "json",
        }).then((response) => {
          setItems(response.data)
        });  
      };
      fetchData();
      },[itemsUpdated])

  return (
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
            placeholder="Search Data"
          />
        )}
      />

      <MuiThemeProvider theme={datatableTheme}>
        <MUIDataTable
          title=""
          data={items}
          columns={columns}
          options={options}
        />
      </MuiThemeProvider>

      <div>
          
        {/*********************** -Add START- ****************************/}
        <Dialog
          maxWidth={"lg"}
          fullWidth
          TransitionComponent={Transition}
          open={openAddDialog}
          onClose={() => setOpenAddDialog(false)}
        >
          <div style={{minHeight:"80vh",overflowX:"hidden"}}>
          <AddOperationForm setOpenDialog={setOpenAddDialog} jobNumber={jobNumber} setItemsUpdated={setItemsUpdated}  />
          </div>
        </Dialog>

      </div>
    </Container>
  );
}
export default LiveOperationAdd;
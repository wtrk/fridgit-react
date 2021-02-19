import React, { useState, useEffect } from "react";
import CustomToolbar from "../../CustomToolbar";
import {
  Container,
  Dialog,
  Slide,
  TextField,
  Chip,
  CircularProgress,
} from "@material-ui/core";
import { MuiThemeProvider } from "@material-ui/core/styles";
import {Autocomplete} from "@material-ui/lab";

import FilterComponent from "components/CustomComponents/FilterComponent.js";
import MUIDataTable from "mui-datatables";
import {datatableTheme} from "assets/css/datatable-theme.js";
import SubTables from "./Components/SubTables.js";
import axios from 'axios';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const PriceRule = () => {
  const [isLoading, setIsloading] = useState(true);  
  const [openAddForm, setOpenAddForm] = useState(false); //for modal
  const [priceRuleId, setPriceRuleID] = useState(); //modal title
  const [formTitle, setFormTitle] = useState("Add"); //modal title
  const [filterDialog,setFilterDialog] = useState(false)
  const [items, setItems] = useState([]); //table items
  const [serviceTypesList, setServiceTypesList] = useState([]);
  const [itemsBackup, setItemsBackup] = useState([]);
  const [searchValue, setSearchValue] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const serviceTypesList = await axios(`${process.env.REACT_APP_BASE_URL}/serviceTypes`, {
        responseType: "json",
      }).then((response) => {
        setServiceTypesList(response.data)
        return response.data
      });

      await axios(`${process.env.REACT_APP_BASE_URL}/priceRules`, {
        responseType: "json",
      }).then((response) => {
        setItems(response.data)
        setItemsBackup(response.data)
        return setIsloading(false)
      });
    };
    fetchData();
  }, [openAddForm]);

  const columns = [
    {
      name: "_id",
      options: {
        display: false,
      }
    },
    {
      name: "priority"
    },
    {
      name: "clients",
      label: "Client",
      options: {
        customBodyRender: (value, tableMeta, updateValue) => {
          return value ? value.map(e=>e.name).toString():"";
        },
      },
    },
    {
      name: "name",
      label: "Name",
      options: {
        filter: false,
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <div>
              <a
                onClick={() => {
                  handleAdd("Edit Price Rule - "+tableMeta.rowData[2],tableMeta.rowData[0]);
                }}
              >
                {value}
              </a>
            </div>
          );
        },
      },
    },
    {
      name: "service",
      label: "Service",
      options: {
        customBodyRender: (value, tableMeta, updateValue) => {
          let typeValue = "-"
          if(serviceTypesList.filter(e=> e._id===value)[0]){
            typeValue = serviceTypesList.filter((e) => e._id == value )[0].name;
          }
          return typeValue;
        },
      },
    },
    {
      name: "handling_in",
      label: "Handling In",
    },
    {
      name: "storage",
    },
    {
      name: "in_house_preventive_maintenance",
      label: "Inhouse Preventive Maintenance",
    },
    {
      name: "corrective_service_in_house",
      label: "Corrective Service Inhouse",
    },
    {
      name: "cabinet_testing_fees",
      label: "Cabinet Testing Fees",
    },
    {
      name: "branding_fees",
      label: "Branding Fees",
    },
    {
      name: "drop",
    },
    {
      name: "transp_cbm",
      label: "Transp Cbm",
    },
    {
      name: "transp_for_1_unit",
      label: "Transp For 1 Unit",
    },
    {
      name: "min_charge",
      label: "Min Charge",
    },
    {
      name: "preventive_maintenance",
      label: "Preventive Maintenance",
    },
    {
      name: "exchange_corrective_reaction",
      label: "Exchange Corrective Reaction",
    },
    {
      name: "corrective_reaction",
      label: "Corrective Reaction",
    }
  ];

  const options = {
    filter: false,
    onRowsDelete: null,
    rowsPerPage: 20,
    rowsPerPageOptions: [20, 50, 100],
    selectToolbarPlacement: "replace",
    customToolbar: () => {
      return (
        <CustomToolbar
          listener={() => {
            handleAdd("Add New Price Rule");
          }}
          handleFilter={handleFilter}
        />
      );
    },
    onRowsDelete: (rowsDeleted, dataRows) => {
      const idsToDelete = rowsDeleted.data.map(d => items[d.dataIndex]._id); // array of all ids to to be deleted
        axios.delete(`${process.env.REACT_APP_BASE_URL}/priceRules/${idsToDelete}`, {
          responseType: "json",
        }).then((response) => {
          console.log("deleted")
        });
    },
    textLabels: {
        body: {
            noMatch: !isLoading && 'Sorry, there is no matching data to display'
        },
    },
  };
  const handleFilter = () => {
    setFilterDialog(true)
  };

  const handleAdd = (title, priceRuleId) => {
    setOpenAddForm(true);
    setFormTitle(title);
    setPriceRuleID(priceRuleId);
  };
  const handleCloseAddForm = () => setOpenAddForm(false)



  // await axios(`${process.env.REACT_APP_BASE_URL}/priceRules/priceRuleFromClient/${ddddd}`, {
  //   responseType: "json",
  // }).then((response) => {
  //   setItems(response.data)
  //   return setIsloading(false)
  // });
  //Search component ---------------START--------------
  const handleChangeSearch = (e, newValue) => {
    if(newValue.length===0) setItems(itemsBackup); else{
      setItems(
        itemsBackup.filter((e) => {
          if (newValue.includes(e.job_number)) return true;
          if (newValue.includes(e.operation_number)) return true;
          if (newValue.includes(e.sn)) return true;
        })
      );

    }



    if(itemsBackup.length===0) setItemsBackup(items)
    setSearchValue(newValue)
    if(newValue===null) setItems(itemsBackup); else setItems([newValue])
  }
  //Search component ---------------END--------------
  return (
    <Container maxWidth="xl">
      <Autocomplete
        id="tags-filled"
        options={items || {}}
        value={searchValue || {}}
        getOptionLabel={(option) => option.name || ""}
        onChange={handleChangeSearch}
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
            placeholder="Search by Name"
          />
        )}
      />

      {!isLoading ? (
        <MuiThemeProvider theme={datatableTheme}>
          <MUIDataTable
            title=""
            data={items}
            columns={columns}
            options={options}
          />
        </MuiThemeProvider>
      ) : (
        <CircularProgress size={30} className="pageLoader" />
      )}

      <div>
        <Dialog
          fullScreen
          open={openAddForm}
          onClose={handleCloseAddForm}
          TransitionComponent={Transition}
        >
          <SubTables
            title={formTitle}
            handleClose={handleCloseAddForm}
            priceRuleId={priceRuleId}
            serviceTypesList={serviceTypesList}
          />
        </Dialog>
        {/*********************** FILTER start ****************************/}
        <Dialog
          onClose={() => setFilterDialog(false)}
          maxWidth={"xl"}
          fullWidth
          aria-labelledby="customized-dialog-title"
          open={filterDialog}
        >
          <FilterComponent setOpenDialog={setFilterDialog} />
        </Dialog>
      </div>
    </Container>
  );
}
export default PriceRule
import React, { useState, useEffect } from "react";
import CustomToolbar from "../../CustomToolbar";
import {
  Container,
  Dialog,
  Slide,
  TextField,
  CircularProgress,
  Tooltip,Zoom
} from "@material-ui/core";

import { ControlPointDuplicate, Close ,Check } from "@material-ui/icons";
import { MuiThemeProvider } from "@material-ui/core/styles";
import {Autocomplete} from "@material-ui/lab";
import { getCookie } from '../../components/auth/Helpers';

import FilterComponent from "./Components/FilterComponent.js";
import MUIDataTable from "mui-datatables";
import {datatableTheme} from "assets/css/datatable-theme.js";
import SubTables from "./Components/SubTables.js";

import axios from 'axios';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const PriceRule = () => {
  const token = getCookie('token');
  const [isLoading, setIsLoading] = useState(true);  
  const [openAddForm, setOpenAddForm] = useState(false); //for modal
  const [priceRuleId, setPriceRuleId] = useState(); //modal title
  const [actionDialog, setActionDialog] = useState("Add"); //modal title
  const [filterDialog,setFilterDialog] = useState(false)
  const [reloadData,setReloadData] = useState(0)
  const [items, setItems] = useState([]); //table items
  const [serviceTypesList, setServiceTypesList] = useState([]);
  const [operationsList, setOperationsList] = useState([]);
  const [itemsBackup, setItemsBackup] = useState([]);
  const [clicked,setClicked] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
        await axios.all([
          axios.get(`${process.env.REACT_APP_BASE_URL}/serviceTypes`,{headers: {Authorization: `Bearer ${token}`}}),
          axios.get(`${process.env.REACT_APP_BASE_URL}/priceRules`,{headers: {Authorization: `Bearer ${token}`}}),
          axios.get(`${process.env.REACT_APP_BASE_URL}/operations`,{headers: {Authorization: `Bearer ${token}`}})
        ]).then(response => {
          setServiceTypesList(response[0].data.data)
          setItems(response[1].data)
          setItemsBackup(response[1].data)
          setOperationsList(response[2].data)
          setClicked(0)
        }).then(() => setIsLoading(false))
    };
    fetchData();
  }, [openAddForm,reloadData]);

  const handleChangeSwitch = async (e, id) => {
    setClicked(id)
    const {name,checked}=e.target
    const active=checked===true ? 1 : 0;
    await axios({
      method: "PUT",
      url: `${process.env.REACT_APP_BASE_URL}/priceRules/${id}`,
      headers: {Authorization: `Bearer ${token}`},
      data: [{active}],
    })
    .then(function (response) {
      setReloadData(reloadData+1)
    })
    .catch((error) => {
      console.log(error);
    });
  }
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
      label: "Clients",
      options: {
        customBodyRender: (value, tableMeta, updateValue) => {
          let clientsValue=value.map(e=>" "+e.name).toString()
          return  <Tooltip TransitionComponent={Zoom} placement="right" arrow title={clientsValue}>
          <span>{clientsValue} </span>
        </Tooltip>
        },
      },
    },
    {
      name: "operations",
      label: "Operations",
      options: {
        customBodyRender: (value, tableMeta, updateValue) => {
          let operationsValue=value.map(e=>" "+e.name).toString()
          return  <Tooltip TransitionComponent={Zoom} placement="right" arrow title={operationsValue}>
          <span>{operationsValue} </span>
        </Tooltip>
        },
      },
    },
    {
      name: "name",
      label: "Name",
      options: {
        filter: false,
        customBodyRender: (value, tableMeta, updateValue) => {
          return <a onClick={() => handleAdd("Edit",tableMeta.rowData[0])}>{value}</a>
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
      name: "promise_day",
      label: "Promise Day"
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
    },
    {
      name: "active",
      options: {
        customBodyRender: (value, tableMeta, updateValue) => {
          
          return (value!=0) ? <Check className="text-success" /> : <Close className="text-danger" /> 
        },
      },
    },
    {
      name: "clone",
      options: {
        customBodyRender: (value, tableMeta, updateValue) => {
          return <a onClick={() => handleAdd("Clone",tableMeta.rowData[0])}><ControlPointDuplicate /></a>
        },
      },
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
            handleAdd("Add");
          }}
          handleFilter={handleFilter}
        />
      );
    },
    onRowsDelete: (rowsDeleted, dataRows) => {
      const idsToDelete = rowsDeleted.data.map(d => items[d.dataIndex]._id); // array of all ids to to be deleted
        axios.delete(`${process.env.REACT_APP_BASE_URL}/priceRules/${idsToDelete}`, {
          responseType: "json", headers: {Authorization: `Bearer ${token}`},
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
    setActionDialog(title);
    setPriceRuleId(priceRuleId);
  };
  const handleCloseAddForm = () => setOpenAddForm(false)

  //Search component ---------------START--------------
  const handleChangeSearch = (e, newValue) => {
    if(newValue.length===0) setItems(itemsBackup); else{
      let valueToSearch=[]
      newValue.forEach(newValueEntry=>{
        valueToSearch.push(...itemsBackup.filter((e,i) => {
          if(!valueToSearch.map(eSearch=>eSearch._id).includes(e._id)){
            if (e.name.toLowerCase().includes(newValueEntry.toLowerCase())){
              return true;
            }
            if (e.clients.map(eSub=>eSub.name).toString().toLowerCase().includes(newValueEntry.toLowerCase())){
              return true;
            }
            if (e.operations.map(eSub=>eSub.name).toString().toLowerCase().includes(newValueEntry.toLowerCase())){
              return true;
            }
          }
        }))
      })
      setItems(valueToSearch)
    }
  }
  //Search component ---------------END--------------
  return (
    <Container maxWidth="xl">
    <Autocomplete
      multiple
      freeSolo
      limitTags={3}
      id="tags-standard"
      options={[]}
      getOptionLabel={(option) => option}
      onChange={handleChangeSearch}
      renderInput={(params) => (
        <TextField
          {...params}
          variant="standard"
          placeholder="Search Data"
          label="Filter by Operations/Clients or Name"
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
            actionDialog={actionDialog}
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
          <FilterComponent setOpenDialog={setFilterDialog} setItems={setItems} />
        </Dialog>
        
      </div>
    </Container>
  );
}
export default PriceRule
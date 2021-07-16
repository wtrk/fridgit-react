import React, { useState, useEffect } from "react";
import {
  Container,
  TextField,
  Dialog,
  CircularProgress,
  Slide,
} from "@material-ui/core";
import { MuiThemeProvider } from "@material-ui/core/styles";
import Autocomplete from "@material-ui/lab/Autocomplete";
import MUIDataTable from "mui-datatables";
import {datatableTheme} from "assets/css/datatable-theme.js";
import axios from 'axios';
import Moment from "react-moment";
import CustomToolbar from "../../CustomToolbar";
import FilterComponent from "./Components/FilterComponent.js";
import { getCookie } from '../../components/auth/Helpers';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const DailyReport = () => {
  const token = getCookie('token');
  const [isLoading, setIsLoading] = useState(true);  
  const [items, setItems] = useState([]); //table items
  const [columns, setColumns] = useState(); //for modal2
  const [filterDialog,setFilterDialog] = useState(false)
  const [pagingInfo, setPagingInfo] = useState({page:0,limit:20,skip:0,count:20}); //Pagination Info
  const [searchEntry, setSearchEntry] = useState([]); //searchEntry


  useEffect(() => {
    const fetchData = async () => {
      await axios(`${process.env.REACT_APP_BASE_URL}/financial/daily`, {
        responseType: "json", headers: {Authorization: `Bearer ${token}`}
      }).then((response) => {
        setItems(response.data)
        return setIsLoading(false)
      })
      .catch((error) => {
        console.log("error",error);
      });
    };
    fetchData();
  }, [searchEntry]);



  useEffect(()=>{
    setColumns([
        {
          name: "_id",
          options: {
            display: false,
          },
        },
        {
          name: "createdAt",
          label: "Day",
          options: {
            customBodyRender: (value, tableMeta, updateValue) => {
              if(value==="Total") return value
              else return <Moment format="DD MMM YYYY">{value}</Moment>
            }
          },
        },
        { label: "Handling IN / OUT", name: "handling_in" },
        { label: "Storage", name: "storage" },
        { label: "In House Preventive", name: "in_house_preventive_maintenance" },
        { label: "In House Corrective", name: "corrective_service_in_house" },
        { label: "Testing", name: "cabinet_testing_fees" },
        { label: "Branding", name: "branding_fees" },
        { label: "Drop", name: "drop" },
        { label: "Transportation", name: "transportation_fees" },
        { label: "Preventive Maintenance", name: "preventive_maintenance" },
        { label: "Exchange Corrective Reaction", name: "exchange_corrective_reaction" },
        { label: "Corrective Reaction", name: "corrective_reaction" },
        { label: "Total", name: "total" },
      ]);
  },[])

  const options = {
    filter: false,
    onRowsDelete: null,
    rowsPerPage: pagingInfo.limit,
    rowsPerPageOptions: [20, 50, 100],
    selectToolbarPlacement: "replace",
    customToolbar: () => {
      return (
        <CustomToolbar 
          handleFilter={handleFilter}
        />
      );
    },
    serverSide: true,
    count:pagingInfo.count, // Use total number of items
    page: pagingInfo.page,
    onTableChange: (action, tableState) => {
      if (action === "changePage") {
        setPagingInfo({...pagingInfo,page:tableState.page,skip:tableState.page*pagingInfo.limit});
      }else if(action === "changeRowsPerPage"){
        setPagingInfo({...pagingInfo,limit:tableState.rowsPerPage});
      }
    }
  };
  const handleFilter = () => {
    setFilterDialog(true)
  };
  //Search component ---------------START--------------
  const handleChangeSearch = (e, newValue) => {
    setSearchEntry(newValue)

  }
  //Search component ---------------END--------------
  return (
    <>
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
              label="Filter by Job #, Operation # and Serial #"
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
      </Container>
        {/*********************** FILTER start ****************************/}
        <Dialog
          onClose={() => setFilterDialog(false)}
          maxWidth={"xl"}
          fullWidth
          aria-labelledby="customized-dialog-title"
          open={filterDialog}
        >
          <FilterComponent setOpenDialog={setFilterDialog} setItems={setItems} setPagingInfo={setPagingInfo} pagingInfo={pagingInfo} />
        </Dialog>
    </>
  );
}
export default DailyReport
import React, {useState,useRef,useEffect} from "react";
import {
  AppBar,
  Typography,
  Toolbar,
  Grid,
  Button,
  CircularProgress,
  IconButton,
} from "@material-ui/core";
import {Close,Save} from '@material-ui/icons';
import { MuiThemeProvider } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables";
import {pricesDataTableTheme} from "assets/css/datatable-theme.js";
import { makeStyles } from "@material-ui/core/styles";
import axios from 'axios';
import { isElementAccessExpression } from "typescript";

const useStyles = makeStyles((theme) => ({
    appBar: {
      position: "relative",
    },
    title: {
      marginLeft: theme.spacing(2),
      flex: 1,
    },
  formControl: {
    minWidth: "100%",
  }
}));
const Preventive = (props) => {
    const classes = useStyles(); //custom css
    const [isLoading, setIsloading] = useState(true);
    const [items, setItems] = useState([]);
    const [checkedIndexes, setCheckedIndexes] = useState([]);

    useEffect(() => {
      const fetchData = async () => {
        const actionsFromDb=await axios(`${process.env.REACT_APP_BASE_URL}/preventiveActions`, {
          responseType: "json",
        }).then((response) => {
          let idsOfSelected=props.preventivesChosen.map(e=>e.preventiveActions_id)
          setCheckedIndexes(response.data.map((e,i)=>{
            if(idsOfSelected.includes(e._id)){
              return i
            }
          }).filter(e=>e!=undefined))
          console.log("response.data",response.data)
          setItems(response.data)
          return setIsloading(false)
        })
      };
      fetchData();
    }, []);
    
    let columns = [
      {
        name: "_id",
        options: {
          display: false,
        },
      },
      { name: "name" },
      { name: "nameAr" },
      { name: "category" },
      { name: "categoryAr" },
      { name: "subCategory" },
      { name: "subCategoryAr" },
    ]
    
    const options = {
      filter:false, sort: false,
      rowsPerPage: 100,
      customFooter: () => "",
      customToolbarSelect: () => "",
      rowsSelected: checkedIndexes,
      customToolbarSelect: (selectedRows, displayData, setSelectedRows) => {
        return (
          <IconButton
            onClick={() => {
              const selectedRowsTotal = displayData.filter((e, i) =>
                  selectedRows.data.map((e) => e.index).includes(i) && !checkedIndexes.includes(i)
                ).map((e) => ({ preventiveActions_id: e.data[0] }));
              props.setPreventivesChosen([
                ...props.preventivesChosen, ...selectedRowsTotal
              ]);
              props.setIsloading(true)
            props.handleClose();

            }}
            style={{ marginRight: "24px", height: "48px", display: "block" }}
          >
            <Save />
          </IconButton>
        );
      },
    };
    return (
      <>
      <AppBar className={classes.appBar}>
        <Toolbar>
          <Close
            onClick={props.handleClose}
            className="btnIcon"
          />
          <Typography variant="h6" className={classes.title}>
          Preventives for {props.title}
          </Typography>
        </Toolbar>
      </AppBar>
        {!isLoading ? (
          <>
            <div style={{ padding: "30px" }}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <MuiThemeProvider theme={pricesDataTableTheme}>
                  <MUIDataTable
                    title="Preventive Actions"
                    data={items}
                    columns={columns}
                    options={options}
                  />
                  </MuiThemeProvider>
                </Grid>
              </Grid>
            </div>
          </>
        ) : (
          <CircularProgress size={30} className="pageLoader" />
        )}
      </>
    );
}
export default Preventive;

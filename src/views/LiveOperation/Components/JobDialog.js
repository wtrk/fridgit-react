import React, { useState,useEffect } from "react";
import {
  DialogContent,
  Button,
  Grid,
  DialogActions
} from "@material-ui/core";
import { MuiThemeProvider } from "@material-ui/core/styles";
import Moment from "react-moment";
import MUIDataTable from "mui-datatables";
import {pricesDataTableTheme} from "assets/css/datatable-theme.js";
import { makeStyles} from "@material-ui/core/styles";
import { Close} from "@material-ui/icons";
import axios from 'axios';

import "react-dropzone-uploader/dist/styles.css";

import "../LiveOperation.css";


const useStyles = makeStyles((theme) => ({
    root_avatar: {
      display: "flex",
      "& > *": {
        margin: theme.spacing(1),
      },
    },
  }));

const JobDialog = (props) => {
    const classes = useStyles(); //custom css
    const [dialogItemTab, setDialogItemTab] = useState(1);
    const [liveOperationsList, setLiveOperationsList] = useState([]);
    const [financialList, setFinancialList] = useState([]);
    const [clientsName, setClientsName] = useState();
    let columnsForPrices = [
      { name: "createdAt",label: "Date",
        options: {
          customBodyRender: (value, tableMeta, updateValue) => <Moment format="DD MMM YYYY">{value}</Moment>
        },
      },
      { name: "location",label: "Location",
        options: {
          customBodyRender: (value, tableMeta, updateValue) => {
          return value.shop_name
          }
        },
      },
      { name: "operation_type",label: "Operation Type" },
      { name: "job_number",label: "Job Number" },
      { name: "operation_number",label: "operation number" },
      { name: "branding_fees",label: "branding fees" },
      { name: "cabinet_testing_fees",label: "cabinet testing fees" },
      { name: "corrective_reaction",label: "corrective reaction" },
      { name: "corrective_service_in_house",label: "corrective service in house" },
      { name: "drop",label: "drop" },
      { name: "exchange_corrective_reaction",label: "exchange corrective reaction" },
      { name: "handling_in",label: "handling in" },
      { name: "in_house_preventive_maintenance",label: "in house preventive maintenance" },
      { name: "preventive_maintenance",label: "preventive maintenance" },
      { name: "promise_day",label: "promise day" },
      { name: "storage",label: "storage" },
      { name: "transportation_fees",label: "transportation fees" },
      { name: "labor",label: "labor" },
      { name: "spare",label: "spare" },
      { name: "total",label: "total" },
    ]
    
  let optionsForPrices = {
    filter:false,
    selectableRows: false,
    rowsPerPage: 100,
    customFooter: () => {
      return <div className="d-flex justify-content-end px-5 py-3">
          {financialList.length?<><strong>Total</strong>: {(financialList.length > 1)?financialList.reduce((a,b)=>a.total+b.total):financialList[0].total}</>:"0"}
          </div>
    }
  };


  useEffect(() => {
    const fetchData = async () => {
        await axios.all([
          axios.get(`${process.env.REACT_APP_BASE_URL}/financial/byJobNumber/${props.jobNumber}`),
          axios.get(`${process.env.REACT_APP_BASE_URL}/liveOperations/byJobNumber/${props.jobNumber}`)
        ])
        .then(response => {
          setFinancialList(response[0].data)
          setLiveOperationsList(response[1].data)
        })
    };
    fetchData();
  }, []);
    
    useEffect(() => {
      const fetchData = async () => {
        const client = await axios(`${process.env.REACT_APP_BASE_URL}/clients`, {
          responseType: "json",
        }).then((response) => {
          if(liveOperationsList.length) {
            if("response.data",response.data.filter((e) => e._id == liveOperationsList[0].client_id).length){
              setClientsName(response.data.filter((e) => e._id == liveOperationsList[0].client_id)[0].name)
              return response.data
            }
          }
        });
      };
      fetchData();
    }, [liveOperationsList]);
  /**************** -OnClickItemDialog START- **************/
  const DialogTabsContent = (props) => {
    if (props.tab === 1) {
      return (
        <MuiThemeProvider theme={pricesDataTableTheme}>
        <MUIDataTable
          title="Financial"
          data={financialList}
          columns={columnsForPrices}
          options={optionsForPrices}
        />
        </MuiThemeProvider>
      );
    // } else if (props.tab === 2) {
    //   return (
    //     <MuiThemeProvider theme={pricesDataTableTheme}>
    //     <MUIDataTable
    //       title="Financial"
    //       data={financialList}
    //       columns={columnsForPrices}
    //       options={optionsForPrices}
    //     />
    //     </MuiThemeProvider>
    //   );
    }
  };
  /**************** -OnClickItemDialog END- **************/



  return (
    <>
      <DialogContent dividers className="entryEditHeader">
        <Grid container>
          <Grid item xs={4}>
            <div className={classes.root_avatar}>
            {clientsName ? (
                  <div className="avatar_circle">
                    {clientsName.substring(0, 2)}
                  </div>
                ) : null}

              <div>
                <strong>Client</strong>
                <br />
                {clientsName}
              </div>
            </div>
          </Grid>
        </Grid>
        <div className="entryEditHeader__tabsCont">
          <Button
            className={
              "ceeh__tabsCont--btn " + (dialogItemTab === 1 ? "selected" : "")
            }
            onClick={() => {
              setDialogItemTab(2);
            }}
          >
            Financial History
          </Button>
        </div>
      </DialogContent>
      <DialogContent dividers>
        <DialogTabsContent tab={dialogItemTab} supplierName={props.supplierName} />
      </DialogContent>
      <DialogActions>
        <Button
          variant="outlined"
          color="primary"
          size="large"
          className="btn btn--save"
          onClick={() => props.setOpenDialog(false)}
          startIcon={<Close />}
        >
          Close
        </Button>
      </DialogActions>
    </>
  );
};

export default JobDialog;

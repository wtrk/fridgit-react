import React, { useState,Fragment, useEffect } from "react";
import {
  Typography,
  Button,
  Grid,
  Avatar,
  DialogActions, DialogContent,TableFooter, TableCell, TableRow
} from "@material-ui/core";
import { MuiThemeProvider } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables";
import {pricesDataTableTheme} from "assets/css/datatable-theme.js";
import { makeStyles} from "@material-ui/core/styles";
import { Close} from "@material-ui/icons";
import axios from 'axios';

import "react-dropzone-uploader/dist/styles.css";
import fridgeDummy from "assets/img/fridge-1.jpg";
import clientDummy from "assets/img/clientDummy.png";

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
      { name: "job_number" },
      { name: "operation_number" },
      { name: "branding_fees" },
      { name: "cabinet_testing_fees" },
      { name: "corrective_reaction" },
      { name: "corrective_service_in_house" },
      { name: "drop" },
      { name: "exchange_corrective_reaction" },
      { name: "min_charge" },
      { name: "handling_in" },
      { name: "in_house_preventive_maintenance" },
      { name: "preventive_maintenance" },
      { name: "promise_day" },
      { name: "storage" },
      { name: "transp_cbm" },
      { name: "transp_for_1_unit" },
      { name: "labor" },
      { name: "spare" },
      { name: "total" }
    ]
    
  const optionsForPrices = {
    filter:false,
    selectableRows: false,
    rowsPerPage: 100,
    customFooter: () => {
      return (
        <div class="d-flex justify-content-end px-5 py-3"><strong>Total</strong>: {(financialList.length > 1)?financialList.reduce((a,b)=>a.total+b.total):financialList[0].total}</div>
        );
    }
  };


    useEffect(() => {
      const fetchData = async () => {
        const financial = await axios(`${process.env.REACT_APP_BASE_URL}/financial/byJobNumber/${props.jobNumber}`, {
          responseType: "json",
        }).then((response) => {
          setFinancialList(response.data)
          return response.data
        });
        const liveOperation = await axios(`${process.env.REACT_APP_BASE_URL}/liveOperations/byJobNumber/${props.jobNumber}`, {
          responseType: "json",
        }).then((response) => {
          setLiveOperationsList(response.data)
          return response.data
        });
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
        <Grid container className="infoTabContainer" spacing={3}>
          <Grid item container xs={12} md={6} spacing={2}>
            <Grid item xs={4}>
              <img src={fridgeDummy} alt="" />
            </Grid>
            <Grid item xs={8}>
              <h4><strong>Fridge</strong></h4>
              <p>
                <strong>Type</strong>: EPTA 482L EIS (Ver-6S18B)
              </p>
              <p>
                <strong>Branding</strong>: Walls
              </p>
              <p>
                <strong>SN</strong>: 18GE43245
              </p>
              <p>
                <strong>Status</strong>: Needs Repair
              </p>
              <p>
                <strong>Location</strong>: Bekaa - CHAFIC JAMIL FOR GENERAL
                TRADING
              </p>
              <p>
                <strong>CBM</strong>: 222346678
              </p>
            </Grid>
          </Grid>

          <Grid item container xs={12} md={6} spacing={2}>
            <Grid item xs={4}>
              <img src={clientDummy} alt="" />
            </Grid>
            <Grid item xs={8}>
              <h4><strong>Client</strong></h4>
              <p>
                <strong>Company</strong>: Unilever Levant S.A.R.L.
              </p>
              <p>
                <strong>Address</strong>: 3rd Floor, Dolphin Building, Fouad
                Ammoun Street-Jisr El Wati, Sin El Fil PO Box 90-908 Beirut/
                Lebanon
              </p>
              <p>
                <strong>Phone</strong>: +961 1 497630
              </p>
              <p>
                <strong>Email</strong>: Baker.Sibai@unilever.com
              </p>
            </Grid>
          </Grid>
        </Grid>
      );
    } else if (props.tab === 2) {
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
    }
  };
  /**************** -OnClickItemDialog END- **************/



  return (
    <Fragment>
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
              setDialogItemTab(1);
            }}
          >
            Info
          </Button>
          <Button
            className={
              "ceeh__tabsCont--btn " + (dialogItemTab === 2 ? "selected" : "")
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
    </Fragment>
  );
};

export default JobDialog;

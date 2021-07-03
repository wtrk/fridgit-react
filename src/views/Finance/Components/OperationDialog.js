import React, { useState, useEffect } from "react";
import {
  Typography,
  Button,
  Grid,
  DialogContent,
  DialogActions
} from "@material-ui/core";
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent,
} from "@material-ui/lab";
import { MuiThemeProvider } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables";
import {pricesDataTableTheme} from "assets/css/datatable-theme.js";
import Moment from "react-moment";
import { makeStyles} from "@material-ui/core/styles";
import { Close } from "@material-ui/icons";
import axios from 'axios';
import "react-dropzone-uploader/dist/styles.css";


const useStyles = makeStyles((theme) => ({
    root_avatar: {
      display: "flex",
      "& > *": {
        margin: theme.spacing(1),
      },
    },
  }));

const OperationDialog = (props) => {
    const classes = useStyles(); //custom css
    const [dialogItemTab, setDialogItemTab] = useState(1);
    const [liveOperationsList, setLiveOperationsList] = useState([]);
    const [historyList, setHistoryList] = useState([]);
    const [financialList, setFinancialList] = useState([]);
    const [clientInfo, setClientInfo] = useState();
    const [fridgeInfo, setFridgeInfo] = useState();
    const [cabinetsSn, setCabinetsSn] = useState();
    let columnsForPrices = [
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
      { name: "total",label: "total" }
    ]
    const optionsForPrices = {
      filter:false,
      selectableRows: false,
      rowsPerPage: 100,
      customFooter: () => {
        return (
          <div className="d-flex justify-content-end px-5 py-3"><strong>Total</strong>: {(financialList.length > 1)?financialList.reduce((a,b)=>a.total+b.total):financialList[0].total}</div>
        );
      }
    };
    
    useEffect(() => {
      const fetchData = async () => {
        const liveOperation = await axios(`${process.env.REACT_APP_BASE_URL}/liveOperations/byOperationNumber/${props.operationNum}`, {
          responseType: "json",
        }).then((response) => {
          console.log("ssssssssssssss",response.data)
          setLiveOperationsList(response.data[0])
          return response.data
        });
      };
      fetchData();
    }, []);
    
    useEffect(() => {
      const fetchData = async () => {
        let findSn=props.cabinetsList.find(e=>e._id===liveOperationsList.sn)
        setCabinetsSn(findSn?findSn.sn:"")

        const history = await axios(`${process.env.REACT_APP_BASE_URL}/operations/history/${liveOperationsList.operation_number}`, {
          responseType: "json",
        }).then((response) => {
          
          setHistoryList(response.data.map(e=>{
            let location={}

            return {...e,location}
          }))
          return response.data
        });
        const financial = await axios(`${process.env.REACT_APP_BASE_URL}/financial/byOperationNumber/${liveOperationsList.operation_number}`, {
          responseType: "json",
        }).then((response) => {
          setFinancialList(response.data)
          return response.data
        });
        if(liveOperationsList.client_id){
          const client = await axios(`${process.env.REACT_APP_BASE_URL}/clients/${liveOperationsList.client_id}`, {
            responseType: "json",
          }).then((response) => {
            setClientInfo(response.data)
          });
        }
        if(liveOperationsList.sn){
          const client = await axios(`${process.env.REACT_APP_BASE_URL}/fridgesTypes/bySn/${liveOperationsList.sn}`, {
            responseType: "json",
          }).then((response) => {
            setFridgeInfo(response.data)
          });
        }
      };
      fetchData();
    }, [liveOperationsList]);
    
  /**************** -OnClickItemDialog START- **************/
  const DialogTabsContent = (props) => {
    if (props.tab === 1) {
      return (
        <Timeline align="left">
          {historyList
            ? historyList.map((e) => {
                return <TimelineItem key={e._id} style={{minHeight:50}}>
                  <TimelineOppositeContent>
                    {(e.status==="Assigned") ? <Typography>{e.status} to {props.supplierName}</Typography>:<Typography>{e.status}</Typography>}
                  </TimelineOppositeContent>
                  <TimelineSeparator>
                    <TimelineDot />
                    <TimelineConnector />
                  </TimelineSeparator>
                  <TimelineContent>
                  <Moment format="DD MMM YYYY - HH:mm">{e.createdAt}</Moment>
                  </TimelineContent>
                </TimelineItem>
            })
            : null}
        </Timeline>
      );
    } else if (props.tab === 2) {
      return (
        <Grid container className="infoTabContainer" spacing={3}>
          {fridgeInfo?<Grid item container xs={12} md={6} spacing={2}>
            <Grid item xs={4}>
              {fridgeInfo.photo?
              <img src={require("assets/uploads/clients/"+fridgeInfo.photo)} alt="" /> 
              :null}
            </Grid>
            <Grid item xs={8}>
              <h4><strong>Fridge</strong></h4>
              <p>
                <strong>Type</strong>: {fridgeInfo.name}
              </p>
              <p>
                <strong>Branding</strong>: {liveOperationsList.brand}
              </p>
              <p>
                <strong>SN</strong>: {cabinetsSn}
              </p>
              <p>
                <strong>Status</strong>: {liveOperationsList.status}
              </p>
              <p>
                <strong>CBM</strong>: {fridgeInfo.cbm}
              </p>
            </Grid>
          </Grid>:null}

        {clientInfo?<Grid item container xs={12} md={6} spacing={2}>
            <Grid item xs={4}>
              {clientInfo.photo?
              <img src={require("assets/uploads/clients/"+clientInfo.photo)} alt="" />
              :null}
            </Grid>
            <Grid item xs={8}>
              <h4><strong>Client</strong></h4>
              <p>
                <strong>Company</strong>: {clientInfo.name}
              </p>
              <p>
                <strong>Address</strong>:  {clientInfo.address}
              </p>
              <p>
                <strong>Phone</strong>:  {clientInfo.phone}
              </p>
              <p>
                <strong>Email</strong>:  {clientInfo.email}
              </p>
            </Grid>
          </Grid>:null}
          </Grid>
      );
    } else if (props.tab === 3) {
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
    <>
      <DialogContent dividers className="entryEditHeader">
        <Grid container>
          <Grid item xs={3}>
            <div className={classes.root_avatar}>
              {clientInfo ? (
                  <div className="avatar_circle">
                    {clientInfo.name.substring(0, 2)}
                  </div>
                ) : null}
              <div>
                <strong>Client</strong><br />
                {clientInfo?clientInfo.name:null}
              </div>
            </div>
          </Grid>
          <Grid item xs={3}>
            <strong>Sn:</strong> {cabinetsSn}
            <br />
            <strong>Status:</strong> {liveOperationsList.status}
            <br/>
            <strong>Branding:</strong> {liveOperationsList.brand}
            </Grid>
          <Grid item xs={3}>
          {liveOperationsList.allocation_rule?<span><strong>Allocation Rules:</strong> {liveOperationsList.allocation_rule.name}</span>:null}
            <br />
            {liveOperationsList.price_rule?<span><strong>Price Rules:</strong> {liveOperationsList.price_rule.name}</span>:null}
            <br />
            <strong>Type:</strong> {liveOperationsList.operation_type}
          </Grid>
          <Grid item xs={3}>
            {historyList.length?<span><strong>location:</strong> {historyList[0].location.neighbourhood} - {historyList[0].location.city}</span>:null}
            <br />
            <strong>Date:</strong> {liveOperationsList.createdAt}
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
            History
          </Button>
          <Button
            className={
              "ceeh__tabsCont--btn " + (dialogItemTab === 2 ? "selected" : "")
            }
            onClick={() => {
              setDialogItemTab(2);
            }}
          >
            Info
          </Button>
          <Button
            className={
              "ceeh__tabsCont--btn " + (dialogItemTab === 3 ? "selected" : "")
            }
            onClick={() => {
              setDialogItemTab(3);
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

export default OperationDialog;

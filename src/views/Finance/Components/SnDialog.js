import React, { useState,Fragment, useEffect }  from "react";
import {
  Typography,
  Button,
  Grid,
  Avatar,
  DialogActions, DialogContent
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
import Moment from "react-moment";
import { MuiThemeProvider } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables";
import {pricesDataTableTheme} from "assets/css/datatable-theme.js";
import { makeStyles} from "@material-ui/core/styles";
import { Close} from "@material-ui/icons";
import axios from 'axios';

import "react-dropzone-uploader/dist/styles.css";


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
    },
  
    root_avatar: {
      display: "flex",
      "& > *": {
        margin: theme.spacing(1),
      },
    },
    root_modal: {
      margin: 0,
      padding: theme.spacing(2),
    },
  }));

const SnDialog = (props) => {
    const classes = useStyles(); //custom css
    const [liveOperationsList, setLiveOperationsList] = useState([]);
    const [financialList, setFinancialList] = useState([]);
    const [neighbourhoodsList, setNeighbourhoodsList] = useState([]);
    const [citiesList, setCitiesList] = useState([]);
    const [clientInfo, setClientInfo] = useState();
    const [fridgeInfo, setFridgeInfo] = useState();
    const [cabinetsSn, setCabinetsSn] = useState();
    let columnsForPrices = [
      { name: "job_number",label: "Job Number" },
      { name: "createdAt",label: "Date",
        options: {
          customBodyRender: (value, tableMeta, updateValue) => {
            return <Moment format="DD MMM YYYY">{value}</Moment>;
          },
        },
      },
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
      { name: "createdAt",label: "Date",
      options: {
        customBodyRender: (value, tableMeta, updateValue) => {
          return <Moment format="DD MMM YYYY">{value}</Moment>;
        },
      },
    }
    ]
    // <Moment format="DD MMM YYYY - HH:mm">{e.createdAt}</Moment>
    const optionsForPrices = {
      filter:false,
      selectableRows: false,
      rowsPerPage: 100,
      customFooter: () => {
        return (
          <div className="d-flex justify-content-end px-5 py-3">
            <strong>Total</strong>: {(financialList.length > 1)?financialList.map(e=>e.total).reduce((a,b)=>a+b):financialList[0].total}</div>
        );
      }
    };
    
    useEffect(() => {
      const fetchData = async () => {
        const neighbourhoods = await axios(`${process.env.REACT_APP_BASE_URL}/neighbourhoods`, {
          responseType: "json",
        }).then((response) => {
          setNeighbourhoodsList(response.data)
          return response.data
        });
        const cities = await axios(`${process.env.REACT_APP_BASE_URL}/cities`, {
          responseType: "json",
        }).then((response) => {
          setCitiesList(response.data)
          return response.data
        });

        const liveOperation = await axios(`${process.env.REACT_APP_BASE_URL}/liveOperations/bySn/${props.snId}`, {
          responseType: "json",
        }).then((response) => {
          setLiveOperationsList(response.data.map(e=>{
            let location={}
            if(e.execution_address){
              location.neighbourhood=neighbourhoods.length?neighbourhoods.filter(eSub=>eSub._id===e.execution_address.neighbourhood_id)[0].name:"";
              location.city=cities.length?cities.filter(eSub=>eSub._id===e.execution_address.city_id)[0].name:"";
              location.shop_name=e.execution_address.shop_name;
              location.mobile=e.execution_address.mobile;
            }else if(e.initiation_address){
              location.neighbourhood=neighbourhoods.length?neighbourhoods.filter(eSub=>eSub._id===e.initiation_address.neighbourhood_id)[0].name:"";
              location.city=cities.length?cities.filter(eSub=>eSub._id===e.initiation_address.city_id)[0].name:"";
              location.shop_name=e.initiation_address.shop_name;
              location.mobile=e.initiation_address.mobile;
            }else{
              location.neighbourhood="";
              location.city="";
              location.shop_name="";
              location.mobile="";
            }
            return {...e,location}
          }))
          return response.data
        });
        const financial = await axios(`${process.env.REACT_APP_BASE_URL}/financial/bySn/${props.snId}`, {
          responseType: "json",
        }).then((response) => {
          setFinancialList(response.data)
          return response.data
        });
      };
      fetchData();
    }, []);

    
    useEffect(() => {
      const fetchData = async () => {
        const sn=liveOperationsList.length?liveOperationsList[0].sn:null;
        const clientId=liveOperationsList.length?liveOperationsList[0].client_id:null;
        const findSn=sn?props.cabinetsList.find(e=>e._id===sn):null;
        setCabinetsSn(findSn?findSn.sn:"")
        if(clientId){
          await axios(`${process.env.REACT_APP_BASE_URL}/clients/${clientId}`, {
            responseType: "json",
          }).then((response) => {
            setClientInfo(response.data)
          });
        }
        if(findSn){
          await axios(`${process.env.REACT_APP_BASE_URL}/fridgesTypes/bySn/${liveOperationsList[0].sn}`, {
            responseType: "json",
          }).then((response) => {
            setFridgeInfo(response.data)
          });
        }
      };
      fetchData();
    }, [liveOperationsList]);

  /**************** -OnClickItemDialog START- **************/
  const [dialogItemTab, setDialogItemTab] = useState(1);
  const DialogTabsContent = (props) => {
    if (props.tab === 1) {
      return (
        <Timeline align="left">
          {liveOperationsList
            ? liveOperationsList.map((e) => (
              <TimelineItem key={e._id} style={{minHeight:50}}>
              <TimelineOppositeContent>
                    <Typography>{e.operation_type} ({e.operation_number})</Typography>
                    <Typography>{e.location.shop_name} - {e.location.mobile}</Typography>
                    <Typography>{e.location.city} - {e.location.neighbourhood}</Typography>
                  </TimelineOppositeContent>
                  <TimelineSeparator>
                    <TimelineDot />
                    <TimelineConnector />
                  </TimelineSeparator>
                  <TimelineContent>
                  <Moment format="DD MMM YYYY - HH:mm">{e.createdAt}</Moment>
                  </TimelineContent>
                </TimelineItem>
              ))
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
    <Fragment>
        <DialogContent dividers className="entryEditHeader">
            <Grid container>
              <Grid item xs={4}>
                <div className={classes.root_avatar}>
                  <Avatar>JO</Avatar>

                  <div>
                    <strong>Client</strong>
                    <br />
                    Jollychic
                  </div>
                </div>
              </Grid>

              <Grid item xs={4}>
                <strong>Sn:</strong> 18GE43250
                <br />
                <strong>Status:</strong> Operational
              </Grid>

              <Grid item xs={4}>
                <strong>Branding:</strong> Walls
                <br />
                <strong>Type:</strong> Walls
              </Grid>
            </Grid>
            <div className="entryEditHeader__tabsCont">
              <Button
                className={
                  "ceeh__tabsCont--btn " +
                  (dialogItemTab === 1 ? "selected" : "")
                }
                onClick={() => {
                  setDialogItemTab(1);
                }}
              >
                History
              </Button>
              <Button
                className={
                  "ceeh__tabsCont--btn " +
                  (dialogItemTab === 2 ? "selected" : "")
                }
                onClick={() => {
                  setDialogItemTab(2);
                }}
              >
                Info
              </Button>
              <Button
                className={
                  "ceeh__tabsCont--btn " +
                  (dialogItemTab === 3 ? "selected" : "")
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
            <DialogTabsContent tab={dialogItemTab} />
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

export default SnDialog;

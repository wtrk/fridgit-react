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
import { makeStyles} from "@material-ui/core/styles";
import { Close} from "@material-ui/icons";
import axios from 'axios';

import "react-dropzone-uploader/dist/styles.css";
import fridgeDummy from "assets/img/fridge-1.jpg";
import clientDummy from "assets/img/clientDummy.png";

import "../LiveOperation.css";


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
    
    useEffect(() => {
      const fetchData = async () => {
        const liveOperation = await axios(`${process.env.REACT_APP_BASE_URL}/liveOperations/bySn/${props.snId}`, {
          responseType: "json",
        }).then((response) => {
          setLiveOperationsList(response.data)
          return response.data
        });
      };
      fetchData();
    }, []);
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
    } else if (props.tab === 3) {
      return (
        <Timeline align="alternate">
          <TimelineItem>
            <TimelineOppositeContent>
              <Typography>Created</Typography>
            </TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineDot />
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>
              <Typography color="textSecondary">01/01/2020 09:30 am</Typography>
            </TimelineContent>
          </TimelineItem>

          <TimelineItem>
            <TimelineOppositeContent>
              <Typography color="textSecondary">10/08/2020 10:00 am</Typography>
            </TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineDot />
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>
              <Typography>Client approved</Typography>
            </TimelineContent>
          </TimelineItem>

          <TimelineItem>
            <TimelineOppositeContent>
              <Typography>Completed</Typography>
            </TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineDot />
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>
              <Typography color="textSecondary">01/10/2020 12:00 am</Typography>
            </TimelineContent>
          </TimelineItem>
          <TimelineItem>
            <TimelineOppositeContent>
              <Typography color="textSecondary">10/10/2020 9:00 am</Typography>
            </TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineDot />
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>
              <Typography>Admin approved</Typography>
            </TimelineContent>
          </TimelineItem>
        </Timeline>
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

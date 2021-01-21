import React, { Fragment } from "react";

import AppBar from "@material-ui/core/AppBar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Toolbar from "@material-ui/core/Toolbar";
import { Close, Save } from "@material-ui/icons";
import CustomInput from "components/CustomInput/CustomInput.js";
import { makeStyles } from "@material-ui/core/styles";
import styles from "assets/jss/material-dashboard-react/components/tasksStyle.js";
const useStyles_theme = makeStyles(styles);

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: "relative",
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  root: {
    backgroundColor: theme.palette.background.paper,
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
const AddFormDialog = (props) => {
  const classes = useStyles(); //custom css
  const classes_theme = useStyles_theme(); //theme css
  return (
    <Fragment>
      <AppBar className={classes.appBar}>
        <Toolbar>
          <Close onClick={props.handleClose} class="btnIcon" />
          <Typography variant="h6" className={classes.title}>
            {props.title}
          </Typography>
        </Toolbar>
      </AppBar>

      <div style={{ padding: "50px" }}>
        <form onSubmit={props.handleOnSubmit}>
        <Grid container spacing={3}>
          {props.inputs.map((e) => {
            return (
              <Grid item xs={12} sm={e.grid ? e.grid : 6}>
                <CustomInput
                  labelText={e.labelText}
                  name={e.name}
                  type={e.type}
                  value={e.value}
                  disabled={e.disabled}
                  formControlProps={{
                    fullWidth: true,
                    setDisableAddress: e.setDisableAddress,
                  }}
                  setDisableAddress={e.setDisableAddress}
                  handler={e.handleChangeInput}
                />
              </Grid>
            );
          })}
          <Grid item xs={12} className="clientTables">
            <Button
              variant="contained"
              color="primary"
              size="large"
              className="btn btn--save"
              type="submit"
              startIcon={<Save />}
            >
              Save
            </Button>
            <Button
              variant="outlined"
              color="primary"
              size="large"
              className="btn btn--save"
              onClick={props.handleClose}
              startIcon={<Close />}
            >
              Close
            </Button>
          </Grid>
        </Grid>
        </form>
      </div>
    </Fragment>
  );
};

export default AddFormDialog;

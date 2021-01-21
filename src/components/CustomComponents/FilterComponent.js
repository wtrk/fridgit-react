import React, { useState,Fragment } from "react";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import { Button, Grid, Switch, FormControlLabel } from "@material-ui/core";
import DateFnsUtils from '@date-io/date-fns'; // choose your lib
import {
  DatePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import { Close, Save } from "@material-ui/icons";
import CustomInput from "components/CustomInput/CustomInput.js";

import "react-dropzone-uploader/dist/styles.css";



const FilterComponent = (props) => {
  
    const [includeFilter, setIncludeFilter] = useState({
      input1: true,
      input2: true,
      input3: true,
      input4: true,
    });
    const changeIncludeFilter = (event) => {
      setIncludeFilter({ ...includeFilter, [event.target.name]: event.target.checked });
    };
    const [createdFromDate, setCreatedFromDate] = useState(new Date());
    const [createdToDate, setCreatedToDate] = useState();
    const [promiseFromDate, setPromiseFromDate] = useState(new Date());
    const [promiseToDate, setPromiseToDate] = useState();
return <Fragment>
    
    <DialogContent dividers>
            <h3>Order Filter</h3>
          </DialogContent>
          <DialogContent dividers>
            <Grid container spacing={3}>
              <Grid item xs={6}>
                <CustomInput
                  labelText="Statuses"
                  type="select"
                  value={[
                    "In progress",
                    "Completed",
                    "Faild",
                    "On hold",
                    "Assigned",
                    "Unassigned",
                  ]}
                  disabled={!includeFilter.input1}
                  formControlProps={{
                    fullWidth: true,
                  }}
                />
                <FormControlLabel
                  style={{ float: "right", marginTop: "-20px" }}
                  label={
                    includeFilter.input1
                      ? "Exclude Statuses"
                      : "Include Statuses"
                  }
                  control={
                    <Switch
                      checked={includeFilter.input1}
                      onChange={changeIncludeFilter}
                      name="input1"
                      color="primary"
                    />
                  }
                />
              </Grid>
              <Grid item xs={6}>
                <CustomInput
                  labelText="Service Type"
                  type="text"
                  value=""
                  disabled={!includeFilter.input2}
                  formControlProps={{
                    fullWidth: true,
                  }}
                />
                <FormControlLabel
                  style={{ float: "right", marginTop: "-20px" }}
                  label={
                    includeFilter.input2
                      ? "Exclude Service Type"
                      : "Include Service Type"
                  }
                  control={
                    <Switch
                      checked={includeFilter.input2}
                      onChange={changeIncludeFilter}
                      name="input2"
                      color="primary"
                    />
                  }
                />
              </Grid>
            </Grid>
            <Grid container spacing={3}>
              <Grid item xs={4}>
                <CustomInput
                  labelText="Statuses"
                  type="select"
                  value={[
                    "In progress",
                    "Completed",
                    "Faild",
                    "On hold",
                    "Assigned",
                    "Unassigned",
                  ]}
                  formControlProps={{
                    fullWidth: true,
                  }}
                />
              </Grid>
              <Grid item xs={4}>
                <CustomInput
                  labelText="Service Type"
                  type="text"
                  value=""
                  formControlProps={{
                    fullWidth: true,
                  }}
                />
              </Grid>
              <Grid item xs={4}>
                <CustomInput
                  labelText="Statuses"
                  type="select"
                  value={[
                    "In progress",
                    "Completed",
                    "Faild",
                    "On hold",
                    "Assigned",
                    "Unassigned",
                  ]}
                  formControlProps={{
                    fullWidth: true,
                  }}
                />
              </Grid>
            </Grid>
            <Grid container spacing={3}>
              <Grid item xs={3}>
                <h5>Created Date</h5>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <DatePicker
                    format="dd/MM/yyyy"
                    id="createdDateFrom"
                    label="Date from"
                    views={["year", "month", "date"]}
                    value={createdFromDate}
                    onChange={setCreatedFromDate}
                    fullWidth
                    disabled={!includeFilter.input3}
                  />
                </MuiPickersUtilsProvider>
              </Grid>
              <Grid item xs={3}>
                <h5> &nbsp;</h5>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <DatePicker
                    format="dd/MM/yyyy"
                    id="createdDateTo"
                    label="Date to"
                    views={["year", "month", "date"]}
                    value={createdToDate}
                    onChange={setCreatedToDate}
                    fullWidth
                    disabled={!includeFilter.input3}
                  />
                </MuiPickersUtilsProvider>
                <FormControlLabel
                  style={{ float: "right" }}
                  label={
                    includeFilter.input3
                      ? "Exclude Created Date"
                      : "Include Created Date"
                  }
                  control={
                    <Switch
                      checked={includeFilter.input3}
                      onChange={changeIncludeFilter}
                      name="input3"
                      color="primary"
                    />
                  }
                />
              </Grid>

              <Grid item xs={3}>
                <h5>Promise Date</h5>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <DatePicker
                    format="dd/MM/yyyy"
                    label="Date from"
                    views={["year", "month", "date"]}
                    value={promiseFromDate}
                    onChange={setPromiseFromDate}
                    fullWidth
                    disabled={!includeFilter.input4}
                  />
                </MuiPickersUtilsProvider>
              </Grid>
              <Grid item xs={3}>
                <h5> &nbsp;</h5>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <DatePicker
                    format="dd/MM/yyyy"
                    id="createdDateTo"
                    label="Date to"
                    views={["year", "month", "date"]}
                    value={promiseToDate}
                    onChange={setPromiseToDate}
                    fullWidth
                    disabled={!includeFilter.input4}
                  />
                </MuiPickersUtilsProvider>
                <FormControlLabel
                  style={{ float: "right" }}
                  label={
                    includeFilter.input3
                      ? "Exclude Created Date"
                      : "Include Created Date"
                  }
                  control={
                    <Switch
                      checked={includeFilter.input4}
                      onChange={changeIncludeFilter}
                      name="input4"
                      color="primary"
                    />
                  }
                />
              </Grid>
          </Grid>
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
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              size="large"
              className="btn btn--save"
              onClick={() => props.setOpenDialog(false)}
              startIcon={<Save />}
            >
              Save
            </Button>
          </DialogActions>
        
</Fragment>
};

export default FilterComponent;

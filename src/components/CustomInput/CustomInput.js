import React, { useState, Fragment } from "react";
import classNames from "classnames";
import PropTypes from "prop-types";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Input from "@material-ui/core/Input";
import Checkbox from "@material-ui/core/Checkbox";

import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormLabel from "@material-ui/core/FormLabel";
// @material-ui/icons
import Clear from "@material-ui/icons/Clear";
import Check from "@material-ui/icons/Check";
// core components
import styles from "assets/jss/material-dashboard-react/components/customInputStyle.js";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

const useStyles = makeStyles(styles);

export default function CustomInput(props) {
  const classes = useStyles();
  const {
    InputLabelProps,
    formControlProps,
    labelText,
    id,
    handler,
    value,
    type,
    labelProps,
    inputProps,
    error,
    endAdornment,
    success,
    disabled,
    name
  } = props;
  const [checked, setChecked] = useState(true);
  const handleChangeCheckbox = (event) => {
    setChecked(event.target.checked);
  };

  const [radioValue, setRadioValue] = React.useState("");

  const handleChangeRadio = async (event) => {
    /*The below in the Users page, add user*/
    event.target.value === "Client"
      ? formControlProps.setDisableAddress(false)
      : formControlProps.setDisableAddress(true);
    setRadioValue(event.target.value);
  };

  const labelClasses = classNames({
    [" " + classes.labelRootError]: error,
    [" " + classes.labelRootSuccess]: success && !error,
  });
  const underlineClasses = classNames({
    [classes.underlineError]: error,
    [classes.underlineSuccess]: success && !error,
    [classes.underline]: true,
  });
  if (type === "checkbox") {
    return (
      <FormControlLabel
        control={
          <Checkbox
            checked={checked}
            onChange={handleChangeCheckbox}
            name="checked"
            color="primary"
          />
        }
        label={labelText}
        className={formControlProps.className + " " + classes.formControl}
      />
    );
  } else {
    let InputField = () => (
      <Fragment>
        {labelText !== undefined ? (
          <InputLabel
            className={classes.labelRoot + labelClasses}
            htmlFor={id}
            {...labelProps}
          >
            {labelText}
          </InputLabel>
        ) : null}
        <Input
          classes={{
            disabled: classes.disabled,
            underline: underlineClasses,
          }}
          onChange={handler}
          name={name}
          id={id}
          type={type}
          disabled={disabled}
          endAdornment={endAdornment}
          value={value}
          {...inputProps}
        />
      </Fragment>
    );
    if (type === "select") {
      InputField = () => (
        <Fragment>
          {labelText !== undefined ? (
            <InputLabel
              className={classes.labelRoot + labelClasses}
              htmlFor={id}
              {...labelProps}
            >
              {labelText}
            </InputLabel>
          ) : null}
          <Select
            disabled={disabled}
            labelId="demo-simple-select-autowidth-label"
            id="demo-simple-select-autowidth"
            autoWidth
          >
            {value.map((option) => (
              <MenuItem value={option}>{option}</MenuItem>
            ))}
          </Select>
        </Fragment>
      );
    } else if (type === "radio") {
      InputField = () => (
        <Fragment>
          {labelText !== undefined ? (
            <FormLabel className={classes.labelRoot + labelClasses}>
              {labelText}
            </FormLabel>
          ) : null}
          <RadioGroup
            value={radioValue}
            onChange={handleChangeRadio}
            style={{ flexDirection: "row" }}
          >
            {value.map((option) => (
              <FormControlLabel
                value={option}
                control={<Radio color="primary" />}
                label={option}
                id={labelText.split(" ").join("")}
              />
            ))}
          </RadioGroup>
        </Fragment>
      );
    }

    return (
      <FormControl
        {...formControlProps}
        className={formControlProps.className + " " + classes.formControl}
      >
        <InputField />
        {error ? (
          <Clear className={classes.feedback + " " + classes.labelRootError} />
        ) : success ? (
          <Check
            className={classes.feedback + " " + classes.labelRootSuccess}
          />
        ) : null}
      </FormControl>
    );
  }
}

CustomInput.propTypes = {
  labelText: PropTypes.node,
  labelProps: PropTypes.object,
  id: PropTypes.string,
  inputProps: PropTypes.object,
  formControlProps: PropTypes.object,
  error: PropTypes.bool,
  success: PropTypes.bool,
};

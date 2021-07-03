import React from "react";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import {FilterList,Add,CloudUpload} from "@material-ui/icons";
import { withStyles } from "@material-ui/core/styles";

const defaultToolbarStyles = {
  iconButton: {
  },
};

class CustomToolbar extends React.Component {
  
  // handleClick = () => {
  //  alert("clicked on icon!");
  // }

  render() {
    const { classes,listener,handleFilter,importXlsx } = this.props;

 
    return (
      <React.Fragment>
        {importXlsx ? (
          <Tooltip title={"Import Excel"}>
            <IconButton className={classes.iconButton} onClick={importXlsx}>
              <CloudUpload className={classes.deleteIcon} />
            </IconButton>
          </Tooltip>
        ) : null}
        {handleFilter ? (
          <Tooltip title={"Filter"}>
            <IconButton className={classes.iconButton} onClick={handleFilter}>
              <FilterList className={classes.deleteIcon} />
            </IconButton>
          </Tooltip>
        ) : null}
        <Tooltip title={"Add"}>
          <IconButton className={classes.iconButton} onClick={listener}>
            <Add className={classes.deleteIcon} />
          </IconButton>
        </Tooltip>
      </React.Fragment>
    );
  }

}

export default withStyles(defaultToolbarStyles, { name: "CustomToolbar" })(CustomToolbar);
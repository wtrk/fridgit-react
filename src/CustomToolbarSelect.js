import React from "react";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import CompareArrowsIcon from "@material-ui/icons/CompareArrows";
import IndeterminateCheckBoxIcon from "@material-ui/icons/IndeterminateCheckBox";
import BlockIcon from "@material-ui/icons/Block";
import { withStyles } from "@material-ui/core/styles";
import { Create, Delete,Add } from '@material-ui/icons';

const defaultToolbarSelectStyles = {
  iconButton: {
  },
  iconContainer: {
    marginRight: "24px",
  },
  inverseIcon: {
    transform: "rotate(90deg)",
  },
};

class CustomToolbarSelect extends React.Component {
  handleClickInverseSelection = () => {
    // const nextSelectedRows = this.props.displayData.reduce((nextSelectedRows, _, index) => {
    //   if (!this.props.selectedRows.data.find(selectedRow => selectedRow.index === index)) {
    //     nextSelectedRows.push(index);
    //   }

    //   return nextSelectedRows;
    // }, []);

    // this.props.setSelectedRows(nextSelectedRows);
  };

  handleClickDeselectAll = () => {
    //this.props.setSelectedRows([]);
  };

  handleDelete = () => {
    //console.log(`block users with dataIndexes: ${this.props.selectedRows.data.map(row => row.dataIndex)}`);
     
    let myItems = [];

    this.props.selectedRows.data.map((anObjectMapped, index) => {


      myItems.push({serial:this.props.items[anObjectMapped.dataIndex].serial});
       })
      //console.log(this.props.items[anObjectMapped.dataIndex].serial);


    
    console.log(myItems);
  
   alert("deleted");

    
  };

  render() {
    const { classes,selectedRows,displayData,setSelectedRows,items,delete_listener } = this.props;
    






    
    return (
      <div className={classes.iconContainer}>
        
        <Tooltip title={"Add to Operation"}>
          <IconButton className={classes.iconButton} onClick={this.handleClickInverseSelection}>
            <CompareArrowsIcon className={[classes.icon, classes.inverseIcon].join(" ")} />
          </IconButton>
        </Tooltip>
        <Tooltip title={"Missing"}>
          <IconButton className={classes.iconButton} onClick={this.handleClickDeselectAll}>
            <BlockIcon className={classes.icon} />
          </IconButton>
        </Tooltip>
        <Tooltip title={"Delete"}>
          <IconButton className={classes.iconButton} onClick={delete_listener}>
            <Delete className={classes.icon} />
          </IconButton>
        </Tooltip>
      </div>
    );
  }
}

export default withStyles(defaultToolbarSelectStyles, { name: "CustomToolbarSelect" })(CustomToolbarSelect);
import React, {useState,useEffect} from "react";
import {
  TextField,
  CircularProgress,
} from "@material-ui/core";
import CustomToolbar from "CustomToolbar";
import MUIDataTable from "mui-datatables";

const NestedTable = (props) => {
  const [valueSelected, setValueSelected] = useState("");



  const add1Row = () => {
    props.setArrayName([...props.arrayName, { name: "" }]);
  };
  const handleChangeInput = (e) => {
    setValueSelected(e.target.value);
  };
  const keyPressHandler = (e) => {
    const { keyCode, target } = e
    if(keyCode===13){
      setValueSelected("")
      props.setArrayName([...props.arrayName.filter(e=>e.name!==""), { name: target.value }]);
    }
  }

  return (
    <MUIDataTable
      title={props.title}
      data={props.arrayName}
      title={props.isLoading ? <CircularProgress  size={30} style={{position:"absolute",top:"120px",left:"45%",zIndex:100}} /> : props.title }
      columns={[
        {
          name: "name",
          label: "Name",
          options: {
            filter: false,
            customBodyRender: (value, tableMeta, updateValue) => {
              if (value == "") {
                return (
                  <div>
                    <TextField
                      id={`${props.title}Input`}
                      label={`Add new ${props.title}`}
                      onChange={handleChangeInput}
                      onKeyDown={keyPressHandler}
                      fullWidth
                      value={valueSelected || ""}
                      name="valueSelected"
                    />
                  </div>
                );
              } else {
                return <div>{value}</div>;
              }
            },
          },
        },
      ]}
      options={{
        filter: false,
        customToolbar: () => {
          return <CustomToolbar listener={add1Row} />;
        },
        textLabels: {
            body: {
                noMatch: !props.isLoading && 'Sorry, there is no matching data to display'
            },
        },
      }}
    />
  );
};

export default NestedTable;

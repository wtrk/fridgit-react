import React, {useState,useEffect} from "react";
import { TextField, CircularProgress } from "@material-ui/core";
import {Autocomplete} from '@material-ui/lab';
import CustomToolbar from "CustomToolbar";
import MUIDataTable from "mui-datatables";
import axios from 'axios';

const NestedTable = (props) => {
  const [valueSelected, setValueSelected] = useState("");
  const [dataList, setDataList] = useState([]);

  const add1Row = () => {
    props.setArrayName([...props.arrayName, { name: "" }]);
  };
    const handleChange = (e, newValue) =>{
      setValueSelected([])
      props.setArrayName([...props.arrayName.filter(e=>e.name!==""), newValue ]);

    }
  
  useEffect(()=>{
    const fetchData = () => {
      let dbTable = props.dbTable
      if(props.title==="operations") dbTable="cities"
      axios(`${process.env.REACT_APP_BASE_URL}/${dbTable}`, {
        responseType: "json",
      }).then((response) => {
        setDataList(response.data)
        return response.data
      });
      };
    fetchData();
  },[])


  return (
    <MUIDataTable
      data={props.arrayName}
      title={props.title}
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
                    <Autocomplete
                      id={`${props.title}Input`}
                      options={dataList || {}}
                      value={valueSelected || {}}
                      getOptionLabel={(option) => {
                        return Object.keys(option).length !== 0
                          ? option.name
                          : "";
                      }}
                      onChange={handleChange}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label={`Add new ${props.title}`}
                        />
                      )}
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

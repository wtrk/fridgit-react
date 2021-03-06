import React, {useState,useEffect} from "react";
import { TextField, CircularProgress } from "@material-ui/core";
import {Autocomplete} from '@material-ui/lab';
import CustomToolbar from "CustomToolbar";
import MUIDataTable from "mui-datatables";
import { getCookie } from 'components/auth/Helpers';
import axios from 'axios';

const NestedTable = (props) => {
  const token = getCookie('token');
  const [valueSelected, setValueSelected] = useState("");
  const [dataList, setDataList] = useState([]);

  const add1Row = () => {
    props.setArrayName([...props.arrayName, { name: "" }]);
  };
    const handleChange = (e, newValue) =>{
      setValueSelected([])
      if(newValue) props.setArrayName([...props.arrayName.filter(e=>e.name!==""), newValue ]);

    }
  
  useEffect(()=>{
    const fetchData = async () => {
      let dbTable = props.dbTable
      await axios(`${process.env.REACT_APP_BASE_URL}/${dbTable}`, {
        responseType: "json", headers: {Authorization: `Bearer ${token}`},
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
        onRowsDelete: (rowsDeleted, dataRows) => {
          const idsToDelete = rowsDeleted.data.map(d => props.arrayName[d.dataIndex]._id);
          const rowsToKeep=props.arrayName.filter(e=> !idsToDelete.includes(e._id))
          props.setArrayName(rowsToKeep)
        }
      }}
    />
  );
};

export default NestedTable;

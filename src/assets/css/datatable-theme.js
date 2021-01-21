import { createMuiTheme } from "@material-ui/core/styles";

  const datatableTheme = createMuiTheme({
    overrides: {
      MUIDataTableHeadCell: {
        toolButton: {
          minWidth: "100px",
          margin: "10px 20px",
        },
      },
      MUIDataTableBodyCell: {
        root: {
          minWidth: "100px",
          margin: "5px 20px",
        },
      },
      MUIDataTableToolbar: {
        root: {
          width: "50%",
          position: "absolute",
          right: 0,
          top: "-59px",
        },
      },
      MUIDataTable: {
        paper: {
          position: "relative",
          height: "calc(100vh - 18rem)",
        },
      },

    },
  });
  export default datatableTheme;
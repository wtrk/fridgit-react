import { createMuiTheme } from "@material-ui/core/styles";

export const datatableTheme = createMuiTheme({
    overrides: {
      MUIDataTableHeadCell: {
        toolButton: {
          minWidth: "100px",
          margin: "10px 20px",
        },
        data:{
          textTransform: "capitalize"
        }
      },
      MUIDataTableToolbarSelect: {
        root: {
          position: "absolute",
          top: "-50px",
          left: 0,
          right: 0,
          paddingTop:0,
          paddingBottom:0
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
          height: "calc(100vh - 12rem)",
        },
        responsiveBase: {
          height: "100% !important",
          width: "100% !important",
          overflow: "scroll",
        }
      },
      MUIDataTableFooter:{
        root:{
          position: "fixed",
          left: 0,
          bottom: 0
        }
      }
    },
  });

export const datatableThemeInTabsPage = createMuiTheme({
    overrides: {
      MUIDataTableHeadCell: {
        toolButton: {
          minWidth: "100px",
          margin: "10px 20px",
        },
        data:{
          textTransform: "capitalize"
        }
      },
      MUIDataTableToolbarSelect: {
        root: {
          position: "absolute",
          top: "-50px",
          left: 0,
          right: 0,
          paddingTop:0,
          paddingBottom:0
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
          height: "calc(100vh - 15rem)",
        },
        responsiveBase: {
          height: "100% !important",
          width: "100% !important",
          overflow: "scroll",
        }
      },
      MUIDataTableFooter:{
        root:{
          position: "fixed",
          left: 0,
          bottom: 0
        }
      }
    },
  });

  
export const pricesDataTableTheme = createMuiTheme({
  overrides: {
    MUIDataTableHeadCell: {
      toolButton: {
        minWidth: "100px",
        margin: "10px 10px",
      },
      data:{
        textTransform: "capitalize"
      }
    },
    MUIDataTableBodyCell: {
      root: {
        minWidth: "100px",
        margin: "5px 10px",
      },
    },
      MUIDataTable: {
        responsiveBase: {
          position: "static !important",
        }
      },
  },
});


export const noToolbarTheme = createMuiTheme({ overrides: { MUIDataTableToolbar: { regular: { display: "none" } } } });
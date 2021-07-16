import React from "react";
import MUIDataTable from "mui-datatables";
import { Add } from "@material-ui/icons";
import Grid from "@material-ui/core/Grid";
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";

import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import Slide from "@material-ui/core/Slide";
import { withStyles } from "@material-ui/core/styles";
import AddAlert from "@material-ui/icons/AddAlert";
import Snackbar from "components/Snackbar/Snackbar.js";
import { getCookie } from 'components/auth/Helpers';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
const styles = (theme) => ({
  appBar: {
    position: "relative",
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
});

class TableList extends React.Component {
  componentDidMount() {
    fetch(`${process.env.REACT_APP_BASE_URL}ws_users`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);

        this.setState({
          loading: false,
          user: data,
        });
        console.log(this.state.user);
      })
      .catch((error) => {
        alert(error.toString());
        // this.setState({ errorMessage: error.toString() });
        //console.error('There was an error!', error);
        this.showNotification("Error!!", "danger");
      });
  }

  getrowdata(row) {
    fetch(`${process.env.REACT_APP_BASE_URL}ws_users.php?id=${row}`)
      .then((response) => response.json())
      .then((data) => {
        this.setState({ single_user: data });

        //  console.log(this.state.user[0].Firstname);
        // this.showNotification("Success!","success")
      })
      .catch((error) => {
        // this.setState({ errorMessage: error.toString() });
        console.error("There was an error!", error);
        // this.showNotification("Error!!","danger")
      });
  }

  showNotification = (text, type) => {
    if (!this.state.notify) {
      this.setState((prev) => {
        return { notify: true, notify_text: [text], notify_type: [type] };
      });

      setTimeout(
        function () {
          this.setState({ notify: false, notify_text: "", notify_type: "" });
        }.bind(this),
        6000
      );
    }
  };

  deleterow(row) {
    const token = getCookie('token');
    const requestOptions = {
      method: "POST",
      headers: {Authorization: `Bearer ${token}`},
      body: JSON.stringify(row),
    };
    fetch(
      `${process.env.REACT_APP_BASE_URL}ws_tusers.php?action=2`,
      requestOptions
    )
      .then((response) => response.json())
      .then((data) => {
        const data1 = this.state.user.filter(
          (user) => user.serial !== row["row"]
        );

        this.setState({ user: data1 });

        this.showNotification("Success!", "success");
      })
      .catch((error) => {
        // this.setState({ errorMessage: error.toString() });
        console.error("There was an error!", error);
        this.showNotification("Error!!", "danger");
      });
  }

  handleClickOpen() {
    this.setState({ open: true });
  }

  handleClose() {
    this.setState({ open: false });
  }

  save() {
    const token = getCookie('token');
    if (this.state.rowID === 0) {
      const requestOptions = {
        method: "POST",
        body: JSON.stringify(this.state.single_user),
        headers: {Authorization: `Bearer ${token}`},
      };
      fetch(
        `${process.env.REACT_APP_BASE_URL}ws_tusers.php?action=1`,
        requestOptions
      )
        .then((response) => response.json())
        .then((data) => {
          this.setState({
            open: false,
          });

          //  alert(data);
          let items = this.state.single_user;
          items[0].serial = data;
          // console.log(items);
          /////////////////////////
          var joined = this.state.user.concat(items);
          this.setState({
            user: joined,
            single_user: [
              {
                serial: "",
                Firstname: "",
                Lastname: "",
                dob: "",
                position: "",
                username: "",
                password: "",
                description: "",
                city: "",
                country: "",
              },
            ],
          });
          ///////////////////////////

          this.showNotification("Success!", "success");
        })
        .catch((error) => {
          // this.setState({ errorMessage: error.toString() });
          console.error("There was an error!", error);
          this.showNotification("Error!!", "danger");
        });
    } else {
      const requestOptions = {
        method: "POST",
        body: JSON.stringify(this.state.single_user),
        headers: {Authorization: `Bearer ${token}`},
      };
      fetch(
        `${process.env.REACT_APP_BASE_URL}ws_tusers.php?action=3`,
        requestOptions
      )
        .then((response) => response.json())
        .then((data) => {
          this.setState({ open: false });

          /////////////////////////
          let items = this.state.user;

          // 2. Make a shallow copy of the item you want to mutate
          items[this.state.rowID] = this.state.single_user[0];

          this.setState({ user: items });
          ///////////////////////////

          this.showNotification("Success!", "success");
        })
        .catch((error) => {
          // this.setState({ errorMessage: error.toString() });
          console.error("There was an error!", error);
          this.showNotification("Error!!", "danger");
        });
    }
  }

  handlechange(event) {
    const { id, value } = event.target;

    //console.log(111);
    // console.log(this.state);
    // this.setState(
    //   {
    //     single_user[0]:value
    //   }
    // );
    // 1. Make a shallow copy of the items
    let items = [...this.state.single_user];
    // 2. Make a shallow copy of the item you want to mutate
    let item = { ...items[0] };
    // 3. Replace the property you're intested in
    item[[id]] = value;
    // 4. Put it back into our array. N.B. we *are* mutating the array here, but that's why we made a copy first
    items[0] = item;
    console.log(items);
    // 5. Set the state to our new copy
    this.setState({ single_user: items });
  }
  constructor() {
    super();

    this.state = {
      notify: false,
      notify_type: "",
      notify_text: "",
      open: false,
      Modal_title: "",
      rowID: "0",
      loading: true,
      user: [],
      single_user: [
        {
          serial: "",
          Firstname: "",
          Lastname: "",
          dob: "",
          position: "",
          username: "",
          password: "",
          description: "",
          city: "",
          country: "",
        },
      ],
    };

    this.deleterow = this.deleterow.bind(this);
    this.handleClickOpen = this.handleClickOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.getrowdata = this.getrowdata.bind(this);
    this.save = this.save.bind(this);
    this.handlechange = this.handlechange.bind(this);
    this.addnew = this.addnew.bind(this);
    this.showNotification = this.showNotification.bind(this);
    this.deleteRows = this.deleteRows.bind(this);
  }

  addnew() {
    this.setState({
      rowID: "0",
      open: "true",
      Modal_title: "Add User",
      single_user: [
        {
          serial: "",
          Firstname: "",
          Lastname: "",
          dob: "",
          position: "",
          username: "",
          password: "",
          description: "",
          city: "",
          country: "",
        },
      ],
    });
  }

  deleteRows(RowsDeleted, data) {
    //const ids = RowsDeleted.data.map((d) => d.dataIndex);
    // const idsToDeleted = ids.map(d => shells[d][9]);   //This is possibly this, ids.map(d => data[d][9])
    // console.log(data); //Now you will get data
    // alert();
    // axios({
    //   method: "POST",
    //   url: 'http://localhost:5000/eliminado',
    //   data: RowsDeleted,
    // });
  }

  render() {
    const columns = [
      {
        name: "Firstname",
        label: "FirstName",
      },
      {
        name: "Lastname",
        label: "FirstName",
      },
      {
        name: "username",
        label: "Username",
      },
      {
        name: "email",
        label: "Email",
      },
      {
        name: "position",
        label: "Position",
      },
      {
        name: "Action",
        options: {
          filter: false,
          sort: false,
          empty: true,
          customBodyRenderLite: (dataIndex, rowIndex) => {
            return (
              <div>
                {/* <IconButton edge="start" color="inherit" 
onClick={() => {



this.setState({open:true,rowID:dataIndex,Modal_title:"Edit User"});
  


let val = this.state.user[dataIndex].serial;
 
this.getrowdata(val);
                 
                  
           //       console.log(data);
                  //this.setState({ data });
  
  
                }}
                 >
<Create></Create>
            </IconButton> */}

                {/* <IconButton edge="start" color="inherit" onClick={() => {



let val = this.state.user[dataIndex].serial;
var del_array = {row:val};   
this.deleterow(del_array);

               
                
         //       console.log(data);
                //this.setState({ data });


              }} >
 <Delete></Delete>
            </IconButton> */}
              </div>
            );
          },
        },
      },
    ];

    const options = {
      filterType: "checkbox",
      onRowsDelete: this.deleteRows,
    };
    const { classes } = this.props;

    return (
      <div>
        <div>
          <Grid container style={{ paddingBottom: "20px" }}>
            <Grid item xs={6} sm={9}></Grid>

            <Grid item xs={6} sm={3}>
              <Button
                style={{ float: "right" }}
                variant="contained"
                color="primary"
                onClick={this.addnew}
                className={classes.button}
                startIcon={<Add></Add>}
              >
                Add
              </Button>
            </Grid>
          </Grid>
        </div>

        <MUIDataTable
          title={"Users"}
          data={this.state.user}
          columns={columns}
          options={options}
        />
        <div>
          <Dialog
            fullScreen
            open={this.state.open}
            onClose={this.handleClose}
            TransitionComponent={Transition}
          >
            <AppBar className={classes.appBar}>
              <Toolbar>
                <IconButton
                  edge="start"
                  color="inherit"
                  onClick={this.handleClose}
                  aria-label="close"
                >
                  <CloseIcon />
                </IconButton>
                <Typography variant="h6" className={classes.title}>
                  {this.state.Modal_title}
                </Typography>
                <Button autoFocus color="inherit" onClick={this.save}>
                  save
                </Button>
              </Toolbar>
            </AppBar>
            <div style={{ padding: "50px" }}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <CustomInput
                    labelText="First Name"
                    id="Firstname"
                    handler={this.handlechange}
                    value={this.state.single_user[0].Firstname}
                    formControlProps={{
                      fullWidth: true,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <CustomInput
                    labelText="Last Name"
                    id="Lastname"
                    handler={this.handlechange}
                    value={this.state.single_user[0].Lastname}
                    formControlProps={{
                      fullWidth: true,
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <CustomInput
                    labelText="Date of Birth"
                    id="dob"
                    handler={this.handlechange}
                    value={this.state.single_user[0].dob}
                    formControlProps={{
                      fullWidth: true,
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <CustomInput
                    labelText="Position"
                    id="position"
                    handler={this.handlechange}
                    value={this.state.single_user[0].position}
                    formControlProps={{
                      fullWidth: true,
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <CustomInput
                    labelText="Password"
                    id="username"
                    type="password"
                    handler={this.handlechange}
                    value={this.state.single_user[0].username}
                    formControlProps={{
                      fullWidth: true,
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <CustomInput
                    labelText="Username"
                    id="password"
                    handler={this.handlechange}
                    value={this.state.single_user[0].password}
                    formControlProps={{
                      fullWidth: true,
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <CustomInput
                    labelText="Email"
                    id="email"
                    handler={this.handlechange}
                    value={this.state.single_user[0].email}
                    formControlProps={{
                      fullWidth: true,
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <CustomInput
                    labelText="Country"
                    id="country"
                    handler={this.handlechange}
                    value={this.state.single_user[0].country}
                    formControlProps={{
                      fullWidth: true,
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <CustomInput
                    labelText="City"
                    id="city"
                    handler={this.handlechange}
                    value={this.state.single_user[0].city}
                    formControlProps={{
                      fullWidth: true,
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <CustomInput
                    labelText="Description"
                    id="description"
                    handler={this.handlechange}
                    value={this.state.single_user[0].description}
                    formControlProps={{
                      fullWidth: true,
                    }}
                  />
                </Grid>
              </Grid>
            </div>
          </Dialog>
        </div>
        <Snackbar
          place="tr"
          color={this.state.notify_type}
          icon={AddAlert}
          message={this.state.notify_text}
          open={this.state.notify}
          closeNotification={() =>
            this.setState({ notify: false, notify_text: "", notify_type: "" })
          }
          close
        />
      </div>
    );
  }
}

export default withStyles(styles)(TableList);

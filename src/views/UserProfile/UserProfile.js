import React from "react";
// @material-ui/core components
import { withStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardAvatar from "components/Card/CardAvatar.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";

import AddAlert from "@material-ui/icons/AddAlert";
import avatar from "assets/img/faces/marc.jpg";

import Snackbar from "components/Snackbar/Snackbar.js";

const styles = {
  cardCategoryWhite: {
    color: "rgba(255,255,255,.62)",
    margin: "0",
    fontSize: "14px",
    marginTop: "0",
    marginBottom: "0",
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
  },
};
// const useStyles = makeStyles(styles);
//  const classes = useStyles();
//const [tr, setTR] = React.useState(false);

class UserProfile extends React.Component {
  constructor() {
    super();

    this.state = {
      Serial: localStorage.getItem("Serial"),
      FirstName: localStorage.getItem("Firstname"),
      LastName: localStorage.getItem("Lastname"),
      Username: localStorage.getItem("Username"),
      Password: localStorage.getItem("Password"),
      Email: localStorage.getItem("Email"),
      Country: localStorage.getItem("Country"),
      City: localStorage.getItem("City"),
      Position: localStorage.getItem("Position"),
      Description: localStorage.getItem("Description"),
      TextView:
        localStorage.getItem("Firstname") +
        " " +
        localStorage.getItem("Lastname"),
      TextView_description: localStorage.getItem("Description"),
      TextView_position: localStorage.getItem("Position"),
      error: "",
      notify: false,
      notify_text: "",
      notify_type: "",
    };

    this.handlerchange = this.handlerchange.bind(this);
    this.Submitdata = this.Submitdata.bind(this);
    this.showNotification = this.showNotification.bind(this);
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

  Submitdata() {
    const requestOptions = {
      method: "POST",
      body: JSON.stringify(this.state),
    };
    fetch(
      `${process.env.REACT_APP_BASE_URL}ws_updateprofile.php`,
      requestOptions
    )
      .then((response) => response.json())
      .then((data) => {
        localStorage.setItem("Firstname", this.state.FirstName);
        localStorage.setItem("Lastname", this.state.LastName);
        localStorage.setItem("Username", this.state.Username);
        localStorage.setItem("City", this.state.City);
        localStorage.setItem("Country", this.state.Country);
        localStorage.setItem("Password", this.state.Password);
        localStorage.setItem("Description", this.state.Description);
        localStorage.setItem("Position", this.state.Position);
        localStorage.setItem("Email", this.state.Email);

        this.setState({
          TextView: this.state.FirstName + " " + this.state.LastName,
          TextView_description: this.state.Description,
          TextView_position: this.state.Position,
        });

        this.showNotification("Success!", "success");
      })
      .catch((error) => {
        // this.setState({ errorMessage: error.toString() });
        console.error("There was an error!", error);
        this.showNotification("Error!!", "danger");
      });
  }
  handlerchange(event) {
    const { id, value } = event.target;

    this.setState({
      [id]: value,
    });
  }
  render() {
    const { classes } = this.props;

    return (
      <div>
        <GridContainer>
          <GridItem xs={12} sm={12} md={8}>
            <Card>
              <CardHeader color="primary">
                <h4 className={classes.cardTitleWhite}>Edit Profile</h4>
                {/* <p className={classes.cardCategoryWhite}>Complete your profile</p> */}
              </CardHeader>
              <CardBody>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={6}>
                    <CustomInput
                      labelText="First Name"
                      id="FirstName"
                      handler={this.handlerchange}
                      value={this.state.FirstName}
                      formControlProps={{
                        fullWidth: true,
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={6}>
                    <CustomInput
                      labelText="Last Name"
                      id="LastName"
                      handler={this.handlerchange}
                      value={this.state.LastName}
                      formControlProps={{
                        fullWidth: true,
                      }}
                    />
                  </GridItem>
                </GridContainer>
                <GridContainer>
                  {/* <GridItem xs={12} sm={12} md={5}>
                  <CustomInput
                    labelText="Company (disabled)"
                    id="company-disabled"
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      disabled: true
                    }}
                  />
                </GridItem> */}
                  <GridItem xs={12} sm={12} md={4}>
                    <CustomInput
                      labelText="Username"
                      id="Username"
                      handler={this.handlerchange}
                      value={this.state.Username}
                      formControlProps={{
                        fullWidth: true,
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={4}>
                    <CustomInput
                      labelText="Password"
                      id="Password"
                      type="password"
                      handler={this.handlerchange}
                      value={this.state.Password}
                      formControlProps={{
                        fullWidth: true,
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={4}>
                    <CustomInput
                      labelText="Email address"
                      id="Email"
                      handler={this.handlerchange}
                      value={this.state.Email}
                      formControlProps={{
                        fullWidth: true,
                      }}
                    />
                  </GridItem>
                </GridContainer>

                <GridContainer>
                  <GridItem xs={12} sm={12} md={4}>
                    <CustomInput
                      labelText="Country"
                      id="Country"
                      handler={this.handlerchange}
                      value={this.state.Country}
                      formControlProps={{
                        fullWidth: true,
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={4}>
                    <CustomInput
                      labelText="City"
                      id="City"
                      handler={this.handlerchange}
                      value={this.state.City}
                      formControlProps={{
                        fullWidth: true,
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={4}>
                    <CustomInput
                      labelText="Position"
                      id="Position"
                      handler={this.handlerchange}
                      value={this.state.Position}
                      formControlProps={{
                        fullWidth: true,
                      }}
                    />
                  </GridItem>
                </GridContainer>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={12}>
                    <InputLabel style={{ color: "#AAAAAA" }}>
                      About me
                    </InputLabel>
                    <CustomInput
                      labelText="Description"
                      id="Description"
                      handler={this.handlerchange}
                      value={this.state.Description}
                      formControlProps={{
                        fullWidth: true,
                      }}
                      inputProps={{
                        multiline: true,
                        rows: 5,
                      }}
                    />
                  </GridItem>
                </GridContainer>
              </CardBody>
              <CardFooter>
                <Button onClick={this.Submitdata} color="primary">
                  Update Profile
                </Button>
              </CardFooter>
            </Card>
          </GridItem>
          <GridItem xs={12} sm={12} md={4}>
            <Card profile>
              <CardAvatar profile>
                <a href="#pablo" onClick={(e) => e.preventDefault()}>
                  <img src={avatar} alt="..." />
                </a>
              </CardAvatar>
              <CardBody profile>
                <h6 className={classes.cardCategory}>
                  {this.state.TextView_position}
                </h6>
                <h4 className={classes.cardTitle}>{this.state.TextView}</h4>
                <p className={classes.description}>
                  {this.state.TextView_description}
                </p>
                <Button color="primary" round>
                  Follow
                </Button>
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>

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

export default withStyles(styles)(UserProfile);

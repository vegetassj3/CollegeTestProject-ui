import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useLocation } from "react-router-dom";

import {
  TextField,
  useMediaQuery,
  Grid,
  Typography,
  Button,
} from "@material-ui/core";
import {
  forgotPassword,
  clearErrors,
  sendVerificationEmail,
} from "../redux/user/userActions";
import { useSelector, useDispatch } from "react-redux";
import { isEmpty, isPresent } from "../../utils/helper";
import "./auth.css";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}
export default function ForgotPassword({ type }) {
  let query = useQuery();
  const client_email = query.get("email");

  const [email, setEmail] = useState("");
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  let errors = useSelector((state) => state.error);
  const history = useHistory();
  const dispatch = useDispatch();
  useEffect(() => {
    if (!isEmpty(errors)) {
      dispatch(clearErrors());
    }
    if (type === "code") {
      dispatch(sendVerificationEmail(client_email));
    }
  }, [type]);
  if (isAuthenticated) {
    history.push("/");
  }
  const mobile = useMediaQuery("(max-width:600px)");
  let variant = "h4";
  if (mobile) {
    variant = "h6";
  }
  let text = "First, let's find your account";
  if (type === "code") {
    text = "Please enter code in email";
  }

  return (
    <div className="container">
      <Grid container alignItems="center" direction="column">
        <Grid item>
          <Typography variant={variant}>{text}</Typography>
        </Grid>
        <Grid item className="item">
          <TextField
            error={isPresent(errors, type)}
            helperText={isPresent(errors, type) && errors[type]}
            className="textInput"
            color="secondary"
            variant="outlined"
            label={type}
            id={type}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></TextField>
        </Grid>
        <Grid item container justify="center">
          <Grid item>
            <Button
              className="formButton item"
              variant="outlined"
              color="secondary"
              onClick={() => {
                history.push("/Login");
              }}
            >
              Cancel
            </Button>
          </Grid>
          <Grid item>
            {type === "email" && (
              <Button
                className="formButton item"
                variant="contained"
                color="secondary"
                onClick={() => {
                  dispatch(forgotPassword(email, history));
                }}
              >
                Find Account
              </Button>
            )}
            {type === "code" && (
              <div>
                <Button
                  className="formButton item"
                  variant="contained"
                  color="secondary"
                  onClick={() => {
                    dispatch(forgotPassword(history));
                  }}
                >
                  Re-Send Email
                </Button>

                <Button
                  className="formButton item"
                  variant="contained"
                  color="secondary"
                  onClick={() => {
                    dispatch(forgotPassword(history));
                  }}
                >
                  Submit Code
                </Button>
              </div>
            )}
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}
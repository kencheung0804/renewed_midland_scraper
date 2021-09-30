import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Container } from "@material-ui/core";
import NavBar from "./NavBar";

const useStyles = makeStyles((theme) => ({
  container: {
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
  },
}));

type FrameProps = {
  children: JSX.Element | JSX.Element[] | any[];
  modal?: JSX.Element;
};

function Frame({ children, modal }: FrameProps): JSX.Element {
  const classes = useStyles();
  return (
    <React.Fragment>
      <NavBar />
      <Container maxWidth="sm" className={classes.container}>
        {children}
      </Container>
      {modal}
    </React.Fragment>
  );
}

export default Frame;

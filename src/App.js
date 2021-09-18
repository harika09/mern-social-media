import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Modal from "react-modal";
import "./App.css";

/* Pages */
import CreatePost from "./Components/CreatePost/CreatePost";
import Home from "./Components/Index/Home";
import Login from "./Components/Login/Login";
import Register from "./Components/Register/Register";
import Profile from "./Components/Profile/Profile";
import UsersProfile from "./Components/UsersProfile/UsersProfile";
import ViewPost from "./Components/ViewPost/ViewPost";

Modal.setAppElement("#root");
function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/profile" component={Profile} />
        <Route path="/post" component={CreatePost} />
        <Route path="/view/profile/:id" component={UsersProfile} />
        <Route path="/view/post/:id" component={ViewPost} />
      </Switch>
    </Router>
  );
}

export default App;

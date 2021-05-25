import React from "react";
import { Switch, BrowserRouter as Router, Route } from "react-router-dom";
import sketches from "data/sketches";
import Navigation from "components/Navigation";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navigation />
        <Switch>
          {sketches.map((sketch) => (
            <Route exact path={`/${sketch.path}`}>
              {sketch.component}
            </Route>
          ))}
        </Switch>
      </div>
    </Router>
  );
}

export default App;

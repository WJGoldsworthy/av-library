import React from "react";
import { Switch, BrowserRouter as Router, Route } from "react-router-dom";
import sketches from "data/sketches";
import Navigation from "components/Navigation";

function App() {
  return (
    <Router>
      <Navigation />
      <Switch>
        {sketches.map((sketch) => (
          <Route exact path={`/${sketch.path}`}>
            {sketch.component}
          </Route>
        ))}
      </Switch>
    </Router>
  );
}

export default App;

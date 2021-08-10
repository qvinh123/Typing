import './App.css';
import { Switch, Route } from "react-router-dom"
import Home from './screens/Home';
import Typing from "./screens/Typing"

function App() {
  return (
    <div className="App">
        <Switch>
          <Route path="/" exact>
            <Home />
          </Route>
          <Route path="/typing">
            <Typing />
          </Route>
        </Switch>
    </div>
  );
}

export default App;

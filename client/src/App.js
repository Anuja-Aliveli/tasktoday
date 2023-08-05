import { Switch, Route } from "react-router-dom";
import Home from "./components/Home";
import Details from './components/Details'
import "./App.css";

const App = () => (
  <Switch>
    <Route exact path="/" component={Home} />
    <Route exact path="/books/:id" component={Details}/>
  </Switch>
);
export default App;

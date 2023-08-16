// App.js
import './App.css';
import { Home } from './Home';
import { Products } from './Products';
import { Customer } from './Customer';
import { CustomerDetails } from './CustomerDetails';
import { Route, NavLink, BrowserRouter, Switch } from 'react-router-dom';


function App() {
  return (
    <BrowserRouter>
      <div className="App container">
        <h3 className="d-flex justify-content-center m-1">
          React JS Frontend
        </h3>

        <nav className="navbar navbar-expand-sm bg-light navbar-dark">
          <ul className="navbar-nav">
            <li className="nav-item- m-1">
              <NavLink className="btn btn-light btn-outline-primary" to="/Home">
                Home
              </NavLink>
            </li>
            <li className="nav-item- m-1">
              <NavLink className="btn btn-light btn-outline-primary" to="/Products">
                Products
              </NavLink>
            </li>
            <li className="nav-item- m-1">
              <NavLink className="btn btn-light btn-outline-primary" to="/Customer">
                Customer
              </NavLink>
            </li>
            <li className="nav-item- m-1">
              <NavLink className="btn btn-light btn-outline-primary" to="/CustomerDetails">
                CustomerDetails
              </NavLink>
            </li>
          </ul>
        </nav>

        <Switch>
          <Route path="/Home" component={Home} />
          <Route path="/Products" component={Products} />
          <Route path="/Customer" component={Customer} />
          <Route path="/CustomerDetails" component={CustomerDetails} />
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;



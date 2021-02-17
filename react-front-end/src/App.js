import React, {Component} from "react";
import './App.css';

//Using material ui to provide button functionality
import Button from '@material-ui/core/Button';


class App extends Component {
  //Constructor for our App class
  constructor(props) {
    super(props);
    this.state = { apiResponse: "" };
  }


  //These methods simply ask the API whats at the specified endpoints.
  callTestAPI1() {
    fetch("http://localhost:9000/testAPI/test1")
        .then(res => res.text())
        .then(res => this.setState({ apiResponse: res }));
  }

  callTestAPI2() {
    fetch("http://localhost:9000/testAPI/test2")
        .then(res => res.text())
        .then(res => this.setState({ apiResponse: res }));
  }

  //This method is a built in one called before the first render.
  componentWillMount() {
    this.callTestAPI1();
  }

  render() {
    //Return the elements that we want rendered
    return (
      <div className="App">
        {/*This is the response from the API on the backend*/}
        <p className="App-intro">{this.state.apiResponse}</p>

        {/*This is the button that calls the api again. 
        The onClick method allows us to call another method when the button is clicked.*/}
        <Button variant="contained" color="primary" onClick={() => { this.callTestAPI2() }}>Click me</Button>
      </div>
      
    );
  }
}

export default App;

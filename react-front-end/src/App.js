import React, { Component } from "react";
import './App.css';
import Table from 'react-bootstrap/Table'
import Dropdown from 'react-bootstrap/Dropdown'
import Select from 'react-select';
import axios from 'axios'

//Using material ui to provide button functionality
import Button from '@material-ui/core/Button';

class App extends Component {
  //Constructor for our App class
  
constructor(props){
    super(props)
    this.state = {
      selectOptions : [],
      value:[]
    }
  }
  async getOptions(){
    const res = await axios.get('https://jsonplaceholder.typicode.com/users')
    const data = res.data

    const options = data.map(d => ({
      "value" : d.id,
      "label" : d.name

    }))

    this.setState({selectOptions: options})

  }

  handleChange(e){
   this.setState({id:e.value, name:e.label})
  }

  componentDidMount(){
      this.getOptions()
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

            <h1>Matching Engine</h1>
                
                    
          
        {/*This is the button that calls the api again. 
        The onClick method allows us to call another method when the button is clicked.*/}
        <Button variant="contained" color="primary" onClick={() => { this.callTestAPI2() }}>Click me</Button>
            <Dropdown>
                <Dropdown.Toggle variant="success" id="dropdown-basic">
                    Currency
                </Dropdown.Toggle>
                <Dropdown.Menu>
                    <Dropdown.Item href="#/action-1">Japanese Yen</Dropdown.Item>
                    <Dropdown.Item href="#/action-2">Great British Pound</Dropdown.Item>
                    <Dropdown.Item href="#/action-3">United States Dollar</Dropdown.Item>
                    <Dropdown.Item href="#/action-4">Euro</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>#####</th>
                        <th>Side</th>
                        <th>Symbol</th>
                        <th>Security Name</th>
                        <th>Security ID</th>
                        <th>Quantity</th>
                        <th>Broker</th>
                        <th>Avg Px</th>
                        <th>Currency</th>
                        <th>Trade Date</th>
                        <th>Settle Date</th>
                        <th>Status</th>
                        <th>Sub Status</th>
                        <th>Gross Money</th>
                        <th>Net Money</th>
                        <th>Alloc ID</th>
                        <th>Last Modified</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>1</td>
                        <td>SELL</td>
                        <td>Toyota</td>
                        <td>Toyota</td>
                        <td>6900643</td>
                        <td>410,000</td>
                        <td>BROKER2</td>
                        <td>8,183.00</td>
                        <td>JPY</td>
                        <td>Apr 22, 2020</td>
                        <td>Apr 24, 2020</td>
                        <td>MATCHED</td>
                        <td>Exact Match</td>
                        <td>3,355,030,000</td>
                        <td>3,356,036,509</td>
                        <td>loadofrandomnumbers</td>
                        <td>07:20:15</td>
                    </tr>
                    <tr>
                        <td>2</td>
                        <td>SELL</td>
                        <td>UNH</td>
                        <td>United Health</td>
                        <td>sek4vuybgs</td>
                        <td>9,000</td>
                        <td>BROKER2</td>
                        <td>75,183.00</td>
                        <td>USD</td>
                        <td>Apr 22, 2020</td>
                        <td>Apr 24, 2020</td>
                        <td>MATCHED</td>
                        <td>Exact Match</td>
                        <td>355,030,000</td>
                        <td>356,036,509</td>
                        <td>loadofrandomnumbers</td>
                        <td>07:20:16</td>
                    </tr>
                    <tr>
                        <td>3</td>
                        <td>BUY</td>
                        <td>VOD</td>
                        <td>Vodafone</td>
                        <td>56327</td>
                        <td>9,001</td>
                        <td>BROKER2</td>
                        <td>883.00</td>
                        <td>GBP</td>
                        <td>Apr 22, 2020</td>
                        <td>Apr 24, 2020</td>
                        <td>MATCHED</td>
                        <td>Exact Match</td>
                        <td>5,800,000</td>
                        <td>7,579,509</td>
                        <td>loadofrandomnumbers</td>
                        <td>07:20:15</td>
                    </tr>
                    <tr>
                        <td>4</td>
                        <td>BUY</td>
                        <td>MOO</td>
                        <td>Cow Insurance</td>
                        <td>245627856</td>
                        <td>345,651</td>
                        <td>BROKER2</td>
                        <td>8.00</td>
                        <td>EUR</td>
                        <td>Apr 22, 2020</td>
                        <td>Apr 24, 2020</td>
                        <td>MATCHED</td>
                        <td>Exact Match</td>
                        <td>345,654,400</td>
                        <td>345,653,654</td>
                        <td>loadofrandomnumbers</td>
                        <td>07:20:15</td>
                    </tr>

                </tbody>
            </Table>

            <Select options={this.state.selectOptions} onChange={this.handleChange.bind(this)} isMulti />
        {
           this.state.value === null ? "" : this.state.value.map(v => <h4>{v.label}</h4>)
        }

         
      </div>   
    );
  }
}

export default App;

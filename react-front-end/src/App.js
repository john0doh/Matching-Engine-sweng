import React, { Component } from "react";
import './App.css';
import Table from 'react-bootstrap/Table'
import Dropdown from 'react-bootstrap/Dropdown'
import Select from 'react-select';
import axios from 'axios'
import {Form, Field} from 'simple-react-forms';

//Using material ui to provide button functionality
import Button from '@material-ui/core/Button';


class App extends Component {
  //Constructor for our App class

  constructor(props) {
    super(props)
    this.state = {
      selectOptions: [],
      value: [] 
    }
  }
  
  async getOptions(){
    
    console.log("Hello World")
    const res = await axios.get("http://localhost:9000/db/fields")
    console.log(res.statusText)
    const data = res.data

    const options = data.map(d => ({
      "value" : d.value,
      "label" : d.label
  
    }))

    this.setState({selectOptions: options})

  } 
    
  handleChange(e) {
    this.setState({ id: e.value, name: e.label, })
    
   
       
  }   

  componentDidMount() {
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
    let options = this.state.selectOptions

    
   
   
    //Return the elements that we want rendered
    return (

      <div className="App">
        {/*This is the response from the API on the backend*/}
        <p className="App-intro">{this.state.apiResponse}</p>
        <h1 style={{ color: 'black' }}>Matching Engine</h1>
        {/*This is the button that calls the api again. 
        The onClick method allows us to call another method when the button is clicked.*/}
        <Button variant="contained" color="primary" onClick={() => { this.callTestAPI2() }}>Click me</Button>

        <Dropdown>
          <Dropdown.Toggle variant="success" id="dropdown-basic">
            Currency
                </Dropdown.Toggle>
          <ul class="dropdown-menu dropdown-menu-right"></ul>
          <Dropdown.Menu>
              <div class="dropdown-content">

                <Dropdown.Item href="#/action-1">Japanese Yen</Dropdown.Item>
                <Dropdown.Item href="#/action-2">Great British Pound</Dropdown.Item>
                <Dropdown.Item href="#/action-3">United States Dollar</Dropdown.Item>
                <Dropdown.Item href="#/action-4">Euro</Dropdown.Item>
              </div>
          </Dropdown.Menu>
        </Dropdown>
       
        <Form ref='simpleForm'>
          <Field
            name='city'
            label='Select category to match:'
            element= {
              <Select className = 'select'
                options={this.state.selectOptions}
                valueAccessor={(selectedValue) => selectedValue.id}
                onChange = {
                 
                  <div>
                    
                  <input className = 'input' type="text" name="name" />
                  <input type="submit" value="Submit" />

                  </div>
                }

              isMulti/>
            }
            
          />
           
           <input className = 'input' type="text" name="name" />
           <input type="submit" value="Submit" />
           
            
      </Form>

      </div>
      

   
    );
  }
}

export default App;
  
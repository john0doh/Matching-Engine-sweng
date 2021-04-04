import React, { Component } from "react";
import './App.css';
import Table from 'react-bootstrap/Table'
import Dropdown from 'react-bootstrap/Dropdown'
import Select from 'react-select';
import axios from 'axios'
import 'react-bootstrap-table/css/react-bootstrap-table.css';




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

    const res = await axios.get("http://localhost:9000/db/fields")
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

  handleText(event){
    this.setState({MyText: event.target.value})
    
  }

  async handleSubmit(e) {
    
    e.preventDefault()
    const result = await axios.get('http://localhost:9000/db/match/'+  this.state.name + '.eq.'+ this.state.MyText)
    const res = result.data
    this.setState({hasLoaded:true, results:res})
      
  }

  render() {  
    let options = this.state.selectOptions
     
    if(this.state.hasLoaded){
      return(
        
         <Table striped bordered hover>
           <thead>
           <tr style={{ color: 'black' }}>
              <th>Title</th>
              <th>Genre</th>
              <th>Awards</th>
              <th>Rated</th>
              <th>Year</th>
             
          
            </tr>

           </thead>
           <tbody>

          {
          
          this.state.results.map((text, index)=>{
            return(
              <tr style={{ color: 'black' }}>
                <td>{text.title} </td>
                <td>{text.genres} </td>
                <td>{text.awards.text} </td>
                <td>{text.rated} </td>
                <td>{text.year} </td>
              
              </tr>
            );
            }) 
          }
          </tbody>
        </Table>
      );
    }
   
   
    //Return the elements that we want rendered
    return (

      <div className="App">  
        {/*This is the response from the API on the backend*/}
        <p className="App-intro">{this.state.apiResponse}</p>
        <h1 style={{ color: 'black' }}>Matching Engine</h1>
        

       
          
        <form onSubmit = {this.handleSubmit.bind(this)}>
             
                  <Select
                    className = 'select'
                    options={options}
                    valueAccessor={(selectedValue) => selectedValue.label}
                    onChange = {this.handleChange.bind(this)}
                  />
                
              
              
                <input className = 'input' placeholder = '  Enter..... 'type = 'text' name = 'name' value = {this.state.MyText} onChange = {this.handleText.bind(this)} />
                
                <input className = 'button' type = 'submit' value = 'Submit' />
             
        </form>


      </div>
      

   
    );
  }
}

export default App;
  
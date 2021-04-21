import React, { Component } from "react";
import './App.css';
import Table from 'react-bootstrap/Table'

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

  handleMulti(event){
    if(event.label === "Multiple and" || event.label === "Multiple or"){
      this.setState({isMulti:true, op:event.value})
    }
    
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

  handleClick(event){
    this.setState({isResolve: true})
    
  }

  handleTolerance(event){
    this.setState({MyTolerance: event.target.value, isTolerance:true})
    
  }

  async handleSubmit(e) {
    
    e.preventDefault()
    var result;
    
    
    if(this.state.isMulti){

      switch(this.state.op){
        case 'or':
          result = await axios.get("http://localhost:9000/db/or/" + this.state.name + ".eq." + this.state.MyText)
        break

        case 'and':
          result = await axios.get("http://localhost:9000/db/and/" + this.state.name + ".eq." + this.state.MyText)
        break


          default:
      }
      

      if(this.state.isResolve){
        result = await axios.get("http://localhost:9000/db/match/resolve")
        const res = result.data
        console.log(res)
        this.setState({hasLoaded:true, results:res})
      }

    }
    else{

    if(this.state.isTolerance){
      result = await axios.get("http://localhost:9000/db/match/"+ this.state.name + ".eq."+ this.state.MyText + "/?atol=" + this.state.MyTolerance)

    

    }
    else{
      switch(this.state.MyText.charAt(0)){
        case '<':
          result = await axios.get('http://localhost:9000/db/match/'+  this.state.name + '.lt.'+ this.state.MyText.substring(1, this.state.MyText.length))
        break
        case '>':
          result = await axios.get('http://localhost:9000/db/match/'+  this.state.name + '.gt.'+ this.state.MyText.substring(1, this.state.MyText.length))
        break
          default:
            result = await axios.get('http://localhost:9000/db/match/'+  this.state.name + '.eq.'+ this.state.MyText)
  
      }
      const res = result.data
      console.log(res)
      this.setState({hasLoaded:true, results:res})

    }
  }
    

      
  }

  render() {  
    let options = this.state.selectOptions
    let options1 = [
      { value: 'and', label: 'Multiple and' },
      { value: 'or', label: 'Multiple or' },
      { value: 'Single', label: 'Single' },
     
    ]
     
    if(this.state.hasLoaded){
      return(
        
         <Table striped bordered hover id="customers">
           <thead>
           <tr style={{ color: 'black' }}>
              <th class = "left">Title </th>
              <th class = "left">Genre</th>
              <th class = "left">Awards</th>
              <th class = "left">Rated</th>
              <th class = "left">Year</th>
             
          
            </tr>

           </thead>
           <tbody>

          {
          
          
          this.state.results.map((text, index)=>{
            return(
              <tr class = "alt"style={{ color: 'black' }}>
                <td class = "box">{text.title} </td> 
                <td class = "box">{text.genres} </td>
                <td class = "box">{text.awards.text} </td>
                <td class = "box">{text.runtime} </td>
                <td class = "box">{text.year} </td>
              
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
        
        <h1 class = "title">Matching Engine</h1>
        <form onSubmit = {this.handleSubmit.bind(this)}>

                  
                   <Select
                    className = 'select'
                    options={options1}
                    valueAccessor={(selectedValue) => selectedValue.label}
                    onChange = {this.handleMulti.bind(this)}
                  />
                  <Select
                    className = 'select'
                    options={options}
                    valueAccessor={(selectedValue) => selectedValue.label}
                    onChange = {this.handleChange.bind(this)}
                  />
                 
                  
                <input className = 'input' placeholder = '  Enter..... 'type = 'text' name = 'name' value = {this.state.MyText} onChange = {this.handleText.bind(this)} />
                <input className = 'input' placeholder = '  Tolerance... 'type = 'text' name = 'name' value = {this.state.MyTolerance} onChange = {this.handleTolerance.bind(this)} />
                <input className = 'button' type = 'submit' value = 'Resolve' onClick = {this.handleClick.bind(this)} />
                <input className = 'button' type = 'submit' value = 'Submit' />
             
        </form>

        <div class="topnav">    
      <a href="https://www.finbourne.com/about">About Us</a>
      <a href="https://www.finbourne.com/lusid">LUSID</a>
      <a href="https://www.finbourne.com/careers">Join Us</a>
      <a href="https://www.finbourne.com/blog">Blog</a>
      <a href="https://www.finbourne.com/events">Events</a>
      <a href="https://www.finbourne.com/contact">Contact Us</a>
      </div>
       
      
      </div>
     
      
    

   
    );
  }
}

export default App;

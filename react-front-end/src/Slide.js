import React, {Component} from "react";

import './App.css';
import Select from 'react-select'
import axios from 'axios'
import { render } from "react-dom";



class Slide extends Component {

  constructor(props){
    super(props)
    this.state = {
      selectOptions : [],
      value: []
    }
  }

  
  async getOptions(){
    const res = await axios.get('https://jsonplaceholder.typicode.com/users')
    const data = res.data

    var ca = []
    for(var i=0; i<data.length; i++){
      ca[i] = data[i]
    }

    const options = data.map(d =>({
      "value" : d.id,
      "label" : d
 
    }))

    this.setState({selectOptions: options})

  }

  handleChange(e){
   this.setState({value: e})
  }

  componentDidMount(){
      this.getOptions()
  }
  
  
}
render(


)


 

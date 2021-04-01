import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Select from 'react-select'
import  { Component } from "react";


const SelectButton = [
  {
    component: "SelectButton",
    children: []
  }
];

class but extends Component{

async getOptions(){
  

}
}

export default function App() {
  return (
    <div className="App">
      <div className="card-container">
        {SelectButton}
      </div>
    </div>
  );
}
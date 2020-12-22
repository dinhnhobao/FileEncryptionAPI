import React, { Component } from 'react';
import './app.css';

export default class App extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <div style={{fontWeight: 'bold'}}> Encrypt </div>
        <div>
          <form id="form-encrypt" action="/api/encrypt" method="post" encType="multipart/form-data">
            File <input type="file" name="file" />
          </form>
        </div>
        <div onClick={() => { document.getElementById("form-encrypt").submit() }}> Submit </div>
        <br></br>
        <div style={{fontWeight: 'bold'}}> Decrypt </div>
        <div>
          <form id="form-decrypt" action="/api/decrypt" method="post">
            Filename <input type="text" name="filename" />
            Password <input type="text" name="password" />
          </form>
        </div>
        <div onClick={() => { document.getElementById("form-decrypt").submit() }}> Submit </div>
      </div>
    );
  }
}

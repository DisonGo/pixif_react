import React, {Component} from 'react';
import './MainHeader.scss'
import dogGif from '../../preloader.gif'
import {
  Link
} from "react-router-dom";

class MainHeader extends Component {
    render() {
      return (
        <div className="component-main-header">
          <div className='headerContainer large-box'>
            <Link to={"/"} className="header-button" id='Logo'>
                <img src={dogGif} alt="Logo" />
                <div>Pixif</div>
            </Link>
            <div className="container">
              <Link to={"/editor"} className="header-button" id='NewArtBut'>New art</Link>
            </div>
          </div>
        </div>
      );
    }
  }
export default MainHeader
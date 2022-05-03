import EditorPage from 'components/EditorPage';
import MainPage from 'components/MainPage';
import { Component } from 'react';
import {  
  BrowserRouter as Router,
  Route,
  Routes,
} from 'react-router-dom';
import './App.css';

class App extends Component{
  render(){
    return (
      <div>
        <Router>
          <Routes>
            <Route path='/' element={<MainPage />}/>
            <Route path='/editor/*' element={<EditorPage />}/>
          </Routes>
        </Router>
      </div>
    );
  }
}


export default App;

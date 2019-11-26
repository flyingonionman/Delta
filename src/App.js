import React from 'react';
import './App.scss';
import 'bootstrap/dist/css/bootstrap.min.css';

class App extends React.Component {
  render() {
  return (
    <div className="App" >    
      <div className="navigation">
      <ul>
        <li><a href="#home">Home</a></li>
        <li><a href="#news">News</a></li>
        <li><a href="#contact">Contact</a></li>
        <li><a href="#about">About</a></li>
      </ul>

      </div>
      <div className="content">
        <div className="picture">
            <img src="https://scontent-lga3-1.xx.fbcdn.net/v/t1.0-9/75199760_2668333133223417_2342838246888701952_n.jpg?_nc_cat=100&_nc_ohc=fvOyMs2mwKgAQm-SisQ-SrZeN-aXTjR0iX60LEut6jK9q3NQsORe9IVwA&_nc_ht=scontent-lga3-1.xx&oh=f3d7471dbe4bf8bcc8cb9c534eca617d&oe=5E85DCCB"/>

        </div>
        <div className="description">
        
        <h1>Recent Projects</h1>
        <ul class="list-unstyled">
          <li class="media">
            <img src="https://image.flaticon.com/icons/svg/120/120845.svg"   width="64" height="64" class="mr-3" alt="bert"></img>
            <div class="media-body">
              <h5 class="mt-0 mb-1">Drop Blocks</h5>
              Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis. Fusce condimentum nunc ac nisi vulputate fringilla. Donec lacinia congue felis in faucibus.
            </div>
          </li>

          <li class="media">
            <img src="https://image.flaticon.com/icons/svg/120/120845.svg"   width="64" height="64" class="mr-3" alt="bert"></img>
            <div class="media-body">
              <h5 class="mt-0 mb-1">List-based media object</h5>
              Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis. Fusce condimentum nunc ac nisi vulputate fringilla. Donec lacinia congue felis in faucibus.
            </div>
          </li>

          <li class="media">
            <img src="https://image.flaticon.com/icons/svg/120/120845.svg"   width="64" height="64" class="mr-3" alt="bert"></img>
            <div class="media-body">
              <h5 class="mt-0 mb-1">List-based media object</h5>
              Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis. Fusce condimentum nunc ac nisi vulputate fringilla. Donec lacinia congue felis in faucibus.
            </div>
          </li>
          
          
        </ul>
        </div>
      </div>    
     
    </div>
    );
  }
}

export default App;

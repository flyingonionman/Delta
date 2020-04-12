import React from 'react';
import '../App.scss';
import 'bootstrap/dist/css/bootstrap.min.css';

class Home extends React.Component {
  render() {
  return (

    <div className="App" >    
      <div className="navigation">
      <ul>
        <li><a href="#home">Home</a></li>
        <li><a href="#news">News</a></li>
        <li><a href="#contact">Contact</a></li>
        <li><a href="#about">WEBSITE CURRENTLY UNDER CONSTRUCTION</a></li>
      </ul>

      </div>
      <div className="content">
        <div className="picture">
             <img src="https://scontent-lga3-1.xx.fbcdn.net/v/t1.0-9/75199760_2668333133223417_2342838246888701952_n.jpg?_nc_cat=100&_nc_ohc=fvOyMs2mwKgAQm-SisQ-SrZeN-aXTjR0iX60LEut6jK9q3NQsORe9IVwA&_nc_ht=scontent-lga3-1.xx&oh=f3d7471dbe4bf8bcc8cb9c534eca617d&oe=5E85DCCB"/>

        </div>
        <div className="description">

        <h1>Projects 2020 Spring</h1>
        
        <ul class="list-unstyled">
    
          <li class="media">
            <div class="media-body">
              <h5 class="mt-0 mb-1">Machine learning with architecture </h5>
            </div>
          </li>

          <li class="media">
            <img src="https://image.flaticon.com/icons/svg/120/120845.svg"   width="64" height="64" class="mr-3" alt="bert"></img>
            <div class="media-body">
              <h5 class="mt-0 mb-1">Data science for unfair bail bonds </h5>
            </div>
          </li>

          <li class="media">
            <img src="https://image.flaticon.com/icons/svg/120/120845.svg"   width="64" height="64" class="mr-3" alt="bert"></img>
            <div class="media-body">
              <h5 class="mt-0 mb-1">Poster design for tax abatement </h5>
            </div>
          </li>

          <li class="media">
            <img src="https://image.flaticon.com/icons/svg/120/120845.svg"   width="64" height="64" class="mr-3" alt="bert"></img>
            <div class="media-body">
              <h5 class="mt-0 mb-1">Baby monitoring device project</h5>
              Done as an electrical engineering final project.
            </div>
          </li>

          <li class="media">
            <img src="https://image.flaticon.com/icons/svg/120/120845.svg"   width="64" height="64" class="mr-3" alt="bert"></img>
            <div class="media-body">
              <h5 class="mt-0 mb-1">UNION web journal design / programming</h5>
              Done as an electrical engineering final project.
            </div>
          </li>
        </ul>
        
        
        <h1>Projects 2019 Winter</h1>
        <ul class="list-unstyled">
          <li class="media">
            <img src="https://image.flaticon.com/icons/svg/120/120845.svg"   width="64" height="64" class="mr-3" alt="bert"></img>
            <div class="media-body">
              <h5 class="mt-0 mb-1">A small study on BERT</h5>
              KEK
            </div>
          </li>
          
          <li class="media">
            <img src="https://image.flaticon.com/icons/svg/120/120845.svg"   width="64" height="64" class="mr-3" alt="bert"></img>
            <div class="media-body">
              <h5 class="mt-0 mb-1">Drop Blocks</h5>
              Implemented Dropblocks in resnet-50 according to <a href="https://arxiv.org/abs/1810.12890">this article</a>. 
              <a href="https://github.com/ArianaFreitag/cgml-midterm">Source code</a>.
            </div>
          </li>

          <li class="media">
            <img src="https://image.flaticon.com/icons/svg/120/120845.svg"   width="64" height="64" class="mr-3" alt="bert"></img>
            <div class="media-body">
              <h5 class="mt-0 mb-1">Graphic design portfolio</h5>
              I know how to use the illustrator a little bit. My sense of color is a bit off but I do what I can do.
            </div>
          </li>

          <li class="media">
            <img src="https://image.flaticon.com/icons/svg/120/120845.svg"   width="64" height="64" class="mr-3" alt="bert"></img>
            <div class="media-body">
              <h5 class="mt-0 mb-1">Runescape Hi-score parser</h5>
              <a href="https://github.com/flyingonionman/ECE-464-1-Databases/tree/master/pset2">Github Link</a>

            </div>
          </li>
        </ul>

        </div>

      </div>    
       
    </div>
    );
  }
}

export default Home;

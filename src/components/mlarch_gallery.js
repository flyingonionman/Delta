import React, { Component } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import {Carousel} from 'react-bootstrap';
import '../css/gallery.scss';
import GridLayout from 'react-grid-layout';

function importAll(r) {
  console.log(r.keys())
  let images = {};
  r.keys().map((item, index) => { images[item.replace('./', '')] = r(item); });
  return images;
}


const images = importAll(require.context('../images', false, /\.(png|jpe?g|svg)$/));


class Mlarch extends React.Component {
 

  render() {
    const layout = [
      {i: 'a', x: 0, y: 0, w: 2, h: 2, static: true},
      {i: 'b', x: 2, y: 0, w: 2, h: 2, static: true},
      {i: 'c', x: 4, y: 0, w: 2, h: 2, static: true},
    ];


    return (
      <div className ="gallery">

        <GridLayout className="layout" layout={layout} cols={12} rowHeight={30} width={1200}>
          <div key="a">            <img src={images['sparks3.jpg']} class="card-img-top" alt="..."/></div>
          <div key="b">  <img src={images['sparks2.jpg']} class="card-img-top" alt="..."/></div>
          <div key="c">  <img src={images['sparks.jpg']} class="card-img-top" alt="..."/></div>
        </GridLayout>

      </div>
    );
  }
}

export default Mlarch;

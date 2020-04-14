import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/gallery.scss';
import RGL, { WidthProvider } from "react-grid-layout";
import _ from "lodash";

const ReactGridLayout = WidthProvider(RGL);


function importAll(r) {
  let images = {};
  r.keys().map((item, index) => { images[item.replace('./', '')] = r(item); });

  return images;
}


const images = importAll(require.context('../images', false, /\.(png|jpe?g|svg)$/));


class Mlarch extends React.Component {
  static defaultProps = {
    className: "layout",
    items: 20,
    rowHeight: 30,
    onLayoutChange: function() {},
    cols: 7
  };

  constructor(props) {
    super(props);

    const layout = this.generateLayout();
    this.state = { layout };
  }

  generateDOM() {
    return _.map(_.range(this.props.items), function(i) {
      return (
        <div className="slot" key={i}>
          <span><img src={images["p"+i+".png"]}/></span>
        </div>
      );
    });
  }

  generateLayout() {
    const p = this.props;
    return _.map(new Array(p.items), function(item, i) {
      const y = 4;
      return {
        x: (i ) % 7,
        y: Math.floor(i / 7) * y,
        w: 1,
        h: y,
        i: i.toString(),
        static: false
      };
    });
  }


  render() {


    return (
      <div className ="gallery">

        <ReactGridLayout className="layout" 
            layout={this.state.layout}
            onLayoutChange={this.onLayoutChange}
            {...this.props}
          >
            {this.generateDOM()}
        </ReactGridLayout>

      </div>
    );
  }
}

export default Mlarch;

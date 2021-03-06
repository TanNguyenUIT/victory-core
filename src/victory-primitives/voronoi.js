/*eslint no-magic-numbers: ["error", { "ignore": [2] }]*/
import React from "react";
import PropTypes from "prop-types";
import { isObject, uniqueId } from "lodash";
import Helpers from "../victory-util/helpers";
import CommonProps from "./common-props";
import ClipPath from "../victory-primitives/clip-path";
import Path from "../victory-primitives/path";
import Circle from "../victory-primitives/circle";


export default class Voronoi extends React.Component {
  static propTypes = {
    ...CommonProps,
    circleComponent: PropTypes.element,
    clipId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    clipPathComponent: PropTypes.element,
    datum: PropTypes.object,
    groupComponent: PropTypes.element,
    pathComponent: PropTypes.element,
    polygon: PropTypes.array,
    size: PropTypes.number,
    x: PropTypes.number,
    y: PropTypes.number
  };

  static defaultProps = {
    pathComponent: <Path/>,
    circleComponent: <Circle/>,
    clipPathComponent: <ClipPath/>,
    groupComponent: <g/>
  }

  constructor(props) {
    super(props);
    this.clipId = !isObject(props) || props.clipId === undefined ?
      uniqueId("voronoi-clip-") : props.clipId;
  }

  getVoronoiPath(props) {
    const { polygon } = props;
    return Array.isArray(polygon) && polygon.length ?
      `M ${props.polygon.join("L")} Z` : "";
  }

  render() {
    const {
      datum, active, role, shapeRendering, className, events, x, y, transform,
      pathComponent, clipPathComponent, groupComponent, circleComponent
    } = this.props;
    const voronoiPath = this.getVoronoiPath(this.props);
    const style = Helpers.evaluateStyle(this.props.style, datum, active);
    const size = Helpers.evaluateProp(this.props.size, datum, active);

    if (size) {
      const circle = React.cloneElement(circleComponent, {
        key: "circle", style, className, role, shapeRendering, events,
        clipPath: `url(#${this.clipId})`, cx: x, cy: y, r: size
      });
      const voronoiClipPath = React.cloneElement(
        clipPathComponent,
        { key: "voronoi-clip", clipId: this.clipId },
        React.cloneElement(pathComponent, { d: voronoiPath, className })
      );
      return React.cloneElement(groupComponent, {}, [voronoiClipPath, circle]);
    }
    return React.cloneElement(pathComponent, {
      style, className, d: voronoiPath, role, shapeRendering, events, transform
    });
  }
}

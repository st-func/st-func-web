import React from "react";
import { SecBuildBox, SecFlatBar, SecRoundBar } from "@st-func/st-func-ts";

class Point {
  x: number;
  y: number;
  x_screen: number;
  y_screen: number;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.x_screen = x;
    this.y_screen = y;
  }
}

class LineData {
  points: Point[];
  constructor(...points: Point[]) {
    this.points = points;
  }
  pointPairs(): [Point, Point][] {
    let result: [Point, Point][] = [];
    for (let i = 0; i < this.points.length - 1; i++) {
      result.push([this.points[i], this.points[i + 1]]);
    }
    return result;
  }
}
class CircleData {
  point: Point;
  diameter: number;
  diameter_screen: number;
  constructor(point: Point, diameter: number) {
    this.point = point;
    this.diameter = diameter;
    this.diameter_screen = diameter;
  }
  radius(): number {
    return this.diameter / 2;
  }
  radius_screen(): number {
    return this.diameter_screen / 2;
  }
}

export class DrawingData {
  points: Point[] = [];
  lines: LineData[] = [];
  circles: CircleData[] = [];
  scale: number = 1;
  origin: Point = new Point(0, 0);
  width: number = 500;
  height: number = 500;
  addLine(line: LineData): void {
    this.lines.push(line);
    for (let point of line.points) {
      if (!this.points.includes(point)) {
        this.points.push(point);
      }
    }
  }
  addCircle(circle: CircleData): void {
    this.circles.push(circle);
    if (!this.points.includes(circle.point)) {
      this.points.push(circle.point);
    }
  }
  setScreenCoordinate(): void {
    for (let point of this.points) {
      point.x_screen =
        this.origin.x_screen + (point.x - this.origin.x) * this.scale;
      point.y_screen =
        this.origin.y_screen + (point.y - this.origin.y) * this.scale;
    }
    for (let circle of this.circles) {
      circle.diameter_screen = circle.diameter * this.scale;
    }
  }
  setAutoScale(): void {
    if (this.points.length === 0) {
      return;
    }
    let max_x = Math.max(
      ...this.points.map((point) => point.x),
      ...this.circles.map((ciecle) => ciecle.point.x + ciecle.radius())
    );
    let min_x = Math.min(
      ...this.points.map((point) => point.x),
      ...this.circles.map((ciecle) => ciecle.point.x - ciecle.radius())
    );
    let max_y = Math.max(
      ...this.points.map((point) => point.y),
      ...this.circles.map((ciecle) => ciecle.point.y + ciecle.radius())
    );
    let min_y = Math.min(
      ...this.points.map((point) => point.y),
      ...this.circles.map((ciecle) => ciecle.point.y - ciecle.radius())
    );
    let dx = max_x - min_x;
    let dy = max_y - min_y;
    this.origin.x = min_x + dx / 2;
    this.origin.y = min_y + dy / 2;
    this.origin.x_screen = this.width / 2;
    this.origin.y_screen = this.height / 2;
    if (dx === 0 && dy === 0) {
      this.scale = 1;
    } else {
      let scale_x = Number.MAX_SAFE_INTEGER;
      if (dx !== 0) {
        scale_x = (this.width * 0.95) / dx;
      }
      let scale_y = Number.MAX_SAFE_INTEGER;
      if (dy !== 0) {
        scale_y = (this.height * 0.95) / dy;
      }
      this.scale = Math.min(scale_x, scale_y);
    }
  }
  getScaleDisplay(): string {
    const px: number = (25.4e-3 / 96) * window.devicePixelRatio;
    const tmpScale: number = this.scale * px;
    if (tmpScale > 0.5) {
      return "x" + tmpScale.toFixed(1);
    } else {
      return "1/" + (1 / tmpScale).toFixed(0);
    }
  }
}

interface DrawingProps {
  drawingData: DrawingData;
}

export const Drawing: React.FC<DrawingProps> = ({ drawingData }) => {
  drawingData.setScreenCoordinate();
  return (
    <svg width={drawingData.width} height={drawingData.height}>
      {drawingData.lines.map((line) => {
        return line.pointPairs().map(([point1, point2]) => {
          if (
            isNaN(point1.x_screen) ||
            isNaN(point1.y_screen) ||
            isNaN(point2.x_screen) ||
            isNaN(point2.y_screen)
          ) {
            return null;
          } else {
            return (
              <line
                x1={point1.x_screen}
                y1={point1.y_screen}
                x2={point2.x_screen}
                y2={point2.y_screen}
                stroke="black"
                key={Math.random()}
              />
            );
          }
        });
      })}
      {drawingData.circles.map((circle) => {
        if (
          isNaN(circle.point.x_screen) ||
          isNaN(circle.point.y_screen) ||
          isNaN(circle.diameter_screen)
        ) {
          return null;
        } else {
          return (
            <circle
              cx={circle.point.x_screen}
              cy={circle.point.y_screen}
              r={circle.radius_screen()}
              fill="none"
              stroke="black"
              key={Math.random()}
            />
          );
        }
      })}
    </svg>
  );
};

export function flatBarDrawing(secFlatBar: SecFlatBar): DrawingData {
  const points: Point[] = [];
  points.push(new Point(0, 0));
  points.push(new Point(secFlatBar.t, 0));
  points.push(new Point(secFlatBar.t, secFlatBar.b));
  points.push(new Point(0, secFlatBar.b));
  points.push(points[0]);
  const result: DrawingData = new DrawingData();
  result.addLine(new LineData(...points));
  return result;
}

export function buildBoxDrawing(secBuildBox: SecBuildBox): DrawingData {
  const result: DrawingData = new DrawingData();
  let points: Point[] = [];
  points.push(new Point(0, 0));
  points.push(new Point(secBuildBox.b, 0));
  points.push(new Point(secBuildBox.b, secBuildBox.a));
  points.push(new Point(0, secBuildBox.a));
  points.push(points[0]);
  result.addLine(new LineData(...points));
  points = [];
  points.push(new Point(secBuildBox.t2, secBuildBox.t1));
  points.push(new Point(secBuildBox.b - secBuildBox.t2, secBuildBox.t1));
  points.push(
    new Point(secBuildBox.b - secBuildBox.t2, secBuildBox.a - secBuildBox.t1)
  );
  points.push(new Point(secBuildBox.t2, secBuildBox.a - secBuildBox.t1));
  points.push(points[0]);
  result.addLine(new LineData(...points));
  return result;
}
export function roundBarDrawing(secRoundBar: SecRoundBar): DrawingData {
  const result: DrawingData = new DrawingData();
  result.addCircle(new CircleData(new Point(0, 0), secRoundBar.r));
  return result;
}

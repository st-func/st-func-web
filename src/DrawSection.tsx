import React from "react";
import { SecFlatBar } from "@st-func/st-func-ts";
import { Unit } from "@st-func/st-func-ts";
export class LineData {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  constructor(x1: number, y1: number, x2: number, y2: number) {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
  }
}
export interface DrawLinesProps {
  width: number;
  height: number;
  lines: LineData[];
}
export const DrawLines: React.FC<DrawLinesProps> = ({
  width,
  height,
  lines,
}) => {
  return (
    <svg width={width} height={height}>
      {lines.map((line) => {
        return (
          <line
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            stroke="black"
          />
        );
      })}
    </svg>
  );
};

export function flatBarLines(secFlatBar: SecFlatBar): LineData[] {
  const lines: LineData[] = [];
  const t = Unit.output(secFlatBar.t, "mm");
  const b = Unit.output(secFlatBar.b, "mm");
  lines.push(new LineData(0, 0, t, 0));
  lines.push(new LineData(t, 0, t, b));
  lines.push(new LineData(t, b, 0, b));
  lines.push(new LineData(0, b, 0, 0));
  return lines;
}

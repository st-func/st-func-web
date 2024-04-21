import React, { useState } from "react";
import {
  SecBuildBox,
  SecFlatBar,
  SecPropertyType,
  SecRoundBar,
  SecShapeType,
  SecSteel,
} from "@st-func/st-func-ts";
import { Unit } from "@st-func/st-func-ts";
import {
  Drawing,
  DrawingData,
  buildBoxDrawing,
  flatBarDrawing,
  roundBarDrawing,
} from "./DrawSection";

interface CalcData {
  secPropertyType: SecPropertyType;
  symbol: string;
  description: string;
  unit: string;
  result: number | undefined;
  fractionDigits: number;
}

interface CalcDataProps {
  calcDatas: CalcData[];
}
const ResultTable: React.FC<CalcDataProps> = ({ calcDatas }) => (
  <table>
    <tbody>
      {calcDatas.map((calcData) => {
        if (calcData.result === undefined || isNaN(calcData.result)) {
          return null;
        } else {
          return (
            <tr key={calcData.symbol}>
              <td>{calcData.description}</td>
              <td>{calcData.symbol}</td>
              <td>=</td>
              <td>
                {Number(
                  calcData.result?.toFixed(calcData.fractionDigits)
                ).toString()}
                &nbsp;
                {calcData.unit}
              </td>
            </tr>
          );
        }
      })}
    </tbody>
  </table>
);

interface DimensionData {
  value: string;
  setNewNum: (value: string) => void;
  symbol: string;
  unit: string;
  description: string;
}
interface DimensionDataProps {
  dimensionDatas: DimensionData[];
  calculation: () => void;
}
const InputTable: React.FC<DimensionDataProps> = ({
  dimensionDatas,
  calculation,
}) => (
  <table>
    <tbody>
      {dimensionDatas.map((dimension, index) => (
        <tr key={index}>
          <td>{dimension.symbol}</td>
          <td>:</td>
          <td>
            <input
              type="number"
              value={dimension.value}
              onChange={(e) => {
                dimension.setNewNum(e.target.value);
                calculation();
              }}
            />
            {dimension.unit}
          </td>
          <td>({dimension.description})</td>
        </tr>
      ))}
    </tbody>
  </table>
);

const SecProperty: React.FC = () => {
  const [calcMode, setCalcMode] = useState<SecShapeType>(SecShapeType.FlatBar);
  const [num1, setNum1] = useState("");
  const [num2, setNum2] = useState("");
  const [num3, setNum3] = useState("");
  const [num4, setNum4] = useState("");
  const [result, setResult] = useState<CalcData[] | undefined>(undefined);
  const [drawing, setDrawing] = useState<DrawingData | undefined>(undefined);
  const nums: string[] = [num1, num2, num3, num4];
  const setNums: React.Dispatch<React.SetStateAction<string>>[] = [
    setNum1,
    setNum2,
    setNum3,
    setNum4,
  ];
  const newNums: (string | undefined)[] = [
    undefined,
    undefined,
    undefined,
    undefined,
  ];
  const setNewNum = (index: number, value: string) => {
    newNums[index] = value;
    setNums[index](value);
  };
  const getNum = (index: number) =>
    Unit.input(parseFloat(newNums[index] ?? nums[index]), "mm");
  const getDimensions = () => {
    let parameters: [string, string][];
    switch (calcMode) {
      default:
        throw new Error(calcMode + "は対応していない断面形状です。");
      case SecShapeType.BuildBox:
        parameters = [
          ["A", "成"],
          ["B", "幅"],
          ["t1", "成方向の板厚"],
          ["t2", "幅方向の板厚"],
        ];
        break;
      case SecShapeType.FlatBar:
        parameters = [
          ["B", "幅"],
          ["t", "板厚"],
        ];
        break;
      case SecShapeType.RoundBar:
        parameters = [["R", "直径"]];
        break;
    }
    return parameters.map((array, index) => ({
      value: nums[index],
      setNewNum: (value: string) => setNewNum(index, value),
      symbol: array[0],
      unit: "mm",
      description: array[1],
    }));
  };
  const calculation = () => {
    let secSteel: SecSteel;
    let drawing: DrawingData | undefined;
    switch (calcMode) {
      case SecShapeType.BuildBox:
        const secBuildBox: SecBuildBox = new SecBuildBox();
        secBuildBox.setDimensions(getNum(0), getNum(1), getNum(2), getNum(3));
        secSteel = secBuildBox;
        drawing = buildBoxDrawing(secBuildBox);
        break;
      case SecShapeType.FlatBar:
        const secFlatBar: SecFlatBar = new SecFlatBar();
        secFlatBar.setDimensions(getNum(0), getNum(1));
        secSteel = secFlatBar;
        drawing = flatBarDrawing(secFlatBar);
        break;
      case SecShapeType.RoundBar:
        const secRoundBar: SecRoundBar = new SecRoundBar();
        secRoundBar.setDimensions(getNum(0));
        secSteel = secRoundBar;
        drawing = roundBarDrawing(secRoundBar);
        break;
      default:
        secSteel = new SecSteel();
        break;
    }
    if (drawing !== undefined) {
      drawing.setAutoScale();
    }
    setDrawing(drawing);
    let calcDatas: CalcData[] = [
      {
        secPropertyType: SecPropertyType.Area,
        symbol: "A",
        description: "断面積",
        unit: "mm^2",
        result: undefined,
        fractionDigits: 1,
      },
      {
        secPropertyType: SecPropertyType.MassPerMetre,
        symbol: "m",
        description: "単位質量",
        unit: "kg/m",
        result: undefined,
        fractionDigits: 3,
      },
      {
        secPropertyType: SecPropertyType.SecondMomentOfAreaX,
        symbol: "Ix",
        description: "断面二次モーメント（X軸）",
        unit: "mm^4",
        result: undefined,
        fractionDigits: 0,
      },
      {
        secPropertyType: SecPropertyType.SecondMomentOfAreaY,
        symbol: "Iy",
        description: "断面二次モーメント（Y軸）",
        unit: "mm^4",
        result: undefined,
        fractionDigits: 0,
      },
      {
        secPropertyType: SecPropertyType.ElasticModulusX,
        symbol: "Zx",
        description: "断面係数（X軸）",
        unit: "mm^3",
        result: undefined,
        fractionDigits: 0,
      },
      {
        secPropertyType: SecPropertyType.ElasticModulusY,
        symbol: "Zy",
        description: "断面係数（Y軸）",
        unit: "mm^3",
        result: undefined,
        fractionDigits: 0,
      },
      {
        secPropertyType: SecPropertyType.RadiusOfGyrationX,
        symbol: "ix",
        description: "断面二次半径（X軸）",
        unit: "mm",
        result: undefined,
        fractionDigits: 1,
      },
      {
        secPropertyType: SecPropertyType.RadiusOfGyrationY,
        symbol: "iy",
        description: "断面二次半径（Y軸）",
        unit: "mm",
        result: undefined,
        fractionDigits: 1,
      },
    ];
    for (let calcData of calcDatas) {
      calcData.result = Unit.output(
        secSteel.property(calcData.secPropertyType),
        calcData.unit
      );
    }
    setResult(calcDatas);
  };
  return (
    <div>
      <h2>断面性能計算</h2>
      <div>
        <h3>断面タイプ</h3>
        <select
          value={calcMode}
          onChange={(e) => {
            setNums.map((setNum) => setNum(""));
            setResult(undefined);
            setDrawing(undefined);
            setCalcMode(e.target.value as SecShapeType);
          }}
        >
          <option value={SecShapeType.BuildBox}>
            組立角形鋼管（BuildBox）
          </option>
          <option value={SecShapeType.FlatBar}>平鋼（FlatBar）</option>
          <option value={SecShapeType.RoundBar}>丸鋼</option>
        </select>
      </div>
      <div>
        <h3>断面寸法</h3>
        <InputTable
          dimensionDatas={getDimensions()}
          calculation={calculation}
        />
      </div>
      <div>
        <h3>計算結果</h3>
        {result !== undefined && <ResultTable calcDatas={result} />}
      </div>
      <div>
        <h3>断面形状</h3>
        {drawing !== undefined && <Drawing drawingData={drawing} />}
        {drawing !== undefined && (
          <p>縮尺：{drawing.getScaleDisplay()}(96ppiのとき)</p>
        )}
      </div>
    </div>
  );
};

export default SecProperty;

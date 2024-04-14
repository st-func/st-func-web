import React, { useState } from "react";
import {
  SecBuildBox,
  SecFlatBar,
  SecPropertyType,
  SecShapeType,
  SecSteel,
} from "@st-func/st-func-ts";
import { Unit } from "@st-func/st-func-ts";

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
      {calcDatas.map((calcData) => (
        <tr>
          <td>{calcData.description}</td>
          <td>{calcData.symbol}</td>
          <td>=</td>
          <td>
            {Number(
              calcData.result?.toFixed(calcData.fractionDigits)
            ).toString()}
            {calcData.unit}
          </td>
        </tr>
      ))}
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
      {dimensionDatas.map((dimension) => (
        <tr>
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
  let newNum1: string | undefined = undefined;
  let newNum2: string | undefined = undefined;
  let newNum3: string | undefined = undefined;
  let newNum4: string | undefined = undefined;

  const getNum1 = () => Unit.input(parseFloat(newNum1 ?? num1), "mm");
  const getNum2 = () => Unit.input(parseFloat(newNum2 ?? num2), "mm");
  const getNum3 = () => Unit.input(parseFloat(newNum3 ?? num3), "mm");
  const getNum4 = () => Unit.input(parseFloat(newNum4 ?? num4), "mm");
  const setNewNum1 = (value: string) => {
    newNum1 = value;
    setNum1(value);
  };
  const setNewNum2 = (value: string) => {
    newNum2 = value;
    setNum2(value);
  };
  const setNewNum3 = (value: string) => {
    newNum3 = value;
    setNum3(value);
  };
  const setNewNum4 = (value: string) => {
    newNum4 = value;
    setNum4(value);
  };

  const getDimensions = () => {
    let tmp: [string, (value: string) => void, string, string][];
    switch (calcMode) {
      default:
        throw new Error(calcMode + "は対応していない断面形状です。");
      case SecShapeType.BuildBox:
        tmp = [
          [num1, setNewNum1, "A", "成"],
          [num2, setNewNum2, "B", "幅"],
          [num3, setNewNum3, "t1", "成方向の板厚"],
          [num4, setNewNum4, "t2", "幅方向の板厚"],
        ];
        break;
      case SecShapeType.FlatBar:
        tmp = [
          [num1, setNewNum1, "B", "幅"],
          [num2, setNewNum2, "t", "板厚"],
        ];
        break;
    }
    return tmp.map((array) => ({
      value: array[0],
      setNewNum: array[1],
      symbol: array[2],
      unit: "mm",
      description: array[3],
    }));
  };

  const calculation = () => {
    let secSteel: SecSteel;
    if (calcMode === SecShapeType.BuildBox) {
      const secBuildBox: SecBuildBox = new SecBuildBox();
      secBuildBox.setDimensions(getNum1(), getNum2(), getNum3(), getNum4());
      secSteel = secBuildBox;
    } else if (calcMode === SecShapeType.FlatBar) {
      const secFlatBar: SecFlatBar = new SecFlatBar();
      secFlatBar.setDimensions(getNum1(), getNum2());
      secSteel = secFlatBar;
    } else {
      secSteel = new SecSteel();
    }
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
          onChange={(e) => setCalcMode(e.target.value as SecShapeType)}
        >
          <option value={SecShapeType.BuildBox}>
            組立角形鋼管（BuildBox）
          </option>
          <option value={SecShapeType.FlatBar}>平鋼（FlatBar）</option>
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
    </div>
  );
};

export default SecProperty;

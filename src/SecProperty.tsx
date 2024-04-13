import React, { useState } from "react";
import {
  SecBuildBox,
  SecFlatBar,
  SecPropertyType,
  SecSteel,
} from "@st-func/st-func-ts";
import { Unit } from "@st-func/st-func-ts";

interface CalcData {
  secPropertyType: SecPropertyType;
  symbol: string;
  description: string;
  unit: string;
  result: number | undefined;
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
            {calcData.result}
            {calcData.unit}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

const SecProperty: React.FC = () => {
  const [calcMode, setCalcMode] = useState<"buildBox" | "flatBar">("flatBar");
  const [num1, setNum1] = useState("");
  const [num2, setNum2] = useState("");
  const [num3, setNum3] = useState("");
  const [num4, setNum4] = useState("");
  const [result, setResult] = useState<CalcData[] | undefined>(undefined);

  const handleCalculation = () => {
    let secSteel: SecSteel;
    if (calcMode === "buildBox") {
      const secBuildBox: SecBuildBox = new SecBuildBox();
      secBuildBox.setDimensions(
        Unit.input(parseFloat(num1), "mm"),
        Unit.input(parseFloat(num2), "mm"),
        Unit.input(parseFloat(num3), "mm"),
        Unit.input(parseFloat(num4), "mm")
      );
      secSteel = secBuildBox;
    } else if (calcMode === "flatBar") {
      const secFlatBar: SecFlatBar = new SecFlatBar();
      secFlatBar.setDimensions(
        Unit.input(parseFloat(num1), "mm"),
        Unit.input(parseFloat(num2), "mm")
      );
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
      },
      {
        secPropertyType: SecPropertyType.MassPerMetre,
        symbol: "m",
        description: "単位質量",
        unit: "kg/m",
        result: undefined,
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
      <h3>断面寸法</h3>
      <div>
        <label>断面タイプ:</label>
        <select
          value={calcMode}
          onChange={(e) =>
            setCalcMode(e.target.value as "buildBox" | "flatBar")
          }
        >
          <option value="buildBox">組立角形鋼管（BuildBox）</option>
          <option value="flatBar">平鋼（FlatBar）</option>
        </select>
      </div>
      <div>
        <label>Number 1:</label>
        <input
          type="number"
          value={num1}
          onChange={(e) => setNum1(e.target.value)}
        />
      </div>
      <div>
        <label>Number 2:</label>
        <input
          type="number"
          value={num2}
          onChange={(e) => setNum2(e.target.value)}
        />
      </div>
      {calcMode === "buildBox" && (
        <div>
          <div>
            <label>Number 3:</label>
            <input
              type="number"
              value={num3}
              onChange={(e) => setNum3(e.target.value)}
            />
          </div>
          <div>
            <label>Number 4:</label>
            <input
              type="number"
              value={num4}
              onChange={(e) => setNum4(e.target.value)}
            />
          </div>
        </div>
      )}
      <button onClick={handleCalculation}>計算</button>
      <div>
        <h3>計算結果</h3>
        {result !== undefined ? (
          <ResultTable calcDatas={result} />
        ) : (
          "寸法を入力してください"
        )}
      </div>
    </div>
  );
};

export default SecProperty;

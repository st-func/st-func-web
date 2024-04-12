import React, { useState } from "react";
import { SecBuildBox, SecFlatBar, SecSteel } from "@st-func/st-func-ts";
import { Unit } from "@st-func/st-func-ts";

const SecProperty: React.FC = () => {
  const [calcMode, setCalcMode] = useState<"buildBox" | "flatBar">("flatBar");
  const [num1, setNum1] = useState("");
  const [num2, setNum2] = useState("");
  const [num3, setNum3] = useState("");
  const [num4, setNum4] = useState("");
  const [result, setResult] = useState<number | undefined>(undefined);

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
    let result: number = Unit.output(secSteel.area(), "mm^2");
    setResult(result);
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
        {result !== undefined ? result : "寸法を入力してください"}
      </div>
    </div>
  );
};

export default SecProperty;

import React, { useState } from "react";

interface CalculatorProps {
  calcMode: "sum" | "product";
  setCalcMode: React.Dispatch<React.SetStateAction<"sum" | "product">>;
}

const Calculator: React.FC<CalculatorProps> = ({ calcMode, setCalcMode }) => {
  const [num1, setNum1] = useState("");
  const [num2, setNum2] = useState("");
  const [num3, setNum3] = useState("");
  const [result, setResult] = useState<number | undefined>(undefined);

  const handleCalculation = () => {
    if (calcMode === "sum") {
      const sum = parseFloat(num1) + parseFloat(num2) + parseFloat(num3);
      setResult(sum);
    } else if (calcMode === "product") {
      const product = parseFloat(num1) * parseFloat(num2);
      setResult(product);
    }
  };

  return (
    <div>
      <h2>Calculator</h2>
      <div>
        <label>Calculation Mode:</label>
        <select
          value={calcMode}
          onChange={(e) => setCalcMode(e.target.value as "sum" | "product")}
        >
          <option value="sum">Addition</option>
          <option value="product">Multiplication</option>
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
      {calcMode === "sum" && (
        <div>
          <label>Number 3:</label>
          <input
            type="number"
            value={num3}
            onChange={(e) => setNum3(e.target.value)}
          />
        </div>
      )}
      <button onClick={handleCalculation}>Calculate</button>
      <div>Result: {result !== undefined ? result : "Please calculate"}</div>
    </div>
  );
};

export default Calculator;

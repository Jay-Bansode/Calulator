const display = document.querySelector(".display");
const buttons = document.querySelectorAll("button");
let output = "";

// Safer calculation logic without eval()
const safeCalculate = (expression) => {
  try {
    // Replace percentage with division by 100
    let processedExpr = expression.replace(/%/g, "/100");
    
    // Using Function constructor as a slightly safer alternative to eval for simple math
    // But still restricted to math characters
    const mathChars = /^[0-9+\-*/.%() ]+$/;
    if (!mathChars.test(processedExpr)) {
      throw new Error("Invalid characters");
    }
    
    // Basic calculation using Function (restricted scope)
    const result = new Function(`return ${processedExpr}`)();
    
    // Format result: limit decimals and handle Infinity
    if (isNaN(result) || !isFinite(result)) return "Error";
    return Number(parseFloat(result).toFixed(8)).toString();
  } catch (err) {
    return "Error";
  }
};

const updateDisplay = (btnValue) => {
  display.focus();
  
  if (btnValue === "=") {
    if (output !== "" && output !== "Error") {
      output = safeCalculate(output);
    }
  } else if (btnValue === "AC") {
    output = "";
  } else if (btnValue === "DEL") {
    output = output.toString().slice(0, -1);
  } else {
    // Prevent starting with operators except minus
    const operators = ["+", "*", "/", "%"];
    if (output === "" && operators.includes(btnValue)) return;
    
    // Prevent multiple consecutive operators
    const lastChar = output.slice(-1);
    const allOps = ["+", "-", "*", "/", "%", "."];
    if (allOps.includes(lastChar) && allOps.includes(btnValue)) {
      // Replace last operator with new one if same type
      output = output.slice(0, -1);
    }
    
    output += btnValue;
  }
  
  display.value = output;
};

// Click events
buttons.forEach((button) => {
  button.addEventListener("click", (e) => {
    updateDisplay(button.dataset.value);
  });
});

// Keyboard support
document.addEventListener("keydown", (e) => {
  const key = e.key;
  
  // Map keys to button values
  if (/[0-9]/.test(key)) updateDisplay(key);
  if (key === ".") updateDisplay(".");
  if (key === "+") updateDisplay("+");
  if (key === "-") updateDisplay("-");
  if (key === "*") updateDisplay("*");
  if (key === "/") updateDisplay("/");
  if (key === "%") updateDisplay("%");
  if (key === "Enter" || key === "=") updateDisplay("=");
  if (key === "Backspace") updateDisplay("DEL");
  if (key === "Escape") updateDisplay("AC");
});


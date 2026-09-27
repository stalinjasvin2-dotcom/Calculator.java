const readline = require("readline");
const calc = require("./calculator");

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

function ask(prompt) {
  return new Promise((resolve) => rl.question(prompt, resolve));
}

function printMenu() {
  console.log("");
  console.log(`==== Simple Calculator (v${calc.VERSION}) ====`);
  console.log("1. Add");
  console.log("2. Subtract");
  console.log("3. Multiply");
  console.log("4. Divide");
  console.log("5. Power (a ^ b)");
  console.log("6. Square Root");
  console.log("7. Exit");
  console.log("=======================================");
}

function readNumber(value) {
  const n = Number(value.trim());
  if (Number.isNaN(n) || value.trim() === "") {
    throw new Error("invalid number");
  }
  return n;
}

async function main() {
  while (true) {
    printMenu();
    const choice = (await ask("Choose an option (1-7): ")).trim();

    if (choice === "7") {
      console.log("Goodbye!");
      break;
    }

    try {
      if (choice === "6") {
        const a = readNumber(await ask("Enter a number: "));
        console.log("Result: " + calc.squareRoot(a));
      } else if (["1", "2", "3", "4", "5"].includes(choice)) {
        const a = readNumber(await ask("Enter first number: "));
        const b = readNumber(await ask("Enter second number: "));
        switch (choice) {
          case "1":
            console.log("Result: " + calc.formatNumber(calc.add(a, b)));
            break;
          case "2":
            console.log("Result: " + calc.formatNumber(calc.subtract(a, b)));
            break;
          case "3":
            console.log("Result: " + calc.formatNumber(calc.multiply(a, b)));
            break;
          case "4":
            console.log("Result: " + calc.divide(a, b));
            break;
          case "5":
            console.log("Result: " + calc.formatNumber(calc.power(a, b)));
            break;
        }
      } else {
        console.log("Invalid option. Please choose 1-7.");
      }
    } catch (e) {
      console.log("Error: Please enter valid numeric input.");
    }
  }

  rl.close();
}

main();

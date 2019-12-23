import chalk from "chalk";
import { spawn } from "child_process";

export default (workingDir: string) => {
  console.log(chalk.green("Generating full-stack scaffold..."));
  console.log(chalk.green("Done!"));
};

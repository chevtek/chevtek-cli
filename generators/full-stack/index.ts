import { exec } from "child_process";

export default () => {
  console.log("Generator running...");
  exec('echo "hi"', (error: any, stdout: any, stderr: any) => {
    stdout.pipe(process.stdout);
    stderr.pipe(process.stderr);
    if (error !== null) {
      console.log(`exec error: ${error}`);
    }
  });
};

import fs from "fs";
import path from "path";
import util from "util";
import chalk from "chalk";
import { spawn } from "child_process";
import Logger from "../../logger";

const { log } = new Logger("generate:full-stack");
const mkdir = util.promisify(fs.mkdir);
const stat = util.promisify(fs.stat);
const readdir = util.promisify(fs.readdir);
const writeFile = util.promisify(fs.writeFile);

export default async (dir: string) => {
  console.log(chalk.green("Generating full-stack scaffold..."));
  log(`Checking if "${dir}" exists...`);
  const dirExists = await checkDirectoryExists(dir);
  if (dirExists) {
    log(`Directory exists. Checking for existing files...`);
    const files = await readdir(dir);
    if (files.length > 0) {
      throw new Error("Please ensure the target directory is empty.");
    }
  } else {
    log(`Creating directory...`);
    await mkdir(dir);
  }
  log(`Creating client and server directories...`);
  await Promise.all([
    createPackageJson(dir),
    createGitIgnore(dir),
    generateServerScaffold(dir),
    generateClientScaffold(dir)
  ]);
  console.log(chalk.green("Done!"));
};

async function createPackageJson(dir: string) {
  const dirName = path.basename(dir);
  const data = {
    "name": dirName,
    "version": "1.0.0",
    "scripts": {
      "start": "cd build && node.js",
      "install": "run-p install:server install:client",
      "install:server": "cd ./server && npm install",
      "install:client": "cd ./client && npm install",
      "dev": "run-p -r dev:server dev:client",
      "dev:server": "cd ./server && npm start",
      "dev:client": "wait-on tcp:3001 && cd ./client && npm start",
      "build": "npm run clean && run-p build:server build:client",
      "build:server": "cd ./server && npm run build && mv ./build ../build",
      "build:client": "cd ./client && npm run build && mv ./build ../build/client",
      "clean": "rm -rf ./build"
    },
  };
}

async function createGitIgnore(dir: string) {

}

async function generateServerScaffold(dir: string) {
  await mkdir(path.join(dir, "server")),
}

async function generateClientScaffold(dir: string) {
  mkdir(path.join(dir, "client"))
}

async function checkDirectoryExists(dir: string) {
  try {
    await stat(dir);
    return true;
  } catch (err) {
    if (err.errno === 34) {
      return false;
    }
  }
}

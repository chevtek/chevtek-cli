import fs from "fs";
import path from "path";
import util from "util";
import chalk from "chalk";
import childProcess from "child_process";
import prettier from "prettier";
import rimraf from "rimraf";

const mkdir = util.promisify(fs.mkdir);
const stat = util.promisify(fs.stat);
const readdir = util.promisify(fs.readdir);
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const unlink = util.promisify(fs.unlink);
const rmdir = util.promisify(rimraf);
const spawn = (command: string, args: string[], cwd?: string) =>
  new Promise((resolve, reject) => {
    const cmd = childProcess.spawn(command, args, { cwd, stdio: "inherit" });
    cmd.on("error", reject);
    cmd.on("close", resolve);
  });
const format = (source: string) =>
  prettier.format(source, { parser: "typescript" });

const npmCmd = /^win/.test(process.platform) ? "npm.cmd" : "npm";
const npxCmd = /^win/.test(process.platform) ? "npx.cmd" : "npx";

export default async (dir: string, force: boolean) => {
  console.log(chalk.greenBright("Generating full-stack scaffold..."));
  const dirExists = await checkDirectoryExists(dir);
  if (dirExists) {
    const files = await readdir(dir);
    if (!force && files.length > 0 && (files.length > 1 || path.basename(files[0]) !== ".git")) {
      throw new Error("Target directory is not empty. Supply --force to generate anyway.");
    }
  } else {
    await mkdir(dir);
    console.log(chalk.greenBright(`Created "${dir}" directory.`));
  }
  await Promise.all([
    createPackageJson(dir),
    generateServerScaffold(dir),
    generateClientScaffold(dir)
  ]);
  await initializeGit(dir);
  console.log(chalk.greenBright("Done!"));
};

async function initializeGit(dir: string) {
  await writeFile(
    path.join(dir, ".gitignore"),
    `
      node_modules
      .vscode
      build
    `
      .split("\n")
      .map((line) => line.trim())
      .join("\n")
  );
  console.log(chalk.greenBright(`Created .gitignore.`));
  try {
    const exitCode = await spawn("git", ["status"], dir);
    if (exitCode !== 128) {
      console.log(chalk.greenBright("Parent git repository found, skipping repo init."));
      return;
    }
    await spawn("git", ["init"], dir);
    await spawn("git", ["add", "."], dir);
    await spawn("git", ["commit", "-m", `"Initialized full-stack project."`], dir);
    console.log(chalk.greenBright("Initialized Git repository."));
  } catch (err) {
    console.log(chalk.redBright(err.message));
  }
}

async function createPackageJson(dir: string) {
  const data = {
    "name": path.basename(dir),
    "version": "1.0.0",
    "scripts": {
      "start": "cd build && node index.js",
      "install": "run-p install:server install:client",
      "install:server": "cd ./server && npm install",
      "install:client": "cd ./client && npm install",
      "dev": "run-p -r dev:server dev:client",
      "dev:server": "cd ./server && npm start",
      "dev:client": "wait-on tcp:3001 && cd ./client && npm start",
      "build":
        "run-s build:clean build:server && run-p build:client build:dependencies",
      "build:server": "cd ./server && npm run build && move-cli ./build ../build",
      "build:client":
        "cd ./client && npm run build && move-cli ./build ../build/client",
      "build:dependencies": "cd ./build && npm install",
      "build:clean": "rimraf ./build"
    }
  };
  await writeFile(
    path.join(dir, "package.json"),
    JSON.stringify(data, null, 2)
  );
  await spawn(
    npmCmd,
    ["install", "-D", "npm-run-all", "wait-on", "rimraf", "move-cli"],
    dir
  );
  console.log(chalk.greenBright(`Created root package.json file.`));
}

async function generateServerScaffold(dir: string) {
  const serverDir = path.join(dir, "server");
  await mkdir(serverDir);
  const packageData = {
    "name": `${path.basename(dir)}-server`,
    "scripts": {
      "start": "ts-node-dev --inspect --respawn --transpileOnly index.ts",
      "build": "tsc && npm run build:dependencies cd ./build && npm install",
      "build:dependencies": "node build-dependencies.js"
    }
  };
  await writeFile(
    path.join(serverDir, "package.json"),
    JSON.stringify(packageData, null, 2)
  );
  await spawn(
    npmCmd,
    ["install", "dotenv", "koa", "mongoose", "koa-static"],
    serverDir
  );
  await spawn(
    npmCmd,
    [
      "install",
      "-D",
      "typescript",
      "ts-node-dev",
      "@types/node",
      "@types/koa",
      "@types/koa-static",
      "@types/mongoose"
    ],
    serverDir
  );
  await Promise.all([
    writeFile(
      path.join(serverDir, "tsconfig.json"),
      JSON.stringify(
        {
          "compilerOptions": {
            "strict": true,
            "esModuleInterop": true,
            "outDir": "./build"
          },
          "include": ["./**/*.ts"]
        },
        null,
        2
      )
    ),
    writeFile(
      path.join(serverDir, "build-dependencies.js"),
      format(`
        const fs = require("fs");
        const { version, author, dependencies } = require("./package.json");

        fs.writeFileSync(
          "./build/package.json",
          JSON.stringify({
            name: "server-build",
            version,
            author,
            dependencies
          }, null, 2)
        );
      `)
    ),
    writeFile(
      path.join(serverDir, "index.ts"),
      format(`
        import dotenv from "dotenv";
        dotenv.config();

        import fs from "fs";
        import { promisify } from "util";
        import Koa from "koa";
        import serve from "koa-static";

        const readFile = promisify(fs.readFile);

        const port = process.env.PORT || 3001;
        const app = new Koa();

        app.use(serve("./client"));

        app.use(async (ctx) => {
          ctx.set("Content-Type", "text/html");
          ctx.body = (await readFile("./client/index.html")).toString();
        });

        app.listen(port, () => console.log(\`Server running on port \${port}.\`));
      `)
    )
  ]);
}

async function generateClientScaffold(dir: string) {
  const clientDir = path.join(dir, "client");
  await mkdir(path.join(dir, "client"));
  console.log(chalk.greenBright(`Created "client" directory.`));
  await spawn(
    npxCmd,
    ["create-react-app", "--template", "typescript", "."],
    clientDir
  );
  console.log(chalk.greenBright(`Created react app.`));
  await unlink(path.join(clientDir, ".gitignore"));
  console.log(chalk.greenBright(`Removed .gitignore file from client.`));
  const packageData = JSON.parse(
    (await readFile(path.join(clientDir, "package.json"))).toString()
  );
  await rmdir(path.join(clientDir, ".git"));
  console.log(chalk.greenBright(`Removed .git folder from client.`));
  packageData.homepage = ".";
  packageData.proxy = "http://localhost:3001";
  await writeFile(
    path.join(clientDir, "package.json"),
    JSON.stringify(packageData, null, 2)
  );
  console.log(chalk.greenBright(`Wrote homepage and proxy to package.json.`));
}

async function checkDirectoryExists(dir: string) {
  try {
    await stat(dir);
    return true;
  } catch (err) {
    return false;
  }
}

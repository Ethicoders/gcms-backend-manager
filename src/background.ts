import { app, protocol, BrowserWindow, ipcMain } from 'electron';
import {
  createProtocol,
  installVueDevtools,
} from 'vue-cli-plugin-electron-builder/lib';
import * as fs from 'fs';
import * as path from 'path';
import { Project } from '@/interfaces/project';

import { spawn, exec } from 'child_process';
import * as rimraf from 'rimraf';
import * as pidusage from 'pidusage';
import { EventEmitter } from 'events';

const isDevelopment = process.env.NODE_ENV !== 'production';

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win: BrowserWindow | null;

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } },
]);

const projectsPath = path.join(app.getPath('userData'), 'projects');
if (!fs.existsSync(projectsPath)) {
  fs.mkdirSync(projectsPath);
}

const pluginsDirectoryPath = path.join(app.getPath('userData'), 'plugins');
if (!fs.existsSync(pluginsDirectoryPath)) {
  fs.mkdirSync(pluginsDirectoryPath);
  fs.writeFileSync(
    path.join(pluginsDirectoryPath, 'package.json'),
    '{"name": "backend-manager"}',
  );
  const worker = exec('yalc add gcms-backend-sdk && yarn', {
    cwd: pluginsDirectoryPath,
  });
  worker.stderr.on('data', (data) => {
    console.log(data);
  });
  worker.on('exit', () => {
    console.log('Done initializing');
  });
  fs.writeFileSync(
    path.join(pluginsDirectoryPath, 'index.js'),
    `module.exports = pluginName => require('gcms-' + pluginName).default;`,
  );
}

function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    },
    frame: false,
  });

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    win.loadURL(process.env.WEBPACK_DEV_SERVER_URL as string);
    if (!process.env.IS_TEST) {
      win.webContents.openDevTools();
    }
  } else {
    createProtocol('app');
    // Load the index.html when not in development
    win.loadURL('app://./index.html');
  }

  win.on('closed', () => {
    win = null;
  });
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow();
  }
});

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit();
      }
    });
  } else {
    process.on('SIGTERM', () => {
      app.quit();
    });
  }
}

const getProjectDirectoryPath = (project: Project) => {
  return path.join(app.getPath('userData'), 'projects', project.key);
};

ipcMain.on('updateProjectsCache', (event, data) => {
  fs.writeFileSync(
    path.join(app.getPath('userData'), 'projects.json'),
    JSON.stringify(data),
  );
});

ipcMain.on('createProject', (event, project: Project) => {
  const projectDirectoryPath = getProjectDirectoryPath(project);

  fs.mkdirSync(projectDirectoryPath);
  fs.writeFileSync(
    path.join(projectDirectoryPath, 'config.json'),
    JSON.stringify(project),
  );
  fs.writeFileSync(path.join(projectDirectoryPath, 'plugins.json'), '[]');
  event.reply('createProjectDone');
});

ipcMain.on('updateProjects', (event, tree: any) => {
  fs.writeFileSync(app.getPath('userData') + '/projects.json', tree);
});

const instances: any = {};

ipcMain.on('getProjects', (event) => {
  const projectsFilePath = app.getPath('userData') + '/projects.json';
  console.log(JSON.parse(fs.readFileSync(projectsFilePath, 'utf-8')));

  const tree = fs.existsSync(projectsFilePath)
    ? JSON.parse(fs.readFileSync(projectsFilePath, 'utf-8'))
    : null;
  if (tree) {
    const walkNodes = (
      node: any,
      callback: (child: any, node: any) => void,
    ) => {
      if (!node.children) {
        return;
      }
      node.children.forEach((child: any) => {
        callback(child, node);
        walkNodes(child, callback);
      });
    };
    if (tree[0].children.length) {
      walkNodes(tree[0], (node: any, parent: any) => {
        if (node.runOnStartUp) {
          startProject(node);
          node.started = true;
        }
      });
    }
  }
  event.reply('retrievedProjects', JSON.stringify(tree));
});

const listeners: { [key: string]: EventEmitter } = {};

const backendPath =
  'C:\\Users\\valen\\Documents\\projects\\gcms\\app\\gql-cms-demo-win32-x64';

const startProject = (project: Project) => {
  console.log(`Spawning project ${project.name}`);

  fs.writeFileSync(
    path.join(projectsPath, project.key, 'gcms.json'),
    JSON.stringify(
      {
        app: {
          graphqlRoot: '/',
          port: project.port,
          graphiql: true,
        },
        plugin: {
          pluginsFilePath: path.join(projectsPath, project.key, 'plugins.json'),
          pluginsDirectory: pluginsDirectoryPath,
        },
        database: {
          url: 'mongodb://localhost:27017',
          databaseName: project.databaseName,
        },
      },
      null,
      2,
    ),
  );

  instances[project.key] = spawn(
    // TODO: provide a dynamic path based on the location the OS related binary will be downloaded
    `${backendPath}\\gql-cms-demo.exe`,
    [path.join(projectsPath, project.key, '/gcms.json')],
    { stdio: ['pipe', null, null, 'ipc'] },
  );

  listeners[project.key] = new EventEmitter();
  listeners[project.key].on('ready', () => {
    (win as BrowserWindow).webContents.send('startedProject:' + project.key);
  });

  const restartProject = () => {
    console.log('requesting to restart');
    instances[project.key].kill();
    startProject(project);
  };
  listeners[project.key].on('trigger:restart', restartProject);

  instances[project.key].on('message', (event) => {
    listeners[project.key].emit(event.eventType);
  });
};

ipcMain.on('startProject', (event, project: Project) => {
  startProject(project);
  setInterval(() => {
    pidusage(instances[project.key].pid, (err: any, stats: any) => {
      ipcMain.emit('monitoringInstance:' + project.key, stats);
      // => {
      //   cpu: 10.0,            // percentage (from 0 to 100*vcore)
      //   memory: 357306368,    // bytes
      //   ppid: 312,            // PPID
      //   pid: 727,             // PID
      //   ctime: 867000,        // ms user + system time
      //   elapsed: 6650000,     // ms since the start of the process
      //   timestamp: 864000000  // ms since epoch
      // }
    });
  }, 1000);

  instances[project.key].stdout.on('data', (data: any) => {
    console.log(`stdout: ${data}`);
  });

  instances[project.key].stderr.on('data', (data: any) => {
    ipcMain.emit('killedInstance:' + project.key);
    console.error(`stderr: ${data}`);
  });

  instances[project.key].on('close', (code: any) => {
    ipcMain.emit('killedInstance:' + project.key);
    console.log(`child process exited with code ${code}`);
  });
});

ipcMain.on('stopProject', (event: any, project: Project) => {
  instances[project.key].kill();
  event.reply('stoppedProject:' + project.key);
});

ipcMain.on('deleteProject', (event: any, project: Project) => {
  rimraf(path.join(projectsPath, project.key), () => {
    event.reply('deletionDone');
  });
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    // Devtools extensions are broken in Electron 6.0.0 and greater
    // See https://github.com/nklayman/vue-cli-plugin-electron-builder/issues/378 for more info
    // Electron will not launch with Devtools extensions installed on Windows 10 with dark mode
    // If you are not using Windows 10 dark mode, you may uncomment these lines
    // In addition, if the linked issue is closed, you can upgrade electron and uncomment these lines
    // try {
    //   await installVueDevtools();
    // } catch (e) {
    //   console.error('Vue Devtools failed to install:', e.toString());
    // }
  }

  createWindow();
});

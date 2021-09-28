import { app, BrowserWindow, Menu, dialog, ipcMain } from "electron";
import installExtension, {
  REACT_DEVELOPER_TOOLS,
} from "electron-devtools-installer";
import Excel from "exceljs";
import { txType } from "./scraper/constants";
import { getAreaList, getUsageList, makeUsagePriceDict, setUpResidentialToken } from "./scraper/utils";
import {prepareSheet} from "./scraper/wbCreators"
import { getLookUpTables, saveLookUpTables } from "./scraper/appStorage";
import path from "path";

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  // eslint-disable-line global-require
  app.quit();
}

Menu.setApplicationMenu(null);

app.whenReady().then(() => {
  installExtension(REACT_DEVELOPER_TOOLS, {
    loadExtensionOptions: { allowFileAccess: true },
    forceDownload: false,
  })
    .then((name) => console.log(`Added Extension:  ${name}`))
    .catch((err) => console.log("An error occurred: ", err));
});

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow: null | BrowserWindow;

const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 800,
    show: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    icon: path.resolve(__dirname,'../../public/logo_.ico')
  });

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on("closed", () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });

  mainWindow.once('ready-to-show', () => {
    mainWindow?.show()
  })
};

ipcMain.on("select-dirs", async () => {
  if (!!mainWindow) {
    const result = await dialog.showOpenDialog(mainWindow, {
      properties: ["openDirectory"],
    });
    mainWindow.webContents.send("filePath:chosen", result.filePaths[0]);
  }
});

ipcMain.on("store:request", () => {
  if (!!mainWindow) {
    mainWindow.webContents.send("store:send", getLookUpTables());
  }
});

ipcMain.on("store:store", (e, store) => {
  if (!!mainWindow) {
    saveLookUpTables(store);
    mainWindow.webContents.send("store:saved");
  }
});

ipcMain.on("parameters:selected", async (_, params) => {
  if (!!mainWindow) {
    try {
      const {
        filename,
        startDate,
        endDate,
        resultWbName,
        modeSelection,
        rawResultPath
      } = params;
      const resultWbPath = path.join(rawResultPath, resultWbName)
      const token = await setUpResidentialToken();
  
      const wb = new Excel.Workbook();
      const targetWb = await wb.xlsx.readFile(filename);
      const targetSheet = targetWb.worksheets[0];
      let rowIndex = 32;
  
      while (!!targetSheet.getRow(rowIndex).getCell("H").value) {
        const targetPropertyName = targetSheet.getCell(`G${rowIndex}`).value as string;
        const areaList = getAreaList({ ws: targetSheet, rowIndex });
        const usages = getUsageList({ ws: targetSheet, rowIndex, mainWindow });
        const usagePriceDict = makeUsagePriceDict({
          ws: targetSheet,
          rowIndex,
          usages,
          mainWindow,
        });
  
        for (const usage of usages) {
          for (const t of txType) {
            if (
              Object.values(usagePriceDict[usage][t]).every(
                (v:any) => !(v === null || isNaN(v))
              )
            ) {
              const isCommercial = usage === "Commercial" || usage === "Office";
              await prepareSheet({
                targetWb,
                targetSheet,
                filename,
                rowIndex,
                t,
                usage,
                areaList,
                startDate,
                endDate,
                usagePriceDict,
                targetPropertyName,
                resultWbPath,
                modeSelection,
                mainWindow,
                isCommercial,
                token,
              });
            }
          }
        }
  
        rowIndex += 1;
      }
  
      mainWindow.webContents.send("data:constructed");
    } catch (err) {
      mainWindow.webContents.send(
        "error:push",
        `Error: ${err}! Please check your excel is valid and try again!`
      );
      mainWindow.webContents.send("data:constructed");
    }
  }
});


// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

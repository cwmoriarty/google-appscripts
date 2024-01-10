function fetch() {
  var url = atob("aHR0cHM6Ly9wb3dlcm91dGFnZS51cy9hcmVhL3JlZ2lvbi9uZXclMjBlbmdsYW5k");

  //fetch URL 
  var content = UrlFetchApp.fetch(url).getContentText();
  //Logger.log('content: ' + content);

  //timestamp
  var fetchTime = Utilities.formatDate(new Date(), 'Etc/GMT', "yyyy-MM-dd HH:mm:ss");
  Logger.log('fetch time: ' + fetchTime);

  
  //extract data
  var REma = new RegExp(/(massachusetts\"\>)([0-9,]+)/);
  var REct = new RegExp(/(connecticut\"\>)([0-9,]+)/);
  var REvt = new RegExp(/(vermont\"\>)([0-9,]+)/);
  var REnh = new RegExp(/(hampshire\"\>)([0-9,]+)/);
  var ma = REma.exec(content);
  var ct = REct.exec(content);
  var vt = REvt.exec(content);
  var nh = REnh.exec(content);
  Logger.log('nh[2] was: ' + nh[2]); //confirm regex group 2 was accurate

  //add data to the spreadsheet, into array of column header names
  var row_data = {
    DateTime: fetchTime,
    CT: ct[2],
    MA: ma[2],
    NH: nh[2],
    VT: vt[2]
  };
  insertRowInTracker(row_data);

}

function insertRowInTracker(rowData) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];  //[0] is the first sheet
  var rowValues = [];
  var columnHeaders = sheet.getDataRange().offset(0, 0, 1).getValues()[0];
  //Logger.log("writing to: ", sheet);
  //Logger.log("writing: ", rowData);
  columnHeaders.forEach((header) => {
    rowValues.push(rowData[header]);
  });
  sheet.appendRow(rowValues);
}

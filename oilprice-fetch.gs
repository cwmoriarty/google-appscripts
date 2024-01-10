function fetch() {
  var url = atob("aHR0cHM6Ly93d3cubmV3ZW5nbGFuZG9pbC5jb20vbWFzc2FjaHVzZXR0cy96b25lOS5hc3A/eD0w"); //🕵️‍♂️

  //fetch site content
  var content = UrlFetchApp.fetch(url).getContentText();
  //Logger.log('website content: ' + content);

  var fetchTime = Utilities.formatDate(new Date(), 'Etc/GMT', "yyyy-MM-dd HH:mm:ssZ"); // "yyyy-MM-dd'T'HH:mm:ss'Z'"
  Logger.log('fetch time: ' + fetchTime);

  //extract data
  var companyPattern = /Company'+.*\>([A-Z&. ]+)(?:<\/a>)?(?:<\/td>)/g;   //include both linked and non-linked URLs. (fun!)
  var pricePattern = /\$([0-9].[0-9]*)&/g;  

  var coMatches = content.matchAll(companyPattern);
  var coList = Array.from(coMatches, i => i[1]);

  var priceMatches = content.matchAll(pricePattern);
  var priceList = Array.from(priceMatches, i => i[1]);

  var lowPrice = Math.min.apply(Math, priceList).toFixed(3);
  var lowCo = coList[priceList.indexOf(String(lowPrice))]; //BUG: This can be incorrect.

  //debug
  Logger.log('coList:' + coList)
  Logger.log('priceList:' + priceList)
  Logger.log('lowPriceIndex:' + priceList.indexOf(String(lowPrice)));
  Logger.log('lowCo:' + lowCo)
  Logger.log('lowPrice:' + lowPrice)

  //add data to the spreadsheet
  var row_data = {
    DateTime: fetchTime,
    Company: lowCo,
    Low: lowPrice,
  };
  insertRowInTracker(row_data)
}

function insertRowInTracker(rowData) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  var rowValues = [];
  var columnHeaders = sheet.getDataRange().offset(0, 0, 1).getValues()[0];
  //Logger.log("writing to: ", sheet);
  //Logger.log("writing: ", rowData);
  columnHeaders.forEach((header) => {
    rowValues.push(rowData[header]);
  });
  sheet.appendRow(rowValues);
}

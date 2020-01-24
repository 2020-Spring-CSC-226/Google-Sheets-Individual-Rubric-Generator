function gradeDownloader() {
  return 0;
}

function feedbackGenerator() {
  // Function that gets the student grades, formats them, and appends them to the sheet
  var ss = SpreadsheetApp.getActiveSheet();	// Gets the header row
  var h_row = ss.getDataRange().offset(0,0,1).getValues()[0];   // Gets all of the grade information (without header row)
  var g_rows = ss.getDataRange().offset(1, 0, ss.getLastRow() - 2).getValues();
  var current_row = getFirstEmptyRow() + 3;

  // Removes values from the data: if assignment was late, in Moodle, and the GitHub usernames
  for(var i = 0; i < h_row.length; i++){
   if (h_row[i] == "GitHub" || h_row[i] == "Late?" || h_row[i] == "In Moodle?" || h_row[i] == "Grader") {
 	h_row.splice(i, 1);
 	for(var j = 0; j < g_rows.length; j++) {
   	g_rows[j].splice(i, 1);
 	}
 	i--;
   }
  }

  // This loop adds the student grade tables to the sheet
  for (var k = 0; k < g_rows.length; k++) {
	var current_student = ss.getRange(current_row, 2, h_row.length, 2);
	current_student.setBorder(true, true, true, true, false, false, "black", SpreadsheetApp.BorderStyle.SOLID).setBorder(null, null, null, null, true, true, "black", SpreadsheetApp.BorderStyle.DASHED);
	if (Math.floor(current_row / 11) % 2 == 0) {current_student.setBackground("#e0f7fa");} else {current_student.setBackground("#ffffff")}
	for (var l = 0; l < h_row.length; l++) {
  	ss.getRange(current_row, 2).setValue(h_row[l]).setFontWeight("bold");
  	ss.getRange(current_row, 3).setValue(g_rows[k][l]);
  	current_row++;
	}
	current_row++;
  }

  // Logs the student info
  for (var j = 0; j < g_rows.length; j++) {
	Logger.log("Row info: " + g_rows[j]);
  }
}


function getFirstEmptyRow() {
  // This function returns the number of the first blank row in the spreadsheet
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var column = ss.getRange("A:A");
  var values = column.getValues();
  var count = 0;
  while (values[count][0] != "") {
	count++
  }
  return count;
}


function onOpen() {
  // This function automatically runs when the sheet is opened and sets up the menu button
  var UI = SpreadsheetApp.getUi();
  UI.createMenu('Post to Moodle')
  	.addItem('Format Individual Data', 'feedbackGenerator').addItem('Download & Post to Moodle (Non functional)', 'gradeDownloader')
  	.addToUi();
}

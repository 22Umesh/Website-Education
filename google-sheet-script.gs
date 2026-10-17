// ==========================================================
// BRILLIANCE COACHING INSTITUTE - GOOGLE SHEET CONNECTION
// ==========================================================
//
// This file is NOT loaded by the web page. It runs inside
// Google Apps Script and saves each form submission as a new
// row in your Google Sheet.
//
// SETUP
//
// 1. Create a new Google Sheet (https://sheets.new).
//
// 2. In the Sheet, open  Extensions > Apps Script.
//    Delete the sample code, paste this whole file, and Save.
//
// 3. Click  Deploy > New deployment.
//    - Select type:      Web app
//    - Execute as:       Me
//    - Who has access:   Anyone
//    Click Deploy and allow the permissions Google asks for.
//
// 4. Copy the "Web app URL" (it ends in /exec) and paste it
//    into GOOGLE_SHEET_URL at the top of script.js.
//
// If you edit this script later, publish the change with
// Deploy > Manage deployments > Edit > Version: New version.
//
// Registrations are saved in a tab named "Registrations" and
// contact messages in a tab named "Messages". Both tabs are
// created automatically on the first submission.
// ==========================================================


const FORMS = {

    registration: {
        sheetName: "Registrations",
        fields: [
            "studentName",
            "parentName",
            "email",
            "mobile",
            "studentClass",
            "subject",
            "address"
        ],
        headers: [
            "Submitted At",
            "Student Name",
            "Parent Name",
            "Email",
            "Mobile",
            "Class",
            "Subject",
            "Address"
        ]
    },

    contact: {
        sheetName: "Messages",
        fields: [
            "name",
            "mobile",
            "message"
        ],
        headers: [
            "Submitted At",
            "Name",
            "Mobile",
            "Message"
        ]
    }

};


// Runs every time the web page submits a form

function doPost(e) {

    const lock = LockService.getScriptLock();

    try {

        // Wait for any other submission that is being saved
        lock.waitLock(10000);

        const formConfig = FORMS[e.parameter.formType];

        if (!formConfig) {
            throw new Error("Unknown form type.");
        }

        const sheet = getOrCreateSheet(formConfig);

        const row = [new Date()];

        formConfig.fields.forEach(function(field) {
            row.push(cleanValue(e.parameter[field]));
        });

        sheet.appendRow(row);

        return jsonResponse({ result: "success" });

    } catch (error) {

        return jsonResponse({
            result: "error",
            message: String(error)
        });

    } finally {

        lock.releaseLock();

    }

}


// Opening the Web app URL in a browser shows this message,
// which confirms that the deployment is working.

function doGet() {

    return jsonResponse({
        result: "ok",
        message: "The form connection is working."
    });

}


function getOrCreateSheet(formConfig) {

    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();

    let sheet = spreadsheet.getSheetByName(formConfig.sheetName);

    if (!sheet) {

        sheet = spreadsheet.insertSheet(formConfig.sheetName);

        sheet.appendRow(formConfig.headers);

        sheet
            .getRange(1, 1, 1, formConfig.headers.length)
            .setFontWeight("bold");

        sheet.setFrozenRows(1);

    }

    return sheet;

}


// The leading apostrophe makes Google Sheets store the value
// as plain text. Without it, text starting with "=" would run
// as a formula and phone numbers could lose digits.

function cleanValue(value) {

    const text = String(value || "").trim().slice(0, 1000);

    return "'" + text;

}


function jsonResponse(data) {

    return ContentService
        .createTextOutput(JSON.stringify(data))
        .setMimeType(ContentService.MimeType.JSON);

}

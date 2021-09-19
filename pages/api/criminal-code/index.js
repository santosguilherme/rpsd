// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { google } from 'googleapis';

import compose from 'utils/functional/compose';

const DOCUMENT_ID = process.env.DOCUMENT_ID;
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

export default async function handler(req, res) {
  const sheets = google.sheets('v4');
  const googleResponse = await sheets.spreadsheets.get({
    auth: GOOGLE_API_KEY,
    spreadsheetId: DOCUMENT_ID,
    includeGridData: false,
  });

  const sheetsTitle = googleResponse.data.sheets.map(
    ({ properties }) => properties.title,
  );

  const [, ...validSheets] = sheetsTitle;

  const promises = validSheets.map((sheetName) => {
    return sheets.spreadsheets.values.get({
      auth: GOOGLE_API_KEY,
      spreadsheetId: DOCUMENT_ID,
      range: sheetName,
    });
  });

  const sheetsValuesResponses = await Promise.all(promises);

  const sheetsValues = sheetsValuesResponses.map(({ data }) => {
    const { values } = data;

    return values
      .filter((item) => item.length)
      .map((item) => item.filter((item) => item).map(clearString));
  });

  const response = validSheets.map((sheetName, index) => {
    const [description, headers, ...rows] = sheetsValues[index];
    const { notes, items } = extractNotesFromItems(rows);

    return {
      title: sheetName,
      description: description[0],
      headers: headers,
      items: items,
      notes,
    };
  });

  res.status(200).json(response);
}

function extractNotesFromItems(items = []) {
  const notesIndex = items.findIndex(
    (item) => item.includes('notas') || item.includes('NOTAS'),
  );

  if (notesIndex < 0) {
    return { items, notes: undefined };
  }

  return {
    items: items.slice(0, notesIndex),
    notes: items[notesIndex + 1][0],
  };
}

function clearArrayOfStrings(array = []) {
  console.log(array);
  return array.map(clearString);
}

const clearString = compose(removeLineBreakersFromString, trim);

function removeLineBreakersFromString(string = '') {
  return string.replace(/\r?\n|\r/g, ' ');
}

function trim(string = '') {
  return string.replace(/\s\s/g, ' ').trim();
}

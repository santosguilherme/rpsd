// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { google } from 'googleapis';

import compose from 'utils/functional/compose';

const DOCUMENT_ID = process.env.DOCUMENT_ID;
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

export async function query() {
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

    const [, titleRaw, headersRaw, ...itemsRaw] = values;
    const [, title] = titleRaw;
    const [, ...headers] = headersRaw;
    const items = itemsRaw.map(itemRaw => {
      const [, ...rest] = itemRaw;

      return rest;
    });

    return [[title], headers, ...items].map((item) => item.map(clearString));
  });

  return validSheets.map((sheetName, index) => {
    const [description, headers, ...rows] = sheetsValues[index];
    const { notes, items } = extractItemsAndNotesFromRows(rows);

    return {
      title: sheetName,
      description: description[0],
      headers: headers,
      items: items,
      notes,
    };
  });
}

function extractItemsAndNotesFromRows(rows = []) {
  const notesIndex = rows.findIndex(
    (item) => item.includes('notas') || item.includes('NOTAS'),
  );

  if (notesIndex < 0) {
    return { items: rows, notes: '' };
  }

  return {
    items: rows.slice(0, notesIndex),
    notes: rows[notesIndex + 1][0],
  };
}

const clearString = compose(removeLineBreakersFromString, trim, preserveEmptyCell);

function removeLineBreakersFromString(string = '') {
  return string.replace(/\r?\n|\r/g, ' ');
}

function trim(string = '') {
  return string.replace(/\s\s/g, ' ').trim();
}

function preserveEmptyCell(string = ''){
  return ['', 'N/A', 'n/a'].includes(string) ? '-' : string
}

function parseMarkdownTabstable(md) {
const rawLines = md.split(/\r?\n/);
let lines = [];
let inTable = false;
let fencedTable = false;

for (const rawLine of rawLines) {
    const line = rawLine.trim();

    if (!inTable) {
        if (/^\|!\|\s*$/.test(line)) {
            inTable = true;
            fencedTable = false;
            lines.push('|!|');
            continue;
        }

        if (/^```tabstable\s*$/.test(line)) {
            inTable = true;
            fencedTable = true;
            lines.push('|!|');
            continue;
        }

        continue;
    }

    if (fencedTable && /^```\s*$/.test(line)) {
        break;
    }

    if (!fencedTable && line === '') {
        break;
    }

    if (line !== '') {
        lines.push(line);
    }
}

  if (lines.length === 0) return { header: [], rows: [] };

  let header = [];
  let rows = [];
  let isHeader = false;

  lines.forEach((line, idx) => {
    if (/^\|!\|\s*$/.test(line)) {
      isHeader = true;
      return;
    }
	  	  
	if (isHeader && header.length === 0) {	  
      header = line.split(/\t+/).map(cell => {
        let align = 'left';
        if (cell.startsWith(':') && cell.endsWith(':')) align = 'center';
        else if (cell.endsWith(':')) align = 'right';
        else if (cell.startsWith(':')) align = 'left';
		let text = cell.replace(/^:/,'').replace(/:$/,'').trim(); // only remove colon from display
		return { text, align };
      });
    } else {
      isHeader = false;
      const cells = line.split(/\t+/).map(c => c.trim());
      let row = [];
      cells.forEach(c => {
        let cell = { text: c };
        const mCol = c.match(/!([0-9]+)>>/);
        const mRow = c.match(/!([0-9]+)<</);
        if (mCol) {
          cell.text = c.replace(/!([0-9]+)>>/, '').trim();
          cell.colspan = parseInt(mCol[1]);
        }
        if (mRow) {
          cell.text = c.replace(/!([0-9]+)<</, '').trim();
          cell.rowspan = parseInt(mRow[1]);
        }
        if (cell.text === '^|' || cell.text === '&empty') cell.text = '';
        row.push(cell);
      });
      rows.push(row);
    }
  });

  return { header, rows };
}

// Expose for button click
window.parseMarkdownTabstable = parseMarkdownTabstable;

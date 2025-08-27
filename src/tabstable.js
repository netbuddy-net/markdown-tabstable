function renderTabstable(mdText) {
    if (!mdText || typeof mdText !== 'string') return '';

    const lines = mdText.split(/\r?\n/).map(l => l.trimEnd());
    let tableLines = [];
    let inTable = false;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        // detect start marker
        if (line === '|!|') {
            inTable = true;
            continue;
        }

        // blank line ends table
        if (inTable && line === '') {
            break;
        }

        if (inTable) {
            tableLines.push(line);
        }
    }

    if (tableLines.length === 0) return '';

    const [headerLine, ...bodyLines] = tableLines;

    function parseCell(cellText) {
        let colspan = '';
        let rowspan = '';
        let text = cellText.trim();

        // dedicated empty cell
        if (text === '^|') {
            text = '';
        }

        // colspan: !N>>
        let spanMatch = text.match(/(.*?)\s+!([0-9]+)(>>|<<)\s*$/);
        if (spanMatch) {
            text = spanMatch[1].trim();
            const n = parseInt(spanMatch[2], 10) || 1;
            if (spanMatch[3] === '>>') {
                colspan = ` colspan="${n}"`;
            } else if (spanMatch[3] === '<<') {
                rowspan = ` rowspan="${n}"`;
            }
        }

        return { text, colspan, rowspan };
    }

    function parseRow(line) {
        let rawCells = line.split(/\t+/).map(c => c.trim());
        rawCells = rawCells.filter(c => c.length > 0 || c === '^|');
        return rawCells.map(parseCell);
    }
	
	// --- parse header with alignment ---
    let rawHeaderCells = headerLine.split(/\t+/).map(c => c.trim());
    rawHeaderCells = rawHeaderCells.filter(c => c.length > 0 || c === '^|');

    const headerCells = rawHeaderCells.map(raw => {
        const parsed = parseCell(raw); // parse spans and get base text
        let text = parsed.text;
        let align = 'left';

        if (/^:.*:$/.test(text)) {
            align = 'center';
            text = text.replace(/^:(.*):$/, '$1');
        } else if (/^:/.test(text)) {
            // leading colon → left (default); remove leading colon
            text = text.replace(/^:/, '');
        } else if (/:$/.test(text)) {
            align = 'right';
            text = text.replace(/:$/, '');
        }

        return {
            text,
            align,
            colspan: parsed.colspan,
            rowspan: parsed.rowspan
        };
    });

    // start HTML
    let html = '<table>\n';

    // header
    html += '<thead><tr>';
	
	
	headerCells.forEach(cell => {
        const alignAttr = cell.align ? ` align="${cell.align}"` : '';
        html += `<th${cell.colspan}${alignAttr}>${cell.text}</th>`;
    });
    html += '</tr></thead>\n';

    // body
    html += '<tbody>\n';
    bodyLines.forEach(line => {
        html += '<tr>';
		const cells = parseRow(line);
        cells.forEach((cell, i) => {
            let alignAttr = '';
            if (headerCells[i] && headerCells[i].align) {
                alignAttr = ` align="${headerCells[i].align}"`;
            }
            html += `<td${cell.colspan}${cell.rowspan}${alignAttr}>${cell.text}</td>`;	

			
			
			
        });
        html += '</tr>\n';
    });
    html += '</tbody>\n';

    html += '</table>';

    return html;
}

// Expose for button click
window.renderTabstable = renderTabstable;
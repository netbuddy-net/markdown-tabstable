// go.js
  /**
   * Render the intermediate representation (IR) to HTML table
   * @param {Array} ir - Intermediate representation from parseMarkdownTabstable
   * @returns {string} HTML string
   */
function renderMarkdownTabstable(ir) {
    console.log('renderMarkdownTabstable called', ir);

    if (!ir || typeof ir !== 'object' || 
        !Array.isArray(ir.header) || !Array.isArray(ir.rows)) {
        console.warn('IR is not a proper object with header and rows!');
        return '';
    }

    let html = '<table>\n';
    
    // header
    html += '<thead><tr>';
    ir.header.forEach(cell => {
        let align = '';
        if (cell.align) align = ` style="text-align:${cell.align}"`;
        html += `<th${align}>${cell.text}</th>`;
    });
    html += '</tr></thead>\n';

    // body
    html += '<tbody>\n';
    ir.rows.forEach(row => {
        html += '<tr>';
        row.forEach((cell, colIndex) => {
            let attrs = '';
            if (cell.colspan) attrs += ` colspan="${cell.colspan}"`;
            if (cell.rowspan) attrs += ` rowspan="${cell.rowspan}"`;

            // Apply alignment from header if not set on cell
            let align = '';
            if (cell.align) {
                align = ` style="text-align:${cell.align}"`;
            } else if (ir.header[colIndex] && ir.header[colIndex].align) {
                align = ` style="text-align:${ir.header[colIndex].align}"`;
            }

            html += `<td${attrs}${align}>${cell.text}</td>`;
        });
        html += '</tr>\n';
    });
    html += '</tbody></table>';

    return html;
}

  // Export globally
  window.renderMarkdownTabstable = renderMarkdownTabstable;




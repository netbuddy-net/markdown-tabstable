# Markdown Tabstable

A lightweight JavaScript library to render **tab-separated Markdown tables (Tabstables)** into HTML. Supports alignment, colspan, rowspan, and explicit empty cells. Can be used either as a **direct renderer** or via an **Intermediate Representation (IR)** for structured pipelines.

No pipes (`|`) are needed. A **single tab,** is sufficient to separate columns, while extra tabs or spaces are allowed but ignored during rendering. A visually "clean" table can be written directly in Markdown:

```text
Name		Age		    Town			Country
Anna		45	        London		    UK 
Alice 		22		    Bristol	        UK
Rick		28	        Lyon			FR	 
Bob		    30          Hawaii          US   
```     
 
## Features

- **Tab-separated tables**: Columns are separated by at least one tab.
- **Cell alignment**: Follows the same syntax as existing Markdown tables.
- **Colspan / Rowspan**:
	- colspan is supported on any cell.
	- rowspan currently works only on table body, it is ignored on table header.
- **Empty cells**: Dedicated empty cells can be created.
- **Two render paths**:
	- **Direct renderer**: Markdown → HTML (fast, browser-friendly)
	- **IR-based renderer**: Markdown → IR → HTML (structured, extendable)

## Syntax

- **Constraints**:
	- A table must be **preceded and followed by an empty line**.
	- The special marker `|!|` (pipe+exclamation mark+pipe) must appear **on the empty line** immediately before the table, with **no spaces** before it.
- **Tab-separated tables**: Columns are separated by **one tab**, extra tabs or spaces are allowed but ignored during rendering.
- **Cell alignment using header**:
	- `:Header:` → center
	- `Header:` → right
	- `Header` or `:Header` → left (default)
	- Applied to &lt;th&gt; and all &lt;td&gt; in the same column.
- **Colspan / Rowspan**:
	- ` !N>>` → **colspan=N**, (space+exclamation mark+number+greater+greater) following the last character in the cell, where N is the number of columns to span (remember the leading space).
	- ` !N<<` → **rowspan=N**, (space+exclamation mark+number+less+less) following the last character in the cell, where N is the number of rows to span (remember the leading space). Note: body only, rowspan on header currently ignored.
- **Empty cells**: Use `^|`  (caret+pipe) to create a dedicated empty cell.
- **Attention**: When using colspan or rowspan, ensure that all affected cells are completely empty (not even `^|`), because the span will occupy those cell positions.

## Markdown Example

```text
... other markdown content here ...
|!|
Name		:Age:		:Town			Country:
Anna		45			London			UK !2<<
Alice		22			Bristol	
Rick		^|			Lyon			FR	 
Bob			30			Hawaii !2>>

... other markdown content here ...
```

## HTML Output

<table style="display: table !important; border-collapse: collapse; width: 500px; table-layout: fixed;">
<thead><tr>
<th align="left">Name</th>
<th align="center">Age</th>
<th align="left">Town</th>
<th align="right">Country</th>
</tr></thead>
<tbody><tr>
<td align="left">Anna</td>
<td align="center">45</td>
<td align="left">London</td>
<td rowspan="2" align="right">UK</td>
</tr><tr>
<td align="left">Alice</td>
<td align="center">22</td>
<td align="left">Bristol</td>
</tr><tr>
<td align="left">Rick</td>
<td align="center"></td>
<td align="left">Lyon</td>
<td align="right">FR</td>
</tr><tr>
<td align="left">Bob</td>
<td align="center">30</td>
<td colspan="2" align="left">Hawaii</td>
</tr></tbody>
</table>

## Notes

- The library follows **HTML3 alignment rules** (align="...") for &lt;th&gt; and &lt;td&gt;.
- **Multiple header rows** are not supported yet. Future upgrades may add multi-level headers.
- Colspan and rowspan numbers (N) can be any positive integer, e.g., ` !10>>`.

## Project Structure

```text
markdown-tabstable/ 
│ 
├─ README.md			# This file 
├─ LICENSE 
├─ package.json 
├─ dist/ 
│  └─ tabstable.min.js 
├─ src/ 
│  ├─ tabstable.js		# Markdown → HTML renderer 
│  ├─ ir.js				# Markdown → Intermediate Representation (IR) 
│  └─ go.js				# IR → HTML pipeline 
├─ examples/ 
│  ├─ demo1.html		# Interactive Markdown → HTML renderer demo
│  └─ demo2.html		# Interactive Markdown → IR → HTML demo 
└─ docs/
    └─ USAGE.md			# Extended usage & examples
```

## Planned

- **Render Plugins for Major Markdown Engines**
Adapters for popular renderers (such as markdown-it, remark, and marked) are planned, making tabstable available as a drop-in plugin.
- **Extended Feature Set**
Additional syntax improvements and performance optimizations are under consideration.

## License

Copyright ©️ 2025, NetBuddy.Net. (MIT License)

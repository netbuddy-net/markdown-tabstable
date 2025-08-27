# Usage

There are two ways to render Tabstable tables, depending on the workflow:

## 1. Direct Renderer (tabstable.js)

- Converts Markdown tables directly into HTML.
- Recommended for **lightweight usage** in browsers or environments where no intermediate processing is required.
- Call the parser with Markdown input, and receive an HTML string.

```js
import { renderTabstable } from "./src/tabstable.js";

const md = `
|!|
Name		Age		    Town			Country
Anna		45	        London		    UK 
Alice 		22		    Bristol	        UK
Rick		28	        Lyon			FR	 
Bob		    30          Hawaii          US 
`;

const html = renderTabstable(md);
document.body.innerHTML = html;
```

## 2. Intermediate Representation (IR) Renderer (ir.js + go.js)

This two-step process is useful when the table data needs to be **manipulated, extended, or validated** before rendering.

### Step 1. Markdown → IR (ir.js)

- Parses Markdown and produces a structured **Intermediate Representation (IR)** object.
- IR is a JSON-like tree of rows, cells, and span attributes.

```js
import { mdToIR } from "./src/ir.js";

const md = `
|!|
Name		Age		    Town			Country
Anna		45	        London		    UK 
Alice 		22		    Bristol	        UK
Rick		28	        Lyon			FR	 
Bob		    30          Hawaii          US 
`;

const ir = mdToIR(md);
console.log(ir);
/* Example:
{ "header": [ { "text": "Name", "align": "left" }, { "text": "Age", "align": "center" }, { "text": "Town", "align": "left" }, { "text": "Country", "align": "right" } ], "rows": [ [ { "text": "Anna" }, { "text": "45" }, { "text": "London" }, { "text": "UK", "rowspan": 2 } ], [ { "text": "Alice" }, { "text": "22" }, { "text": "Bristol" } ], [ { "text": "Rick" }, { "text": "" }, { "text": "Lyon" }, { "text": "FR" } ], [ { "text": "Bob" }, { "text": "30" }, { "text": "Hawaii", "colspan": 2 } ] ] }
*/
```

### Step 2. IR → HTML (go.js)

- Takes the IR object and renders it into HTML.
- Keeps rendering consistent and extendable.

```js
import { irToHtml } from "./src/go.js";

const html = irToHtml(ir);
document.body.innerHTML = html;
```

## When to Use Which

- **Direct Renderer (tabstable.js)**:
Fast, minimal, no extra dependencies. Best when Markdown input goes straight to output.

- **IR Renderer (ir.js + go.js)**:
More flexible. Use when additional processing, transformations, or custom rendering are required.

---

ℹ️ **Note**: The IR format is stable but open for extension. Future features (custom attributes, advanced spans, styling hints) will build on the IR path.


# Example 03: Forms & Input

## What You'll Learn

- Creating forms with various input types
- Handling form submissions
- Collecting and validating user input

## The Concept

Forms are essential for collecting user input. MCP-UI supports all standard HTML form elements:

- Text inputs
- Email inputs
- Number inputs
- Textareas
- Select dropdowns
- Checkboxes
- Radio buttons

## Server Code

```typescript
// server.ts
import { createUIResource } from '@mcp-ui/server';

export function feedbackFormTool() {
  return createUIResource({
    uri: 'ui://form/feedback',
    content: {
      type: 'rawHtml',
      htmlString: `
        <form onsubmit="
          event.preventDefault();
          const formData = {};
          new FormData(this).forEach((value, key) => formData[key] = value);
          window.parent.postMessage({
            type: 'mcp-ui-action',
            action: 'tool',
            payload: { 
              toolName: 'submit_feedback', 
              params: formData 
            }
          }, '*');
        " style="max-width: 400px; padding: 24px;">
          
          <div style="margin-bottom: 16px;">
            <label style="display: block; margin-bottom: 4px; font-weight: 500;">
              Name *
            </label>
            <input 
              type="text" 
              name="name" 
              required
              style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;"
            />
          </div>
          
          <div style="margin-bottom: 16px;">
            <label style="display: block; margin-bottom: 4px; font-weight: 500;">
              Email *
            </label>
            <input 
              type="email" 
              name="email" 
              required
              style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;"
            />
          </div>
          
          <div style="margin-bottom: 16px;">
            <label style="display: block; margin-bottom: 4px; font-weight: 500;">
              Rating
            </label>
            <select name="rating" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
              <option value="5">Excellent</option>
              <option value="4">Good</option>
              <option value="3">Average</option>
              <option value="2">Poor</option>
              <option value="1">Very Poor</option>
            </select>
          </div>
          
          <div style="margin-bottom: 16px;">
            <label style="display: block; margin-bottom: 4px; font-weight: 500;">
              Comments
            </label>
            <textarea 
              name="comments" 
              rows="4"
              style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; resize: vertical;"
            ></textarea>
          </div>
          
          <button 
            type="submit"
            style="width: 100%; padding: 12px; background: #4f46e5; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 16px;"
          >
            Submit Feedback
          </button>
        </form>
      `
    },
    encoding: 'text'
  });
}
```

## Handling Form Data

```tsx
// client.tsx
const handleAction = (result: UIActionResult) => {
  if (result.type === 'tool' && result.payload.toolName === 'submit_feedback') {
    const formData = result.payload.params;
    console.log('Form submitted:', formData);
    // formData = { name: 'John', email: 'john@example.com', rating: '5', comments: 'Great!' }
    
    // Send to your backend or MCP tool
    callMCPTool('process_feedback', formData);
  }
};
```

## Form Validation

HTML5 validation attributes work:

```html
<input type="email" required pattern="[a-z]+@[a-z]+\.[a-z]+" />
```

For custom validation:

```html
<form onsubmit="
  event.preventDefault();
  const email = this.email.value;
  if (!email.includes('@company.com')) {
    alert('Please use your company email');
    return;
  }
  // ... submit
">
```

## Try It Yourself

1. Run the playground: `bun run dev:playground`
2. Select "form" from the resource picker
3. Fill out the form and submit
4. Check the Action Log for the submitted data

## Key Takeaways

1. **Use FormData API** - Easy way to collect all form values
2. **HTML5 validation** - Use `required`, `pattern`, `type` attributes
3. **Serialize to object** - Convert FormData to plain object for JSON
4. **Visual feedback** - Show success/error states after submission

## Next Steps

→ [Example 04: External URLs](../04-external-url/README.md)

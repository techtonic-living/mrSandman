# Figma Widget API - Making Network Requests

> **Reference Documentation for Widget Development**
> Last Updated: November 26, 2025

---

## Table of Contents

1. [Overview](#overview)
2. [Make Network Requests](#make-network-requests)
3. [Test Network Access](#test-network-access)
4. [Specify Network Access](#specify-network-access)
5. [Best Practices](#best-practices)
6. [Resources](#resources)
7. [Next Steps](#next-steps)

---

## Overview

This guide describes how to make basic network requests, test network access, and specify the scope of your widget's network access.

**Best Practice**: Your widget should only allow domains that are needed for your widget to work.

### Development Workflow

In practice, you first develop your widget and implement all the required network requests. Then, before publishing, you can use the instructions in this guide to specify access to only the domains used by your widget.

### Key Concepts

- **Fetch API** - Modern approach using Plugin API (recommended)
- **CORS Policies** - Widgets have `null` origin, require `Access-Control-Allow-Origin: *`
- **networkAccess** - Manifest configuration for domain allowlisting
- **CSP Errors** - Content Security Policy violations when accessing blocked domains

⚠️ **Prerequisites**

This guide assumes that you're familiar with the basics of creating Figma widgets. If you're new to developing plugins and widgets, check out the [Build your first plugin](https://help.figma.com/hc/en-us/articles/4407260620823--BYFP-1-Overview) course.

---

## Make Network Requests

Making network requests with widgets is very similar to making network requests with [plugins](https://developers.figma.com/docs/plugins/making-network-requests/). The widget approach [uses the Plugin API](https://developers.figma.com/docs/widgets/using-the-plugin-api/), and so has the same requirements and limitations as other uses of the Plugin API.

### Basic Fetch API Example

The following code creates an element that, when clicked, uses the Fetch API to make a request. The response is then rendered in a new text node.

**code.tsx:**

```tsx
const { widget } = figma
const { Text } = widget

// This widget fetches a resource and renders the text response in a rectangle.
function Widget() {
  return (
    <Text
      fontSize={24}
      onClick={
        () =>
          (async () => {
            const response = await fetch('https://httpbin.org/get?success=true')
            const json = await response.json()
            const textNode = figma.createText()

            // Make sure the new text node is visible where we're currently looking
            textNode.x = figma.viewport.center.x
            textNode.y = figma.viewport.center.y

            await figma.loadFontAsync(textNode.fontName as FontName)

            // success=true!
            textNode.characters = JSON.stringify(json.args, null, 2)
            figma.closePlugin()
          })()
      }
    >
      Show fetch response
    </Text>
  )
}

widget.register(Widget)
```

### CORS Considerations

Because widgets run inside a browser environment, [Cross-Origin Resource Sharing (CORS)](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) policies apply.

⚠️ **Important: Widget Origin**

Widget iframes have a `null` origin. This means that they will only be able to call APIs with `Access-Control-Allow-Origin: *` (i.e., those that allow access from any origin).

### Legacy iFrame Approach

📝 **Migration Note**

Previously, to make network requests within a widget, you had to implement an iframe to handle sending requests and receiving data. While widgets implemented this way will continue to function normally and do not need to be modified, we recommend using the simpler [Fetch API](https://developers.figma.com/docs/plugins/api/properties/global-fetch/) approach. The Fetch API is provided by the Plugin API, which can be used with your widgets.

---

## Test Network Access

After you've implemented network requests in your widget, whether calls to an API or getting images from a server, test the impact of limiting your widget's network access. Then, use the results of your testing to build the list of domains you need to appropriately limit network access.

### Testing Procedure

**Step 1: Block All Network Access**

In your widget's `manifest.json`, add the `networkAccess` key with the `allowedDomains` property set to `["none"]`.

**manifest.json:**

```json
{
  "name": "MyWidget",
  "id": "737805260747778093",
  "api": "1.0.0",
  "widgetApi": "1.0.0",
  "editorType": ["figma", "figjam"],
  "containsWidget": true,
  "main": "code.js",
  "ui": "ui.html",
  "networkAccess": {
    "allowedDomains": ["none"]
  }
}
```

**Step 2: Identify CSP Errors**

In Figma, try to use your widget as normal. In the developer console, note any content-security policy (CSP) errors.

**Example CSP Error:**

```
Refused to connect to 'https://httpbin.org/' because it violates the following Content Security Policy directive: "default-src data:". Note that 'connect-src' was not explicitly set, so 'default-src' is used as a fallback.
```

**Step 3: Add Required Domains**

As you identify CSP errors, follow the [Specify Network Access](#specify-network-access) steps to remove `"none"` and add the domains that your widget requires to the `allowedDomains` list.

**Step 4: Validate**

When you're confident that all the required domains are listed in `allowedDomains` and you no longer encounter CSP errors, testing is complete.

---

## Specify Network Access

To specify a list of domains that your widget is allowed to access, you update the widget's `manifest.json` file.

### Configuration Steps

**Step 1: Add networkAccess Key**

In your widget's `manifest.json`, add the `networkAccess` key. `networkAccess` has the following properties: `allowedDomains`, `reasoning`, and `devAllowedDomains`.

**manifest.json:**

```json
{
  "name": "MyWidget",
  "id": "737805260747778093",
  "api": "1.0.0",
  "widgetApi": "1.0.0",
  "editorType": ["figma", "figjam"],
  "containsWidget": true,
  "main": "code.js",
  "ui": "ui.html",
  "networkAccess": {
    "allowedDomains": [],
    "reasoning": "",
    "devAllowedDomains": []
  }
}
```

**Step 2: Add Domains to allowedDomains**

The domains that you add to the list should correspond to the domains that you are making requests to. This includes any requests you make for external resources using methods like `createImageAsync()`.

**Example - Domain-level access:**

```json
{
  "name": "MyWidget",
  "id": "737805260747778093",
  "api": "1.0.0",
  "widgetApi": "1.0.0",
  "editorType": ["figma", "figjam"],
  "containsWidget": true,
  "main": "code.js",
  "ui": "ui.html",
  "networkAccess": {
    "allowedDomains": ["httpbin.org"],
    "reasoning": "",
    "devAllowedDomains": []
  }
}
```

**Example - Endpoint-specific access (more secure):**

If the only endpoint the widget uses is `/get`, make the string in the `allowedDomains` list even more granular:

```json
{
  "name": "MyWidget",
  "id": "737805260747778093",
  "api": "1.0.0",
  "widgetApi": "1.0.0",
  "editorType": ["figma", "figjam"],
  "containsWidget": true,
  "main": "code.js",
  "ui": "ui.html",
  "networkAccess": {
    "allowedDomains": ["httpbin.org/get"],
    "reasoning": "",
    "devAllowedDomains": []
  }
}
```

⚠️ **Security Benefit**

This way, no unexpected requests can be made to other endpoints on the domain.

### Special Domain Patterns

📝 **Special Keywords and Patterns**

There are several patterns that can be used to specify domains for `allowedDomains`. For a complete list, see [Widget Manifest](https://developers.figma.com/docs/widgets/widget-manifest/).

**`["none"]`** - Special keyword that prevents all network access. Use this if your widget doesn't make any network requests.

**`["*"]`** - Special character that permits your widget to access any domain. If your widget includes `*` in `allowedDomains`, then `reasoning` is **required**.

**Step 3: Provide Reasoning**

For `reasoning`, provide a brief explanation for the access scope permitted by `allowedDomains`. When you publish your widget, this explanation is visible on your widget's Community page along with the list of allowed domains.

**Example:**

```json
{
  "name": "MyWidget",
  "id": "737805260747778093",
  "api": "1.0.0",
  "widgetApi": "1.0.0",
  "editorType": ["figma", "figjam"],
  "containsWidget": true,
  "main": "code.js",
  "ui": "ui.html",
  "networkAccess": {
    "allowedDomains": ["httpbin.org/get"],
    "reasoning": "MyPlugin queries httpbin.org/get for example responses.",
    "devAllowedDomains": []
  }
}
```

**Step 4: Add Development Domains (Optional)**

If you need to access a local or development web server to build your widget, add its domain(s) to the `devAllowedDomains` list. The domains that you add to the list should correspond to the local URL(s) for your development server.

⚠️ **Development Server Access**

If you want to access a local or development web server in `allowedDomains`, then `reasoning` is required.

**Example:**

```json
{
  "name": "MyPlugin",
  "id": "737805260747778092",
  "api": "1.0.0",
  "main": "code.js",
  "ui": "ui.html",
  "networkAccess": {
    "allowedDomains": ["httpbin.org/get"],
    "reasoning": "MyPlugin queries httpbin.org/get for example responses.",
    "devAllowedDomains": ["http://localhost:3000"]
  }
}
```

**Step 5: Save and Test**

Save the changes to your manifest.

### Enforcement

After `networkAccess` is implemented, Figma enforces the list of domains that you gave for `allowedDomains`. If a request originates from your widget to a domain not in `allowedDomains`, Figma blocks the request and throws a [content-security policy (CSP)](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP) error.

**Example CSP Error:**

For example, if our widget attempts to make a request to `httpbin.org/post`, we get the following error:

```
Refused to connect to 'https://httpbin.org/post' because it violates the following Content Security Policy directive: "default-src data:". Note that 'connect-src' was not explicitly set, so 'default-src' is used as a fallback.
```

---

## Best Practices

### Security

- **Principle of Least Privilege** - Only allow the specific domains and endpoints your widget actually needs
- **Granular Permissions** - Use endpoint-specific access (e.g., `"httpbin.org/get"`) rather than domain-level access when possible
- **Avoid Wildcards** - Don't use `["*"]` unless absolutely necessary; if you must, provide detailed reasoning

### Development

- **Test Early** - Test network access limitations before publishing
- **Use devAllowedDomains** - Keep development URLs separate from production domains
- **Document Reasoning** - Provide clear explanations for why domains are needed (users will see this)

### CORS Compatibility

- **Check API Headers** - Ensure external APIs return `Access-Control-Allow-Origin: *`
- **Use Proxy if Needed** - If an API doesn't support CORS, consider setting up a proxy server
- **Handle Errors** - Implement proper error handling for network failures

---

## Resources

### Network Requests

- **[Fetch API (Plugin API)](https://developers.figma.com/docs/plugins/api/properties/global-fetch/)** - JavaScript Fetch API reference
- **[Making Network Requests (Plugins)](https://developers.figma.com/docs/plugins/making-network-requests/)** - Plugin guide with same concepts
- **[Widget Manifest](https://developers.figma.com/docs/widgets/widget-manifest/)** - Complete manifest configuration reference

### Web Standards

- **[Cross-Origin Resource Sharing (CORS)](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)** - MDN CORS documentation
- **[Content Security Policy (CSP)](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)** - MDN CSP documentation
- **[Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)** - MDN Fetch API guide

### Related Topics

- **[Using the Plugin API](https://developers.figma.com/docs/widgets/using-the-plugin-api/)** - How widgets access Plugin API
- **[Handling User Events](https://developers.figma.com/docs/widgets/handling-user-events/)** - Click handlers for triggering requests
- **[Build Your First Plugin](https://help.figma.com/hc/en-us/articles/4407260620823--BYFP-1-Overview)** - Getting started course

### Community & Support

Get help and connect with other developers:

- **[Figma Community Forum](https://forum.figma.com/c/plugin-widget-api/20)** - Plugin and widget related questions
- **[Discord Server](https://discord.gg/xzQhe2Vcvx)** - Community-driven developer server
- **[Sample Widgets on GitHub](https://github.com/figma/widget-samples)** - Real-world examples

---

## Next Steps

Ready to add more functionality? Here's what to explore next:

1. **Handle User Input** - [Learn about text editing →](https://developers.figma.com/docs/widgets/text-editing/)
2. **Display Images** - [Work with images and createImageAsync →](https://developers.figma.com/docs/plugins/api/properties/createimageasync/)
3. **Add Authentication** - Implement OAuth flows with network requests
4. **Study Examples** - [Browse sample widgets →](https://github.com/figma/widget-samples)

---

**Questions or feedback?** [Leave us feedback](https://form.asana.com/?k=6r2Tos6p01DyVKGLeYJByg&d=10497086658021)

---
agent: agent
---

# Add Developer Reference Documentation

## Task

Fetch content from a provided URL and generate a well-formatted reference document following the project's documentation template.

## Requirements

1. **Fetch the URL** provided by the user
2. **Extract relevant content** - focus on technical documentation, API references, guides, or tutorials
3. **Generate a markdown document** at the specified file path using the template structure from `/.github/templates/devdoc_TEMPLATE.md`
4. **Follow the template format** including:
    - Header with title and last updated date
    - Table of contents with working anchor links
    - Overview section introducing the topic
    - Multiple detailed sections with subsections
    - Code examples where applicable
    - Important callouts and warnings (⚠️ format)
    - Resources and links section
    - Next steps section
    - Footer with feedback link

## Constraints

-   Must use the exact markdown formatting from the template
-   Preserve the professional tone and structure
-   Include working internal anchor links in the table of contents
-   Code blocks must specify language for syntax highlighting
-   All external links must be preserved from source content
-   Date format: "Month Day, Year" (e.g., "November 26, 2025")

## Success Criteria

-   [ ] Content successfully fetched from URL
-   [ ] Document created at specified path with proper directory structure
-   [ ] All template sections are populated with relevant content
-   [ ] Table of contents matches actual section headings
-   [ ] Code examples are properly formatted with language tags
-   [ ] Document is readable, well-organized, and easy to navigate
-   [ ] Important concepts are highlighted with callout boxes
-   [ ] Related resources and next steps are included
-   [ ] `/.github/copilot-instructions.md` updated with any new patterns, conventions, or API information discovered from the documentation

## Usage Pattern

User provides:

1. URL to fetch documentation from
2. Destination file path (e.g., `/docs/devdocs/figma/widget-api/topic-name.md`)

Example: "Fetch https://developers.figma.com/docs/widgets/handling-user-events and create reference doc at `/docs/devdocs/figma/widget-api/user-events.md`"

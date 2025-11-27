# Figma Widget API - Images in Widgets

> **Reference Documentation for Widget Development**
> Last Updated: November 26, 2025

---

## Table of Contents

1. [Overview](#overview)
2. [Using the Image Component](#using-the-image-component)
3. [Image Sources](#image-sources)
4. [Using Images as Fills](#using-images-as-fills)
5. [Sizing and Styling](#sizing-and-styling)
6. [Advanced Patterns](#advanced-patterns)
7. [Resources](#resources)
8. [Next Steps](#next-steps)

---

## Overview

You can render images as part of a widget using the **`<Image>`** component or by using the **`fill`** property on `<Frame>` and `<Rectangle>` elements.

### Image Component

An `Image` is essentially syntactic sugar for a [Rectangle](https://developers.figma.com/docs/widgets/api/component-Rectangle/) with an image fill. Instead of the `fill` prop, it has a `src` prop that can be either:

- **URL string** - Used to create an ImagePaint automatically
- **ImagePaint object** - For more control over image display

### Use Cases

- **User avatars** - Display profile photos
- **Icons and logos** - Brand elements or UI icons
- **Data visualization** - Charts, graphs, diagrams
- **Product images** - Photos or illustrations
- **Decorative elements** - Background patterns or textures

---

## Using the Image Component

### Basic Image

The simplest way to display an image is using a URL or data URI.

**Example:**

```tsx
const { widget } = figma
const { Image, AutoLayout } = widget

function ImageExamples() {
  return (
    <AutoLayout>
      <Image
        // Pass a data URI directly as the image
        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAALCAYAAACprHcm..."
        width={100}
        height={100}
      />
    </AutoLayout>
  )
}

widget.register(ImageExamples)
```

### User Photo Example

Display the current user's profile photo:

```tsx
const { widget } = figma
const { Image, AutoLayout } = widget

function UserAvatar() {
  return (
    <AutoLayout>
      <Image
        src={figma.currentUser?.photoUrl || ""}
        width={50}
        height={50}
        cornerRadius={25}  // Make it circular
      />
    </AutoLayout>
  )
}

widget.register(UserAvatar)
```

### Required Props

⚠️ **Image Size Required**

The `width` and `height` props are **required** for the Image component.

```tsx
<Image
  src="https://example.com/image.png"
  width={200}   // Required
  height={150}  // Required
/>
```

---

## Image Sources

### URL String

Pass an HTTP(S) URL directly:

```tsx
<Image
  src="https://example.com/photo.jpg"
  width={300}
  height={200}
/>
```

⚠️ **Network Access Required**

URLs must be allowed in your widget's `manifest.json` under `networkAccess.allowedDomains`. See [Making Network Requests](https://developers.figma.com/docs/widgets/making-network-requests/).

### Data URI

Embed images directly as base64-encoded data URIs:

```tsx
<Image
  src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA..."
  width={100}
  height={100}
/>
```

**Use Cases for Data URIs:**
- Small icons or graphics
- Embedded SVGs converted to PNG
- Images that shouldn't require network access
- Fallback images

### ImagePaint Object

For more control, use an ImagePaint object:

```tsx
<Image
  src={{
    type: 'image',
    src: figma.currentUser.photoUrl,
    scaleMode: 'FILL',  // or 'FIT', 'CROP', 'TILE'
  }}
  width={100}
  height={100}
/>
```

**ImagePaint Properties:**
- **`type`** - Always `'image'`
- **`src`** - URL or data URI
- **`scaleMode`** - How image is sized: `'FILL'`, `'FIT'`, `'CROP'`, `'TILE'`
- **`imageHash`** - Hash of the image (optional)
- **`imageTransform`** - Transformation matrix (optional)
- **`scalingFactor`** - Scale factor (optional)
- **`rotation`** - Rotation angle (optional)
- **`filters`** - Image filters (optional)

---

## Using Images as Fills

### Frame with Image Fill

Apply images to Frame or Rectangle using the `fill` property:

```tsx
const { widget } = figma
const { Frame, AutoLayout } = widget

function FrameWithImage() {
  return (
    <AutoLayout>
      <Frame
        fill={{
          type: 'image',
          src: figma.currentUser.photoUrl
        }}
        width={100}
        height={100}
      />
    </AutoLayout>
  )
}

widget.register(FrameWithImage)
```

### Multiple Fill Layers

Frames can have multiple fills, including images:

```tsx
<Frame
  fill={[
    {
      type: 'image',
      src: 'https://example.com/background.jpg',
      opacity: 0.5
    },
    {
      type: 'solid',
      color: { r: 0, g: 0, b: 0 },
      opacity: 0.3
    }
  ]}
  width={300}
  height={200}
/>
```

---

## Sizing and Styling

### Corner Radius

Create rounded images:

```tsx
<Image
  src={photoUrl}
  width={100}
  height={100}
  cornerRadius={8}  // Rounded corners
/>

// Circular image
<Image
  src={photoUrl}
  width={50}
  height={50}
  cornerRadius={25}  // Half of width/height for circle
/>
```

### Different Corner Radii

Apply different radii to each corner:

```tsx
<Image
  src={photoUrl}
  width={100}
  height={100}
  cornerRadius={{
    topLeft: 16,
    topRight: 8,
    bottomRight: 16,
    bottomLeft: 8
  }}
/>
```

### Stroke and Border

Add borders to images:

```tsx
<Image
  src={photoUrl}
  width={100}
  height={100}
  cornerRadius={50}
  stroke="#0066ff"
  strokeWidth={3}
  strokeAlign="inside"  // or "center", "outside"
/>
```

### Opacity and Blend Mode

Control image transparency and blending:

```tsx
<Image
  src={photoUrl}
  width={200}
  height={150}
  opacity={0.8}
  blendMode="multiply"  // Various blend modes available
/>
```

### Effects

Apply shadow or blur effects:

```tsx
<Image
  src={photoUrl}
  width={100}
  height={100}
  cornerRadius={8}
  effect={{
    type: 'drop-shadow',
    color: { r: 0, g: 0, b: 0, a: 0.25 },
    offset: { x: 0, y: 4 },
    radius: 8
  }}
/>
```

---

## Advanced Patterns

### Image Gallery

Create a grid of images:

```tsx
const { widget } = figma
const { AutoLayout, Image, useSyncedState } = widget

function ImageGallery() {
  const images = [
    'https://example.com/photo1.jpg',
    'https://example.com/photo2.jpg',
    'https://example.com/photo3.jpg',
    'https://example.com/photo4.jpg',
  ]

  return (
    <AutoLayout direction="vertical" spacing={8}>
      {/* Row 1 */}
      <AutoLayout spacing={8}>
        <Image src={images[0]} width={150} height={150} cornerRadius={8} />
        <Image src={images[1]} width={150} height={150} cornerRadius={8} />
      </AutoLayout>

      {/* Row 2 */}
      <AutoLayout spacing={8}>
        <Image src={images[2]} width={150} height={150} cornerRadius={8} />
        <Image src={images[3]} width={150} height={150} cornerRadius={8} />
      </AutoLayout>
    </AutoLayout>
  )
}

widget.register(ImageGallery)
```

### Clickable Images

Add interactivity to images:

```tsx
const { widget } = figma
const { Image, Text, AutoLayout, useSyncedState } = widget

function ClickableImage() {
  const [clicked, setClicked] = useSyncedState('clicked', false)

  return (
    <AutoLayout direction="vertical" spacing={8}>
      <Image
        src="https://example.com/button.png"
        width={200}
        height={60}
        onClick={() => {
          setClicked(!clicked)
          figma.notify(clicked ? 'Unclicked!' : 'Clicked!')
        }}
        hoverStyle={{
          opacity: 0.8
        }}
      />
      <Text>{clicked ? 'Clicked!' : 'Click the image'}</Text>
    </AutoLayout>
  )
}

widget.register(ClickableImage)
```

### Dynamic Image Loading

Load images based on user interaction:

```tsx
const { widget } = figma
const { Image, Text, AutoLayout, useSyncedState } = widget

function DynamicImages() {
  const [imageUrl, setImageUrl] = useSyncedState('imageUrl', '')
  const [loading, setLoading] = useSyncedState('loading', false)

  const loadRandomImage = async () => {
    setLoading(true)
    try {
      const response = await fetch('https://api.example.com/random-image')
      const data = await response.json()
      setImageUrl(data.url)
    } catch (error) {
      figma.notify('Failed to load image')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AutoLayout direction="vertical" spacing={12} padding={16}>
      {imageUrl ? (
        <Image
          src={imageUrl}
          width={300}
          height={200}
          cornerRadius={8}
        />
      ) : (
        <Text>No image loaded</Text>
      )}

      <Text
        onClick={loadRandomImage}
        fill="#0066ff"
        textDecoration="underline"
      >
        {loading ? 'Loading...' : 'Load Random Image'}
      </Text>
    </AutoLayout>
  )
}

widget.register(DynamicImages)
```

### Image with Fallback

Provide fallback for missing images:

```tsx
function ImageWithFallback({ src, width, height }) {
  const fallbackSrc = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='100%25' height='100%25' fill='%23ddd'/%3E%3C/svg%3E"

  return (
    <Image
      src={src || fallbackSrc}
      width={width}
      height={height}
      cornerRadius={4}
    />
  )
}
```

### Responsive Images

Create images that adapt to container size:

```tsx
<AutoLayout width="fill-parent" padding={16}>
  <Image
    src={photoUrl}
    width="fill-parent"
    height={200}
    cornerRadius={8}
  />
</AutoLayout>
```

---

## Resources

### Image Component

- **[Image Component API](https://developers.figma.com/docs/widgets/api/component-Image/)** - Complete API reference
- **[ImagePaint Type](https://developers.figma.com/docs/widgets/api/type-ImagePaint/)** - ImagePaint object specification
- **[Rectangle Component](https://developers.figma.com/docs/widgets/api/component-Rectangle/)** - Alternative for image fills

### Styling Props

- **[CornerRadius Type](https://developers.figma.com/docs/widgets/api/type-CornerRadius/)** - Corner radius options
- **[Effect Type](https://developers.figma.com/docs/widgets/api/type-Effect/)** - Shadow and blur effects
- **[BlendMode Type](https://developers.figma.com/docs/widgets/api/type-BlendMode/)** - Blend mode options
- **[Size Type](https://developers.figma.com/docs/widgets/api/type-Size/)** - Size specification

### Related Topics

- **[Making Network Requests](https://developers.figma.com/docs/widgets/making-network-requests/)** - Load external images
- **[Handling User Events](https://developers.figma.com/docs/widgets/handling-user-events/)** - Add click handlers
- **[Working with Lists](https://developers.figma.com/docs/widgets/working-with-lists/)** - Render image galleries
- **[Frame Component](https://developers.figma.com/docs/widgets/api/component-Frame/)** - Container with image fills

### Plugin API

- **[createImage](https://developers.figma.com/docs/plugins/api/figma/#createimage)** - Create image nodes (Plugin API)
- **[createImageAsync](https://developers.figma.com/docs/plugins/api/figma/#createimageasync)** - Async image creation

### Community & Support

Get help and connect with other developers:

- **[Figma Community Forum](https://forum.figma.com/c/plugin-widget-api/20)** - Plugin and widget related questions
- **[Discord Server](https://discord.gg/xzQhe2Vcvx)** - Community-driven developer server
- **[Sample Widgets on GitHub](https://github.com/figma/widget-samples)** - Real-world examples

---

## Next Steps

Ready to build more complex widgets? Here's what to explore next:

1. **Manage Multiple Widgets** - [Learn about widget instances →](https://developers.figma.com/docs/widgets/managing-multiple-widgets/)
2. **Fetch External Images** - [Make network requests →](https://developers.figma.com/docs/widgets/making-network-requests/)
3. **Add Interactivity** - [Handle user events →](https://developers.figma.com/docs/widgets/handling-user-events/)
4. **Study Examples** - [Browse sample widgets →](https://github.com/figma/widget-samples)

---

**Questions or feedback?** [Leave us feedback](https://form.asana.com/?k=6r2Tos6p01DyVKGLeYJByg&d=10497086658021)

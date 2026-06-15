# QR Code Generator - Utility Tool

## Overview

The QR Code Generator is a utility tool available for creating branded QR codes with the customer logo embedded in the center. QR codes are scannable images that store information and can be read by smartphone cameras.

---

## What is a QR Code?

A QR (Quick Response) code is a two-dimensional barcode that can store various types of information. When scanned with a smartphone camera or QR reader app, it instantly decodes the stored data and performs the appropriate action (opening a URL, composing an email, connecting to WiFi, etc.).

---

## Features

### Content Types Supported

The QR Generator supports 5 different content types:

| Type | Description | Example Output |
|------|-------------|----------------|
| **URL** | Website links | Opens browser to specified website |
| **Text** | Plain text messages | Displays text on device |
| **Email** | Email addresses | Opens email app with pre-filled recipient |
| **Phone** | Phone numbers | Opens phone dialer with number ready |
| **WiFi** | WiFi network credentials | Auto-connects device to network |

### Customization Options

- **QR Code Size:** 150x150, 200x200, 300x300, 400x400, 500x500 pixels
- **Color Presets:** Black, Navy Blue, Forest Green, Crimson Red, Royal Purple, Burnt Orange
- **Custom Colors:** Full color picker for any color
- **Logo Variants:** Standard logo

### Output Features

- **Download PNG:** Save QR code as PNG image file
- **Copy to Clipboard:** Copy QR code image directly for pasting

---

## Use Cases

### 1. Event Management

- **Event Registration:** Create QR codes linking to registration forms
- **Event Check-in:** Generate unique QR codes for attendee check-in
- **Event Materials:** Link to digital event programs or schedules

### 2. Marketing & Communications

- **Promotional Materials:** Add QR codes to posters linking to landing pages
- **Business Cards:** Include personal contact QR codes on digital cards
- **Social Media Links:** Quick links to social media profiles
- **Brochures & Flyers:** Link printed materials to online content

### 3. Academic Use

- **Course Materials:** Link to online resources, reading materials
- **Submission Portals:** Quick access to assignment submission pages
- **Survey & Feedback:** Link to student feedback forms
- **Research Papers:** Link to full papers or supplementary materials

### 4. Administrative Operations

- **WiFi Access:** Share guest WiFi credentials easily
- **Room Booking:** Link to room reservation systems
- **Document Access:** Quick links to shared documents
- **Contact Information:** Share staff contact details efficiently

### 5. Campus Navigation

- **Building Directions:** Link to campus maps
- **Facility Information:** Details about labs, libraries, rooms
- **Emergency Information:** Quick access to emergency procedures

---

## How to Use

### Step 1: Select Content Type

Choose from URL, Text, Email, Phone, or WiFi based on what information you want to encode.

### Step 2: Enter Content

Input the relevant information:
- **URL:** Full website address (must include `http://` or `https://`)
- **Text:** Any message (Vietnamese characters supported)
- **Email:** Valid email address
- **Phone:** Phone number with country code
- **WiFi:** Network name, password, and security type

### Step 3: Customize Appearance

- Select preferred size based on intended use
- Choose a color that matches your branding needs
- Toggle white logo if using dark QR colors

### Step 4: Generate & Export

- Click "Generate QR Code" to create
- Download as PNG or copy to clipboard for use

---

## WiFi QR Code Details

For WiFi QR codes, the generator creates a standard WiFi configuration format:

```
WIFI:T:{encryption};S:{network_name};P:{password};;
```

**Security Types:**
- WPA/WPA2 (most common, recommended)
- WEP (legacy)
- No Password (open networks)

When scanned, compatible devices will prompt to connect to the network automatically.

#### Basic Validations

- **Required content:** The "Generate QR Code" button stays disabled until the selected content type has all required fields filled in.
- **URL format:** Must start with `http://` or `https://` and pass a basic URL syntax check before generation is allowed.
- **Email format:** Must match a standard `name@domain.tld` pattern.
- **Phone format:** Digits only, with an optional leading `+`, between 7 and 15 characters (E.164-style).
- **WiFi fields:** Network name (SSID) is required (max 32 characters); password is required and at least 8 characters unless the security type is set to "No Password". Reserved characters (`;`, `,`, `"`, `\`) in the SSID/password are automatically escaped per the WiFi QR spec.
- **Length limit:** Text/URL content is capped based on the QR code's data capacity for the selected size, so the generated code remains reliably scannable.

#### Content Filtering (18+ & NSFW Protection)

To keep generated QR codes appropriate for shared/public use (posters, campus boards, classrooms), free-text input (Text, URL, and WiFi network name fields) is screened before a QR code is generated:

- **AI-based moderation (optional, recommended):** If `VITE_GEMINI` is configured, the entered content is sent to the Gemini API (Google AI Studio) with a moderation prompt that classifies the text for 18+/NSFW/explicit, hateful, or otherwise inappropriate material. If the content is flagged, QR generation is blocked and the user sees a message asking them to revise their input.
- **Keyword fallback:** If `VITE_GEMINI` is not configured, a local keyword/denylist filter runs instead, blocking a baseline set of explicit terms. This is less accurate than the AI check but ensures filtering is always active.
- **Fail-safe behavior:** If the Gemini API call fails or times out, the tool falls back to the local keyword filter rather than blocking or allowing generation unconditionally.
- **Privacy:** Only the text content entered by the user is sent for moderation — no images, logos, or generated QR codes are transmitted.

---

## Best Practices

### Do's

- **Test before printing:** Always scan your QR code to verify it works
- **Use appropriate size:** Larger sizes for posters, smaller for digital use
- **Ensure contrast:** Dark QR on light background works best
- **Add context:** Include text near QR explaining what it links to
- **Use short URLs:** Shorter data = simpler, more scannable QR codes

### Don'ts

- **Don't make too small:** Minimum 2cm x 2cm for reliable scanning
- **Don't distort:** Keep QR codes square, no stretching
- **Don't over-customize:** Too many color changes can affect scannability
- **Don't hide:** Place QR codes in visible, accessible locations

---

## Common Scenarios

### Scenario 1: Conference Poster
Create a URL QR code linking to the conference registration page. Use the official brand color with standard logo. Download at 400x400 for high-quality printing.

### Scenario 2: Guest WiFi
Create a WiFi QR code with network name, WPA2 password. Print and display in meeting rooms for easy guest access.

### Scenario 3: Email Contact
Create an email QR code for department contact. When scanned, opens email app with recipient pre-filled.

### Scenario 4: Event Feedback
Create a URL QR code linking to a Google Form or survey. Display on event materials for instant feedback collection.

---

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_GEMINI` | Gemini API key for AI content moderation | Optional (enhances filtering) |
| `VITE_FIREBASE_*` | Firebase config for QR tracking | Required for tracking |

---

## Development

This project is built with React, TypeScript, and Vite.

```bash
npm install
npm run dev      # start dev server
npm run build    # production build
```

Copy `.env.example` to `.env` and fill in the variables above to enable AI content moderation and/or QR tracking.

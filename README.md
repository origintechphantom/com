# OriginTech Professional Website

A modern, responsive website for tech companies offering app development, web development, software management, and IT consulting services.

## 📁 Project Structure

```
origintech website/
├── index.html          # Main HTML file
├── styles.css          # CSS styling and responsive design
├── script.js           # JavaScript for interactivity
└── README.md           # This file
```

## ✨ Features

- **Professional Design**: Modern gradient backgrounds and clean layout
- **Responsive**: Works perfectly on desktop, tablet, and mobile devices
- **Multiple Sections**:
  - Hero section with call-to-action
  - Services showcase (6 service categories)
  - About section with company stats
  - Portfolio/Recent Projects
  - Contact form
  - Footer with social links

- **Interactive Elements**:
  - Smooth scrolling navigation
  - Hover effects on cards and buttons
  - Mobile-friendly hamburger menu
  - Working contact form
  - Scroll animations

- **Professional Images**: Uses high-quality tech images from Unsplash (automatically loaded from CDN)

## 🚀 How to Use

### Option 1: Open in Browser
1. Right-click on `index.html`
2. Select "Open with" → Your favorite browser
3. Done! The website is ready to use

### Option 2: Using Live Server (Recommended)
If you have VS Code with Live Server extension:
1. Right-click on `index.html`
2. Select "Open with Live Server"
3. Website opens with auto-refresh on file changes

### Option 3: Web Server
1. Navigate to the folder in terminal
2. Run: `python -m http.server 8000` (Python 3)
3. Open: `http://localhost:8000`

## 🎨 Customization Guide

### Change Company Name
- In `index.html`, find all instances of "OriginTech" and replace with your company name
- Also update the page title in the `<title>` tag

### Update Contact Information
In `index.html`, find the Contact section and update:
```html
<p>+1 (555) 123-4567</p>        <!-- Phone -->
<p>info@origintech.com</p>      <!-- Email -->
<p>123 Tech Street, Innovation City</p>  <!-- Location -->
```

### Customize Services
Edit the service cards in the Services section:
- Change service titles and descriptions
- Modify icons using Font Awesome (https://fontawesome.com/icons)
- Update images (current ones are from Unsplash)

### Change Colors
In `styles.css`, update the CSS variables at the top:
```css
:root {
    --primary-color: #0066cc;      /* Main blue */
    --secondary-color: #00d4ff;    /* Cyan accent */
    --dark-color: #1a1a2e;         /* Dark navy */
    --light-color: #f5f7fa;        /* Light gray */
}
```

### Use Local Images
Instead of using Unsplash URLs, download images and replace URLs:
1. Create an `images/` folder in your project
2. Add your images there
3. Replace image URLs in HTML:
   ```html
   <!-- Old: -->
   <img src="https://images.unsplash.com/...">
   
   <!-- New: -->
   <img src="images/your-image.jpg">
   ```

### Update Company Stats
In the About section, modify:
```html
<h3>500+</h3>
<p>Projects Completed</p>
```

## 🔧 Technical Details

- **HTML5**: Semantic structure
- **CSS3**: Flexbox and Grid layouts, gradients, animations
- **JavaScript (Vanilla)**: No jQuery or frameworks needed
- **Font Icons**: Font Awesome 6.4.0
- **Responsive**: Mobile-first design, breakpoints at 768px and 480px

## 📱 Browser Compatibility

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- Mobile browsers: ✅ Fully responsive

## 🎯 SEO Tips

To improve search engine visibility:
1. Update the `<title>` tag
2. Add meta description in `<head>`:
   ```html
   <meta name="description" content="Your company description">
   ```
3. Add your actual business information in all sections
4. Update service descriptions with relevant keywords
5. Customize the About section with real company info

## 📧 Contact Form Enhancement

The contact form currently shows an alert. To make it functional:
1. Set up a backend service (Firebase, Formspree, etc.)
2. Update `script.js` to send data to your service
3. Or connect to an email service

## 🎓 For Developers

To modify functionality:
- **Smooth Scrolling**: Located in `script.js` around line 14
- **Mobile Menu**: Hamburger logic in `script.js` around line 1
- **Animations**: CSS animations in `styles.css` (search @keyframes)
- **Form Validation**: Enhanced in `script.js` contact form section

## 📝 License

Free to use and modify for your business.

## 💡 Next Steps

1. Replace placeholder text with your actual company information
2. Update contact details
3. Add real project examples in the Portfolio section
4. Consider adding a blog section
5. Set up form handling backend
6. Add Google Analytics for tracking
7. Submit to Google Search Console

## 🆘 Troubleshooting

**Images not loading?**
- Check internet connection (images load from Unsplash CDN)
- Try refreshing the page

**Mobile menu not working?**
- Clear browser cache
- Check browser console for errors (F12)

**Contact form not working?**
- Currently shows alerts as demo
- See "Contact Form Enhancement" section above

---

**Made with ❤️ for Tech Companies**

For further customization help, refer to the code comments in each file.

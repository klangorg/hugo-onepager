# Hugo One-Pager

A personal portfolio website built with Hugo, using the [Adritian theme](https://github.com/zetxek/adritian-free-hugo-theme).

## Project Structure

This project uses **Hugo modules** to manage the theme dependency, while keeping a git submodule for reference to the theme's source code.

- **Hugo modules** (`hugo.toml`): The actual theme is imported as a Hugo module from `github.com/zetxek/adritian-free-hugo-theme`
- **Git submodule** (`themes/adritian-free-hugo-theme`): A copy of the theme source code is available as a git submodule for easy reference and browsing

## Prerequisites

- [Hugo Extended](https://gohugo.io/installation/) (v0.92.0 or higher)
- [Go](https://go.dev/doc/install) (required for Hugo modules)
- [Node.js](https://nodejs.org/) (for npm dependencies)
- Git

## Getting Started

### 1. Clone the Repository

```bash
# Clone the repository with submodules
git clone --recurse-submodules https://github.com/klangorg/hugo-onepager.git

# Or if you already cloned without submodules:
git clone https://github.com/klangorg/hugo-onepager.git
cd hugo-onepager
git submodule update --init --recursive
```

### 2. Install Dependencies

```bash
# Install npm dependencies (Bootstrap, PostCSS, etc.)
npm install

# Initialize Hugo modules
hugo mod get -u
```

### 3. Run Development Server

```bash
# Start Hugo development server
hugo server

# Or use the npm script
npm start
```

The site will be available at `http://localhost:1313`

## Project Configuration

### Hugo Configuration

The main configuration is in `hugo.toml`:

- **Theme Module**: Imported via Hugo modules at line 5-6
- **Languages**: Supports German (default), English, and French
- **Sections**: Showcase, About, Education, Experience, Client & Work, Testimonial, Contact, Newsletter

### Custom Styling

Custom CSS is located in `assets/css/custom.css` and includes:
- Header and logo styling
- Dark mode support for skills section
- Rocket.Chat widget customization
- Responsive design adjustments

### Custom Layouts

Custom layout overrides are in `layouts/partials/`:
- `base-foot.html`: Includes Rocket.Chat livechat widget integration

## Building for Production

```bash
# Build the site
hugo

# The output will be in the ./public directory
```

## Theme Customization

Since the theme is imported as a Hugo module, you can customize it by:

1. **Overriding layouts**: Create files in `layouts/` that mirror the theme structure
2. **Custom CSS**: Add styles to `assets/css/custom.css`
3. **Custom JS**: Add scripts referenced in `hugo.toml` under `params.plugins.js`

For reference, the theme source code is available in `themes/adritian-free-hugo-theme/` (git submodule).

## Updating the Theme

```bash
# Update Hugo modules (including the theme)
hugo mod get -u

# Update the git submodule (for reference)
git submodule update --remote
```

## Deployment

This site is configured for deployment with:
- Base URL: `https://max-it.tech`
- Vercel Analytics support (can be enabled in `hugo.toml`)
- Google Analytics support (can be enabled in `hugo.toml`)

## Features

- Multi-language support (German, English)
- Dark/Light theme toggle
- Rocket.Chat live chat integration
- Responsive design
- Skills showcase with progress bars
- Experience timeline
- Contact form integration

## License

This project uses the [Adritian theme](https://github.com/zetxek/adritian-free-hugo-theme) by Adrián Moreno.

## Links

- Theme Repository: https://github.com/zetxek/adritian-free-hugo-theme
- Project Repository: https://github.com/klangorg/hugo-onepager
- Live Site: https://max-it.tech

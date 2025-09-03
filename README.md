

# Personal Website - Khawaja Muhammad Owais

A simple, responsive personal website showcasing my work as a Data Scientist, founder of Goshawk Labs, and hands-on experimenter. The site highlights my projects, services, thoughts, and contact information.

## Features

- **Responsive Design**: Optimized for desktop and mobile devices.
- **Sections**: About, Projects, Services, Thoughts (blog), and Contact.
- **Blog System**: Dynamically renders posts from Markdown files in the `/posts` directory using a `posts.json` manifest.
- **Social Links**: Connects to Kaggle, GitHub, LinkedIn, X, and email.
- **Hosting**: Deployed on GitHub Pages with Cloudflare's free plan and a free domain from DigitalPlat FreeDomain.

## Setup

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/khmowais/owais/
   ```

2. **Directory Structure**:

   - `index.html`: Main webpage.
   - `/posts`: Directory for blog post Markdown files.
   - `/posts/posts.json`: JSON manifest listing blog posts (e.g., `[{"file":"2025-09-01-intro.md","title":"Welcome — My First Post","date":"2025-09-01"}]`).


3. **Add Blog Posts**:
   - Create Markdown files in `/posts` (e.g., `2025-09-01-intro.md`).
   - Update `/posts/posts.json` with post details.
4. **Deploy**:
   - Push changes to GitHub.
   - Enable GitHub Pages in the repository settings to serve `index.html`.

## Dependencies

- No external libraries; pure HTML/CSS with vanilla JavaScript for blog rendering.
- Hosted on GitHub Pages with Cloudflare for DNS.

## Usage

- Modify `index.html` to update content (About, Projects, Services, etc.).
- Add new blog posts to `/posts` and update `posts.json` for automatic rendering.
- Ensure the repository is public for GitHub Pages hosting.

## License

© 2025 Khawaja Muhammad Owais. All rights reserved.


This is my personal website, you can checkout at [owais.qzz.io](owais.qzz.io). Built completely using AI, hosted on github pages, domain from [DigitalPlat FreeDomain](https://www.opensourceprojects.dev/post/1959600649026302372)

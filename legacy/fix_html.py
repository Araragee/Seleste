import os

html_files = ["index.html", "aboutus.html", "contactus.html", "services.html"]
base_dir = "/Users/dex/Desktop/Essentials x Coding/Seleste"

for f in html_files:
    path = os.path.join(base_dir, f)
    with open(path, 'r', encoding='utf-8') as file:
        content = file.read()
    
    # Common fixes for absolute paths
    content = content.replace('src="/assets/', 'src="assets/')
    content = content.replace('href="/aboutus.html"', 'href="aboutus.html"')
    content = content.replace('href="/contactus.html"', 'href="contactus.html"')
    content = content.replace('href="/services.html"', 'href="services.html"')
    
    if f == "index.html":
        content = content.replace(
            '<link rel="stylesheet" href="text/css" href="/globalStyle.css">',
            '<link rel="stylesheet" type="text/css" href="./globalStyle.css">'
        )
    
    # Fix body structure for subpages
    if f in ["aboutus.html", "contactus.html", "services.html"]:
        content = content.replace('<body class="page__body">\n', '')
        content = content.replace('<body class="page__body">', '')
        content = content.replace('</head>', '</head>\n<body class="page__body">')
        content = content.replace('</body>', '')
        content = content.replace('</html>', '')
        content = content.strip() + '\n</body>\n</html>\n'

    with open(path, 'w', encoding='utf-8') as file:
        file.write(content)

print("HTML files fixed successfully!")

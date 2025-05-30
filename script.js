// Initialize mermaid configuration
mermaid.initialize({
    startOnLoad: false,
    theme: 'dark',
    securityLevel: 'loose',
    themeVariables: {
        primaryColor: '#661A25',
        primaryTextColor: '#fff',
        primaryBorderColor: '#872341',
        lineColor: '#E17564',
        secondaryColor: '#4D1425',
        tertiaryColor: '#09122C',
        textColor: '#E17564',
        mainBkg: '#09122C',
        nodeBorder: '#872341',
        clusterBkg: 'rgba(135, 35, 65, 0.15)',
        titleColor: '#fff',
        edgeLabelBackground: '#09122C',
        nodeTextColor: '#fff',
        labelBackgroundColor: '#09122C',
        classText: '#fff',
        noteBackgroundColor: '#BE3144',
        noteBorderColor: '#872341',
        errorBkgColor: '#661A25',
        errorTextColor: '#fff',
        warningBkgColor: '#8B4513',
        warningTextColor: '#fff',
        successBkgColor: '#1B4D3E',
        successTextColor: '#fff'
    }
});

// Configure marked to handle code blocks with Prism.js syntax highlighting
marked.use({
    renderer: {
        code(code, language) {
            if (language === 'mermaid') {
                return `<div class="mermaid">${code}</div>`;
            }
            
            // Use Prism.js for syntax highlighting
            const validLanguage = Prism.languages[language] ? language : 'plaintext';
            const highlightedCode = Prism.highlight(
                code,
                Prism.languages[validLanguage],
                validLanguage
            );
            
            return `<div class="code-container">
                <button class="copy-button" aria-label="Copy code">
                    Copy
                </button>
                <pre><code class="language-${validLanguage}">${highlightedCode}</code></pre>
            </div>`;
        }
    }
});

// Add copy functionality to code blocks
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('copy-button')) {
        const button = e.target;
        const code = button.nextElementSibling.querySelector('code').textContent;
        
        navigator.clipboard.writeText(code).then(() => {
            button.textContent = 'Copied!';
            button.classList.add('copied');
            
            setTimeout(() => {
                button.textContent = 'Copy';
                button.classList.remove('copied');
            }, 2000);
        }).catch(() => {
            button.textContent = 'Failed!';
            setTimeout(() => {
                button.textContent = 'Copy';
            }, 2000);
        });
    }
});

// Get markdown content from files
const principles = {};

async function loadPrinciples() {
    try {
        const responses = await Promise.all([
            fetch('README.md'),
            fetch('SRP/README.md'),
            fetch('OCP/README.md'),
            fetch('LSP/README.md'),
            fetch('ISP/README.md'),
            fetch('DIP/README.md')
        ]);
        
        const [home, srp, ocp, lsp, isp, dip] = await Promise.all(
            responses.map(response => response.text())
        );
        
        principles.home = home;
        principles.srp = srp;
        principles.ocp = ocp;
        principles.lsp = lsp;
        principles.isp = isp;
        principles.dip = dip;
        
        // Display home by default after loading
        displayPrinciple('home');
    } catch (error) {
        console.error('Error loading principles:', error);
        document.getElementById('content').innerHTML = `
            <h1>Error Loading Content</h1>
            <p>Unable to load the documentation. Please try:</p>
            <ul>
                <li>Running the page through a local server (e.g. Live Server in VS Code)</li>
                <li>Checking if all README.md files are present in their respective folders</li>
            </ul>
        `;
    }
}

function displayPrinciple(principle) {
    // Update active button
    document.querySelectorAll('nav button').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.principle === principle) {
            btn.classList.add('active');
        }
    });

    // Display content
    const content = principles[principle];
    if (content) {
        const contentDiv = document.getElementById('content');
        contentDiv.innerHTML = marked.parse(content);
        
        // Remove any existing rendered diagrams
        document.querySelectorAll('.mermaid').forEach(el => {
            el.removeAttribute('data-processed');
        });
        
        // Re-render mermaid diagrams
        mermaid.run({
            querySelector: '.mermaid'
        }).catch(err => console.error('Mermaid rendering error:', err));
    } else {
        document.getElementById('content').innerHTML = '<p>Loading content...</p>';
    }
}

// Load principles when the page loads
loadPrinciples();
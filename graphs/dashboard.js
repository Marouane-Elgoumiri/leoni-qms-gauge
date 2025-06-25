// Dashboard.js - Main functionality for LEONI Quality Dashboard
class ProductionDashboard {
    constructor() {
        this.defectsChart = null;
        this.linesChart = null;
        this.init();
    }

    init() {
        this.loadInitialData();
        this.setupCharts();
        this.startAutoRefresh();
    }

    loadInitialData() {
        // Update defect number
        document.getElementById('defectNumber').textContent = mockData.totalDefects;
        
        // Update quality scores
        document.getElementById('score5S').textContent = mockData.qualityScores.score5S + '%';
        document.getElementById('scoreAFP').textContent = mockData.qualityScores.scoreAFP + '%';
        
        // Update KPI grid
        this.updateKPIGrid();
        
        // Add animation to defect number
        this.animateDefectNumber();
    }

    updateKPIGrid() {
        const kpiGrid = document.getElementById('kpiGrid');
        kpiGrid.innerHTML = '';
        
        mockData.kpiData.forEach(kpi => {
            const kpiItem = document.createElement('div');
            kpiItem.className = 'kpi-item';
            
            const trendIcon = this.getTrendIcon(kpi.trend);
            
            kpiItem.innerHTML = `
                <div class="kpi-value">${kpi.value} ${trendIcon}</div>
                <div class="kpi-label">${kpi.label}</div>
            `;
            
            kpiGrid.appendChild(kpiItem);
        });
    }

    getTrendIcon(trend) {
        switch(trend) {
            case 'up': return '📈';
            case 'down': return '📉';
            case 'stable': return '➡️';
            default: return '';
        }
    }

    animateDefectNumber() {
        const element = document.getElementById('defectNumber');
        const targetValue = mockData.totalDefects;
        let currentValue = 0;
        const increment = Math.ceil(targetValue / 30);
        
        const animate = () => {
            if (currentValue < targetValue) {
                currentValue = Math.min(currentValue + increment, targetValue);
                element.textContent = currentValue;
                requestAnimationFrame(animate);
            }
        };
        
        animate();
    }

    setupCharts() {
        this.createDefectsChart();
        this.createLinesChart();
    }

    createDefectsChart() {
        const ctx = document.getElementById('defectsChart').getContext('2d');
        
        const labels = mockData.topDefects.map(defect => defect.name);
        const data = mockData.topDefects.map(defect => defect.count);
        const colors = mockData.colorSchemes.defects;

        this.defectsChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Number of Defects',
                    data: data,
                    backgroundColor: colors,
                    borderColor: colors.map(color => color + 'CC'),
                    borderWidth: 2,
                    borderRadius: 8,
                    borderSkipped: false,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: 'white',
                        bodyColor: 'white',
                        borderColor: 'rgba(255, 255, 255, 0.2)',
                        borderWidth: 1,
                        cornerRadius: 8,
                        padding: 15,
                        titleFont: {
                            size: 16,
                            weight: 'bold'
                        },
                        bodyFont: {
                            size: 14
                        },
                        callbacks: {
                            label: function(context) {
                                const defect = mockData.topDefects[context.dataIndex];
                                return [
                                    `Count: ${context.parsed.y}`,
                                    `Severity: ${defect.severity.toUpperCase()}`,
                                    `Trend: ${defect.trend}`
                                ];
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)',
                            drawBorder: false
                        },
                        ticks: {
                            color: '#6B7280',
                            font: {
                                size: 12
                            }
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: '#6B7280',
                            font: {
                                size: 11
                            },
                            maxRotation: 45,
                            minRotation: 0
                        }
                    }
                },
                elements: {
                    bar: {
                        borderRadius: 8
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'index'
                }
            }
        });
    }

    createLinesChart() {
        const ctx = document.getElementById('linesChart').getContext('2d');
        
        const labels = mockData.topLines.map(line => line.name.split(' - ')[0]); // Shorter labels
        const defectData = mockData.topLines.map(line => line.defectCount);
        const efficiencyData = mockData.topLines.map(line => parseFloat(line.efficiency));
        
        this.linesChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Defects Count',
                        data: defectData,
                        borderColor: '#FF6B6B',
                        backgroundColor: 'rgba(255, 107, 107, 0.1)',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4,
                        pointBackgroundColor: '#FF6B6B',
                        pointBorderColor: '#ffffff',
                        pointBorderWidth: 2,
                        pointRadius: 6,
                        yAxisID: 'y'
                    },
                    {
                        label: 'Efficiency %',
                        data: efficiencyData,
                        borderColor: '#4ECDC4',
                        backgroundColor: 'rgba(78, 205, 196, 0.1)',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4,
                        pointBackgroundColor: '#4ECDC4',
                        pointBorderColor: '#ffffff',
                        pointBorderWidth: 2,
                        pointRadius: 6,
                        yAxisID: 'y1'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            usePointStyle: true,
                            padding: 20,
                            font: {
                                size: 12,
                                weight: 'bold'
                            }
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: 'white',
                        bodyColor: 'white',
                        borderColor: 'rgba(255, 255, 255, 0.2)',
                        borderWidth: 1,
                        cornerRadius: 8,
                        padding: 15,
                        titleFont: {
                            size: 16,
                            weight: 'bold'
                        },
                        bodyFont: {
                            size: 14
                        },
                        callbacks: {
                            label: function(context) {
                                const line = mockData.topLines[context.dataIndex];
                                if (context.datasetIndex === 0) {
                                    return [
                                        `Defects: ${context.parsed.y}`,
                                        `Status: ${line.status.toUpperCase()}`
                                    ];
                                } else {
                                    return `Efficiency: ${context.parsed.y}%`;
                                }
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        title: {
                            display: true,
                            text: 'Defects Count',
                            color: '#FF6B6B',
                            font: {
                                size: 12,
                                weight: 'bold'
                            }
                        },
                        grid: {
                            color: 'rgba(255, 107, 107, 0.1)',
                            drawBorder: false
                        },
                        ticks: {
                            color: '#FF6B6B',
                            font: {
                                size: 11
                            }
                        }
                    },
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        title: {
                            display: true,
                            text: 'Efficiency %',
                            color: '#4ECDC4',
                            font: {
                                size: 12,
                                weight: 'bold'
                            }
                        },
                        grid: {
                            drawOnChartArea: false,
                        },
                        ticks: {
                            color: '#4ECDC4',
                            font: {
                                size: 11
                            }
                        }
                    },
                    x: {
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)',
                            drawBorder: false
                        },
                        ticks: {
                            color: '#6B7280',
                            font: {
                                size: 11
                            }
                        }
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'index'
                }
            }
        });
    }

    refreshDashboard() {
        // Refresh mock data
        refreshMockData();
        
        // Update UI elements
        this.loadInitialData();
        
        // Update charts
        if (this.defectsChart) {
            this.defectsChart.data.datasets[0].data = mockData.topDefects.map(defect => defect.count);
            this.defectsChart.update('active');
        }
        
        if (this.linesChart) {
            this.linesChart.data.datasets[0].data = mockData.topLines.map(line => line.defectCount);
            this.linesChart.data.datasets[1].data = mockData.topLines.map(line => parseFloat(line.efficiency));
            this.linesChart.update('active');
        }
        
        // Add visual feedback for refresh
        this.showRefreshIndicator();
    }

    showRefreshIndicator() {
        // Create a subtle refresh indicator
        const indicator = document.createElement('div');
        indicator.innerHTML = '🔄 Data refreshed';
        indicator.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #4CAF50, #45a049);
            color: white;
            padding: 10px 20px;
            border-radius: 25px;
            font-size: 14px;
            font-weight: bold;
            box-shadow: 0 4px 15px rgba(76, 175, 80, 0.3);
            z-index: 1000;
            animation: slideIn 0.3s ease;
        `;
        
        // Add animation keyframes
        if (!document.getElementById('refreshStyles')) {
            const style = document.createElement('style');
            style.id = 'refreshStyles';
            style.textContent = `
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes slideOut {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(indicator);
        
        setTimeout(() => {
            indicator.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(indicator);
            }, 300);
        }, 2000);
    }

    startAutoRefresh() {
        // Auto-refresh every 30 seconds
        setInterval(() => {
            this.refreshDashboard();
        }, mockData.refreshInterval);
    }

    destroy() {
        if (this.defectsChart) {
            this.defectsChart.destroy();
        }
        if (this.linesChart) {
            this.linesChart.destroy();
        }
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const dashboard = new ProductionDashboard();
    
    // Initialize the chatbot with a delay to ensure all DOM elements are ready
    setTimeout(() => {
        console.log('🚀 Initializing LEONI QMS Chatbot...');
        const chatbot = new LEONIChatbot();
        
        // Make chatbot globally accessible for debugging
        window.leonichatbot = chatbot;
        
        console.log('✅ Chatbot initialized and accessible via window.leonichatbot');
    }, 1000);
    
    // Manual refresh button (optional - could be added to HTML)
    window.refreshDashboard = () => dashboard.refreshDashboard();
    
    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
        dashboard.destroy();
    });
});

// Add some additional utility functions
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function getStatusColor(status) {
    const colors = {
        'excellent': '#4CAF50',
        'good': '#8BC34A',
        'normal': '#FFC107',
        'attention': '#FF9800',
        'critical': '#F44336'
    };
    return colors[status] || '#6B7280';
}

// LEONI Quality Management Chatbot Integration
class LEONIChatbot {
    constructor() {
        this.apiUrl = 'http://localhost:5001/api';
        this.isOpen = false;
        this.isTyping = false;
        this.conversationHistory = [];
        
        // Typing animation configuration
        this.typingConfig = {
            baseSpeed: 3,  // Much faster typing speed (3ms per character)
            htmlTagSpeed: 1, // Very fast for HTML tags
            punctuationDelay: 20, // Minimal delay after punctuation
            soundEnabled: false // Optional typing sound (disabled by default)
        };

        // Markdown configuration
        this.markdownConfig = {
            enabled: true,
            renderer: null,
            useManualMath: false  // Flag for manual math processing when extension fails
        };
        
        this.init();
    }

    init() {
        this.setupMarkdown();
        this.setupEventListeners();
        this.loadSuggestions();
        
        // Add a small delay to ensure DOM is ready
        setTimeout(() => {
            this.addWelcomeMessage();
        }, 500);
    }

    setupMarkdown() {
        // Configure marked.js for optimal chatbot rendering with enhanced features
        if (typeof marked !== 'undefined') {
            // Configure marked options for security and performance
            marked.setOptions({
                breaks: true,        // Convert \n to <br>
                gfm: true,          // GitHub Flavored Markdown
                sanitize: false,    // We'll handle sanitization
                smartLists: true,   // Use smarter list behavior
                smartypants: false, // Don't use smart quotes
                xhtml: false        // Don't self-close tags
            });

            // Use manual math processing with KaTeX (extension removed due to compatibility issues)
            console.log('📐 Using manual math processing with KaTeX for LaTeX formulas');
            this.markdownConfig.useManualMath = true;

            // Create enhanced custom renderer
            this.markdownConfig.renderer = new marked.Renderer();
            
            // Enhanced renderer overrides for better chatbot formatting
            this.markdownConfig.renderer.heading = function(text, level) {
                // Ensure text is a string (handle tokens and other types)
                let textStr;
                if (typeof text === 'string') {
                    textStr = text;
                } else if (text && typeof text === 'object') {
                    textStr = text.text || text.raw || text.tokens?.map(t => t.raw || t.text || String(t)).join('') || String(text);
                } else {
                    textStr = String(text);
                }
                const escapedText = textStr.toLowerCase().replace(/[^\w]+/g, '-');
                return `<h${level} id="${escapedText}">${textStr}</h${level}>`;
            };

            this.markdownConfig.renderer.code = function(code, language) {
                // Ensure code is a string
                let codeStr;
                if (typeof code === 'string') {
                    codeStr = code;
                } else if (code && typeof code === 'object') {
                    codeStr = code.text || code.raw || String(code);
                } else {
                    codeStr = String(code);
                }
                if (language) {
                    return `<pre class="language-${language}"><code class="language-${language}">${codeStr}</code></pre>`;
                }
                return `<pre><code>${codeStr}</code></pre>`;
            };

            this.markdownConfig.renderer.codespan = function(text) {
                // Ensure text is a string
                let textStr;
                if (typeof text === 'string') {
                    textStr = text;
                } else if (text && typeof text === 'object') {
                    textStr = text.text || text.raw || String(text);
                } else {
                    textStr = String(text);
                }
                return `<code>${textStr}</code>`;
            };

            this.markdownConfig.renderer.blockquote = function(quote) {
                // Ensure quote is a string
                let quoteStr;
                if (typeof quote === 'string') {
                    quoteStr = quote;
                } else if (quote && typeof quote === 'object') {
                    quoteStr = quote.text || quote.raw || String(quote);
                } else {
                    quoteStr = String(quote);
                }
                return `<blockquote>${quoteStr}</blockquote>`;
            };

            // Enhanced table renderer
            this.markdownConfig.renderer.table = function(header, body) {
                return `<table>
                    <thead>${header}</thead>
                    <tbody>${body}</tbody>
                </table>`;
            };

            this.markdownConfig.renderer.tablecell = function(content, flags) {
                // Ensure content is a string
                let contentStr;
                if (typeof content === 'string') {
                    contentStr = content;
                } else if (content && typeof content === 'object') {
                    contentStr = content.text || content.raw || String(content);
                } else {
                    contentStr = String(content);
                }
                const type = flags.header ? 'th' : 'td';
                const tag = flags.align ? `<${type} align="${flags.align}">` : `<${type}>`;
                return tag + contentStr + `</${type}>`;
            };

            // Enhanced link renderer with security
            this.markdownConfig.renderer.link = function(href, title, text) {
                // Ensure parameters are strings
                let hrefStr, textStr, titleStr;
                
                if (typeof href === 'string') {
                    hrefStr = href;
                } else {
                    hrefStr = href && href.href ? href.href : String(href);
                }
                
                if (typeof text === 'string') {
                    textStr = text;
                } else if (text && typeof text === 'object') {
                    textStr = text.text || text.raw || String(text);
                } else {
                    textStr = String(text);
                }
                
                if (title) {
                    titleStr = typeof title === 'string' ? title : String(title);
                }
                
                const titleAttr = titleStr ? ` title="${titleStr}"` : '';
                return `<a href="${hrefStr}" target="_blank" rel="noopener noreferrer"${titleAttr}>${textStr}</a>`;
            };

            // Enhanced image renderer
            this.markdownConfig.renderer.image = function(href, title, text) {
                // Ensure parameters are strings
                let hrefStr, textStr, titleStr;
                
                if (typeof href === 'string') {
                    hrefStr = href;
                } else {
                    hrefStr = href && href.href ? href.href : String(href);
                }
                
                if (text) {
                    textStr = typeof text === 'string' ? text : String(text);
                }
                
                if (title) {
                    titleStr = typeof title === 'string' ? title : String(title);
                }
                
                const titleAttr = titleStr ? ` title="${titleStr}"` : '';
                const altAttr = textStr ? ` alt="${textStr}"` : '';
                return `<img src="${hrefStr}"${altAttr}${titleAttr} style="max-width: 100%; height: auto; border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);">`;
            };

            console.log('✅ Enhanced Markdown renderer configured with math support');
        } else {
            console.warn('Marked.js library not loaded - Markdown support disabled');
            this.markdownConfig.enabled = false;
        }
    }

    setupEventListeners() {
        // Chat button toggle
        const chatButton = document.querySelector('.chat-button');
        const chatContainer = document.querySelector('.chat-container');
        const chatClose = document.querySelector('.chat-close');
        const chatSend = document.querySelector('.chat-send');
        const chatInput = document.querySelector('.chat-input');

        if (chatButton) {
            chatButton.addEventListener('click', () => this.toggleChat());
        }

        if (chatClose) {
            chatClose.addEventListener('click', () => this.closeChat());
        }

        if (chatSend) {
            chatSend.addEventListener('click', () => this.sendMessage());
        }

        if (chatInput) {
            chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.sendMessage();
                }
            });

            // Auto-resize textarea
            chatInput.addEventListener('input', () => {
                chatInput.style.height = 'auto';
                chatInput.style.height = Math.min(chatInput.scrollHeight, 100) + 'px';
            });
        }

        // Suggestion clicks
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('chat-suggestion')) {
                this.sendMessage(e.target.textContent);
            }
        });

        // Setup resize functionality
        this.setupChatResize();
    }

    setupChatResize() {
        const chatContainer = document.querySelector('.chat-container');
        const resizeHandle = document.querySelector('.chat-resize-handle');
        
        if (!chatContainer || !resizeHandle) return;

        // Load saved dimensions
        this.loadChatDimensions();

        let isResizing = false;
        let startX, startY, startWidth, startHeight;

        const startResize = (e) => {
            isResizing = true;
            startX = e.clientX;
            startY = e.clientY;
            startWidth = parseInt(window.getComputedStyle(chatContainer).width, 10);
            startHeight = parseInt(window.getComputedStyle(chatContainer).height, 10);
            
            document.addEventListener('mousemove', doResize);
            document.addEventListener('mouseup', stopResize);
            
            // Disable text selection during resize
            document.body.style.userSelect = 'none';
            chatContainer.style.transition = 'none';
        };

        const doResize = (e) => {
            if (!isResizing) return;
            
            // For left handle: width increases when moving left (negative X change)
            const newWidth = startWidth + (startX - e.clientX);
            const newHeight = startHeight + (e.clientY - startY);
            
            // Apply constraints
            const minWidth = 320;
            const maxWidth = window.innerWidth * 0.8;
            const minHeight = 400;
            const maxHeight = window.innerHeight * 0.8;
            
            const constrainedWidth = Math.max(minWidth, Math.min(maxWidth, newWidth));
            const constrainedHeight = Math.max(minHeight, Math.min(maxHeight, newHeight));
            
            chatContainer.style.width = constrainedWidth + 'px';
            chatContainer.style.height = constrainedHeight + 'px';
            
            // Adjust position to keep it on screen
            const containerRect = chatContainer.getBoundingClientRect();
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            
            // For left resize, we need to adjust the right position to maintain the right edge
            if (containerRect.left < 0) {
                chatContainer.style.right = (viewportWidth - constrainedWidth - 10) + 'px';
            }
            if (containerRect.bottom > viewportHeight) {
                chatContainer.style.bottom = '10px';
            }
        };

        const stopResize = () => {
            isResizing = false;
            document.removeEventListener('mousemove', doResize);
            document.removeEventListener('mouseup', stopResize);
            
            // Re-enable text selection
            document.body.style.userSelect = '';
            chatContainer.style.transition = '';
            
            // Save dimensions
            this.saveChatDimensions();
        };

        // Add event listeners
        resizeHandle.addEventListener('mousedown', startResize);
        
        // Handle window resize to maintain responsive behavior
        window.addEventListener('resize', () => {
            this.adjustChatPosition();
        });
    }

    loadChatDimensions() {
        const chatContainer = document.querySelector('.chat-container');
        if (!chatContainer) return;

        try {
            const saved = localStorage.getItem('leonichat-dimensions');
            if (saved) {
                const dimensions = JSON.parse(saved);
                
                // Apply constraints for current viewport
                const minWidth = 320;
                const maxWidth = window.innerWidth * 0.8;
                const minHeight = 400;
                const maxHeight = window.innerHeight * 0.8;
                
                const width = Math.max(minWidth, Math.min(maxWidth, dimensions.width));
                const height = Math.max(minHeight, Math.min(maxHeight, dimensions.height));
                
                chatContainer.style.width = width + 'px';
                chatContainer.style.height = height + 'px';
            }
        } catch (error) {
            console.warn('Failed to load chat dimensions:', error);
        }
    }

    saveChatDimensions() {
        const chatContainer = document.querySelector('.chat-container');
        if (!chatContainer) return;

        try {
            const dimensions = {
                width: parseInt(chatContainer.style.width, 10) || 480,
                height: parseInt(chatContainer.style.height, 10) || 650,
                timestamp: Date.now()
            };
            localStorage.setItem('leonichat-dimensions', JSON.stringify(dimensions));
        } catch (error) {
            console.warn('Failed to save chat dimensions:', error);
        }
    }

    adjustChatPosition() {
        const chatContainer = document.querySelector('.chat-container');
        if (!chatContainer) return;

        const containerRect = chatContainer.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        // Adjust if container is off-screen
        if (containerRect.right > viewportWidth) {
            chatContainer.style.right = '10px';
        }
        if (containerRect.bottom > viewportHeight) {
            chatContainer.style.bottom = '10px';
        }
        
        // Apply responsive constraints
        const maxWidth = viewportWidth * 0.8;
        const maxHeight = viewportHeight * 0.8;
        const currentWidth = parseInt(chatContainer.style.width, 10) || 480;
        const currentHeight = parseInt(chatContainer.style.height, 10) || 650;
        
        if (currentWidth > maxWidth) {
            chatContainer.style.width = maxWidth + 'px';
        }
        if (currentHeight > maxHeight) {
            chatContainer.style.height = maxHeight + 'px';
        }
    }

    toggleChat() {
        const chatContainer = document.querySelector('.chat-container');
        const chatButton = document.querySelector('.chat-button');
        
        if (this.isOpen) {
            this.closeChat();
        } else {
            this.openChat();
        }
    }

    openChat() {
        const chatContainer = document.querySelector('.chat-container');
        const chatButton = document.querySelector('.chat-button');
        
        chatContainer.classList.add('open');
        chatButton.classList.add('active');
        this.isOpen = true;
        
        // Focus on input
        setTimeout(() => {
            const chatInput = document.querySelector('.chat-input');
            if (chatInput) chatInput.focus();
        }, 300);
    }

    closeChat() {
        const chatContainer = document.querySelector('.chat-container');
        const chatButton = document.querySelector('.chat-button');
        
        chatContainer.classList.remove('open');
        chatButton.classList.remove('active');
        this.isOpen = false;
    }

    async loadSuggestions() {
        try {
            const response = await fetch(`${this.apiUrl}/suggestions`);
            const data = await response.json();
            
            if (response.ok && data.suggestions) {
                this.displaySuggestions(data.suggestions);
            } else {
                throw new Error('Invalid suggestions response');
            }
        } catch (error) {
            console.warn('Could not load suggestions:', error);
            // Use fallback suggestions
            const fallbackSuggestions = [
                "How do I perform a 5S audit?",
                "What are the steps for QRQC analysis?",
                "Explain AFP quality checkpoints",
                "How to reduce crimping defects?"
            ];
            this.displaySuggestions(fallbackSuggestions);
        }
    }

    displaySuggestions(suggestions) {
        const suggestionsContainer = document.querySelector('.chat-suggestions');
        if (!suggestionsContainer) return;

        suggestionsContainer.innerHTML = '';
        suggestions.slice(0, 4).forEach(suggestion => {
            const suggestionBtn = document.createElement('button');
            suggestionBtn.className = 'chat-suggestion';
            suggestionBtn.textContent = suggestion;
            suggestionsContainer.appendChild(suggestionBtn);
        });
    }

    async addWelcomeMessage() {
        try {
            // Fetch welcome message from API
            const response = await fetch(`${this.apiUrl}/welcome`);
            const data = await response.json();
            
            if (response.ok && data.response) {
                this.addMessage(data.response, 'bot', data.isMarkdown);
            } else {
                // Fallback welcome message
                this.addMessage('# LEONI QMS Assistant\n\nHello! I\'m your LEONI Quality Management System assistant. How can I help you?', 'bot', true);
            }
        } catch (error) {
            console.error('Error fetching welcome message:', error);
            // Fallback welcome message
            this.addMessage('# LEONI QMS Assistant\n\nHello! I\'m your LEONI Quality Management System assistant. How can I help you?', 'bot', true);
        }
    }

    async sendMessage(messageText = null) {
        const chatInput = document.querySelector('.chat-input');
        const message = messageText || chatInput.value.trim();
        
        if (!message) return;

        // Clear input if using input field
        if (!messageText) {
            chatInput.value = '';
            chatInput.style.height = 'auto';
        }

        // Add user message to chat
        this.addMessage(message, 'user');
        
        // Show typing indicator
        this.showTypingIndicator();

        try {
            // Get current page context for better responses
            const currentPage = this.getCurrentPageContext();
            
            const response = await fetch(`${this.apiUrl}/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    message: message,
                    currentPage: currentPage
                })
            });

            const data = await response.json();
            
            // Hide typing indicator before showing response
            this.hideTypingIndicator();

            // Check if response was successful
            if (response.ok && data.response) {
                // Use the isMarkdown flag from API response, fallback to detection
                const isMarkdownResponse = data.isMarkdown !== undefined ? data.isMarkdown : this.detectMarkdown(data.response);
                
                // Add bot response with typing animation and Markdown support
                this.addMessage(data.response, 'bot', isMarkdownResponse);
                
                this.conversationHistory.push({
                    user: message,
                    bot: data.response,
                    timestamp: data.timestamp || new Date().toISOString(),
                    format: isMarkdownResponse ? 'markdown' : 'html'
                });
            } else {
                throw new Error(data.error || `HTTP ${response.status}: ${response.statusText}`);
            }
        } catch (error) {
            console.error('Chat error:', error);
            this.hideTypingIndicator();
            
            // Show fallback message with Markdown formatting
            const fallbackMessage = `**LEONI QMS Assistant**

⚠️ **Connection Issue**

I'm currently unable to connect to the server. Please try again later or contact your system administrator.

### 🔧 In the meantime, you can:
* Check the **5S checklist** for quality standards
* Review the **AFP audit procedures**  
* Access the **QRQC analysis tools**

### 📞 Support
> If this issue persists, please contact the IT support team.

---
*System Status: Offline Mode*`;
            
            this.addMessage(fallbackMessage, 'bot', true); // Enable Markdown for fallback
        }
    }

    getCurrentPageContext() {
        const currentPath = window.location.pathname;
        const currentURL = window.location.href;
        
        if (currentPath.includes('dashboard') || currentPath.includes('graphs')) {
            return 'Dashboard';
        } else if (currentURL.includes('5S') || currentPath.includes('5s')) {
            return '5S System';
        } else if (currentURL.includes('AFP') || currentPath.includes('afp')) {
            return 'AFP System';
        } else if (currentURL.includes('QRQC') || currentPath.includes('qrqc')) {
            return 'QRQC Analysis';
        } else if (currentURL.includes('defect') || currentPath.includes('Defect')) {
            return 'Defect Management';
        }
        return 'General System';
    }

    // Convert Markdown to HTML for better visualization with enhanced features
    parseMarkdown(markdownText) {
        // Ensure we have a string to work with
        if (!markdownText) return '';
        const textStr = typeof markdownText === 'string' ? markdownText : String(markdownText);
        
        console.log('📝 Parsing markdown:', textStr.substring(0, 100) + '...');
        
        if (!this.markdownConfig.enabled || typeof marked === 'undefined') {
            console.log('⚠️ Markdown disabled, using fallback');
            // Fallback: enhanced HTML formatting if Markdown is not available
            return this.enhancedMarkdownFallback(textStr);
        }

        try {
            let processedText = textStr;
            
            // If using manual math processing (extension failed), preprocess math expressions
            if (this.markdownConfig.useManualMath) {
                console.log('🔢 Starting math preprocessing...');
                processedText = this.preprocessMathExpressions(textStr);
                console.log('📝 After preprocessing:', processedText.substring(0, 100) + '...');
            }
            
            // Parse Markdown to HTML with enhanced features
            let htmlContent = marked.parse(processedText, {
                renderer: this.markdownConfig.renderer,
                highlight: function(code, lang) {
                    // Use Prism.js for syntax highlighting if available
                    if (typeof Prism !== 'undefined' && lang && Prism.languages[lang]) {
                        return Prism.highlight(code, Prism.languages[lang], lang);
                    }
                    return code;
                }
            });
            
            console.log('📝 After markdown parsing:', htmlContent.substring(0, 100) + '...');
            
            // If using manual math processing, restore and render math expressions
            if (this.markdownConfig.useManualMath) {
                console.log('🔢 Starting math postprocessing...');
                htmlContent = this.postprocessMathExpressions(htmlContent);
                console.log('📝 Final result:', htmlContent.substring(0, 100) + '...');
            }
            
            // Apply syntax highlighting if Prism.js is available
            if (typeof Prism !== 'undefined') {
                setTimeout(() => {
                    Prism.highlightAll();
                }, 10);
            }
            
            return htmlContent;
        } catch (error) {
            console.error('Enhanced markdown parsing error:', error);
            return this.enhancedMarkdownFallback(textStr);
        }
    }

    // Preprocess math expressions to protect them during markdown parsing
    preprocessMathExpressions(text) {
        const mathPlaceholders = [];
        let processedText = text;
        
        // Use simple placeholder strings that won't be modified by markdown
        const uniqueId = Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
        
        // Handle display math ($$...$$)
        processedText = processedText.replace(/\$\$([^$]+)\$\$/g, (match, math) => {
            const placeholder = `LEONI_MATH_DISPLAY_${uniqueId}_${mathPlaceholders.length}`;
            mathPlaceholders.push({ type: 'display', content: math.trim(), placeholder });
            console.log('🔢 Display math found:', math.trim());
            console.log('📝 Using placeholder:', placeholder);
            return placeholder;
        });
        
        // Handle inline math ($...$)
        processedText = processedText.replace(/\$([^$\n]+)\$/g, (match, math) => {
            const placeholder = `LEONI_MATH_INLINE_${uniqueId}_${mathPlaceholders.length}`;
            mathPlaceholders.push({ type: 'inline', content: math.trim(), placeholder });
            console.log('🔢 Inline math found:', math.trim());
            console.log('📝 Using placeholder:', placeholder);
            return placeholder;
        });
        
        // Store placeholders for post-processing
        this._mathPlaceholders = mathPlaceholders;
        this._uniqueId = uniqueId;
        console.log('📝 Math preprocessing complete. Placeholders:', mathPlaceholders.length);
        return processedText;
    }

    // Post-process to restore and render math expressions
    postprocessMathExpressions(html) {
        if (!this._mathPlaceholders || typeof katex === 'undefined') {
            console.log('⚠️ Math postprocessing skipped:', !this._mathPlaceholders ? 'No placeholders' : 'KaTeX not available');
            return html;
        }
        
        let processedHtml = html;
        console.log('🔄 Processing', this._mathPlaceholders.length, 'math placeholders');
        console.log('🔍 HTML before processing:', processedHtml.substring(0, 200) + '...');
        
        this._mathPlaceholders.forEach(({ type, content, placeholder }, index) => {
            console.log(`🔢 Processing placeholder ${index}:`, placeholder);
            console.log(`📝 Content:`, content);
            
            // Check if placeholder exists (now using simple text placeholders)
            if (processedHtml.includes(placeholder)) {
                console.log(`🔍 Found placeholder exactly:`, placeholder);
                
                try {
                    let renderedMath;
                    if (type === 'display') {
                        renderedMath = katex.renderToString(content, {
                            displayMode: true,
                            throwOnError: false,
                            output: 'html',
                            trust: true
                        });
                        renderedMath = `<div class="math-display">${renderedMath}</div>`;
                    } else {
                        renderedMath = katex.renderToString(content, {
                            displayMode: false,
                            throwOnError: false,
                            output: 'html',
                            trust: true
                        });
                        renderedMath = `<span class="math-inline">${renderedMath}</span>`;
                    }
                    
                    // Replace all occurrences of the placeholder
                    const beforeCount = (processedHtml.split(placeholder).length - 1);
                    processedHtml = processedHtml.split(placeholder).join(renderedMath);
                    const afterCount = (processedHtml.split(placeholder).length - 1);
                    
                    console.log('✅ Math rendered:', type, '| Before:', beforeCount, '| After:', afterCount);
                    console.log('🎨 Rendered HTML:', renderedMath.substring(0, 100) + '...');
                } catch (error) {
                    console.error('❌ KaTeX rendering error:', error);
                    // Fallback to raw math expression
                    const fallback = type === 'display' ? 
                        `<div class="math-display"><code>$$${content}$$</code></div>` :
                        `<span class="math-inline"><code>$${content}$</code></span>`;
                    processedHtml = processedHtml.split(placeholder).join(fallback);
                    console.log('🔄 Used fallback for:', content);
                }
            } else {
                console.warn('⚠️ Placeholder not found:', placeholder);
                console.log('🔍 Available text sample:', processedHtml.substring(0, 300) + '...');
            }
        });
        
        console.log('🔍 HTML after processing:', processedHtml.substring(0, 200) + '...');
        
        // Clear placeholders
        this._mathPlaceholders = [];
        this._uniqueId = null;
        return processedHtml;
    }

    // Enhanced Markdown fallback for essential formatting with math support
    enhancedMarkdownFallback(text) {
        let processedText = text
            // Headers with enhanced styling
            .replace(/^### (.*$)/gim, '<h3>$1</h3>')
            .replace(/^## (.*$)/gim, '<h2>$1</h2>')
            .replace(/^# (.*$)/gim, '<h1>$1</h1>')
            
            // Math expressions
            .replace(/\$\$([^$]+)\$\$/g, '<div class="math-display"><code>$$1$$</code></div>')
            .replace(/\$([^$\n]+)\$/g, '<span class="math-inline"><code>$1</code></span>')
            
            // Bold and italic
            .replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            
            // Code blocks and inline code
            .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre><code class="language-$1">$2</code></pre>')
            .replace(/`(.*?)`/g, '<code>$1</code>')
            
            // Links
            .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
            
            // Images
            .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" style="max-width: 100%; height: auto; border-radius: 8px;">')
            
            // Tables (basic support)
            .replace(/\|(.+)\|/g, (match, content) => {
                const cells = content.split('|').map(cell => cell.trim());
                const cellsHtml = cells.map(cell => `<td>${cell}</td>`).join('');
                return `<tr>${cellsHtml}</tr>`;
            })
            
            // Blockquotes
            .replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>')
            
            // Horizontal rules
            .replace(/^---$/gm, '<hr>')
            
            // Lists (enhanced)
            .replace(/^\* (.*$)/gim, '<li>$1</li>')
            .replace(/^\d+\. (.*$)/gim, '<li>$1</li>')
            
            // Line breaks
            .replace(/\n\n/g, '</p><p>')
            .replace(/\n/g, '<br>');

        // Wrap consecutive list items in proper list tags
        processedText = processedText
            .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
            .replace(/(<li>.*<\/li>)/s, '<ol>$1</ol>');
            
        // Wrap in paragraphs if needed
        if (!processedText.includes('<p>') && !processedText.includes('<h') && !processedText.includes('<div>')) {
            processedText = `<p>${processedText}</p>`;
        }

        return processedText;
    }

    // Enhanced message processing with full markdown and math support
    processMessageContent(content, isMarkdown = false) {
        // Force markdown processing if math expressions are detected
        const hasMath = /\$.*?\$/.test(content);
        const shouldUseMarkdown = isMarkdown || hasMath || this.detectMarkdown(content);
        
        if (shouldUseMarkdown) {
            console.log('🔬 Processing with enhanced markdown (math detected:', hasMath, ')');
            return this.parseMarkdown(content);
        }
        
        // Check if content is already HTML
        if (/<[^>]*>/.test(content)) {
            return content;
        }
        
        // Plain text - convert line breaks to <br> and preserve formatting
        return content
            .replace(/\n\n/g, '</p><p>')
            .replace(/\n/g, '<br>')
            .replace(/^(.*)$/, '<p>$1</p>');
    }

    // Enhanced detection for various markdown patterns including math
    detectMarkdown(text) {
        const markdownPatterns = [
            /^#{1,6}\s/m,           // Headers
            /\*\*.*?\*\*/,          // Bold
            /\*.*?\*/,              // Italic
            /`.*?`/,                // Inline code
            /```[\s\S]*?```/,       // Code blocks
            /^\* /m,                // Unordered lists
            /^\d+\. /m,             // Ordered lists
            /^\> /m,                // Blockquotes
            /\[.*?\]\(.*?\)/,       // Links
            /!\[.*?\]\(.*?\)/,      // Images
            /\|.*\|.*\|/,           // Tables
            /^---$/m,               // Horizontal rules
            /\$\$.*?\$\$/,          // Display math
            /\$[^$\n]+\$/,          // Inline math
            /~~.*?~~/,              // Strikethrough
            /\*\*\*.*?\*\*\*/,      // Bold italic
            /^\s*-\s+/m,            // Alternative list marker
            /^\s*\+\s+/m            // Alternative list marker
        ];
        
        return markdownPatterns.some(pattern => pattern.test(text));
    }

    addMessage(message, sender, isMarkdown = false) {
        console.log('📧 Adding message:', { sender, isMarkdown, messageLength: message.length });
        
        const messagesContainer = document.querySelector('.chat-messages');
        if (!messagesContainer) {
            console.error('❌ Messages container not found!');
            return;
        }

        const messageElement = document.createElement('div');
        messageElement.className = `chat-message ${sender}`;
        
        if (sender === 'bot') {
            // Process message content with Markdown support
            const processedContent = this.processMessageContent(message, isMarkdown);
            console.log('🔄 Processed content:', processedContent.substring(0, 100) + '...');
            
            // For bot messages, implement fast typing animation
            messageElement.innerHTML = '';
            messagesContainer.appendChild(messageElement);
            
            // Set initial styling to ensure proper expansion
            messageElement.style.minHeight = 'auto';
            messageElement.style.height = 'auto';
            messageElement.style.maxHeight = 'none';
            messageElement.style.overflow = 'visible';
            messageElement.style.flexShrink = '0';
            
            // Start monitoring message expansion
            this.startMessageMonitoring(messageElement);
            
            // Use HTML typing for processed content
            this.typeHTMLMessage(messageElement, processedContent);
        } else {
            // User messages appear instantly
            messageElement.textContent = message;
            messagesContainer.appendChild(messageElement);
            // Immediate scroll for user messages
            this.scrollToBottom();
        }
    }

    scrollToBottom() {
        const messagesContainer = document.querySelector('.chat-messages');
        if (messagesContainer) {
            // Use smooth scrolling and ensure we're at the very bottom
            setTimeout(() => {
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            }, 10);
        }
    }

    typeMessage(element, message, speed = null) {
        // Use configured speed or default
        speed = speed || this.typingConfig.baseSpeed;
        
        let index = 0;
        const isHTML = /<[^>]*>/.test(message); // Check if message contains HTML
        
        // Add typing class for shimmer effect
        element.classList.add('typing');
        
        if (isHTML) {
            // For HTML content, type it as HTML
            this.typeHTMLMessage(element, message, speed);
        } else {
            // For plain text, type character by character
            const typeChar = () => {
                if (index < message.length) {
                    const char = message.charAt(index);
                    element.textContent += char;
                    index++;
                    
                    // Add extra delay after punctuation for natural rhythm
                    let nextDelay = speed;
                    if (/[.!?]/.test(char)) {
                        nextDelay += this.typingConfig.punctuationDelay;
                    }
                    
                    // Scroll to bottom every few characters for smooth scrolling
                    if (index % 5 === 0) {
                        this.scrollToBottom();
                    }
                    
                    setTimeout(typeChar, nextDelay);
                } else {
                    // Remove typing class when done and ensure final scroll
                    element.classList.remove('typing');
                    // Force a reflow to ensure proper sizing
                    this.ensureMessageVisibility(element);
                    this.scrollToBottom();
                }
            };
            typeChar();
        }
    }

    typeHTMLMessage(element, htmlMessage, speed = null) {
        // Use configured speed or default
        speed = speed || this.typingConfig.baseSpeed;
        
        let index = 0;
        let currentHTML = '';
        let isInsideTag = false;
        let charCount = 0;
        
        const typeChar = () => {
            if (index < htmlMessage.length) {
                const char = htmlMessage.charAt(index);
                
                if (char === '<') {
                    isInsideTag = true;
                }
                
                currentHTML += char;
                
                if (char === '>') {
                    isInsideTag = false;
                    element.innerHTML = currentHTML;
                } else if (!isInsideTag) {
                    // Only update display for visible characters
                    element.innerHTML = currentHTML;
                    charCount++;
                    
                    // Scroll periodically during typing for smooth scrolling
                    if (charCount % 10 === 0) {
                        this.scrollToBottom();
                    }
                }
                
                index++;
                
                // Faster typing for HTML tags, normal speed for text
                // Add punctuation delays for visible text
                let nextSpeed = speed;
                if (isInsideTag) {
                    nextSpeed = this.typingConfig.htmlTagSpeed;
                } else if (/[.!?]/.test(char)) {
                    nextSpeed += this.typingConfig.punctuationDelay;
                }
                
                setTimeout(typeChar, nextSpeed);
            } else {
                // Remove typing class when done and ensure final scroll
                element.classList.remove('typing');
                // Force a reflow to ensure proper sizing
                this.ensureMessageVisibility(element);
                this.scrollToBottom();
            }
        };
        
        typeChar();
    }

    showTypingIndicator() {
        const messagesContainer = document.querySelector('.chat-messages');
        if (!messagesContainer) return;

        const typingElement = document.createElement('div');
        typingElement.className = 'chat-typing';
        typingElement.innerHTML = `
            <div class="chat-typing-dots">
                <div class="chat-typing-dot"></div>
                <div class="chat-typing-dot"></div>
                <div class="chat-typing-dot"></div>
            </div>
        `;
        
        messagesContainer.appendChild(typingElement);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        this.isTyping = true;
    }

    hideTypingIndicator() {
        const typingElement = document.querySelector('.chat-typing');
        if (typingElement) {
            typingElement.remove();
        }
        this.isTyping = false;
    }

    // Utility methods for typing configuration
    setTypingSpeed(speed) {
        this.typingConfig.baseSpeed = Math.max(1, Math.min(20, speed)); // Clamp between 1-20ms for very fast typing
        this.typingConfig.htmlTagSpeed = Math.max(1, Math.floor(speed / 3)); // Proportional HTML tag speed
        console.log(`Chatbot typing speed set to ${this.typingConfig.baseSpeed}ms per character`);
    }

    toggleTypingSound() {
        this.typingConfig.soundEnabled = !this.typingConfig.soundEnabled;
        console.log(`Chatbot typing sound ${this.typingConfig.soundEnabled ? 'enabled' : 'disabled'}`);
    }

    // Enhanced debugging/development method
    getTypingStats() {
        return {
            baseSpeed: this.typingConfig.baseSpeed,
            htmlTagSpeed: this.typingConfig.htmlTagSpeed,
            punctuationDelay: this.typingConfig.punctuationDelay,
            soundEnabled: this.typingConfig.soundEnabled,
            conversationCount: this.conversationHistory.length,
            isCurrentlyTyping: this.isTyping,
            markdownEnabled: this.markdownConfig.enabled,
            markdownLibraryLoaded: typeof marked !== 'undefined',
            lastMessageFormat: this.conversationHistory.length > 0 ? 
                this.conversationHistory[this.conversationHistory.length - 1].format : 'none'
        };
    }

    // Method to instantly show response (for testing or user preference)
    setInstantMode(enabled = true) {
        if (enabled) {
            this.typingConfig.baseSpeed = 1;
            this.typingConfig.htmlTagSpeed = 1;
            this.typingConfig.punctuationDelay = 0;
            console.log('Chatbot set to instant mode');
        } else {
            this.typingConfig.baseSpeed = 3;
            this.typingConfig.htmlTagSpeed = 1;
            this.typingConfig.punctuationDelay = 20;
            console.log('Chatbot set to normal typing mode');
        }
    }

    // Markdown management utilities
    toggleMarkdown(enabled = null) {
        if (enabled === null) {
            this.markdownConfig.enabled = !this.markdownConfig.enabled;
        } else {
            this.markdownConfig.enabled = enabled;
        }
        return this.markdownConfig.enabled;
    }

    isMarkdownEnabled() {
        return this.markdownConfig.enabled && typeof marked !== 'undefined';
    }

    // Missing utility methods for message monitoring and expansion
    startMessageMonitoring(messageElement) {
        if (!messageElement) {
            console.warn('No message element provided for monitoring');
            return;
        }

        // Set up a ResizeObserver to monitor the message element
        if (typeof ResizeObserver !== 'undefined') {
            const resizeObserver = new ResizeObserver(entries => {
                for (let entry of entries) {
                    this.ensureMessageVisibility(entry.target);
                }
            });
            
            resizeObserver.observe(messageElement);
            
            // Store the observer on the element for cleanup if needed
            messageElement._resizeObserver = resizeObserver;
        } else {
            // Fallback for browsers without ResizeObserver
            setTimeout(() => {
                this.ensureMessageVisibility(messageElement);
            }, 100);
        }
    }

    ensureMessageVisibility(messageElement) {
        if (!messageElement) {
            console.warn('No message element provided for visibility check');
            return;
        }

        const messagesContainer = document.querySelector('.chat-messages');
        if (!messagesContainer) {
            console.warn('Messages container not found');
            return;
        }

        // Check if the message is fully visible
        const containerRect = messagesContainer.getBoundingClientRect();
        const messageRect = messageElement.getBoundingClientRect();
        
        const isFullyVisible = (
            messageRect.top >= containerRect.top &&
            messageRect.bottom <= containerRect.bottom
        );

        if (!isFullyVisible) {
            this.scrollToBottom();
        }

        // Ensure proper styling for expanded content
        this.fixMessageExpansion(messageElement);
    }

    fixMessageExpansion(messageElement) {
        if (!messageElement) return;

        // Remove any height constraints that might interfere with content
        messageElement.style.minHeight = 'auto';
        messageElement.style.height = 'auto';
        messageElement.style.maxHeight = 'none';
        messageElement.style.overflow = 'visible';
        
        // Ensure the element can expand properly
        messageElement.style.flexShrink = '0';
        messageElement.style.flexGrow = '1';
        
        // Fix any nested content expansion issues
        const contentElements = messageElement.querySelectorAll('*');
        contentElements.forEach(element => {
            if (element.style.height && element.style.height !== 'auto') {
                element.style.height = 'auto';
            }
        });
    }

    fixAllMessageExpansion() {
        const allMessages = document.querySelectorAll('.chat-message');
        allMessages.forEach(message => {
            this.fixMessageExpansion(message);
        });
        
        // Ensure the container scrolls to show the latest content
        setTimeout(() => {
            this.scrollToBottom();
        }, 100);
    }

    // Cleanup method for observers
    cleanupMessageObservers() {
        const allMessages = document.querySelectorAll('.chat-message');
        allMessages.forEach(message => {
            if (message._resizeObserver) {
                message._resizeObserver.disconnect();
                delete message._resizeObserver;
            }
        });
    }
}

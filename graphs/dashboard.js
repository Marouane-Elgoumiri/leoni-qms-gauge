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
    // Initialize the chatbot
    const chatbot = new LEONIChatbot();
    
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
        this.apiUrl = 'http://localhost:5000/api';
        this.isOpen = false;
        this.isTyping = false;
        this.conversationHistory = [];
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadSuggestions();
        this.addWelcomeMessage();
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
            
            if (data.status === 'success') {
                this.displaySuggestions(data.suggestions);
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

    addWelcomeMessage() {
        const welcomeMessage = `
            <span class="bot-name">LEONI QMS Assistant</span>
            Hello! I'm your LEONI Quality Management System assistant. I can help you with:
            <br><br>
            • 5S Implementation & Audits
            • AFP Quality Processes  
            • QRQC Analysis
            • Production Line Quality
            • Defect Analysis & Solutions
            <br><br>
            How can I assist you today?
        `;
        this.addMessage(welcomeMessage, 'bot');
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
            const response = await fetch(`${this.apiUrl}/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: message })
            });

            const data = await response.json();
            
            // Hide typing indicator
            this.hideTypingIndicator();

            if (data.status === 'success') {
                this.addMessage(data.response, 'bot');
                this.conversationHistory.push({
                    user: message,
                    bot: data.response,
                    timestamp: data.timestamp
                });
            } else {
                throw new Error(data.error || 'Unknown error');
            }
        } catch (error) {
            console.error('Chat error:', error);
            this.hideTypingIndicator();
            
            // Show fallback message
            const fallbackMessage = `
                <span class="bot-name">LEONI QMS Assistant</span>
                I'm currently unable to connect to the server. Please try again later or contact your system administrator.
                <br><br>
                In the meantime, you can:
                • Check the 5S checklist for quality standards
                • Review the AFP audit procedures
                • Access the QRQC analysis tools
            `;
            this.addMessage(fallbackMessage, 'bot');
        }
    }

    addMessage(message, sender) {
        const messagesContainer = document.querySelector('.chat-messages');
        if (!messagesContainer) return;

        const messageElement = document.createElement('div');
        messageElement.className = `chat-message ${sender}`;
        
        if (sender === 'bot') {
            messageElement.innerHTML = message;
        } else {
            messageElement.textContent = message;
        }
        
        messagesContainer.appendChild(messageElement);
        
        // Scroll to bottom
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
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
}

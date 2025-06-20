// LEONI QMS Chatbot - Enhanced Markdown Demo & Testing Utilities
// This file contains demo functions to test enhanced markdown features

// Test the enhanced chatbot with math and markdown examples
function testEnhancedChatbot() {
    console.log('🧪 Testing Enhanced LEONI QMS Chatbot Features...');
    
    if (!window.leonichatbot) {
        console.error('❌ Chatbot not found! Please ensure the chatbot is initialized.');
        return;
    }
    
    const chatbot = window.leonichatbot;
    
    // Test 1: Math formulas
    const mathTest = `# Quality Metrics with Math

## Statistical Process Control

**Cp (Process Capability):**
$$Cp = \\frac{USL - LSL}{6\\sigma}$$

**Cpk (Process Capability Index):**
$$Cpk = \\min\\left(\\frac{USL - \\mu}{3\\sigma}, \\frac{\\mu - LSL}{3\\sigma}\\right)$$

**Defect Rate:**
The defect rate is calculated as: $\\text{Defect Rate} = \\frac{\\text{Number of Defects}}{\\text{Total Units}} \\times 100\\%$

## Quality Control Limits

**Upper Control Limit (UCL):**
$$UCL = \\bar{x} + 3\\sigma$$

**Lower Control Limit (LCL):**
$$LCL = \\bar{x} - 3\\sigma$$`;

    // Test 2: Enhanced tables
    const tableTest = `# Quality Audit Results

| Line | Defects | Efficiency | Status | Cp | Cpk |
|------|---------|------------|--------|----|----|
| Line A | 12 | 95.2% | ✅ Good | 1.33 | 1.25 |
| Line B | 8 | 97.8% | ✅ Excellent | 1.67 | 1.58 |
| Line C | 25 | 89.1% | ⚠️ Attention | 0.98 | 0.89 |
| Line D | 5 | 98.5% | ✅ Excellent | 1.85 | 1.72 |

## Analysis Summary

> **Key Findings:**
> - Line D shows the best performance with $Cpk = 1.72$
> - Line C requires immediate attention with $Cp < 1.0$
> - Overall efficiency: $\\bar{\\eta} = 95.15\\%$`;

    // Test 3: Code blocks with syntax highlighting
    const codeTest = `# Quality Management System API

## Python Example

\`\`\`python
def calculate_process_capability(data, usl, lsl):
    """Calculate Cp and Cpk for quality control"""
    mean = np.mean(data)
    std_dev = np.std(data, ddof=1)
    
    # Process Capability
    cp = (usl - lsl) / (6 * std_dev)
    
    # Process Capability Index
    cpk_upper = (usl - mean) / (3 * std_dev)
    cpk_lower = (mean - lsl) / (3 * std_dev)
    cpk = min(cpk_upper, cpk_lower)
    
    return cp, cpk
\`\`\`

## JavaScript Example

\`\`\`javascript
function calculateDefectRate(defects, totalUnits) {
    const rate = (defects / totalUnits) * 100;
    console.log(\`Defect Rate: \${rate.toFixed(2)}%\`);
    return rate;
}
\`\`\``;

    // Add test messages to chat
    chatbot.addMessage(mathTest, 'bot', true);
    setTimeout(() => chatbot.addMessage(tableTest, 'bot', true), 1000);
    setTimeout(() => chatbot.addMessage(codeTest, 'bot', true), 2000);
    
    console.log('✅ Enhanced chatbot test completed!');
}

// Test math expressions specifically
function testMathExpressions() {
    console.log('🧮 Testing Math Expression Rendering...');
    
    if (!window.leonichatbot) {
        console.error('❌ Chatbot not found!');
        return;
    }
    
    const mathExamples = `# Mathematical Formulas for Quality Management

## 1. Statistical Process Control

**Process Capability Index:**
$$Cpk = \\min\\left(\\frac{USL - \\bar{x}}{3s}, \\frac{\\bar{x} - LSL}{3s}\\right)$$

**Six Sigma Level:**
$$\\text{Sigma Level} = \\frac{USL - LSL}{6s}$$

## 2. Control Charts

**Control Limits:**
- Upper: $UCL = \\bar{x} + A_2 \\bar{R}$
- Lower: $LCL = \\bar{x} - A_2 \\bar{R}$

**R-Chart Limits:**
- $UCL_R = D_4 \\bar{R}$
- $LCL_R = D_3 \\bar{R}$

## 3. Defect Analysis

**Defect Density:**
$$\\text{Defect Density} = \\frac{\\text{Total Defects}}{\\text{Total Units Produced}} \\times 1000$$

**DPMO (Defects Per Million Opportunities):**
$$DPMO = \\frac{\\text{Number of Defects}}{\\text{Number of Units} \\times \\text{Opportunities per Unit}} \\times 10^6$$`;

    window.leonichatbot.addMessage(mathExamples, 'bot', true);
    console.log('✅ Math expression test completed!');
}

// Test markdown parsing directly
function testMarkdownParsing() {
    console.log('📝 Testing Markdown Parsing...');
    
    if (!window.leonichatbot) {
        console.error('❌ Chatbot not found!');
        return;
    }
    
    const testMarkdown = `# Test Markdown

## Features Test

**Bold text** and *italic text* and ***bold italic***

### Lists
- Item 1
- Item 2
  - Nested item
- Item 3

### Numbered List
1. First item
2. Second item
3. Third item

### Code
Inline code: \`console.log('Hello')\`

Block code:
\`\`\`javascript
function test() {
    return 'Hello World';
}
\`\`\`

### Quote
> This is a blockquote
> with multiple lines

### Math
Inline math: $E = mc^2$

Display math:
$$\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}$$`;

    const chatbot = window.leonichatbot;
    const parsed = chatbot.parseMarkdown(testMarkdown);
    
    console.log('📄 Parsed markdown:', parsed);
    
    // Add to chat
    chatbot.addMessage(testMarkdown, 'bot', true);
    
    console.log('✅ Markdown parsing test completed!');
}

// Get chatbot status and configuration
function getEnhancedChatbotStatus() {
    console.log('📊 Enhanced Chatbot Status Report');
    console.log('==================================');
    
    if (!window.leonichatbot) {
        console.log('❌ Chatbot not initialized');
        return;
    }
    
    const chatbot = window.leonichatbot;
    
    console.log('🤖 Chatbot Instance:', chatbot);
    console.log('📡 API URL:', chatbot.apiUrl);
    console.log('🔧 Markdown Config:', chatbot.markdownConfig);
    console.log('⚡ Typing Config:', chatbot.typingConfig);
    
    // Check library availability
    console.log('\n📚 Library Status:');
    console.log('- Marked.js:', typeof marked !== 'undefined' ? '✅ Available' : '❌ Not loaded');
    console.log('- KaTeX:', typeof katex !== 'undefined' ? '✅ Available' : '❌ Not loaded');
    console.log('- Prism.js:', typeof Prism !== 'undefined' ? '✅ Available' : '❌ Not loaded');
    
    // Test math rendering capability
    if (typeof katex !== 'undefined') {
        try {
            const testMath = katex.renderToString('E = mc^2', { throwOnError: false });
            console.log('🧮 Math rendering test:', testMath ? '✅ Working' : '❌ Failed');
        } catch (error) {
            console.log('🧮 Math rendering test: ❌ Error -', error.message);
        }
    }
    
    console.log('\n🎯 Manual Math Processing:', chatbot.markdownConfig.useManualMath ? '✅ Enabled' : '❌ Disabled');
    
    return {
        chatbot: chatbot,
        libraries: {
            marked: typeof marked !== 'undefined',
            katex: typeof katex !== 'undefined',
            prism: typeof Prism !== 'undefined'
        },
        config: {
            markdown: chatbot.markdownConfig,
            typing: chatbot.typingConfig
        }
    };
}

// Run comprehensive demo
function runMarkdownDemo() {
    console.log('🚀 Running Comprehensive Markdown Demo...');
    
    // Open chat if not already open
    if (window.leonichatbot && !window.leonichatbot.isOpen) {
        window.leonichatbot.toggleChat();
    }
    
    // Run tests with delays
    setTimeout(() => testMathExpressions(), 500);
    setTimeout(() => testMarkdownParsing(), 2000);
    setTimeout(() => testEnhancedChatbot(), 4000);
    setTimeout(() => getEnhancedChatbotStatus(), 6000);
    
    console.log('✅ Demo sequence started!');
}

// Make functions globally available
window.testEnhancedChatbot = testEnhancedChatbot;
window.testMathExpressions = testMathExpressions;
window.testMarkdownParsing = testMarkdownParsing;
window.getEnhancedChatbotStatus = getEnhancedChatbotStatus;
window.runMarkdownDemo = runMarkdownDemo;

console.log('📋 Enhanced Markdown Demo Loaded!');
console.log('Available functions:');
console.log('- testEnhancedChatbot()');
console.log('- testMathExpressions()'); 
console.log('- testMarkdownParsing()');
console.log('- getEnhancedChatbotStatus()');
console.log('- runMarkdownDemo()');

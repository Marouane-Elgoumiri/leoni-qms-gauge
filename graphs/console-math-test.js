// Quick test for math rendering in browser console
// Use this in the browser console on the dashboard page

function quickMathTest() {
    console.log('🧮 Quick Math Test - LEONI QMS');
    
    // Check if necessary libraries are loaded
    const checks = {
        'KaTeX': typeof katex !== 'undefined',
        'Marked': typeof marked !== 'undefined',
        'Chatbot': typeof window.leonichatbot !== 'undefined'
    };
    
    console.table(checks);
    
    if (!checks.KaTeX) {
        console.error('❌ KaTeX not loaded!');
        return false;
    }
    
    if (!checks.Marked) {
        console.error('❌ Marked.js not loaded!');
        return false;
    }
    
    if (!checks.Chatbot) {
        console.error('❌ Chatbot not initialized!');
        return false;
    }
    
    // Test math processing
    const testInput = "Process Capability: $$Cpk = \\min\\left(\\frac{USL - \\bar{x}}{3\\sigma}, \\frac{\\bar{x} - LSL}{3\\sigma}\\right)$$ and inline: $DR = \\frac{Defects}{Total} \\times 100$";
    
    console.log('📝 Testing input:', testInput);
    
    try {
        // Test the chatbot's math processing
        const result = window.leonichatbot.parseMarkdown(testInput);
        console.log('✅ Math processing result:', result);
        
        // Add to chatbot as a test message
        window.leonichatbot.addMessage(testInput, 'bot', true);
        console.log('✅ Test message added to chatbot');
        
        return true;
    } catch (error) {
        console.error('❌ Math processing failed:', error);
        return false;
    }
}

// Test individual components
function testKaTeX() {
    console.log('🧮 Testing KaTeX directly...');
    
    if (typeof katex === 'undefined') {
        console.error('❌ KaTeX not available');
        return false;
    }
    
    try {
        const result = katex.renderToString('Cpk = \\frac{USL - LSL}{6\\sigma}', {
            displayMode: true,
            throwOnError: false
        });
        console.log('✅ KaTeX test successful:', result);
        return true;
    } catch (error) {
        console.error('❌ KaTeX test failed:', error);
        return false;
    }
}

function testMarkdown() {
    console.log('📝 Testing Markdown...');
    
    if (typeof marked === 'undefined') {
        console.error('❌ Marked.js not available');
        return false;
    }
    
    try {
        const result = marked.parse('# Test\n\n**Bold text** and *italic*');
        console.log('✅ Markdown test successful:', result);
        return true;
    } catch (error) {
        console.error('❌ Markdown test failed:', error);
        return false;
    }
}

function sendTestMessage() {
    console.log('📨 Sending test message to chatbot...');
    
    if (typeof window.leonichatbot === 'undefined') {
        console.error('❌ Chatbot not available');
        return false;
    }
    
    const mathMessage = `# Quality Metrics Test

## Process Capability Index

The process capability index is calculated as:

$$Cpk = \\min\\left(\\frac{USL - \\bar{x}}{3\\sigma}, \\frac{\\bar{x} - LSL}{3\\sigma}\\right)$$

Where:
- $USL$ = Upper Specification Limit
- $LSL$ = Lower Specification Limit  
- $\\bar{x}$ = Process Mean
- $\\sigma$ = Process Standard Deviation

## Defect Rate Calculation

The defect rate percentage is: $DR = \\frac{\\text{Defects}}{\\text{Total Production}} \\times 100\\%$

## Control Chart Limits

- Upper Control Limit: $UCL = \\bar{x} + 3\\sigma$
- Lower Control Limit: $LCL = \\bar{x} - 3\\sigma$
`;

    try {
        window.leonichatbot.addMessage(mathMessage, 'bot', true);
        console.log('✅ Test message sent successfully');
        
        // Also open the chat if it's closed
        if (!window.leonichatbot.isOpen) {
            window.leonichatbot.openChat();
        }
        
        return true;
    } catch (error) {
        console.error('❌ Failed to send test message:', error);
        return false;
    }
}

// Make functions available globally
window.quickMathTest = quickMathTest;
window.testKaTeX = testKaTeX;
window.testMarkdown = testMarkdown;
window.sendTestMessage = sendTestMessage;

console.log('🔧 Math test functions loaded!');
console.log('Available functions:');
console.log('- quickMathTest() - Full test');
console.log('- testKaTeX() - Test KaTeX only');
console.log('- testMarkdown() - Test Markdown only');
console.log('- sendTestMessage() - Send test message to chatbot');

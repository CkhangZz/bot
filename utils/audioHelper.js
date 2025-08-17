/**
 * Add delay for retry logic
 * @param {number} ms - Milliseconds to wait
 * @returns {Promise} Promise that resolves after delay
 */
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Retry voice connection with backoff
 * @param {function} connectionFn - Function to establish connection
 * @param {number} maxRetries - Maximum retry attempts
 * @returns {Promise} Connection result
 */
async function retryVoiceConnection(connectionFn, maxRetries = 3) {
    let lastError;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            console.log(`Voice connection attempt ${attempt}/${maxRetries}`);
            return await connectionFn();
        } catch (error) {
            lastError = error;
            console.log(`Connection attempt ${attempt} failed:`, error.message);
            
            if (attempt < maxRetries) {
                const delayMs = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
                console.log(`Retrying in ${delayMs}ms...`);
                await delay(delayMs);
            }
        }
    }
    
    throw lastError;
}

module.exports = {
    retryVoiceConnection,
    delay
};
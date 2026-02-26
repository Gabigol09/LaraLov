/**
 * Media Detection and Rendering Utilities
 * Detects file types by extension and renders them responsively
 */

// Media file extensions
const IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg'];
const VIDEO_EXTENSIONS = ['mp4', 'webm', 'mov', 'avi', 'mkv', 'ogg'];

/**
 * Detects if a file is an image or video based on its extension
 * @param {string} filepath - The path or filename of the media file
 * @returns {string} - Returns 'image', 'video', or 'unknown'
 */
function detectMediaType(filepath) {
    if (!filepath) return 'unknown';
    
    // Extract extension from filepath
    const extension = filepath.split('.').pop().toLowerCase().split('?')[0];
    
    if (IMAGE_EXTENSIONS.includes(extension)) {
        return 'image';
    } else if (VIDEO_EXTENSIONS.includes(extension)) {
        return 'video';
    }
    
    return 'unknown';
}

/**
 * Creates a responsive image element
 * @param {string} src - Image source path
 * @param {string} alt - Alt text for the image
 * @returns {HTMLImageElement} - Configured image element
 */
function createResponsiveImage(src, alt = '') {
    const img = document.createElement('img');
    img.src = src;
    img.alt = alt || 'Image';
    
    // Responsive styling
    img.style.maxWidth = '100%';
    img.style.maxHeight = '100%';
    img.style.width = 'auto';
    img.style.height = 'auto';
    img.style.objectFit = 'contain';
    img.style.display = 'block';
    
    // Retro pixel styling
    img.style.imageRendering = 'pixelated';
    img.style.imageRendering = '-moz-crisp-edges';
    img.style.imageRendering = 'crisp-edges';
    
    // Border and shadow for retro aesthetic
    img.style.border = '2px solid #ffffff';
    img.style.boxShadow = '0 0 15px rgba(255, 255, 255, 0.2)';
    
    // Error handling
    img.onerror = function() {
        this.style.display = 'none';
        const errorContainer = this.parentElement;
        if (errorContainer && !errorContainer.querySelector('.error')) {
            const errorMsg = document.createElement('div');
            errorMsg.className = 'error';
            errorMsg.textContent = 'Image not found';
            errorMsg.style.color = '#ff0000';
            errorMsg.style.fontSize = '20px';
            errorMsg.style.textAlign = 'center';
            errorMsg.style.padding = '20px';
            errorContainer.appendChild(errorMsg);
        }
    };
    
    return img;
}

/**
 * Creates a responsive video element
 * @param {string} src - Video source path
 * @param {Object} options - Optional configuration
 * @returns {HTMLVideoElement} - Configured video element
 */
function createResponsiveVideo(src, options = {}) {
    const video = document.createElement('video');
    video.src = src;
    
    // Video attributes
    video.controls = options.controls !== false; // Default to true
    video.autoplay = options.autoplay || false;
    video.loop = options.loop || false;
    video.muted = options.muted || false;
    video.playsInline = true; // Important for mobile
    
    // Responsive styling
    video.style.maxWidth = '100%';
    video.style.maxHeight = '100%';
    video.style.width = 'auto';
    video.style.height = 'auto';
    video.style.objectFit = 'contain';
    video.style.display = 'block';
    
    // Border and shadow for retro aesthetic
    video.style.border = '2px solid #ffffff';
    video.style.boxShadow = '0 0 15px rgba(255, 255, 255, 0.2)';
    
    // Error handling
    video.onerror = function() {
        this.style.display = 'none';
        const errorContainer = this.parentElement;
        if (errorContainer && !errorContainer.querySelector('.error')) {
            const errorMsg = document.createElement('div');
            errorMsg.className = 'error';
            errorMsg.textContent = 'Video not found or format not supported';
            errorMsg.style.color = '#ff0000';
            errorMsg.style.fontSize = '20px';
            errorMsg.style.textAlign = 'center';
            errorMsg.style.padding = '20px';
            errorContainer.appendChild(errorMsg);
        }
    };
    
    // Load error handling
    video.addEventListener('error', function(e) {
        console.error('Video loading error:', e);
    });
    
    return video;
}

/**
 * Creates a responsive media element (image or video) based on file type
 * @param {string} filepath - Path to the media file
 * @param {string} alt - Alt text (for images)
 * @param {Object} options - Optional configuration for videos
 * @returns {HTMLElement} - Image or video element
 */
function createResponsiveMedia(filepath, alt = '', options = {}) {
    const mediaType = detectMediaType(filepath);
    
    if (mediaType === 'image') {
        return createResponsiveImage(filepath, alt);
    } else if (mediaType === 'video') {
        return createResponsiveVideo(filepath, options);
    } else {
        // Unknown type - try as image first
        const img = createResponsiveImage(filepath, alt);
        img.onerror = function() {
            // If image fails, try as video
            const video = createResponsiveVideo(filepath, options);
            this.parentElement.replaceChild(video, this);
        };
        return img;
    }
}

/**
 * Renders media into a container element responsively
 * @param {HTMLElement} container - Container element to render media into
 * @param {string} filepath - Path to the media file
 * @param {string} alt - Alt text (for images)
 * @param {Object} options - Optional configuration for videos
 */
function renderMedia(container, filepath, alt = '', options = {}) {
    // Clear container
    container.innerHTML = '';
    
    // Ensure container has proper styling for responsive media
    if (!container.style.display) {
        container.style.display = 'flex';
    }
    if (!container.style.alignItems) {
        container.style.alignItems = 'center';
    }
    if (!container.style.justifyContent) {
        container.style.justifyContent = 'center';
    }
    if (!container.style.width) {
        container.style.width = '100%';
    }
    if (!container.style.height) {
        container.style.height = '100%';
    }
    if (!container.style.overflow) {
        container.style.overflow = 'hidden';
    }
    
    // Create and append media element
    const mediaElement = createResponsiveMedia(filepath, alt, options);
    container.appendChild(mediaElement);
    
    return mediaElement;
}

/**
 * Updates media element to be responsive on window resize
 * @param {HTMLElement} mediaElement - The media element to make responsive
 */
function makeMediaResponsive(mediaElement) {
    const updateSize = () => {
        if (mediaElement.tagName === 'IMG' || mediaElement.tagName === 'VIDEO') {
            const container = mediaElement.parentElement;
            if (container) {
                const containerWidth = container.clientWidth;
                const containerHeight = container.clientHeight;
                
                // Maintain aspect ratio while fitting container
                mediaElement.style.maxWidth = `${containerWidth}px`;
                mediaElement.style.maxHeight = `${containerHeight}px`;
            }
        }
    };
    
    // Update on load
    if (mediaElement.tagName === 'IMG') {
        mediaElement.onload = updateSize;
    } else if (mediaElement.tagName === 'VIDEO') {
        mediaElement.addEventListener('loadedmetadata', updateSize);
    }
    
    // Update on window resize
    window.addEventListener('resize', updateSize);
    
    // Initial update
    updateSize();
}

// Export functions for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        detectMediaType,
        createResponsiveImage,
        createResponsiveVideo,
        createResponsiveMedia,
        renderMedia,
        makeMediaResponsive,
        IMAGE_EXTENSIONS,
        VIDEO_EXTENSIONS
    };
}

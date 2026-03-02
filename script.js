/**
 * Media Detection and Rendering Utilities
 */

const IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg'];
const VIDEO_EXTENSIONS = ['mp4', 'webm', 'mov', 'avi', 'mkv', 'ogg'];

function detectMediaType(filepath) {
    if (!filepath) return 'unknown';
    const extension = filepath.split('.').pop().toLowerCase().split('?')[0];

    if (IMAGE_EXTENSIONS.includes(extension)) return 'image';
    if (VIDEO_EXTENSIONS.includes(extension)) return 'video';

    return 'unknown';
}

function createResponsiveImage(src, alt = '') {
    const img = document.createElement('img');
    img.src = src;
    img.alt = alt || 'Image';

    // ❌ REMOVIDO qualquer controle de width/height aqui
    // CSS agora controla tudo

    img.onerror = function () {
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

function createResponsiveVideo(src, options = {}) {
    const video = document.createElement('video');
    video.src = src;

    video.controls = true;
    video.autoplay = true;
    video.loop = true;
    video.muted = true; // necessário para autoplay funcionar
    video.playsInline = true;

    return video;
}

function createResponsiveMedia(filepath, alt = '', options = {}) {
    const mediaType = detectMediaType(filepath);

    if (mediaType === 'image') {
        return createResponsiveImage(filepath, alt);
    } else if (mediaType === 'video') {
        return createResponsiveVideo(filepath, options);
    }

    return createResponsiveImage(filepath, alt);
}

function renderMedia(container, filepath, alt = '', options = {}) {
    container.innerHTML = '';

    const mediaElement = createResponsiveMedia(filepath, alt, options);
    container.appendChild(mediaElement);

    return mediaElement;
}

// ❌ FUNÇÃO REMOVIDA
// makeMediaResponsive apagada porque ela causava o corte
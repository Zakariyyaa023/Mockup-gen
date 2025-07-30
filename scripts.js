const promptFormUI = document.querySelector(".prompt-form");
const promptBtn = document.querySelector(".prompt-btn");
const promptInput = document.querySelector(".prompt-input");
const generateBtn = document.querySelector(".generate-btn");
const modelSelect = document.getElementById("model-select");
const textArea = document.getElementById("generatedCode");
const showLiveCode = document.getElementById("codePreview");
const mainContent = document.getElementById("uiMockGeneratorContent");
const title = document.querySelector(".title");
const body = document.body;
const previewContainer = document.getElementById("previewContainer");
const sidebarPreview = document.getElementById("sidebarPreview");
const codeTextarea = document.getElementById("generatedCode");
let sidebarTransitioned = false;

promptInput.addEventListener('input', () => {
  promptInput.style.height = 'auto'; 
  promptInput.style.height = promptInput.scrollHeight + 'px';
});

const examplePrompts = [
    "Mobile login screen with a clean white background, email and password fields, Google login button, and a 'Forgot password?' link at the bottom.",
    "Modern analytics dashboard with a sidebar, top navbar, dark theme, cards showing revenue, active users, and graphs.",
    "Product detail page for an online clothing store, with large product image, title, price, size selection, and an 'Add to cart' button.",
    "Minimal desktop chat app interface with contacts sidebar, chat bubbles, message input field, and profile avatar at the top.",
    "Simple signup form UI with a full-width layout, fields for name, email, password, confirm password, and a large green signup button.",
    "Responsive e-commerce homepage featuring a hero banner, featured products carousel, navigation bar, and a footer with social links.",
    "Dark mode settings page with toggle switches for notifications, privacy, and language preferences, plus a save changes button.",
    "Mobile food delivery app interface showing nearby restaurants list, filters for cuisine type, search bar, and cart icon with item count.",
    "Clean portfolio website homepage with a grid of project thumbnails, header with logo and menu, and a footer with contact info.",
    "Fitness tracker dashboard with weekly activity graphs, step count, calories burned, and a motivational quote widget.",
    "Booking form UI for a travel website with date pickers, destination dropdown, number of travelers input, and a prominent search button.",
    "Minimal music player UI with album art, play/pause button, progress bar, volume control, and playlist dropdown.",
    "User profile page with circular avatar, editable bio section, follower/following counts, and a tabbed interface for posts and likes.",
    "Mobile banking app dashboard showing account balances, recent transactions, transfer money button, and a quick pay feature.",
    "Task management app UI with columns for To Do, In Progress, and Done tasks, drag-and-drop functionality, and a new task input field.",
    "E-learning platform course page with video player, course outline sidebar, progress bar, and discussion section below the video.",
    "Recipe app interface displaying list of recipes with images, filter by cuisine and difficulty, and a favorite toggle button on each item.",
    "Minimal calendar app UI with month view, daily agenda list, add event button, and color-coded event categories.",
    "News app homepage featuring top headlines carousel, category tabs, article cards with images, and a bottom navigation bar.",
    "Customer support chat widget UI with message history, quick reply buttons, typing indicator, and agent profile info.",
    "Travel itinerary planner with map integration, daily schedule list, add/remove activity buttons, and share itinerary feature.",
    "Minimalistic weather app interface showing current conditions, hourly forecast scroll, and weekly forecast cards with icons.",
    "Job application tracker dashboard with job cards, status labels (applied, interview, offer), and a search/filter panel.",
    "Photo gallery UI with masonry layout, lightbox preview on click, upload button, and filter by date or tags.",
    "Cryptocurrency portfolio dashboard with real-time price charts, portfolio value summary, and buy/sell action buttons.",
    "Event ticket booking page with seat map selector, ticket quantity dropdown, total price display, and checkout button.",
    "Social media feed UI with user posts, like/comment/share buttons, story highlights carousel, and a new post creation modal.",
    "Simple newsletter signup popup with email input, checkbox for terms agreement, and a submit button with success confirmation.",
    "Online bookstore homepage featuring bestseller carousel, search bar, categories sidebar, and user reviews section.",
    "Healthcare appointment booking UI with doctor list, date/time picker, patient info form, and confirmation screen."
];

// Utility function to add delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let hasReloaded = false;

async function makeAPICall(basePromptURL, maxRetries = 3, retryDelay = 1000) {
    const randomSeed = Math.floor(Math.random() * 1000000);
    const url = `${basePromptURL}?seed=${randomSeed}`;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            console.log(`API call attempt ${attempt}/${maxRetries} (Seed: ${randomSeed})`);

            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Accept": "text/plain",
                    "Cache-Control": "no-cache"
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const text = await response.text();
            console.log(`API call successful on attempt ${attempt}`);
            return text;

        } catch (error) {
            console.error(`Attempt ${attempt} failed:`, error.message);

            if (attempt === maxRetries) {
                const codeTextarea = document.getElementById("generatedCode");
                if (codeTextarea) {
                    codeTextarea.value = `// All ${maxRetries} attempts failed (Seed: ${randomSeed}).\n// Please wait while we retry...`;
                    autoResize();
                }

                // Prevent infinite reload loop
                if (!hasReloaded) {
                    hasReloaded = true;
                    setTimeout(() => {
                        location.reload();
                    }, 2000); // delay before reload
                }

                throw new Error(`All ${maxRetries} attempts failed. Last error: ${error.message}`);
            }

            const waitTime = retryDelay * Math.pow(2, attempt - 1);
            console.log(`Waiting ${waitTime}ms before retry...`);
            await delay(waitTime);
        }
    }
}


// Function to transition to sidebar layout
function transitionToSidebar() {
    if (!sidebarTransitioned) {
        sidebarTransitioned = true;
        
        // Add classes to trigger the transition
        body.classList.add('sidebar-active');
        mainContent.classList.add('sidebar-active');
        title.classList.add('sidebar-active');
        showLiveCode.classList.add('sidebar-active');
        previewContainer.classList.add('show');
        
        // Adjust iframe height after transition
        setTimeout(() => {
            adjustIframeHeight();
        }, 600); // Wait for transition to complete
    }
}

// Function to adjust iframe height
function adjustIframeHeight() {
    const iframe = document.getElementById('codePreview');
    if (iframe && iframe.classList.contains('sidebar-active')) {
        iframe.style.height = '100vh';
    }
}

// Main code generation function with validation and retry logic
const generateTextCode = async (promptText) => {
    generateBtn.setAttribute("disabled", "true");
    generateBtn.textContent = "Generating...";
    
    let i = 0;
    let generatedText = "";

    try {
        // Single API call that validates and generates in one go
        const fullPrompt = `First check if this is a UI design related prompt: "${promptText}". If it is UI related, respond with "yes" followed by clean HTML with embedded CSS JS for: ${promptText}. Include code only with brief comments, no explanations. If it's not UI related, respond with only "no".`;
        
        const encodedPrompt = encodeURIComponent(fullPrompt);
        const baseURL = `https://text.pollinations.ai/prompt/${encodedPrompt}`;
        
        // Use retry logic for the single API call
        generatedText = await makeAPICall(baseURL, 3, 1000);
        console.log("Full API response:", generatedText);
        console.log("Response length:", generatedText.length);
        console.log("First 200 characters:", generatedText.substring(0, 200));
        
        // Check if response starts with "yes"
        if (!generatedText.toLowerCase().trim().startsWith('yes')) {
            console.log("Response does not start with 'yes':", generatedText.substring(0, 50));
            alert("Only UI design prompts are allowed. Please describe a UI component or screen.");
            generateBtn.removeAttribute("disabled");
            generateBtn.textContent = "Generate";
            return;
        }
        
        console.log("Validation passed, processing code...");
        
        // Remove "yes" from the beginning and clean up the code
        generatedText = generatedText.replace(/^yes\s*/i, '').trim();
        console.log("Code after removing 'yes':", generatedText.length, "characters");
        console.log("Cleaned code preview:", generatedText.substring(0, 200) + "...");
        
        generatedText = generatedText.replace(/^yes\s*/i, '').trim();

        if (generatedText.length === 0) {
            console.error("No code content after removing 'yes'!");
            if (codeTextarea) {
                codeTextarea.value = `// The API confirmed it's a UI prompt, but didn't return any code.\n// Try using a more common or clearer UI description.`;
                autoResize();
            }
            generateBtn.removeAttribute("disabled");
            generateBtn.textContent = "Generate";
            return;
        }

        
        
        if (codeTextarea) {
            console.log("Starting typing animation...");
            codeTextarea.value = ""; // Clear before typing

            const typeInterval = setInterval(() => {
                if (i < generatedText.length) {
                    codeTextarea.value += generatedText.charAt(i);
                    codeTextarea.scrollTop = codeTextarea.scrollHeight; // Auto-scroll
                    i++;
                } else {
                    console.log("Typing animation complete");
                    autoResize();
                    clearInterval(typeInterval);
                    generateBtn.removeAttribute("disabled");
                    generateBtn.textContent = "Generate";
                    
                    // After typing animation completes, transition to sidebar
                    setTimeout(() => {
                        console.log("Transitioning to sidebar...");
                        transitionToSidebar();
                        renderCodeInIframe(generatedText);
                    }, 500); // Small delay before transition
                }
            }, 5);
        } else {
            console.error("Code textarea not found!");
        }

    } catch (error) {
        console.error("Error generating text/code:", error);
        const codeTextarea = document.getElementById("generatedCode");
        if (codeTextarea) {
            codeTextarea.value = `// Error generating code: ${error.message}\n// Please try again.`;
        }
        generateBtn.removeAttribute("disabled");
        generateBtn.textContent = "Generate";
        
    } 
};

function renderCodeInIframe(codeString) {
    showLiveCode.classList.add("show");
    const iframe = document.getElementById('codePreview');
    const sidebarIframe = document.getElementById('sidebarPreview');
    
    // Remove markdown fences from the code string (if present)
    const cleanedCode = codeString
        .replace(/^```html\s*/i, '')
        .replace(/```$/, '');

    // Render in both iframes
    [iframe, sidebarIframe].forEach(frame => {
        if (frame) {
            const doc = frame.contentDocument || frame.contentWindow.document;
            doc.open();
            doc.write(cleanedCode);
            doc.close();
        }
    });

    // Adjust iframe height based on content if not in sidebar mode
    if (!iframe.classList.contains('sidebar-active')) {
        iframe.style.height = 'auto';
        setTimeout(() => {
            const doc = iframe.contentDocument || iframe.contentWindow.document;
            const body = doc.body;
            if (body) {
                iframe.style.height = body.scrollHeight + 'px';
            }
        }, 50);
    }
}

const handleFormSubmit = async (e) => {
    e.preventDefault();

    const promptText = promptInput.value.trim();
    
    if (!promptText) {
        alert("Please enter a prompt.");
        return;
    }

    // Direct generation with built-in validation
    await generateTextCode(promptText);
};

// Fill prompt input with random example (typing effect)
promptBtn.addEventListener("click", () => {
    const prompt = examplePrompts[Math.floor(Math.random() * examplePrompts.length)];
    let i = 0;
    promptInput.focus();
    promptInput.value = "";
    promptBtn.disabled = true;
    promptBtn.style.opacity = "0.5";
    const typeInterval = setInterval(() => {
        if (i < prompt.length) {
            promptInput.value += prompt.charAt(i);
            i++;
        } else {
            clearInterval(typeInterval);
            promptBtn.disabled = false;
            promptBtn.style.opacity = "1";
        }
    }, 10); // Speed of typing
});

promptFormUI.addEventListener("submit", handleFormSubmit);

// Handle window resize to adjust iframe
window.addEventListener('resize', () => {
    if (sidebarTransitioned) {
        adjustIframeHeight();
    }
});

const textarea = document.getElementById('generatedCode');

function autoResize() {
    textarea.style.height = 'auto'; // reset height
    textarea.style.height = textarea.scrollHeight + 'px'; // set to scrollHeight
}

// Example: Simulate typing or updating content gradually
function simulateTyping(text, index = 0) {
    if (index <= text.length) {
        textarea.value = text.slice(0, index);
        autoResize();
        setTimeout(() => simulateTyping(text, index + 1), 50);
    }
}

function downloadCode(filename, code) {
    const blob = new Blob([code], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}
document.getElementById('downloadBtn').addEventListener('click', (e) => {
    e.preventDefault(); 

    const rawCode = codeTextarea.value;
    if (!rawCode || rawCode.trim().length < 10) {
        alert("Nothing to download yet. Please generate some code first.");
        return;
    }

    const filename = "ui-design.html"; // Static or make it dynamic
    downloadCode(filename, rawCode); // Use raw code directly
});




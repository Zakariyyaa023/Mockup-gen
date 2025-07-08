# UI Design Prompt Image & Code Generator

This project is a web-based tool that allows users to generate UI design images and related code snippets based on textual prompts. It leverages the Pollinations API for AI-powered image and text generation, focusing specifically on UI design prompts.

---

## Features

- **Prompt Input:** Enter UI design prompts to generate images and code.
- **Example Prompts:** Generate random example UI design prompts for inspiration.
- **Image Generation:** Produces multiple images based on selected count and aspect ratio.
- **Code Generation:** Provides detailed code and explanations related to the generated UI design.
- **Validation:** Ensures that only valid UI design-related prompts are accepted.
- **Responsive UI:** Displays generated images in a grid with loading states and error handling.
- **Download:** Allows downloading generated images directly from the UI.

---

## How It Works

1. **Prompt Input & Validation:**
   - User enters a UI design prompt or clicks a button to fill the input with a random example prompt.
   - The prompt is validated asynchronously via the Pollinations API to confirm it's UI design-related.

2. **Image Generation:**
   - The app calculates the appropriate image dimensions based on the selected aspect ratio.
   - It sends requests to generate images from the Pollinations image generation endpoint.
   - Displays loading spinners for each image slot and updates the image cards once images are ready.

3. **Code Generation:**
   - Sends the prompt to the Pollinations text API to generate code and explanations related to the UI design.
   - The generated code is typed out gradually inside a textarea for better user experience.

4. **User Interaction:**
   - Users can download any generated image.
   - Error states and loading animations improve feedback.

---

## Usage

### UI Elements

- **Prompt Input:** Text input where the user writes the UI prompt.
- **Generate Button:** Starts the image and code generation process.
- **Example Prompt Button:** Fills the prompt input with a random example prompt with a typing effect.
- **Model Select (optional):** Placeholder for model selection.
- **Count Select:** Number of images to generate.
- **Ratio Select:** Aspect ratio of generated images.
- **Gallery Grid:** Displays generated images.
- **Generated Code Textarea:** Shows generated code and explanations.

### Example Prompts

Some sample UI prompts include:

- "Mobile login screen with a clean white background, email and password fields..."
- "Modern analytics dashboard with a sidebar, top navbar, dark theme..."
- "Minimal desktop chat app interface with contacts sidebar, chat bubbles..."

---

## Installation

Clone the repository and open the main HTML file in a browser. Ensure internet connectivity for API access.

## Dependencies
FontAwesome (for icons)

Pollinations API (https://pollinations.ai)

## Future Improvements
Add support for multiple AI models.

Improve UI/UX with better loading animations.

Cache previously generated images and code for offline use.

Add user authentication and prompt saving.


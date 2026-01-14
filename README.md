# Fire Math

A fast-paced, arithmetic-based survival game built with Phaser 3. Solve math problems quickly to keep the fire from consuming the screen!

---

## Setup and Run Instructions

1. Ensure you have [Node.js](https://nodejs.org/) installed.
2. Open terminal in the project folder and run:
    ```
    npm install
    ```
3. Run Development Server:
    ```
    npm run dev
    ```
4. Open the url link provided in your terminal in your browser and play!

---

## Engine
* Game Engine: [Phaser 3.90+](https://phaser.io/)
* Bundler: Vite
* Language: JavaScript

---

## Design Choices
* Instead of a simple numerical countdown, the game uses a dynamic Progress Bar which is easier to track when playing.
* The background and progress bar utilize Color interpolation. The scene shifts from green to red as the timer approaches zero, providing feedback.
* To increase engagement, the game uses Camera Shaking during the final 5 seconds to simulate panic.


---

## Gameplay Logic
* The game generates random arithmetic problems based on the current level of difficulty. 3 levels of difficulty: addition, substraction, multiplication. The difficulty increases with the progress (scores).
* Players use the number keys to type their answer and the Enter key to submit.
* Every correct answer resets the timer. If the timer reaches zero, the game ends.
* A progress bar and a shifting background color (green to red) show the remaining time, creating a visual sense of urgency.

---

## Assets
* <a href="https://www.flaticon.com/free-icons/fire" title="fire icons">Fire icons created by Freepik - Flaticon</a>
* Music by <a href="https://pixabay.com/users/delosound-46524562/?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=432203">DELOSound</a> from <a href="https://pixabay.com/music//?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=432203">Pixabay</a>
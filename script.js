document.addEventListener("DOMContentLoaded", () => {
    // Get DOM elements
    const cups = document.querySelectorAll(".cup");
    const ball = document.getElementById("ball");
    const message = document.getElementById("message");
    const shuffleButton = document.getElementById("shuffleBtn");

    // Game state
    let isShuffling = false;
    let gameOver = false;

    // Hide ball initially
    ball.style.opacity = "0";

    // Initialize game state
    function resetGame() {
        isShuffling = false;
        gameOver = false;
        message.textContent = "Pick a cup!";
        message.style.color = "#212121";
        ball.style.opacity = "0";

        // Reset all cup positions
        cups.forEach((cup) => {
            cup.style.transform = "";
            cup.style.transition = "transform 0.3s ease-out";
        });
    }

    // Shuffle animation
    function shuffleCups() {
        if (isShuffling || gameOver) return;

        isShuffling = true;
        message.textContent = "🎲";
        ball.style.opacity = "0";

        let shuffleCount = 8;
        let currentShuffle = 0;

        function performShuffle() {
            if (currentShuffle >= shuffleCount) {
                isShuffling = false;
                message.textContent = "រើសកែវមួយ!";
                return;
            }

            // Pick two random cups to swap
            const idx1 = Math.floor(Math.random() * 3);
            let idx2 = Math.floor(Math.random() * 3);
            while (idx2 === idx1) {
                idx2 = Math.floor(Math.random() * 3);
            }

            const cup1 = cups[idx1];
            const cup2 = cups[idx2];

            // Get positions for animation
            const cup1Rect = cup1.getBoundingClientRect();
            const cup2Rect = cup2.getBoundingClientRect();
            const distance = cup2Rect.left - cup1Rect.left;

            // Animate swap
            cup1.style.transition = "transform 0.2s ease-in-out";
            cup2.style.transition = "transform 0.2s ease-in-out";
            cup1.style.transform = `translateX(${distance}px)`;
            cup2.style.transform = `translateX(${-distance}px)`;

            // After animation completes
            setTimeout(() => {
                // Reset transforms
                cup1.style.transition = "none";
                cup2.style.transition = "none";
                cup1.style.transform = "";
                cup2.style.transform = "";

                // Swap DOM positions
                const parent = cup1.parentNode;
                const cup1Next = cup1.nextSibling;
                const cup2Next = cup2.nextSibling;

                if (cup1Next === cup2) {
                    parent.insertBefore(cup2, cup1);
                } else if (cup2Next === cup1) {
                    parent.insertBefore(cup1, cup2);
                } else {
                    parent.insertBefore(cup1, cup2Next);
                    parent.insertBefore(cup2, cup1Next);
                }

                // Re-enable transitions
                setTimeout(() => {
                    cup1.style.transition = "";
                    cup2.style.transition = "";
                }, 50);

                currentShuffle++;
                setTimeout(performShuffle, 200);
            }, 200);
        }

        performShuffle();
    }

    // Handle cup click (rigged to always lose)
    function handleCupClick(clickedCup) {
        if (isShuffling || gameOver) return;

        const cupElements = Array.from(cups);
        const clickedIndex = cupElements.indexOf(clickedCup);

        // Lift clicked cup with animation
        clickedCup.style.transition = "transform 0.3s ease-out";
        clickedCup.style.transform = "translateY(-50px)";

        // Get unclicked cups
        const unclickedCups = cupElements.filter(
            (_, index) => index !== clickedIndex
        );

        // Randomly select one of the unclicked cups to show the ball under
        const riggedCup =
            unclickedCups[Math.floor(Math.random() * unclickedCups.length)];

        setTimeout(() => {
            // Show losing message
            message.textContent = "😞 អ្នកចាញ់!";
            message.style.color = "#f44336";

            // Lift the rigged cup with animation
            riggedCup.style.transition = "transform 0.3s ease-out";
            riggedCup.style.transform = "translateY(-50px)";

            // Position ball under rigged cup - simplified centering
            const cupRect = riggedCup.getBoundingClientRect();
            const parentRect = riggedCup.parentNode.getBoundingClientRect();

            ball.style.transition = "opacity 0.3s ease-out";
            // Center the ball by using the cup's center position
            ball.style.left = `${
                cupRect.left - parentRect.left + cupRect.width / 2
            }px`;
            ball.style.transform = "translateX(-50%)"; // Center the ball using transform
            ball.style.opacity = "1";

            gameOver = true;
        }, 300);
    }

    // Event Listeners
    cups.forEach((cup) => {
        cup.addEventListener("click", () => handleCupClick(cup));
    });

    shuffleButton.addEventListener("click", () => {
        resetGame();
        message.textContent = "🎲";
        setTimeout(shuffleCups, 300);
    });

    // Start game
    resetGame();
    setTimeout(shuffleCups, 500);
});

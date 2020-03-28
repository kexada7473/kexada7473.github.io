function setOpacity(element, opacity) {
    element.style.display = opacity > 0 ? "block" : "none";
    element.style.opacity = opacity;
}

function easing(time) {
    return time < 0.5 ? 4 * time * time * time : (time - 1) * (2 * time - 2) * (2 * time - 2) + 1;
}

function blendTransition(slideElementFrom, slideElementTo) {
    return time => {
        setOpacity(slideElementFrom, 1 - time);
        setOpacity(slideElementTo, time);
    };
}

function slideTransition(slideElementFrom, slideElementTo) {
    return time => {
        blendTransition(slideElementFrom, slideElementTo)(time);
        if (time == 0 || time == 1) {
            slideElementFrom.style.transform = slideElementTo.style.transform = "";
        } else {
            slideElementFrom.style.transform = `translate3d(0, 0, 0) translate(${-time * 200}vmin, 0)`;
            slideElementTo.style.transform = `translate3d(0, 0, 0) translate(${(1 - time) * 200}vmin, 0)`;
        }
    };
}

let slideNames = [];
for (let slideElement of document.querySelector(".slides").childNodes) {
    if (slideElement.nodeType == Node.ELEMENT_NODE) {
        slideNames.push(slideElement.classList[0].split("slide-")[1]);
    }
}

let slideElements = [];
for (let slideName of slideNames) {
    slideElements.push(document.querySelector(`.slide-${slideName}`));
}
function getSlideElement(slideName) {
    return slideElements[slideNames.indexOf(slideName)];
}

let indicatorElement = document.querySelector(".indicator");

window.onload = () => {
    document.body.style.opacity = 1;
    for (let i = 0; i < slideNames.length; i++) {
        setOpacity(slideElements[i], i == 0 ? 1 : 0);
    }
};

let transitionFunctions = [];
for (let i = 0; i < slideNames.length - 1; i++) {
    transitionFunctions.push(slideTransition(getSlideElement(slideNames[i]), getSlideElement(slideNames[i + 1])));
}

let slideTime = 15 * 60, transitionTime = 60;
let currentSlideIndex = 0;
let nextSlideIndex = -1;
let currentTime = 0;
let transitionStartTime, transitionEndTime;
let autoModeEnabled = false;
let currentSlideStartTime = 0;
function startTransition() {
    transitionStartTime = currentTime;
    transitionEndTime = currentTime + transitionTime;
    if (nextSlideIndex < currentSlideIndex) {
        transitionFunctions[Math.min(currentSlideIndex, nextSlideIndex)](1);
    } else {
        transitionFunctions[Math.min(currentSlideIndex, nextSlideIndex)](0);
    }
}
function tick() {
    if (autoModeEnabled && currentTime >= currentSlideStartTime + slideTime && nextSlideIndex == -1 && currentSlideIndex < slideNames.length - 1) {
        nextSlideIndex = currentSlideIndex + 1;
        startTransition();
    }
    if (currentSlideIndex == slideNames.length - 1) {
        autoModeEnabled = false;
    }
    if (autoModeEnabled) {
        indicatorElement.style.right = `${(1 - (currentTime - currentSlideStartTime) / slideTime) * 15}vmin`;
        indicatorElement.style.width = `${(currentTime - currentSlideStartTime) / slideTime * 15}vmin`;
    } else {
        indicatorElement.style.right = 0;
        indicatorElement.style.width = 0;
    }
    if (nextSlideIndex != -1) {
        currentSlideStartTime = currentTime;
        if (nextSlideIndex < currentSlideIndex) {
            transitionFunctions[Math.min(currentSlideIndex, nextSlideIndex)](1 - easing((currentTime - transitionStartTime) / (transitionEndTime - transitionStartTime)));
        } else {
            transitionFunctions[Math.min(currentSlideIndex, nextSlideIndex)](easing((currentTime - transitionStartTime) / (transitionEndTime - transitionStartTime)));
        }
        if (currentTime >= transitionEndTime) {
            if (nextSlideIndex < currentSlideIndex) {
                transitionFunctions[Math.min(currentSlideIndex, nextSlideIndex)](0);
            } else {
                transitionFunctions[Math.min(currentSlideIndex, nextSlideIndex)](1);
            }
            currentSlideIndex = nextSlideIndex;
            nextSlideIndex = -1;
        }
    }
    currentTime++;
    requestAnimationFrame(tick);
}
tick();

document.addEventListener("keydown", event => {
    if (event.code == "ArrowLeft") {
        if (nextSlideIndex == -1 && currentSlideIndex > 0) {
            autoModeEnabled = false;
            nextSlideIndex = currentSlideIndex - 1;
            startTransition();
        }
    }
    if (event.code == "ArrowRight") {
        if (nextSlideIndex == -1 && currentSlideIndex < slideNames.length - 1) {
            autoModeEnabled = false;
            nextSlideIndex = currentSlideIndex + 1;
            startTransition();
        }
    }
    if (event.code == "Space") {
        currentSlideStartTime = currentTime;
        autoModeEnabled = !autoModeEnabled;
    }
});

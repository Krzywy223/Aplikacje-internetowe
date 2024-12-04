interface StyleDictionary {
    [key: string]: string;
}

const styles: StyleDictionary = {
    "Style 1": "style.css",
    "Style 2": "style2.css",
    "Style 3": "style3.css"
};

let currentStyle: string = "style.css";

function switchStyle(styleName: string) {
    const styleLink = document.getElementById("current-style") as HTMLLinkElement;
    if (styleLink) {
        styleLink.href = styles[styleName];
        currentStyle = styles[styleName];
    }
}

function createStyleLinks() {
    const styleLinksContainer = document.getElementById("style-links");
    if (styleLinksContainer) {
        for (const styleName in styles) {
            const li = document.createElement("li");
            const a = document.createElement("a");
            a.href = "#";
            a.textContent = styleName;
            a.addEventListener("click", (event) => {
                event.preventDefault();
                switchStyle(styleName);
            });
            li.appendChild(a);
            styleLinksContainer.appendChild(li);
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    createStyleLinks();
});
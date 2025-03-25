document.addEventListener("DOMContentLoaded", function () {
    const row1 = document.getElementById("row1");
    const row2 = document.getElementById("row2");
    const resetButton = document.getElementById("reset-btn");
    const db = firebase.firestore();
    
    let softColors = ["#FFDDC1", "#FFABAB", "#FFC3A0", "#D5AAFF", "#85E3FF",
        "#B9FBC0", "#AFCBFF", "#FFD6E0", "#FFECB3", "#C5E1A5"];
    
    function generateUniqueNumbers() {
        let numbers = [];
        while (numbers.length < 11) {
            let num = (Math.floor(Math.random() * 11) + 2).toString().padStart(2, '0');
            if (!numbers.includes(num)) {
                numbers.push(num);
            }
        }
        return numbers;
    }
    
    function createBoxes() {
        let row1Numbers = generateUniqueNumbers();
        let row2Numbers = generateUniqueNumbers();
        
        for (let i = 0; i < 11; i++) {
            const box1 = document.createElement("div");
            box1.classList.add("box");
            box1.style.backgroundColor = softColors[i % softColors.length];
            box1.innerHTML = "💰";
            addClickEvent(box1, row1Numbers[i]);
            row1.appendChild(box1);
            
            const box2 = document.createElement("div");
            box2.classList.add("box");
            box2.style.backgroundColor = softColors[(i + 1) % softColors.length];
            box2.innerHTML = "💰";
            addClickEvent(box2, row2Numbers[i]);
            row2.appendChild(box2);
        }
    }
    
    function addClickEvent(box, number) {
        box.addEventListener("click", function () {
            if (!box.dataset.clicked) {
                box.textContent = number;
                box.dataset.clicked = "true";
                box.style.backgroundColor = "#fff";
                
                setTimeout(() => {
                    box.textContent = "💰";
                    db.collection("clicks").add({ number, timestamp: firebase.firestore.FieldValue.serverTimestamp() });
                }, 5000);
            }
        });
    }
    
    createBoxes();
    
    resetButton.addEventListener("click", async function () {
        await db.collection("clicks").get().then(snapshot => {
            snapshot.docs.forEach(doc => doc.ref.delete());
        });
        location.reload();
    });
    
    firebase.auth().onAuthStateChanged(user => {
        if (user && user.email === "admin@example.com") {
            resetButton.style.display = "block";
        }
    });
});

window.onload = function() {
  "use strict";

  let buttons = document.querySelectorAll(".item");
  const itemCount = buttons.length/2;
  if(itemCount%2 !== 0) {
    let text = document.getElementById("time").innerHTML = "the pictures are odd, change it";
    return 0;
  }
  let items = setVegetables();
  placeImages(items);

  function setVegetables() {
    let vegetables = ["apple", "avocado", "banana", "blueberries", "carrot", "cherry", "corn", "lemon", "mushroom", "peach", "pear", "peas", "strawberry", "tomato"];
    let arr = [];
    arr = vegetables.slice(0,itemCount);
    arr = arr.concat(arr);
    arr = shuffleArray(arr);
    return arr;

    function shuffleArray(array) {
      let a = [];
      for(let i = 0; i<itemCount*2;i++) {
        let rand = Math.floor(Math.random()*array.length);
        a.push(array[rand]);
        array.splice(rand,1);
      }
      return a;
    }
  }

  function showImage(img) {
    img.setAttribute("style", "display: display; width: 100%; height: 100%")
  }

  function hideImage(img) {
    img.setAttribute("style", "display: none; width: 100%; height: 100%")
  }

  function placeImages(images) {
    let i = 0;
    buttons.forEach((v) => {
      let reverseCard = document.createElement("img");
      reverseCard.src = "vegetables/reverse.png";
      v.appendChild(reverseCard);
      showImage(reverseCard);

      let vegetableImage = document.createElement("img");
      vegetableImage.src = `vegetables/${images[i]}.png`;
      vegetableImage.name = images[i];
      v.appendChild(vegetableImage);
      hideImage(vegetableImage);

      i++;
    });

  }
  let statistics = {
    myTimer: 0,

    startTimer: function startTimer() {
      let that = this;
      let text = document.getElementById("time");
      let timer = document.getElementById("time").innerHTML;
      function fn() {
        if(timer <= 0) {
          clearInterval(that.myTimer);
          text.innerHTML = "you lost";
          that.endGame();
        } else {
          text.innerHTML = --timer;
        }
      }
      that.myTimer = setInterval( fn, 1000);
    },
    endGame: function() {
      document.getElementsByClassName("gameBoard")[0].style.display = "none";
    },
    points: points = (function() {
      let points = 0;
      return function() {
        points++;
        if(points >= itemCount) {
          statistics.endGame();
          clearInterval(statistics.myTimer);
        }
        return points;
      }
    })(),
  };

  let guessedCards = {
    visible: 0,
    firstCard:"",
    secondCard:"",
    checkPairs: function checkPairs() {
      let firstCardName = this.firstCard.children[1].name;
      let secondCardName = this.secondCard.children[1].name;
      let pair = false;

      if(firstCardName === secondCardName) {
        pair = true;

        let text = document.getElementById("points");
        text.innerHTML = `your points: ${points()}`;

        this.firstCard.children[1].setAttribute("class", "matched");
        this.secondCard.children[1].setAttribute("class", "matched");

        this.visible = 0;
      }

      if(!pair) {
        setTimeout( () => {
          hideImage(this.firstCard.children[1]);
          showImage(this.firstCard.children[0]);
          hideImage(this.secondCard.children[1]);
          showImage(this.secondCard.children[0]);
          this.visible = 0;
          this.firstCard = "";
          this.secondCard = "";
        },1000);
      }

    },
    flipCard: function flipCard() {
      if(guessedCards.visible >= 2) {
        return 0;
      }
      let reverse = this.children[0];
      let card = this.children[1];

      if(card.style.display === "none" && guessedCards.visible===0) {

        showImage(card);
        hideImage(reverse);
        guessedCards.firstCard = this;
        guessedCards.visible++;
        return 0;
      }

      if(card.style.display === "none" && guessedCards.visible===1) {
        showImage(card);
        hideImage(reverse);
        guessedCards.secondCard = this;
        guessedCards.visible++;
      }

      if(guessedCards.visible === 2) {
        guessedCards.checkPairs();
      }
    },
  };

  buttons.forEach((b) => {
    b.addEventListener("click", guessedCards.flipCard);
  });

  statistics.startTimer();

};

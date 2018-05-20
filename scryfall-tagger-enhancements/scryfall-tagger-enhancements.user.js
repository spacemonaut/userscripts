// ==UserScript==
// @name         Scryfall Tagger Enhancements
// @namespace    https://github.com/spacemonaut/
// @version      0.2.2
// @description  Enhance the Scryfall tagger. Right now, pagination.
// @author       spacemonaut
// @match        *://tagger.scryfall.com/*
// @grant        none
// @updateURL    https://github.com/spacemonaut/scryfall-enhancements/raw/master/release/scryfall-enhancements.user.js
// @downloadURL  https://github.com/spacemonaut/scryfall-enhancements/raw/master/release/scryfall-enhancements.user.js
// ==/UserScript==

(() => {

  'use strict';

  const scriptCss = `
  .ste.buttons--row {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-top: 20px;
    position: relative;
    z-index: 1;
  }
  `;

  const overrideCss = `
  .illustration-detail__card a {
    z-index: 2;
  }
  `;

  const card = {};

  let cardPanel = document.getElementsByClassName('illustration-detail__card');
  if (cardPanel.length > 0) {
    cardPanel = cardPanel[0];
    parseUrl();
    createCss();
    createNavPanel();
  }

  function parseUrl() {
    const particles = location.pathname.split('/');
    card.setCode = particles[2];
    // TODO: if set is promo, identify the non-promo set
    card.number = parseInt(particles[3], 10);
    card.isBackFace = false;
    if (particles.length > 4 && particles[4] === 'back') {
      card.isBackFace = true;
    }
  }

  function createCss() {
    let styles = document.createElement('style');
    styles.innerHTML = scriptCss;
    document.head.appendChild(styles);

    let overrideStyles = document.createElement('style');
    overrideStyles.innerHTML = overrideCss;
    document.head.appendChild(overrideStyles);
  }

  function makeUrlForCard(setCode, number) {
    return '/card/' + setCode + '/' + number;
  }

  function createNavPanel() {
    let navPanel = document.createElement('div');
    navPanel.className = "ste buttons--row";
    cardPanel.appendChild(navPanel);

    let prevButton = document.createElement('a');
    prevButton.innerHTML = "&larr; prev";
    prevButton.className = "button-primary";
    prevButton.href = makeUrlForCard(card.setCode, card.number - 1);
    navPanel.appendChild(prevButton);

    let nextButton = document.createElement('a');
    nextButton.innerHTML = "next &rarr;";
    nextButton.className = "button-primary";
    nextButton.href = makeUrlForCard(card.setCode, card.number + 1);
    navPanel.appendChild(nextButton);
  }
})();

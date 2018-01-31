// ==UserScript==
// @name         Stack Exchange Chat History Pagination
// @namespace    https://github.com/spacemonaut/
// @version      1.2.1
// @description  Add pagination buttons to the recent messages tab for a Stack Exchange chat user.
// @author       spacemonaut
// @match        https://chat.stackexchange.com/users/*
// @grant        none
// @updateURL    https://raw.githubusercontent.com/spacemonaut/userscripts/master/se-chat-user-history-pagination/se-chat-user-history-pagination.user.js
// ==/UserScript==

(function() {
  'use strict';

  if (window.location.search.indexOf('tab=recent') === -1) {
    return;
  }

  let FIRST_PAGE = 1;
  let url = window.location.href;
  let pageParamRegex = /\bpage=\d+\b/g;
  let pageWasDefined = false;
  let currentPage = FIRST_PAGE;

  setPage();
  addNavigationButtons();

  function setPage() {
    let findPageParam = window.location.search.match(pageParamRegex);
    if (findPageParam !== null) {
      pageWasDefined = true;
      let pageParam = findPageParam[0];
      let pageParamValue = pageParam.split('=')[1];
      currentPage = parseInt(pageParamValue, 10);
    }
  }

  function urlForPage(pageNumber) {
    let newPageParam = 'page=' + pageNumber;
    if (pageWasDefined) {
      return window.location.href.replace(pageParamRegex, newPageParam);
    } else {
      return window.location.href + '&' + newPageParam;
    }
  }

  function createButton(label, pageNumber) {
    var button = document.createElement('a');
    button.innerHTML = label;
    button.href = urlForPage(pageNumber);

    let styles = 'display: block; padding: 0.5em 1em; margin: 0.5em; border: 2px solid; font-weight: bolder;';
    if (typeof additionalStyles === 'string') {
      styles += additionalStyles;
    }
    button.setAttribute('style', styles);

    return button;
  }

  function createNavbar() {
    let navbarStyle = 'display: flex; flex-direction: row; align-items: center;';
    let majorNavbarStyle = navbarStyle + 'justify-content: space-between;';
    let minorNavbarStyle = navbarStyle + 'justify-content: flex-start;';
    let navbar = document.createElement('div');
    navbar.setAttribute('style', majorNavbarStyle);

    let leftPart = document.createElement('div');
    leftPart.setAttribute('style', minorNavbarStyle);

    let rightPart = document.createElement('div');
    rightPart.setAttribute('style', minorNavbarStyle);

    navbar.appendChild(leftPart);
    navbar.appendChild(rightPart);

    if (currentPage > FIRST_PAGE) {
      let firstButton = createButton('&#8630; first page', FIRST_PAGE);
      leftPart.appendChild(firstButton);

      if (currentPage >= (FIRST_PAGE + 10)) {
        let megaPrevButton = createButton('&lArr; prev 10', currentPage - 10);
        rightPart.appendChild(megaPrevButton);
      }

      let prevButton = createButton('&larr; prev', currentPage - 1);
      rightPart.appendChild(prevButton);
    }

    let pageDisplay = document.createElement('div');
    pageDisplay.setAttribute('style', 'font-weight: bold; margin: 1em');
    pageDisplay.innerText = 'page ' + currentPage;
    rightPart.appendChild(pageDisplay);

    let nextButton = createButton('next &rarr;', currentPage + 1);
    rightPart.appendChild(nextButton);

    let megaNextButton = createButton('next 10 &rArr;', currentPage + 10);
    rightPart.appendChild(megaNextButton);

    return navbar;
  }

  function addNavigationButtons() {
    let topNavbar = createNavbar();
    let bottomNavbar = topNavbar.cloneNode(true);

    let contentElem = document.getElementById('content');


    var subheaderElem = contentElem.getElementsByClassName('subheader')[0];
    contentElem.insertBefore(topNavbar, subheaderElem.nextSibling);

    contentElem.appendChild(bottomNavbar);
  }
})();

if (window.devicePixelRatio && devicePixelRatio >= 2) {
  var testElem = document.createElement('div');
  testElem.style.border = '.5px solid transparent';
  document.body.appendChild(testElem);
  if (testElem.offsetHeight == 1)
  {
    document.querySelector('html').classList.add('hairlines');
  }
  document.body.removeChild(testElem);
}
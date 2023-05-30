window.addEventListener('beforeunload', (e) => {
    e.preventDefault();
    e.returnValue = '';  // This line is necessary for Chrome and Firefox
  });
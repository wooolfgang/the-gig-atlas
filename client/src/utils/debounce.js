function debounce(func, wait, immediate) {
  let timeout = null;

  return function run() {
    const context = this;
    const args = arguments;
    const executable = immediate && !timeout;
    clearInterval(timeout);
    timeout = setTimeout(() => {
      timeout = null;
      if (!executable) {
        func.apply(context, args);
      }
    }, wait);
    if (executable) func.apply(context, args);
  };
}

export default debounce;

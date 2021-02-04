export const getSize = () => {
  const { body } = document;
  const { documentElement } = document;

  const height = Math.max(
    body.scrollHeight,
    body.offsetHeight,
    documentElement.clientHeight,
    documentElement.scrollHeight,
    documentElement.offsetHeight,
  );
  const width = Math.max(
    body.scrollWidth,
    body.offsetWidth,
    documentElement.clientWidth,
    documentElement.scrollWidth,
    documentElement.offsetWidth,
  );
  return {
    width,
    height,
  };
};

export const getREMinPX = () => parseFloat(getComputedStyle(document.documentElement).fontSize);

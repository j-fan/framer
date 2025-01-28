export const downloadURL = (dataUrl: string, fileName: string) => {
  const a = document.createElement('a');
  document.body.appendChild(a);
  a.style = 'display: none';

  a.href = dataUrl;
  a.download = fileName;
  a.click();
  a.remove();
};

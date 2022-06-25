import { useEffect, useState } from 'react';

const useTitle = (_title) => {
  const [title, setTitle] = useState(_title);
  const updateTitle = () => {
    const htmlTitle = document.querySelector('title');
    htmlTitle.innerText = title;
  };

  useEffect(updateTitle, [title]);
  return setTitle;
};

export default useTitle;

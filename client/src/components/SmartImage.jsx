import React, { useState, useEffect } from 'react';

/* ═══════════════════════════════════════════════════════
   SMART IMAGE COMPONENT
   Architecture: Local -> Wikipedia API -> DiceBear
═══════════════════════════════════════════════════════ */
export function SmartImage({ character, style, className }) {
  // Use character.image directly if available, otherwise fallback to local folder or dicebear
  const initialImg = character?.image || `/images/characters/${character?.id}.jpg`;
  const [imgSrc, setImgSrc] = useState(initialImg);
  const [errorLevel, setErrorLevel] = useState(0);

  useEffect(() => {
    // Reset state when character changes
    setImgSrc(character?.image || `/images/characters/${character?.id}.jpg`);
    setErrorLevel(0);
  }, [character]);

  const handleError = async () => {
    if (errorLevel === 0) {
      // Failed primary image. Fallback to Wikipedia API
      try {
        const query = encodeURIComponent(character.name);
        const res = await fetch(`https://en.wikipedia.org/w/api.php?action=query&titles=${query}&prop=pageimages&format=json&pithumbsize=500&origin=*`);
        const data = await res.json();
        const pages = data.query?.pages;
        
        let wikiImage = null;
        if (pages) {
          const pageId = Object.keys(pages)[0];
          if (pageId !== '-1' && pages[pageId].thumbnail?.source) {
            wikiImage = pages[pageId].thumbnail.source;
          }
        }

        if (wikiImage) {
          setImgSrc(wikiImage);
          setErrorLevel(1);
        } else {
          // No Wikipedia image, fallback to DiceBear immediately
          setImgSrc(`https://api.dicebear.com/7.x/micah/svg?seed=${encodeURIComponent(character.name)}&backgroundColor=b6e3f4,c0aede,d1d4f9`);
          setErrorLevel(2);
        }
      } catch (err) {
        // Wikipedia API failed, fallback to DiceBear
        setImgSrc(`https://api.dicebear.com/7.x/micah/svg?seed=${encodeURIComponent(character.name)}&backgroundColor=b6e3f4,c0aede,d1d4f9`);
        setErrorLevel(2);
      }
    } else if (errorLevel === 1) {
      // Wikipedia image failed to load, fallback to DiceBear
      setImgSrc(`https://api.dicebear.com/7.x/micah/svg?seed=${encodeURIComponent(character.name)}&backgroundColor=b6e3f4,c0aede,d1d4f9`);
      setErrorLevel(2);
    }
  };

  return (
    <img 
      src={imgSrc} 
      alt={character?.name} 
      onError={handleError}
      className={className}
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        ...style
      }}
    />
  );
}

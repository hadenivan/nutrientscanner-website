import React, { useCallback, useLayoutEffect, useRef, useState } from 'react';
import './StaggeredMenu.css';

export const StaggeredMenu = ({
  position = 'right',
  colors = ['#B19EEF', '#5227FF'],
  items = [],
  socialItems = [],
  displaySocials = true,
  displayItemNumbering = true,
  className,
  logoUrl = '/logo.svg',
  menuButtonColor = '#fff',
  openMenuButtonColor = '#fff',
  accentColor = '#5227FF',
  changeMenuColorOnOpen = true,
  isFixed = false,
  onMenuOpen,
  onMenuClose
}) => {
  const [open, setOpen] = useState(false);
  const openRef = useRef(false);
  const panelRef = useRef(null);
  const preLayersRef = useRef(null);
  const preLayerElsRef = useRef([]);
  const plusHRef = useRef(null);
  const plusVRef = useRef(null);
  const iconRef = useRef(null);
  const textInnerRef = useRef(null);
  const textWrapRef = useRef(null);
  const [textLines, setTextLines] = useState(['Menu', 'Close']);

  const openTlRef = useRef(null);
  const closeTweenRef = useRef(null);
  const spinTweenRef = useRef(null);
  const textCycleAnimRef = useRef(null);
  const colorTweenRef = useRef(null);
  const toggleBtnRef = useRef(null);
  const busyRef = useRef(false);
  const itemEntranceTweenRef = useRef(null);

  // Simple animation functions (replacing GSAP)
  const animateElement = (element, properties, duration = 300) => {
    if (!element) return;
    
    const startProps = {};
    Object.keys(properties).forEach(key => {
      startProps[key] = window.getComputedStyle(element)[key];
    });

    const startTime = performance.now();
    
    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Simple ease-out function
      const easeOut = 1 - Math.pow(1 - progress, 3);
      
      Object.keys(properties).forEach(key => {
        const startValue = parseFloat(startProps[key]) || 0;
        const endValue = parseFloat(properties[key]) || 0;
        const currentValue = startValue + (endValue - startValue) * easeOut;
        
        element.style[key] = currentValue + (key.includes('opacity') ? '' : 'px');
      });
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  };

  useLayoutEffect(() => {
    const panel = panelRef.current;
    const preContainer = preLayersRef.current;
    const plusH = plusHRef.current;
    const plusV = plusVRef.current;
    const icon = iconRef.current;
    const textInner = textInnerRef.current;
    
    if (!panel || !plusH || !plusV || !icon || !textInner) return;

    let preLayers = [];
    if (preContainer) {
      preLayers = Array.from(preContainer.querySelectorAll('.sm-prelayer'));
    }
    preLayerElsRef.current = preLayers;

    const offscreen = position === 'left' ? -100 : 100;
    preLayers.forEach(layer => {
      layer.style.transform = `translateX(${offscreen}%)`;
    });
    panel.style.transform = `translateX(${offscreen}%)`;
    
    icon.style.transform = 'rotate(0deg)';
    if (toggleBtnRef.current) {
      toggleBtnRef.current.style.color = menuButtonColor;
    }
  }, [menuButtonColor, position]);

  const buildOpenTimeline = useCallback(() => {
    const panel = panelRef.current;
    const layers = preLayerElsRef.current;
    if (!panel) return;

    // Simple stagger animation for layers
    layers.forEach((layer, i) => {
      setTimeout(() => {
        animateElement(layer, { transform: 'translateX(0%)' }, 500);
      }, i * 70);
    });

    // Panel animation
    setTimeout(() => {
      animateElement(panel, { transform: 'translateX(0%)' }, 650);
    }, layers.length * 70 + 80);

    // Animate menu items
    const itemEls = Array.from(panel.querySelectorAll('.sm-panel-itemLabel'));
    itemEls.forEach((item, i) => {
      setTimeout(() => {
        animateElement(item, { transform: 'translateY(0px) rotate(0deg)', opacity: '1' }, 1000);
      }, layers.length * 70 + 80 + 200 + i * 100);
    });
  }, []);

  const playOpen = useCallback(() => {
    if (busyRef.current) return;
    busyRef.current = true;
    
    buildOpenTimeline();
    
    setTimeout(() => {
      busyRef.current = false;
    }, 1000);
  }, [buildOpenTimeline]);

  const playClose = useCallback(() => {
    const panel = panelRef.current;
    const layers = preLayerElsRef.current;
    if (!panel) return;

    const all = [...layers, panel];
    const offscreen = position === 'left' ? -100 : 100;
    
    all.forEach(el => {
      animateElement(el, { transform: `translateX(${offscreen}%)` }, 320);
    });

    // Reset menu items
    const itemEls = Array.from(panel.querySelectorAll('.sm-panel-itemLabel'));
    itemEls.forEach(item => {
      setTimeout(() => {
        item.style.transform = 'translateY(140px) rotate(10deg)';
        item.style.opacity = '0';
      }, 300);
    });
  }, [position]);

  const animateIcon = useCallback((opening) => {
    const icon = iconRef.current;
    if (!icon) return;
    
    const rotation = opening ? 225 : 0;
    const duration = opening ? 800 : 350;
    
    animateElement(icon, { transform: `rotate(${rotation}deg)` }, duration);
  }, []);

  const animateColor = useCallback((opening) => {
    const btn = toggleBtnRef.current;
    if (!btn) return;
    
    const targetColor = opening ? openMenuButtonColor : menuButtonColor;
    btn.style.color = targetColor;
  }, [openMenuButtonColor, menuButtonColor]);

  const animateText = useCallback((opening) => {
    const currentLabel = opening ? 'Menu' : 'Close';
    const targetLabel = opening ? 'Close' : 'Menu';
    const cycles = 3;
    const seq = [currentLabel];
    let last = currentLabel;
    
    for (let i = 0; i < cycles; i++) {
      last = last === 'Menu' ? 'Close' : 'Menu';
      seq.push(last);
    }
    if (last !== targetLabel) seq.push(targetLabel);
    seq.push(targetLabel);
    
    setTextLines(seq);
  }, []);

  const toggleMenu = useCallback(() => {
    const target = !openRef.current;
    openRef.current = target;
    setOpen(target);
    
    if (target) {
      onMenuOpen?.();
      playOpen();
    } else {
      onMenuClose?.();
      playClose();
    }
    
    animateIcon(target);
    animateColor(target);
    animateText(target);
  }, [playOpen, playClose, animateIcon, animateColor, animateText, onMenuOpen, onMenuClose]);

  return (
    <div
      className={(className ? className + ' ' : '') + 'staggered-menu-wrapper' + (isFixed ? ' fixed-wrapper' : '')}
      style={accentColor ? { ['--sm-accent']: accentColor } : undefined}
      data-position={position}
      data-open={open || undefined}
    >
      <div ref={preLayersRef} className="sm-prelayers" aria-hidden="true">
        {(() => {
          const raw = colors && colors.length ? colors.slice(0, 4) : ['#1e1e22', '#35353c'];
          let arr = [...raw];
          if (arr.length >= 3) {
            const mid = Math.floor(arr.length / 2);
            arr.splice(mid, 1);
          }
          return arr.map((c, i) => <div key={i} className="sm-prelayer" style={{ background: c }} />);
        })()}
      </div>
      <header className="staggered-menu-header" aria-label="Main navigation header">
        <div className="sm-logo" aria-label="Logo">
          <img
            src={logoUrl || '/logo.svg'}
            alt="NutriView Logo"
            className="sm-logo-img"
            draggable={false}
            width={110}
            height={24}
          />
        </div>
        <button
          ref={toggleBtnRef}
          className="sm-toggle"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-controls="staggered-menu-panel"
          onClick={toggleMenu}
          type="button"
        >
          <span ref={textWrapRef} className="sm-toggle-textWrap" aria-hidden="true">
            <span ref={textInnerRef} className="sm-toggle-textInner">
              {textLines.map((l, i) => (
                <span className="sm-toggle-line" key={i}>
                  {l}
                </span>
              ))}
            </span>
          </span>
          <span ref={iconRef} className="sm-icon" aria-hidden="true">
            <span ref={plusHRef} className="sm-icon-line" />
            <span ref={plusVRef} className="sm-icon-line sm-icon-line-v" />
          </span>
        </button>
      </header>

      <aside id="staggered-menu-panel" ref={panelRef} className="staggered-menu-panel" aria-hidden={!open}>
        <div className="sm-panel-inner">
          <ul className="sm-panel-list" role="list" data-numbering={displayItemNumbering || undefined}>
            {items && items.length ? (
              items.map((it, idx) => (
                <li className="sm-panel-itemWrap" key={it.link + idx}>
                  <a className="sm-panel-item" href={it.link} aria-label={it.ariaLabel} data-index={idx + 1}>
                    <span className="sm-panel-itemLabel">{it.label}</span>
                  </a>
                </li>
              ))
            ) : (
              <li className="sm-panel-itemWrap" aria-hidden="true">
                <span className="sm-panel-item">
                  <span className="sm-panel-itemLabel">No items</span>
                </span>
              </li>
            )}
          </ul>
          {displaySocials && socialItems && socialItems.length > 0 && (
            <div className="sm-socials" aria-label="Social links">
              <h3 className="sm-socials-title">Connect</h3>
              <ul className="sm-socials-list" role="list">
                {socialItems.map((s, i) => (
                  <li key={s.label + i} className="sm-socials-item">
                    <a href={s.link} target="_blank" rel="noopener noreferrer" className="sm-socials-link">
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
};

export default StaggeredMenu;

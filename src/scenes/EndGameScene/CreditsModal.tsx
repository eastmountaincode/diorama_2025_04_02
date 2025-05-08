import React, { useEffect, useState, useRef } from 'react';
import { useAtom } from 'jotai';
import { breakpointAtom } from '../../atoms/gameState';
import { AiOutlineClose } from 'react-icons/ai';
import { FaInstagram } from 'react-icons/fa';
import { useCursor } from '../../context/CursorContext';

interface CreditsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreditsModal: React.FC<CreditsModalProps> = ({ isOpen, onClose }) => {
  const [breakpoint] = useAtom(breakpointAtom);
  const { setCursorType } = useCursor();
  const [viewportWidth, setViewportWidth] = useState(window.innerWidth);
  const modalRef = useRef<HTMLDivElement>(null);

  // Update viewport width on resize
  useEffect(() => {
    const handleResize = () => {
      setViewportWidth(window.innerWidth);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Helper function for font sizes
  const calculateFontSize = (baseSize: number): string => {
    const minSize = Math.max(baseSize * 0.6, 10);
    const size = Math.max(minSize, viewportWidth * 0.01 * baseSize * 0.08);
    return `${size}px`;
  };

  // Mouse handlers for cursor changes
  const handleMouseEnter = () => {
    setCursorType('pointing');
  };

  const handleMouseLeave = () => {
    setCursorType('open');
  };

  const handleLinkClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  if (!isOpen) return null;

  // Style objects - organized for better readability
  const styles = {
    overlay: {
      position: 'fixed' as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.85)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
      padding: '5%',
    },
    container: {
      width: breakpoint === 'mobile' ? '90%' : '60%',
      maxWidth: '500px',
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'flex-start',
    },
    modal: {
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      color: 'white',
      border: '1px solid white',
      borderRadius: '4px',
      padding: breakpoint === 'mobile' ? '5%' : '3%',
      width: '100%',
      maxWidth: '100%',
      overflow: 'auto',
      position: 'relative' as const,
      boxSizing: 'border-box' as const,
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
      marginBottom: '7%',
    },
    title: {
      fontSize: calculateFontSize(22),
      textAlign: 'left' as const,
      letterSpacing: '0.05em',
      fontWeight: 'bold' as const,
      margin: 0,
    },
    closeButton: {
      backgroundColor: 'transparent',
      color: 'white',
      border: 'none',
      fontSize: calculateFontSize(18),
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      opacity: 0.8,
      padding: '0',
      zIndex: 10,
    },
    section: {
      marginBottom: '6%',
      width: '100%',
    },
    heading: {
      fontSize: calculateFontSize(18),
      marginBottom: '3%',
      borderBottom: '1px solid rgba(255, 255, 255, 0.3)',
      paddingBottom: '2%',
      textAlign: 'left' as const,
      width: '100%',
      letterSpacing: '0.03em',
      fontWeight: '600' as const,
      textTransform: 'uppercase' as const,
    },
    creditRow: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '3%',
      width: '100%',
      paddingLeft: '2%',
      minHeight: '30px',
    },
    name: {
      fontSize: calculateFontSize(16),
      fontWeight: '400' as const,
      marginRight: '8px',
      flex: '0 1 auto',
      whiteSpace: 'nowrap' as const,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      opacity: 0.9,
      fontStyle: 'normal' as const,
    },
    link: {
      color: 'white',
      display: 'inline-flex',
      alignItems: 'center',
      textDecoration: 'none',
      opacity: 0.7,
      transition: 'opacity 0.2s ease',
      padding: '2px',
      marginLeft: '3px',
      ':hover': {
        opacity: 1,
      }
    },
    icon: {
      fontSize: calculateFontSize(16),
    },
    copyright: {
      marginTop: '8%',
      fontSize: calculateFontSize(12),
      opacity: 0.6,
      textAlign: 'left' as const,
      width: '100%',
    }
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.container}>
        <div 
          ref={modalRef}
          style={styles.modal} 
          onClick={(e) => e.stopPropagation()}
        >
          <div style={styles.header}>
            <h2 style={styles.title}>
              DIORAMA
            </h2>
            <button 
              style={styles.closeButton} 
              onClick={onClose}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <AiOutlineClose />
            </button>
          </div>
          
          {/* Narrative */}
          <div style={styles.section}>
            <h3 style={styles.heading}>Narrative & Song</h3>
            <div style={styles.creditRow}>
              <span style={styles.name}>Laila Smith</span>
              <a 
                href="#" 
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick('https://www.instagram.com/lailasmith/');
                }}
                style={styles.link}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <FaInstagram style={styles.icon} />
              </a>
            </div>
          </div>
          
          {/* Web Development */}
          <div style={styles.section}>
            <h3 style={styles.heading}>Web Development</h3>
            <div style={styles.creditRow}>
              <span style={styles.name}>Andrew Boylan</span>
              <a 
                href="#" 
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick('https://www.instagram.com/ndrewboylan/');
                }}
                style={styles.link}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <FaInstagram style={styles.icon} />
              </a>
            </div>
          </div>
          
          {/* Visuals */}
          <div style={styles.section}>
            <h3 style={styles.heading}>Visual Development</h3>
            <div style={styles.creditRow}>
              <span style={styles.name}>N3L</span>
              <a 
                href="#" 
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick('https://www.instagram.com/garbageandglory.jpg/');
                }}
                style={styles.link}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <FaInstagram style={styles.icon} />
              </a>
            </div>
          </div>
          
          {/* Publishing */}
          <div style={styles.section}>
            <h3 style={styles.heading}>Publishing</h3>
            <div style={styles.creditRow}>
              <span style={styles.name}>UNL Rent-Network</span>
              <a 
                href="#" 
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick('https://www.instagram.com/unl.rn/');
                }}
                style={styles.link}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <FaInstagram style={styles.icon} />
              </a>
            </div>
          </div>
          
          <div style={styles.copyright}>
            © 2025 Team Dio
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreditsModal; 
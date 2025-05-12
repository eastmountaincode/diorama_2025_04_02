import React, { useEffect, useState, useRef } from 'react';
import { useAtom } from 'jotai';
import { breakpointAtom } from '../../atoms/gameState';
import { AiOutlineClose } from 'react-icons/ai';
import { FaInstagram, FaGlobe } from 'react-icons/fa';
import { useCursor } from '../../context/CursorContext';
import { playMouseClickSound } from '../../util/sound';

interface CreditsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreditsModal: React.FC<CreditsModalProps> = ({ isOpen, onClose }) => {
  const [breakpoint] = useAtom(breakpointAtom);
  const { setCursorType } = useCursor();
  const modalRef = useRef<HTMLDivElement>(null);

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

  // Handle close with sound
  const handleClose = () => {
    playMouseClickSound();
    onClose();
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
    },
    container: {
      width: breakpoint === 'mobile' ? '83%' : '80%',
      height: breakpoint === 'mobile' ? '80%' : '83%',
      maxWidth: '600px',
      maxHeight: '600px',
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'flex-start',
      fontFamily: "monospace",
    },
    modal: {
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      color: 'white',
      border: '1px solid white',
      padding: breakpoint === 'mobile' ? '5%' : '4%',
      width: '100%',
      height: '100%',
      overflow: 'auto',
      position: 'relative' as const,
      boxSizing: 'border-box' as const,
      display: 'flex',
      flexDirection: 'column' as const,
    },
    contentContainer: {
      display: 'flex',
      width: '100%',
      flex: '1 1 auto',
    },
    leftColumn: {
      flex: breakpoint === 'mobile' ? '1 1 100%' : '1 1 70%',
      paddingRight: breakpoint === 'mobile' ? '0' : '2%',
    },
    rightColumn: {
      flex: breakpoint === 'mobile' ? '1 1 30%' : '1 1 30%',
      display: 'flex',
      flexDirection: 'column' as const,
      justifyContent: 'center',
      alignItems: 'center',
      paddingLeft: breakpoint === 'mobile' ? '2%' : '3%',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
      marginBottom: '7%',
    },
    title: {
      fontSize: breakpoint === 'mobile' ? '16px' : '20px',
      textAlign: 'left' as const,
      letterSpacing: '0.05em',
      fontWeight: 'bold' as const,
      margin: 0,
      fontFamily: "monospace",
    },
    closeButton: {
      backgroundColor: 'transparent',
      color: 'white',
      border: 'none',
      fontSize: breakpoint === 'mobile' ? '18px' : '24px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      opacity: 0.8,
      padding: '5px',
      zIndex: 10,
    },
    section: {
      marginBottom: '4%',
      width: '100%',
    },
    heading: {
      fontSize: breakpoint === 'mobile' ? '14px' : '16px',
      marginBottom: '3%',
      borderBottom: '1px solid rgba(255, 255, 255, 0.3)',
      paddingBottom: '2%',
      textAlign: 'left' as const,
      width: '100%',
      letterSpacing: '0.03em',
      fontWeight: '600' as const,
      textTransform: 'uppercase' as const,
      fontFamily: "monospace",
    },
    creditRow: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '3%',
      width: '100%',
      paddingLeft: '2%',
      minHeight: '30px',
      fontFamily: "monospace",
    },
    name: {
      fontSize: breakpoint === 'mobile' ? '13px' : '14px',
      fontWeight: '400' as const,
      flex: '1 1 auto',
      whiteSpace: breakpoint === 'mobile' ? 'normal' as const : 'nowrap' as const,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      opacity: 0.9,
      fontStyle: 'normal' as const,
      fontFamily: "monospace",
    },
    link: {
      color: 'white',
      display: 'inline-flex',
      alignItems: 'center',
      textDecoration: 'none',
      opacity: 0.7,
      transition: 'opacity 0.2s ease',
      padding: '2px',
      marginLeft: '10px',
      ':hover': {
        opacity: 1,
      }
    },
    icon: {
      fontSize: breakpoint === 'mobile' ? '16px' : '19px',
    },
    teamLogo: {
      width: '100%',
      maxWidth: breakpoint === 'mobile' ? '80%' : '85%',
      height: 'auto',
      opacity: 1,
      marginBottom: breakpoint === 'mobile' ? '5%' : '10%',
      marginTop: breakpoint === 'mobile' ? '20%' : '5%',
    },
    copyright: {
      marginTop: 'auto',
      paddingTop: '15px',
      fontSize: breakpoint === 'mobile' ? '10px' : '12px',
      opacity: 0.6,
      textAlign: 'center' as const,
      width: '100%',
      fontFamily: "monospace",
    }
  };

  return (
    <div style={styles.overlay} onClick={handleClose}>
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
              onClick={handleClose}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <AiOutlineClose />
            </button>
          </div>
          
          <div style={styles.contentContainer}>
            {/* Left Column */}
            <div style={styles.leftColumn}>
              {/* Narrative */}
              <div style={styles.section}>
                <h3 style={styles.heading}>Narrative & Music</h3>
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
                      handleLinkClick('https://andrew-boylan.com/');
                    }}
                    style={styles.link}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  >
                    <FaGlobe style={styles.icon} />
                  </a>
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
                <h3 style={styles.heading}>Visual Assistant</h3>
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
            </div>
            
            {/* Right Column - Only show on desktop */}
            {breakpoint !== 'mobile' && (
              <div style={styles.rightColumn}>
                <img 
                  src="assets/credits/team_dio.png" 
                  alt="Team Dio" 
                  style={styles.teamLogo}
                />
              </div>
            )}
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
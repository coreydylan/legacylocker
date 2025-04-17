import React from 'react';
import { DIMENSIONS, FONTS } from './constants';

interface HeadlineProps {
  headline: string;
  subtitle?: string;
}

export const Headline: React.FC<HeadlineProps> = ({ headline, subtitle }) => {
  return (
    <div style={{ 
      position: 'absolute',
      width: '100%',
      textAlign: 'center',
      fontFamily: FONTS.PRIMARY,
    }}>
      <h1 style={{
        position: 'relative',
        top: DIMENSIONS.TEXT.HEADLINE.TOP,
        fontSize: DIMENSIONS.TEXT.HEADLINE.SIZE,
        margin: 0,
        padding: 0,
      }}>
        {headline}
      </h1>
      {subtitle && (
        <h2 style={{
          position: 'relative',
          top: DIMENSIONS.TEXT.SUBTITLE.TOP,
          fontSize: DIMENSIONS.TEXT.SUBTITLE.SIZE,
          margin: 0,
          padding: 0,
          fontWeight: 'normal',
        }}>
          {subtitle}
        </h2>
      )}
    </div>
  );
}; 
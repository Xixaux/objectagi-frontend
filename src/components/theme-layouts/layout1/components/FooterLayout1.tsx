'use client';

/**
 * DEBUGGING NOTE: THE "INVISIBLE CURTAIN" ISSUE
 * -----------------------------------------------------------------------------
 * PROBLEM: 
 * The page content was rendering in the DOM but was visually blank. 
 * * CAUSE: 
 * MUI's <AppBar> defaults to 'position: fixed'. When placed inside a flexbox 
 * layout (common in Next.js/Fuse themes), it was removed from the document flow. 
 * This caused the main content container to collapse to 0px height OR be 
 * overlaid by a transparent fixed-position element with a high z-index.
 * * SOLUTION: 
 * Explicitly set position="static" to force the footer into the natural 
 * document flow and added flexShrink: 0 to prevent layout "squashing."
 * -----------------------------------------------------------------------------
 */

import AppBar from '@mui/material/AppBar';
import { ThemeProvider } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import { memo } from 'react';
import clsx from 'clsx';
import DemoLayoutFooterContent from 'src/components/theme-layouts/components/DemoLayoutFooterContent';
import { useFooterTheme } from '@objectagi/core/ObjectAGISettings/hooks/objectagiThemeHooks';

type FooterLayout1Props = {
  className?: string;
};

/**
 * The footer layout 1.
 */
function FooterLayout1(props: FooterLayout1Props) {
  const { className } = props;

  // Retrieves the specific theme settings for the footer from the ObjectAGI core hooks.
  const footerTheme = useFooterTheme();

  return (
    <ThemeProvider theme={footerTheme}>
      <AppBar
        id="objectagi-footer"
        
        /**
         * RECOMMENDATION 1: POSITIONING
         * We use position="static" here. 
         * Avoid "fixed" or "sticky" inside complex Flexbox layouts unless the 
         * main content area has an explicit 'padding-bottom' or 'margin-bottom' 
         * to compensate for the height of this bar.
         */
        position="static" 

        /**
         * RECOMMENDATION 2: CSS CLASS MERGING
         * 'relative' is kept for z-index context, but 'z-20' is dangerous if 
         * the footer is 'fixed'. In 'static' mode, z-index is mostly redundant 
         * but safe. 'border-t' provides the visual separation from the content.
         */
        className={clsx('relative z-20 border-t', className)}
        
        color="default"
        elevation={0}
        
        sx={{
          // TODO: Background color known inconsistency. Hardcoded. 
          // If the theme changes, ensure this hex is updated or linked to theme.palette
          backgroundColor: '#FAFAFA',

          /**
           * RECOMMENDATION 3: FLEXBOX STABILITY
           * In a 'display: flex' parent (like most Next.js App layouts), 
           * flexShrink: 0 ensures this footer maintains its min-height (12/16 units)
           * and isn't "crushed" by the main content area (children).
           */
          flexShrink: 0, 
        }}
      >
        {/* Toolbar handles the internal spacing. 
            'overflow-x-auto' ensures that if too many engine icons are added 
            (Thought, Emotion, etc.), the footer scrolls horizontally rather 
            than breaking the layout.
        */}
        <Toolbar className="min-h-12 md:min-h-16 px-2 sm:px-3 py-0 flex items-center overflow-x-auto">
          <DemoLayoutFooterContent />
        </Toolbar>
      </AppBar>
    </ThemeProvider>
  );
}

// Memoized to prevent unnecessary re-renders when the main content changes.
export default memo(FooterLayout1);
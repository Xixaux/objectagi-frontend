import { objectagiDark, skyBlue } from '@objectagi/colors';
import { blueGrey } from '@mui/material/colors';
import { ObjectAGIThemesType } from '@objectagi/core/ObjectAGISettings/ObjectAGISettings';

/**
 * The lightPaletteText object defines the text color palette for the light theme.
 */
export const lightPaletteText = {
  primary: 'rgb(17, 24, 39)',
  secondary: 'rgb(107, 114, 128)',
  disabled: 'rgb(149, 156, 169)',
};

/**
 * The darkPaletteText object defines the text color palette for the dark theme.
 */
export const darkPaletteText = {
  primary: 'rgb(255,255,255)',
  secondary: 'rgb(148, 163, 184)',
  disabled: 'rgb(156, 163, 175)',
};

/**
 * The themesConfig object is a configuration object for the color themes of the ObjectAGI application.
 */
export const themesConfig: ObjectAGIThemesType = {
  default: {
    palette: {
      mode: 'light',
      divider: 'rgba(214,214,214,0.7)',
      text: {
        primary: '#212121',
        secondary: '#5F6368',
      },
      common: {
        black: '#000000',
        white: '#FFFFFF',
      },
      primary: {
        light: '#536D89',
        main: '#111111',
        dark: '#00418A',
        contrastText: '#FFFFFF',
      },
      secondary: {
        light: '#6BC9F7',
        main: '#00A4EF',
        dark: '#0078D7',
        contrastText: '#FFFFFF',
      },
      background: {
        paper: '#FFFFFF',
        default: '#FAFAFA',
      },
      error: {
        light: '#FFCDD2',
        main: '#D32F2F',
        dark: '#B71C1C',
        contrastText: '#FFFFFF',
      },
    },
  },
  defaultDark: {
    palette: {
      mode: 'dark',
      divider: 'rgba(79,79,79,0.5)',
      text: {
        primary: '#E0E0E0',
        secondary: '#B0BEC5',
      },
      common: {
        black: '#000000',
        white: '#FFFFFF',
      },
      primary: {
        light: '#536D89',
        main: '#111111',
        dark: '#00418A',
        contrastText: '#FFFFFF',
      },
      secondary: {
        light: '#6BC9F7',
        main: '#00A4EF',
        dark: '#0078D7',
        contrastText: '#FFFFFF',
      },
      background: {
        paper: '#1E1E1E',
        default: '#111111',
      },
      error: {
        light: '#FFCDD2',
        main: '#D32F2F',
        dark: '#B71C1C',
        contrastText: '#FFFFFF',
      },
    },
  },
  slateCrimsonDark: {
    palette: {
      mode: 'dark',
      primary: {
        main: '#37474F',
        light: '#62727B',
        dark: '#102027',
        contrastText: darkPaletteText.primary,
      },
      secondary: {
        main: '#D32F2F',
        light: '#FF6659',
        dark: '#9A0007',
        contrastText: darkPaletteText.primary,
      },
      background: {
        default: '#212121',
        paper: '#2e2e2e',
      },
      text: darkPaletteText,
      divider: '#3a3d40',
    },
  },
  indigoCoral: {
    palette: {
      mode: 'light',
      primary: {
        main: '#283593',
        light: '#5F5FC4',
        dark: '#001064',
        contrastText: darkPaletteText.primary,
      },
      secondary: {
        main: '#FF7043',
        light: '#FFA270',
        dark: '#C63F17',
        contrastText: lightPaletteText.primary,
      },
      background: {
        default: '#eaebfb',
        paper: '#f6f7fd',
      },
      text: lightPaletteText,
      divider: '#dcdcf2',
    },
  },
  indigoCoralDark: {
    palette: {
      mode: 'dark',
      primary: {
        main: '#283593',
        light: '#5F5FC4',
        dark: '#001064',
        contrastText: darkPaletteText.primary,
      },
      secondary: {
        main: '#FF7043',
        light: '#FFA270',
        dark: '#C63F17',
        contrastText: lightPaletteText.primary,
      },
      background: {
        default: '#1A237E',
        paper: '#283593',
      },
      text: darkPaletteText,
      divider: '#4d557e',
    },
  },
  coolGreyPink: {
    palette: {
      mode: 'light',
      primary: {
        main: '#dde6eb',
        light: '#FFFFFF',
        dark: '#9EA7AA',
        contrastText: lightPaletteText.primary,
      },
      secondary: {
        main: '#F06292',
        light: '#FF94C2',
        dark: '#BA2D65',
        contrastText: darkPaletteText.primary,
      },
      background: {
        default: '#F5F5F5',
        paper: '#FAFAFA',
      },
      text: lightPaletteText,
      divider: '#e1e1e1',
    },
  },
  coolGreyPinkDark: {
    palette: {
      mode: 'dark',
      primary: {
        main: '#dde6eb',
        light: '#FFFFFF',
        dark: '#9EA7AA',
        contrastText: lightPaletteText.primary,
      },
      secondary: {
        main: '#F06292',
        light: '#FF94C2',
        dark: '#BA2D65',
        contrastText: darkPaletteText.primary,
      },
      background: {
        default: '#1a1a1a',
        paper: '#292929',
      },
      text: darkPaletteText,
      divider: '#424242',
    },
  },
  legacy: {
    palette: {
      mode: 'light',
      divider: '#e2e8f0',
      text: lightPaletteText,
      common: {
        black: 'rgb(17, 24, 39)',
        white: 'rgb(255, 255, 255)',
      },
      primary: {
        light: objectagiDark[200],
        main: objectagiDark[500],
        dark: objectagiDark[800],
        contrastText: darkPaletteText.primary,
      },
      secondary: {
        light: skyBlue[100],
        main: skyBlue[500],
        dark: skyBlue[900],
        contrastText: lightPaletteText.primary,
      },
      background: {
        paper: '#FAFAFA',
        default: '#f6f7f9',
      },
      error: {
        light: '#ffcdd2',
        main: '#f44336',
        dark: '#b71c1c',
      },
    },
  },
  light1: {
    palette: {
      mode: 'light',
      divider: '#e2e8f0',
      text: lightPaletteText,
      primary: {
        light: '#b3d1d1',
        main: '#006565',
        dark: '#003737',
        contrastText: darkPaletteText.primary,
      },
      secondary: {
        light: '#ffecc0',
        main: '#FFBE2C',
        dark: '#ff9910',
        contrastText: lightPaletteText.primary,
      },
      background: {
        paper: '#FFFFFF',
        default: '#F0F7F7',
      },
      error: {
        light: '#ffcdd2',
        main: '#f44336',
        dark: '#b71c1c',
      },
    },
  },
  light2: {
    palette: {
      mode: 'light',
      divider: '#e2e8f0',
      text: lightPaletteText,
      primary: {
        light: '#BBE2DA',
        main: '#1B9E85',
        dark: '#087055',
        contrastText: darkPaletteText.primary,
      },
      secondary: {
        light: '#FFD0C1',
        main: '#FF6231',
        dark: '#FF3413',
        contrastText: darkPaletteText.primary,
      },
      background: {
        paper: '#FFFFFF',
        default: '#F2F8F1',
      },
      error: {
        light: '#ffcdd2',
        main: '#f44336',
        dark: '#b71c1c',
      },
    },
  },
  light3: {
    palette: {
      mode: 'light',
      divider: '#e2e8f0',
      text: lightPaletteText,
      primary: {
        light: '#D3C0CD',
        main: '#6B2C57',
        dark: '#3C102C',
        contrastText: darkPaletteText.primary,
      },
      secondary: {
        light: '#C3C2D2',
        main: '#36336A',
        dark: '#16143C',
        contrastText: darkPaletteText.primary,
      },
      background: {
        paper: '#FFFFFF',
        default: '#FAFAFE',
      },
      error: {
        light: '#ffcdd2',
        main: '#f44336',
        dark: '#b71c1c',
      },
    },
  },
  light4: {
    palette: {
      mode: 'light',
      divider: '#e2e8f0',
      text: lightPaletteText,
      primary: {
        light: '#C6C9CD',
        main: '#404B57',
        dark: '#1C232C',
        contrastText: darkPaletteText.primary,
      },
      secondary: {
        light: '#C2C8D2',
        main: '#354968',
        dark: '#16213A',
        contrastText: darkPaletteText.primary,
      },
      background: {
        paper: '#FFFFFF',
        default: '#F5F4F6',
      },
      error: {
        light: '#ffcdd2',
        main: '#f44336',
        dark: '#b71c1c',
      },
    },
  },
  light5: {
    palette: {
      mode: 'light',
      divider: '#e2e8f0',
      text: lightPaletteText,
      primary: {
        light: '#C4C4C4',
        main: '#3A3A3A',
        dark: '#181818',
        contrastText: darkPaletteText.primary,
      },
      secondary: {
        light: '#EFEFED',
        main: '#CBCAC3',
        dark: '#ACABA1',
        contrastText: lightPaletteText.primary,
      },
      background: {
        paper: '#EFEEE7',
        default: '#FAF8F2',
      },
      error: {
        light: '#F7EAEA',
        main: '#EBCECE',
        dark: '#E3B9B9',
      },
    },
  },
  dark1: {
    palette: {
      mode: 'dark',
      divider: 'rgba(241,245,249,.12)',
      text: darkPaletteText,
      primary: {
        light: '#C2C2C3',
        main: '#323338',
        dark: '#131417',
        contrastText: darkPaletteText.primary,
      },
      secondary: {
        light: '#B8E1D9',
        main: '#129B7F',
        dark: '#056D4F',
        contrastText: darkPaletteText.primary,
      },
      background: {
        paper: '#262526',
        default: '#1E1D1E',
      },
      error: {
        light: '#ffcdd2',
        main: '#f44336',
        dark: '#b71c1c',
      },
    },
  },
  dark2: {
    palette: {
      mode: 'dark',
      divider: 'rgba(241,245,249,.12)',
      text: darkPaletteText,
      primary: {
        light: '#C9CACE',
        main: '#4B4F5A',
        dark: '#23262E',
        contrastText: darkPaletteText.primary,
      },
      secondary: {
        light: '#F8F5F2',
        main: '#E6DED5',
        dark: '#D5C8BA',
        contrastText: lightPaletteText.primary,
      },
      background: {
        paper: '#31343E',
        default: '#2A2D35',
      },
      error: {
        light: '#F7EAEA',
        main: '#EBCECE',
        dark: '#E3B9B9',
      },
    },
  },
  dark3: {
    palette: {
      mode: 'dark',
      divider: 'rgba(241,245,249,.12)',
      text: darkPaletteText,
      primary: {
        light: '#C2C8D2',
        main: '#354968',
        dark: '#16213A',
        contrastText: darkPaletteText.primary,
      },
      secondary: {
        light: '#F4CFCA',
        main: '#D55847',
        dark: '#C03325',
        contrastText: darkPaletteText.primary,
      },
      background: {
        paper: '#23354E',
        default: '#1B2A3F',
      },
      error: {
        light: '#ffcdd2',
        main: '#f44336',
        dark: '#b71c1c',
      },
    },
  },
  dark4: {
    palette: {
      mode: 'dark',
      divider: 'rgba(241,245,249,.12)',
      text: darkPaletteText,
      primary: {
        light: '#CECADF',
        main: '#5A4E93',
        dark: '#2E2564',
        contrastText: darkPaletteText.primary,
      },
      secondary: {
        light: '#B3EBD6',
        main: '#00BC77',
        dark: '#009747',
        contrastText: darkPaletteText.primary,
      },
      background: {
        paper: '#22184B',
        default: '#180F3D',
      },
      error: {
        light: '#ffcdd2',
        main: '#f44336',
        dark: '#b71c1c',
      },
    },
  },
  dark5: {
    palette: {
      mode: 'dark',
      divider: 'rgba(241,245,249,.12)',
      text: darkPaletteText,
      primary: {
        light: '#CCD7E2',
        main: '#56789D',
        dark: '#2B486F',
        contrastText: darkPaletteText.primary,
      },
      secondary: {
        light: '#D7D3ED',
        main: '#796CC4',
        dark: '#493DA2',
        contrastText: darkPaletteText.primary,
      },
      background: {
        paper: '#465261',
        default: '#232931',
      },
      error: {
        light: '#ffcdd2',
        main: '#f44336',
        dark: '#b71c1c',
      },
    },
  },
  dark6: {
    palette: {
      mode: 'dark',
      divider: 'rgba(241,245,249,.12)',
      text: darkPaletteText,
      primary: {
        light: '#BEBFC8',
        main: '#252949',
        dark: '#0D0F21',
        contrastText: darkPaletteText.primary,
      },
      secondary: {
        light: '#CBD7FE',
        main: '#5079FC',
        dark: '#2749FA',
        contrastText: darkPaletteText.primary,
      },
      background: {
        paper: '#2D3159',
        default: '#202441',
      },
      error: {
        light: '#ffcdd2',
        main: '#f44336',
        dark: '#b71c1c',
      },
    },
  },
  dark7: {
    palette: {
      mode: 'dark',
      divider: 'rgba(241,245,249,.12)',
      text: darkPaletteText,
      primary: {
        light: '#BCC8CD',
        main: '#204657',
        dark: '#0B202C',
        contrastText: darkPaletteText.primary,
      },
      secondary: {
        light: '#B3EBC5',
        main: '#00BD3E',
        dark: '#00981B',
        contrastText: darkPaletteText.primary,
      },
      background: {
        paper: '#1C1E27',
        default: '#15171E',
      },
      error: {
        light: '#ffcdd2',
        main: '#f44336',
        dark: '#b71c1c',
      },
    },
  },
  greyDark: {
    palette: {
      mode: 'dark',
      divider: 'rgba(241,245,249,.12)',
      text: darkPaletteText,
      primary: {
        light: objectagiDark[200],
        main: objectagiDark[700],
        dark: objectagiDark[800],
        contrastText: darkPaletteText.primary,
      },
      secondary: {
        light: skyBlue[100],
        main: skyBlue[500],
        dark: skyBlue[900],
        contrastText: lightPaletteText.primary,
      },
      background: {
        paper: blueGrey[700],
        default: blueGrey[900],
      },
      error: {
        light: '#ffcdd2',
        main: '#f44336',
        dark: '#b71c1c',
      },
    },
  },
};

export default themesConfig;